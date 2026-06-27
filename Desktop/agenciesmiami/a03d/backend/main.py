"""
A03D Backend — Hunyuan3D 2.0 Text-to-3D Generation API
Pipeline: text → Stable Diffusion image → Hunyuan3D mesh → texture bake → upright
"""
import asyncio
import json
import math
import os
import threading
import time
import uuid
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Optional

import numpy as np
import trimesh
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, Field
import io

import torch

# ── Config ─────────────────────────────────────────────────────────
LIBRARY_DIR = Path(__file__).parent.parent / "library"
LIBRARY_DIR.mkdir(exist_ok=True)

INTERMEDIATE_DIR = LIBRARY_DIR / "intermediate"
INTERMEDIATE_DIR.mkdir(exist_ok=True)

QUANTIZE_MODEL = os.getenv("A03D_QUANTIZE", "0") == "1"

DEVICE_STR = os.getenv("A03D_DEVICE", "auto")
if DEVICE_STR == "auto":
    if torch.backends.mps.is_available():
        DEVICE = torch.device("mps")
    elif torch.cuda.is_available():
        DEVICE = torch.device("cuda")
    else:
        DEVICE = torch.device("cpu")
else:
    DEVICE = torch.device(DEVICE_STR)

MAX_CONCURRENT = int(os.getenv("A03D_MAX_CONCURRENT", "1"))
MAX_QUEUE_DEPTH = MAX_CONCURRENT * 10

NEGATIVE_PROMPT = "platform, base, ground, floor, pedestal, stand, table, flat surface, bottom plate"

