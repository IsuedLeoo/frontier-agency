import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getQueries } from "@/lib/db";
import { generateId } from "@/lib/auth";

interface AnalyticsEventBatch {
  type: string;
  fingerprint: string;
  sessionId?: string;
  pagePath: string;
  pageTitle?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  duration?: number;
  scrollDepth?: number;
  eventType?: string;
  eventName?: string;
  eventData?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const batch: AnalyticsEventBatch[] = await request.json();

    if (!Array.isArray(batch) || batch.length === 0) {
      return NextResponse.json({ ok: true, inserted: 0 });
    }

    const { analyticsQueries } = await getQueries();
    const now = new Date().toISOString();
    let inserted = 0;

    for (const event of batch) {
      try {
        const id = generateId();
        await analyticsQueries.insertEvent
          .bind(
            id,
            event.sessionId || null,
            event.pagePath || "/",
            event.type,
            event.eventName || null,
            event.eventData ? JSON.stringify(event.eventData) : "{}",
            now
          )
          .run();
        inserted++;
      } catch (eventError) {
        console.error("Failed to insert analytics event:", eventError);
        // Continue processing remaining events
      }
    }

    return NextResponse.json({ ok: true, inserted });
  } catch (error) {
    console.error("Analytics track error:", error);
    // Return 200 anyway — analytics should never break the client
    return NextResponse.json({ ok: false, error: "Failed to process events" });
  }
}
