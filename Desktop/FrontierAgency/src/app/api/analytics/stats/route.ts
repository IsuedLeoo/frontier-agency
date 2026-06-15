import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getQueries } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { analyticsQueries } = await getQueries();
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30";
    const days = `-${range} days`;

    const [pageviewsByDay, topPages, uniqueVisitors, eventCounts, totalEvents, recentEvents] = await Promise.all([
      analyticsQueries.getPageviewsByDay.bind(days).all(),
      analyticsQueries.getTopPages.bind(days).all(),
      analyticsQueries.getUniqueVisitorsByDay.bind(days).all(),
      analyticsQueries.getEventCountsByType.bind(days).all(),
      analyticsQueries.getTotalEvents.bind(days).first(),
      analyticsQueries.getRecentEvents.bind(50).all(),
    ]);

    return NextResponse.json({
      ok: true,
      range: parseInt(range, 10),
      totalEvents: (totalEvents as { total: number } | null)?.total || 0,
      pageviewsByDay,
      topPages,
      uniqueVisitors,
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
