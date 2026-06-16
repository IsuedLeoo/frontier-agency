import { getSession } from "@/lib/auth";
import { getDb, callScriptQueries } from "@/lib/db";
import type { CallScript } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const db = getDb();
    const script = await callScriptQueries.findById(db, id);
    if (!script) {
      return Response.json({ error: "Script not found" }, { status: 404 });
    }
    return Response.json({ script });
  } catch (err) {
    // Script fetch error
    return Response.json({ error: "Failed to fetch script" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as Partial<CallScript>;

  try {
    const db = getDb();
    const existing = await callScriptQueries.findById(db, id);
    if (!existing) {
      return Response.json({ error: "Script not found" }, { status: 404 });
    }

    await callScriptQueries.update(db, id, {
      name: body.name ?? existing.name,
      description: body.description ?? existing.description,
      category: body.category ?? existing.category,
      system_prompt: body.system_prompt ?? existing.system_prompt,
      first_message: body.first_message ?? existing.first_message,
      persona: body.persona ?? existing.persona,
      target_business: body.target_business ?? existing.target_business,
      voice_speed: body.voice_speed ?? existing.voice_speed,
      is_active: body.is_active ?? existing.is_active,
    });

    return Response.json({ success: true, id });
  } catch (err) {
    // Script update error
    return Response.json({ error: "Failed to update script" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const db = getDb();
    await callScriptQueries.delete(db, id);
    return Response.json({ success: true });
  } catch (err) {
    // Script delete error
    return Response.json({ error: "Failed to delete script" }, { status: 500 });
  }
}
