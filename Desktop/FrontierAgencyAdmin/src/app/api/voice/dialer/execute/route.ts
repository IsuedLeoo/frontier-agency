/**
 * Execute pending scheduled calls.
 *
 * This endpoint is designed to be called by a Cloudflare Cron Trigger
 * every 5 minutes during business hours (Mon-Fri 9AM-6PM ET).
 *
 * It checks for pending calls that are due and initiates them via Vapi.
 */

import { getDb, voiceCallScheduleQueries, voiceCallsQueries, generateId, voiceConfigQueries } from "@/lib/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getPendingCalls, completeScheduledCall } from "@/lib/voice/auto-dialer";
import { initiateOutboundCall } from "@/lib/voice/vapi";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Verify cron secret if provided
  const authHeader = request.headers.get("Authorization");
  const { env } = getCloudflareContext();
  const expectedSecret = (env as unknown as { CRON_SECRET?: string }).CRON_SECRET;
  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = env.frontier_agency_db as D1Database;

  try {
    const pending = await getPendingCalls(db);

    if (pending.length === 0) {
      return Response.json({ executed: 0, message: "No pending calls" });
    }

    const results: Array<{ scheduleId: string; callId?: string; error?: string }> = [];

    for (const call of pending) {
      try {
        // Parse metadata for context
        let businessName = call.phone_number;
        let industry = "";
        try {
          const meta = JSON.parse(call.metadata);
          businessName = meta.businessName || businessName;
          industry = meta.industry || "";
        } catch { /* ignore */ }

        // Initiate the outbound call via Vapi
        const { callId } = await initiateOutboundCall({
          to: call.phone_number,
          metadata: {
            businessName,
            industry,
            scheduledCallId: call.id,
            source: "auto-dialer",
          },
        });

        // Get the configured phone number for from_number
        const voiceConfig = await voiceConfigQueries.get(db);
        const fromNumber = voiceConfig?.phone_number || null;

        // Create voice_calls record
        await voiceCallsQueries.create(db, {
          id: generateId(),
          call_control_id: callId,
          direction: "outbound",
          from_number: fromNumber,
          to_number: call.phone_number,
          status: "initiated",
          initiated_by: null, // system-initiated
        });

        // Mark scheduled call as completed
        await completeScheduledCall(db, call.id, "completed");

        results.push({ scheduleId: call.id, callId });
      } catch (err) {
        // Failed to execute scheduled call
        await completeScheduledCall(db, call.id, "failed");
        results.push({
          scheduleId: call.id,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return Response.json({
      executed: results.length,
      results,
    });
  } catch (err) {
    // Dialer execution error
    return Response.json(
      { error: "Failed to execute dialer" },
      { status: 500 }
    );
  }
}
