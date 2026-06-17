import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getQueries } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { analyticsQueries } = await getQueries();
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30";
    const days = `-${range} days`;

    const [eventCountsRes, totalEventsRes, recentEventsRes] = await Promise.all([
      analyticsQueries.getEventCountsByType.bind(days).all(),
      analyticsQueries.getTotalEvents.bind(days).first(),
      analyticsQueries.getRecentEvents.bind(50).all(),
    ]);

    // Unwrap D1 response format { results: [...] }
    const eventCounts = (eventCountsRes as { results?: unknown[] })?.results ?? eventCountsRes;
    const recentEvents = (recentEventsRes as { results?: unknown[] })?.results ?? recentEventsRes;
    const totalEvents = (totalEventsRes as { total: number } | null)?.total || 0;

    return NextResponse.json({
      ok: true,
      range: parseInt(range, 10),
      totalEvents,
      eventCounts,
      recentEvents,
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch analytics stats" },
      { status: 500 }
    );
  }
}