# ── App ────────────────────────────────────────────────────────────
app = FastAPI(
    title="A03D API",
    description="Agencies3D — Text-to-3D Generation Engine (Hunyuan3D 2.0)",
    version="2.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Models (loaded lazily) ────────────────────────────────────────
_model_cache = {}
_model_load_lock = threading.Lock()


def get_models():
    """Load Hunyuan3D + Stable Diffusion pipelines (thread-safe, lazy)."""
    if "shape_pipeline" not in _model_cache:
        with _model_load_lock:
            if "shape_pipeline" not in _model_cache:
                print(f"[A03D] Loading Hunyuan3D shape model on {DEVICE}...")
                from hy3dgen.shapegen import Hunyuan3DDiTFlowMatchingPipeline
                pipe = Hunyuan3DDiTFlowMatchingPipeline.from_pretrained(
                    "tencent/Hunyuan3D-2",
                    subfolder="hunyuan3d-dit-v2-0-fast",
                    device=DEVICE,
                    torch_dtype=torch.float16 if DEVICE.type in ("cuda", "mps") else torch.float32,
                )

                # Apply quantization to the DiT transformer (optional)
                # CUDA: NF4 4-bit via bitsandbytes | MPS/CPU: int8 dynamic (1.6x speedup)
                if QUANTIZE_MODEL:
                    print(f"[A03D] Applying quantization to DiT (device: {DEVICE.type})...")
                    from quantize_model import quantize_dit_model
                    pipe.model = quantize_dit_model(pipe.model, device=DEVICE.type)
                    print("[A03D] Quantization applied.")

                _model_cache["shape_pipeline"] = pipe
                print("[A03D] Shape model loaded.")

    if "text2image" not in _model_cache:
        with _model_load_lock:
            if "text2image" not in _model_cache:
                print(f"[A03D] Loading Stable Diffusion text-to-image on {DEVICE}...")
                from diffusers import StableDiffusionPipeline
                _model_cache["text2image"] = StableDiffusionPipeline.from_pretrained(
                    "runwayml/stable-diffusion-v1-5",
                    torch_dtype=torch.float16 if DEVICE.type in ("cuda", "mps") else torch.float32,
                ).to(DEVICE)
                print("[A03D] Text-to-image model loaded.")

    return _model_cache


# ── Queue system ───────────────────────────────────────────────────
class JobStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    DONE = "done"
    ERROR = "error"


@dataclass
class Job:
    id: str
    status: JobStatus
    position: int
    created_at: str
    prompt: str
    options: dict = field(default_factory=dict)
    error: Optional[str] = None
    result: Optional[dict] = None


_job_queue: dict[str, Job] = {}
_job_order: list[str] = []
_queue_lock = threading.Lock()
_generation_semaphore = threading.Semaphore(MAX_CONCURRENT)
_avg_generation_seconds = 120.0

# ── Progress tracking ──────────────────────────────────────────────
_job_progress: dict[str, dict] = {}
_progress_lock = threading.Lock()

# Step durations (approximate, for progress estimation)
STEP_DURATIONS = {
    "image": 30,      # SD text→image
    "mesh": 200,      # Hunyuan3D diffusion + volume decode (octree 256, 30 steps)
    "geometry": 5,    # Ground plane removal + orient + center
    "texture": 5,     # Spherical UV texture bake
    "finalize": 3,    # Save GLB + metadata
}


def _init_progress(job_id: str):
    with _progress_lock:
        _job_progress[job_id] = {
            "step_name": "Generating image",
            "step": 1,
            "total_steps": 5,
            "step_percent": 0,
            "total_percent": 0,
            "step_key": "image",
            "started_at": time.time(),
            "step_started_at": time.time(),
        }


def _update_progress_step(job_id: str, step_key: str, step_name: str, step_num: int, percent: int = 0):
    """Update progress from the main thread — called on step transitions."""
    with _progress_lock:
        if job_id not in _job_progress:
            return
        p = _job_progress[job_id]
        now = time.time()
        p["step_key"] = step_key
        p["step_name"] = step_name
        p["step"] = step_num
        p["step_percent"] = min(percent, 100)
        p["step_started_at"] = now

        # Set total_percent based on step completion only
        # (within-step animation is handled by _progress_tracker)
        total_weight = sum(STEP_DURATIONS.values())
        completed_weight = sum(STEP_DURATIONS[k] for k in list(STEP_DURATIONS.keys())[:step_num - 1])
        current_weight = STEP_DURATIONS.get(step_key, 0)
        # Add the within-step contribution
        p["total_percent"] = min(
            int(completed_weight / total_weight * 100 + (current_weight / total_weight * 100 * percent / 100)),
            99
        )


def _progress_tracker(job_id: str):
    """Background thread that updates step_percent based on elapsed time."""
    while True:
        time.sleep(0.5)

        with _progress_lock:
            if job_id not in _job_progress:
                break
            p = _job_progress[job_id]
            if p.get("done"):
                break

            elapsed = time.time() - p["step_started_at"]
            step_duration = STEP_DURATIONS.get(p["step_key"], 30)
            step_pct = min(int(elapsed / step_duration * 100), 95)

            p["step_percent"] = step_pct
            # Recalculate total
            step_key_order = list(STEP_DURATIONS.keys())
            total_weight = sum(STEP_DURATIONS.values())
            completed_weight = sum(STEP_DURATIONS[k] for k in step_key_order[:p["step"] - 1])
            current_weight = STEP_DURATIONS.get(p["step_key"], 0)
            p["total_percent"] = min(
                int(completed_weight / total_weight * 100 + (current_weight / total_weight * 100 * step_pct / 100)),
                99
            )

            if p["step_key"] == "finalize" and step_pct >= 95:
                break


def _get_queue_position(job_id: str) -> int:
    with _queue_lock:
        if job_id not in _job_queue:
            return -1
        if _job_queue[job_id].status == JobStatus.RUNNING:
            return 0
        try:
            return _job_order.index(job_id) + 1
        except ValueError:
            return -1


def _estimate_wait_seconds(position: int) -> float:
    if position <= 0:
        return 0.0
    effective_batches = math.ceil(position / MAX_CONCURRENT)
    return effective_batches * _avg_generation_seconds


# ── Schemas ────────────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="Text prompt for 3D generation")
    save_to_library: Optional[bool] = Field(default=True)
    name: Optional[str] = Field(default=None, max_length=100)
    # Speed optimization options
    steps: Optional[int] = Field(default=None, ge=5, le=50, description="Hunyuan3D diffusion steps (default: 30)")
    sd_steps: Optional[int] = Field(default=None, ge=5, le=30, description="Stable Diffusion steps (default: 20)")
    octree_resolution: Optional[int] = Field(default=None, ge=64, le=256, description="Octree resolution (default: 256)")
    guidance_scale: Optional[float] = Field(default=None, ge=1.0, le=10.0, description="Hunyuan3D guidance scale (default: 5.0)")
    sd_guidance_scale: Optional[float] = Field(default=None, ge=1.0, le=15.0, description="SD guidance scale (default: 7.5)")
    enable_texture: Optional[bool] = Field(default=False, description="Bake vertex colors from generated image (disabled - raw geometry only)")


class LibraryItem(BaseModel):
    id: str
    name: str
    prompt: str
    created_at: str
    vertices: int
    faces: int
    file_size: int
    thumbnail_url: str


class QueuedResponse(BaseModel):
    job_id: str
    status: str
    position: int
    estimated_wait: float
    poll_url: str


# ── Remove ground planes ───────────────────────────────────────────

def _remove_ground_plane(mesh: trimesh.Trimesh) -> trimesh.Trimesh:
    """Remove flat horizontal geometry at the bottom of the mesh."""
    verts = np.array(mesh.vertices, dtype=np.float64)
    faces = np.array(mesh.faces)

    y_min, y_max = verts[:, 1].min(), verts[:, 1].max()
    y_range = y_max - y_min if y_max > y_min else 1.0

    # Bottom 8% of the mesh — candidate for ground plane
    bottom_threshold = y_min + y_range * 0.08
    bottom_mask = verts[:, 1] <= bottom_threshold
    bottom_verts = verts[bottom_mask]

    if len(bottom_verts) < 10:
        return mesh

    # Check if bottom vertices span a large flat area
    x_span = bottom_verts[:, 0].max() - bottom_verts[:, 0].min()
    z_span = bottom_verts[:, 2].max() - bottom_verts[:, 2].min()
    full_x_span = verts[:, 0].max() - verts[:, 0].min()
    full_z_span = verts[:, 2].max() - verts[:, 2].min()

    if full_x_span < 0.01 or full_z_span < 0.01:
        return mesh

    # If bottom spans > 35% of total XZ area, it's a platform
    xz_coverage = (x_span / full_x_span) * (z_span / full_z_span)
    if xz_coverage > 0.12:  # 35% × 35% ≈ 12%
        # Find faces where ALL vertices are at the bottom
        bottom_vert_indices = set(np.where(bottom_mask)[0])
        faces_to_remove = []
        for i, face in enumerate(faces):
            if all(v in bottom_vert_indices for v in face):
                # Also check if face normal is mostly vertical
                v0, v1, v2 = verts[face[0]], verts[face[1]], verts[face[2]]
                normal = np.cross(v1 - v0, v2 - v0)
                normal_norm = np.linalg.norm(normal)
                if normal_norm > 1e-8:
                    normal /= normal_norm
                    if abs(normal[1]) > 0.8:  # normal pointing up/down
                        faces_to_remove.append(i)

        if faces_to_remove:
            mask = np.ones(len(faces), dtype=bool)
            mask[faces_to_remove] = False
            mesh = mesh.submesh([np.where(mask)[0]], append=True)
            print(f"[A03D] Removed {len(faces_to_remove)} ground plane faces")

    return mesh


# ── Orientation fix ────────────────────────────────────────────────

def _orient_upright(mesh: trimesh.Trimesh) -> trimesh.Trimesh:
    """Rotate mesh so model stands upright, centered, bottom at Y=0."""
    verts = np.array(mesh.vertices, dtype=np.float64)

    y_min, y_max = verts[:, 1].min(), verts[:, 1].max()
    y_range = y_max - y_min if y_max > y_min else 1.0
    x_range = verts[:, 0].max() - verts[:, 0].min()
    z_range = verts[:, 2].max() - verts[:, 2].min()

    # Only rotate if model is clearly sideways
    if x_range > 2.0 * y_range and x_range > z_range:
        # X is longest and >2Y → rotate 90° around Z
        R = np.array([[0, 1, 0], [-1, 0, 0], [0, 0, 1]], dtype=np.float64)
        centroid = verts.mean(axis=0)
        verts = (verts - centroid) @ R.T + centroid
    elif z_range > 2.0 * y_range and z_range > x_range:
        # Z is longest and >2Y → rotate 90° around X
        R = np.array([[1, 0, 0], [0, 0, -1], [0, 1, 0]], dtype=np.float64)
        centroid = verts.mean(axis=0)
        verts = (verts - centroid) @ R.T + centroid

    # Center on XZ
    verts[:, 0] -= verts[:, 0].mean()
    verts[:, 2] -= verts[:, 2].mean()

    # Bottom at Y=0
    verts[:, 1] -= verts[:, 1].min()

    mesh.vertices = verts
    return mesh


# ── Generation worker ──────────────────────────────────────────────

def _run_generation(job_id: str):
    """Worker: text → image → 3D mesh → texture → upright → save."""
    with _generation_semaphore:
        with _queue_lock:
            if job_id in _job_queue:
                _job_queue[job_id].status = JobStatus.RUNNING
                try:
                    _job_order.remove(job_id)
                except ValueError:
                    pass

        # Start progress tracker thread
        _init_progress(job_id)
        tracker = threading.Thread(target=_progress_tracker, args=(job_id,), daemon=True)
        tracker.start()

        try:
            job = _job_queue[job_id]
            start_time = time.time()

            prompt = job.options["prompt"]
            name = job.options.get("name") or prompt[:50]

            # Speed options with defaults
            steps = job.options.get("steps") or 30
            sd_steps = job.options.get("sd_steps") or 20
            octree_resolution = job.options.get("octree_resolution") or 256
            guidance_scale = job.options.get("guidance_scale") or 5.0
            sd_guidance_scale = job.options.get("sd_guidance_scale") or 7.5

            print(f"[A03D] Job {job_id}: generating '{prompt}' (steps={steps}, sd_steps={sd_steps}, octree={octree_resolution})")

            models = get_models()

            # Step 1: Text → Image
            _update_progress_step(job_id, "image", "Generating image", 1, 0)
            sd_pipe = models["text2image"]
            image = sd_pipe(
                prompt,
                negative_prompt=NEGATIVE_PROMPT,
                num_inference_steps=sd_steps,
                guidance_scale=sd_guidance_scale,
                width=512,
                height=512,
            ).images[0]
            print(f"[A03D] Image generated: {image.size}")

            # Save intermediate image for real-time preview
            image_path = INTERMEDIATE_DIR / f"{job_id}_preview.png"
            image.save(image_path)
            with _queue_lock:
                if job_id in _job_queue:
                    _job_queue[job_id].options["preview_image"] = f"/api/library/{job_id}/preview"

            # Step 2: Image → 3D Mesh (diffusion)
            _update_progress_step(job_id, "mesh", "Generating 3D shape", 2, 0)
            shape_pipe = models["shape_pipeline"]
            mesh_list = shape_pipe(
                image=image,
                num_inference_steps=steps,
                octree_resolution=octree_resolution,
                guidance_scale=guidance_scale,
            )
            mesh = mesh_list[0]
            print(f"[A03D] Mesh generated: {len(mesh.vertices)} verts, {len(mesh.faces)} faces")

            # Step 3: Geometry cleanup (volume decode is included in step 2)
            _update_progress_step(job_id, "geometry", "Cleaning up geometry", 3, 0)
            mesh = _remove_ground_plane(mesh)
            mesh = _orient_upright(mesh)
            print(f"[A03D] Geometry processed")

            # Step 4: Texture disabled - raw geometry only
            _update_progress_step(job_id, "texture", "Texture disabled", 4, 100)

            # Step 5: Save
            _update_progress_step(job_id, "finalize", "Saving model", 5, 0)
            file_path = LIBRARY_DIR / f"{job_id}.glb"
            mesh.export(str(file_path), file_type="glb")

            # Render thumbnail in background
            threading.Thread(target=_render_thumbnail, args=(job_id, mesh), daemon=True).start()

            created_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            meta = {
                "id": job_id,
                "name": name,
                "prompt": prompt,
                "vertices": int(len(mesh.vertices)),
                "faces": int(len(mesh.faces)),
                "created_at": created_at,
                "file_size": file_path.stat().st_size,
                "textured": False,
            }
            meta_path = LIBRARY_DIR / f"{job_id}.json"
            meta_path.write_text(json.dumps(meta))

            elapsed = time.time() - start_time
            global _avg_generation_seconds
            _avg_generation_seconds = 0.7 * _avg_generation_seconds + 0.3 * elapsed

            result_data = {
                "id": job_id,
                "name": name,
                "prompt": prompt,
                "model_type": "hunyuan3d",
                "created_at": created_at,
                "vertices": meta["vertices"],
                "faces": meta["faces"],
                "download_url": f"/api/library/{job_id}/download",
                "thumbnail_url": f"/api/library/{job_id}/thumbnail",
            }

            with _queue_lock:
                if job_id in _job_queue:
                    _job_queue[job_id].status = JobStatus.DONE
                    _job_queue[job_id].result = result_data

            # Mark progress as complete
            _update_progress_step(job_id, "finalize", "Complete", 5, 100)
            with _progress_lock:
                if job_id in _job_progress:
                    _job_progress[job_id]["done"] = True
                    _job_progress[job_id]["total_percent"] = 100
                    _job_progress[job_id]["step_percent"] = 100

            print(f"[A03D] Job {job_id} done ({meta['vertices']} verts, {meta['faces']} faces, {elapsed:.1f}s)")

        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"[A03D] Job {job_id} failed: {e}")
            with _queue_lock:
                if job_id in _job_queue:
                    _job_queue[job_id].status = JobStatus.ERROR
                    _job_queue[job_id].error = str(e)
            with _progress_lock:
                if job_id in _job_progress:
                    _job_progress[job_id]["done"] = True


