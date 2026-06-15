import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { scheduleTodaysCalls } from "@/lib/voice/auto-dialer";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { env } = getCloudflareContext();
  const db = env.frontier_agency_db as D1Database;

  try {
    const result = await scheduleTodaysCalls(db, undefined, user.id);
    return Response.json({
      success: true,
      scheduled: result.scheduled,
      callIds: result.calls,
    });
  } catch (err) {
    console.error("[Dialer] Schedule error:", err);
    return Response.json(
      { error: "Failed to schedule calls" },
      { status: 500 }
    );
  }
}
