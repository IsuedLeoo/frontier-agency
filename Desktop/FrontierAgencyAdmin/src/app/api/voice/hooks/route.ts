import { getDb, voiceCallsQueries, generateId } from "@/lib/db";
import { handleInboundWebhook, type VapiWebhookEvent } from "@/lib/voice/vapi";

export const dynamic = "force-dynamic";

/**
 * Vapi webhook endpoint for general events (assistant-request, status-update,
 * end-of-call-report, transcript, etc.).
 *
 * The function-calling (tool-calls) endpoint is separate: /api/voice/inbound
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VapiWebhookEvent;
    const msg = body.message;

    // Vapi webhook received

    // Persist call data to D1 for important events
    if (msg) {
      const db = getDb();

      try {
        switch (msg.type) {
          case "status-update": {
            const callId = msg.callId;
            const existing = await voiceCallsQueries.findByCallControlId(db, callId);
            if (existing) {
              await voiceCallsQueries.updateStatus(db, existing.id, msg.status);
              if (msg.status === "in-progress") {
                await voiceCallsQueries.updateAnswered(db, existing.id);
              }
            } else {
              // Create a new record if we don't have one yet
              await voiceCallsQueries.create(db, {
                id: generateId(),
                call_control_id: callId,
                direction: "inbound",
                from_number: null,
                to_number: null,
                status: msg.status,
                initiated_by: null,
              });
            }
            break;
          }

          case "end-of-call-report": {
            const callId = msg.callId;
            const existing = await voiceCallsQueries.findByCallControlId(db, callId);
            if (existing) {
              await voiceCallsQueries.updateOnEnd(
                db,
                existing.id,
                "completed",
                msg.durationSeconds ?? null,
                msg.transcript ?? null,
                msg.summary ?? null,
                null
              );
            }
            break;
          }

          case "transcript": {
            const callId = msg.callId;
            const existing = await voiceCallsQueries.findByCallControlId(db, callId);
            if (existing && msg.transcript) {
              // Append to existing transcript
              const currentTranscript = existing.transcript || "";
              const newTranscript = currentTranscript
                ? `${currentTranscript}\n${msg.role}: ${msg.transcript}`
                : `${msg.role}: ${msg.transcript}`;
              await voiceCallsQueries.updateTranscript(db, existing.id, newTranscript);
            }
            break;
          }

          case "hang": {
            const callId = msg.callId;
            const existing = await voiceCallsQueries.findByCallControlId(db, callId);
            if (existing) {
              await voiceCallsQueries.updateOnEnd(
                db,
                existing.id,
                "completed",
                null,
                null,
                "Call ended (hang)",
                null
              );
            }
            break;
          }

          default:
            break;
        }
      } catch (dbErr) {
        // Log but don't fail the webhook — Vapi doesn't retry on error
        // Webhook DB error
      }
    }

    const response = handleInboundWebhook(body);

    if (response) {
      return Response.json(response);
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    // Webhook processing error
    // Return 200 to prevent Vapi from retrying — we don't want duplicate events
    return new Response(null, { status: 200 });
  }
}