# ── Thumbnail rendering ────────────────────────────────────────────

def _render_thumbnail(model_id: str, mesh: trimesh.Trimesh):
    """Render a 3D thumbnail and save as PNG."""
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        from mpl_toolkits.mplot3d.art3d import Poly3DCollection

        verts = np.array(mesh.vertices)
        faces = np.array(mesh.faces)

        max_faces = 12000
        if len(faces) > max_faces:
            indices = np.linspace(0, len(faces) - 1, max_faces, dtype=int)
            faces = faces[indices]

        center = verts.mean(axis=0)
        verts -= center
        max_range = np.abs(verts).max()
        if max_range > 0:
            verts /= max_range

        vertex_colors = None
        if hasattr(mesh, "visual") and hasattr(mesh.visual, "vertex_colors"):
            vc = np.array(mesh.visual.vertex_colors)
            if len(vc) == len(verts):
                vertex_colors = vc[:, :3] / 255.0

        fig = plt.figure(figsize=(3, 3), dpi=100)
        ax = fig.add_subplot(111, projection="3d", facecolor="#0a0a0a")
        ax.set_facecolor("#0a0a0a")

        polygons = verts[faces]
        if vertex_colors is not None:
            face_colors = vertex_colors[faces].mean(axis=1)
            poly = Poly3DCollection(polygons, alpha=0.9, linewidths=0.1, edgecolors="#1a1a1a")
            poly.set_facecolor(face_colors)
        else:
            poly = Poly3DCollection(polygons, alpha=0.9, facecolor="#888888",
                                    linewidths=0.1, edgecolors="#1a1a1a")
        ax.add_collection3d(poly)

        ax.set_xlim(-1, 1)
        ax.set_ylim(-1, 1)
        ax.set_zlim(-1, 1)
        ax.set_axis_off()
        ax.view_init(elev=30, azim=-45)

        fig.tight_layout(pad=0)
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=120, bbox_inches="tight",
                    facecolor="#0a0a0a", edgecolor="none")
        plt.close(fig)

        thumb_path = LIBRARY_DIR / f"{model_id}_thumb.png"
        thumb_path.write_bytes(buf.getvalue())
        print(f"[A03D] Thumbnail saved: {thumb_path.name}")
    except Exception as e:
        print(f"[A03D] Thumbnail render failed: {e}")


