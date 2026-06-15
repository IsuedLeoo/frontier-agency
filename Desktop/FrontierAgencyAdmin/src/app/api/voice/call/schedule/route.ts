import { getSession } from "@/lib/auth";
import { getDb, voiceCallScheduleQueries } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);

  try {
    const db = getDb();
    const calls = await voiceCallScheduleQueries.listAll(db, limit);
    return Response.json({ calls: calls.results ?? [], total: (calls.results ?? []).length });
  } catch (err) {
    console.error("[Voice Schedule] GET error:", err);
    return Response.json({ error: "Failed to fetch scheduled calls" }, { status: 500 });
  }
}
