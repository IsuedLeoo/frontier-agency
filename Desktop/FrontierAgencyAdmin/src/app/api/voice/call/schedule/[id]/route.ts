import { getSession } from "@/lib/auth";
import { getDb, voiceCallScheduleQueries } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as { status?: string };
  const status = body?.status;

  if (!status || !["pending", "completed", "failed", "cancelled"].includes(status)) {
    return Response.json(
      { error: "Valid status required: pending, completed, failed, cancelled" },
      { status: 400 }
    );
  }

  try {
    const db = getDb();
    const existing = await voiceCallScheduleQueries.findById(db, id);
    if (!existing) {
      return Response.json({ error: "Scheduled call not found" }, { status: 404 });
    }

    await voiceCallScheduleQueries.updateStatus(db, id, status);
    return Response.json({ success: true, id, status });
  } catch (err) {
    console.error("[Voice Schedule] PATCH error:", err);
    return Response.json({ error: "Failed to update scheduled call" }, { status: 500 });
  }
}