# ── API Endpoints ──────────────────────────────────────────────────

@app.post("/api/generate", response_model=QueuedResponse)
async def generate_model(req: GenerateRequest):
    """Queue a 3D generation job."""
    with _queue_lock:
        if len(_job_order) >= MAX_QUEUE_DEPTH:
            raise HTTPException(
                status_code=503,
                detail=f"Queue full ({len(_job_order)} jobs waiting). Try again in a few minutes."
            )

    job_id = uuid.uuid4().hex[:12]
    options = {
        "prompt": req.prompt,
        "save_to_library": req.save_to_library,
        "name": req.name,
        "steps": req.steps,
        "sd_steps": req.sd_steps,
        "octree_resolution": req.octree_resolution,
        "guidance_scale": req.guidance_scale,
        "sd_guidance_scale": req.sd_guidance_scale,
        "enable_texture": req.enable_texture,
    }

    with _queue_lock:
        position = len(_job_order) + 1
        job = Job(
            id=job_id,
            status=JobStatus.QUEUED,
            position=position,
            created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            prompt=req.prompt,
            options=options,
        )
        _job_queue[job_id] = job
        _job_order.append(job_id)

    asyncio.create_task(asyncio.to_thread(_run_generation, job_id))

    return QueuedResponse(
        job_id=job_id,
        status="queued",
        position=position,
        estimated_wait=_estimate_wait_seconds(position),
        poll_url=f"/api/queue/{job_id}",
    )


