import { getSession } from "@/lib/auth";
import { getDb, voiceCallsQueries, voiceCallScheduleQueries } from "@/lib/db";
import { listCalls } from "@/lib/voice/vapi";

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

    // Get calls from D1
    const dbCalls = await voiceCallsQueries.listAll(db, limit);

    // Get scheduled calls
    const scheduledCalls = await voiceCallScheduleQueries.listAll(db, limit);

    return Response.json({
      calls: dbCalls.results ?? [],
      scheduled_calls: (scheduledCalls.results ?? []),
      total: (dbCalls.results ?? []).length,
    });
  } catch (err) {
    // Error listing voice calls
    return Response.json({ error: "Failed to fetch calls" }, { status: 500 });
  }
}