@app.get("/api/queue/{job_id}")
async def get_job_status(job_id: str):
    """Get the current status of a queued generation job."""
    with _queue_lock:
        job = _job_queue.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    position = _get_queue_position(job_id)

    # Build response with progress
    response = {
        "job_id": job.id,
        "status": job.status.value,
        "position": position,
        "estimated_wait": _estimate_wait_seconds(position),
        "created_at": job.created_at,
        "error": job.error,
        "result": job.result,
        "progress": None,
        "preview_url": job.options.get("preview_image"),
    }

    with _progress_lock:
        if job_id in _job_progress:
            response["progress"] = _job_progress[job_id]

    # Auto-cleanup old jobs
    if job.status in (JobStatus.DONE, JobStatus.ERROR):
        try:
            age = time.time() - time.mktime(time.strptime(job.created_at, "%Y-%m-%dT%H:%M:%SZ"))
            if age > 3600:
                with _queue_lock:
                    _job_queue.pop(job_id, None)
                with _progress_lock:
                    _job_progress.pop(job_id, None)
                # Clean up intermediate preview image
                preview_path = INTERMEDIATE_DIR / f"{job_id}_preview.png"
                if preview_path.exists():
                    preview_path.unlink()
        except (ValueError, OSError):
            pass

    return response


@app.get("/api/library")
async def list_library():
    """List all generated models."""
    items = []
    for meta_file in sorted(LIBRARY_DIR.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True):
        meta = json.loads(meta_file.read_text())
        items.append(LibraryItem(**meta, thumbnail_url=f"/api/library/{meta['id']}/thumbnail"))
    return {"items": items, "total": len(items)}


@app.get("/api/library/{model_id}")
async def get_model_meta(model_id: str):
    meta_path = LIBRARY_DIR / f"{model_id}.json"
    if not meta_path.exists():
        raise HTTPException(status_code=404, detail="Model not found")
    return json.loads(meta_path.read_text())


@app.get("/api/library/{model_id}/thumbnail")
async def get_thumbnail(model_id: str):
    thumb_path = LIBRARY_DIR / f"{model_id}_thumb.png"
    if thumb_path.exists():
        return FileResponse(thumb_path)

    glb_path = LIBRARY_DIR / f"{model_id}.glb"
    if not glb_path.exists():
        raise HTTPException(status_code=404, detail="Model not found")

    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        from mpl_toolkits.mplot3d.art3d import Poly3DCollection

        tm = trimesh.load(str(glb_path))
        if isinstance(tm, trimesh.Scene):
            geometries = [g for g in tm.geometry.values() if isinstance(g, trimesh.Trimesh)]
            if not geometries:
                raise ValueError("No geometry")
            tm = trimesh.util.concatenate(geometries)

        verts = np.array(tm.vertices)
        faces = np.array(tm.faces)

        max_faces = 12000
        if len(faces) > max_faces:
            indices = np.linspace(0, len(faces) - 1, max_faces, dtype=int)
            faces = faces[indices]

        center = verts.mean(axis=0)
        verts -= center
        max_range = np.abs(verts).max()
        if max_range > 0:
            verts /= max_range

        vertex_colors = None
        if hasattr(tm, "visual") and hasattr(tm.visual, "vertex_colors"):
            vc = np.array(tm.visual.vertex_colors)
            if len(vc) == len(verts):
                vertex_colors = vc[:, :3] / 255.0

        fig = plt.figure(figsize=(3, 3), dpi=120)
        ax = fig.add_subplot(111, projection="3d", facecolor="#0a0a0a")
        ax.set_facecolor("#0a0a0a")

        polygons = verts[faces]
        if vertex_colors is not None:
            face_colors = vertex_colors[faces].mean(axis=1)
            poly = Poly3DCollection(polygons, alpha=0.9, linewidths=0.1, edgecolors="#1a1a1a")
            poly.set_facecolor(face_colors)
        else:
            poly = Poly3DCollection(polygons, alpha=0.9, facecolor="#888888",
                                    linewidths=0.1, edgecolors="#1a1a1a")
        ax.add_collection3d(poly)

        ax.set_xlim(-1, 1)
        ax.set_ylim(-1, 1)
        ax.set_zlim(-1, 1)
        ax.set_axis_off()
        ax.view_init(elev=30, azim=-45)

        fig.tight_layout(pad=0)
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=120, bbox_inches="tight",
                    facecolor="#0a0a0a", edgecolor="none")
        plt.close(fig)
        buf.seek(0)

        thumb_path.write_bytes(buf.getvalue())
        buf.seek(0)
        return StreamingResponse(buf, media_type="image/png")

    except Exception as e:
        print(f"[A03D] Thumbnail render failed for {model_id}: {e}")
        from PIL import Image
        img = Image.new("RGB", (256, 256), color=(30, 30, 30))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)
        return StreamingResponse(buf, media_type="image/png")


@app.delete("/api/library/{model_id}")
async def delete_model(model_id: str):
    for ext in ["glb", "json", "_thumb.png", "_preview.png"]:
        p = LIBRARY_DIR / f"{model_id}{ext}"
        if p.exists():
            p.unlink()
        # Also check intermediate directory
        p2 = INTERMEDIATE_DIR / f"{model_id}{ext}"
        if p2.exists():
            p2.unlink()
    return {"deleted": True, "id": model_id}


@app.get("/api/library/{model_id}/download")
async def download_model(model_id: str):
    file_path = LIBRARY_DIR / f"{model_id}.glb"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Model not found")
    return FileResponse(file_path, filename=f"{model_id}.glb", media_type="model/gltf-binary")


@app.get("/api/library/{model_id}/preview")
async def get_preview_image(model_id: str):
    """Get the intermediate 2D preview image generated in step 1."""
    image_path = INTERMEDIATE_DIR / f"{model_id}_preview.png"
    if image_path.exists():
        return FileResponse(image_path, media_type="image/png")
    raise HTTPException(status_code=404, detail="Preview not ready yet")


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "device": str(DEVICE),
        "model": "hunyuan3d-2.0",
        "library_count": len(list(LIBRARY_DIR.glob("*.glb"))),
        "quantized": QUANTIZE_MODEL,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
