import { getDb, generateId } from "@/lib/db";
import { executeToolLocally } from "../tools-locally";

export const dynamic = "force-dynamic";

/**
 * Vapi tool-calling and function-call endpoint.
 *
 * Vapi sends tool-call requests here when the assistant wants to execute a function.
 * This endpoint handles:
 *   - "tool-calls" events (batch tool calls)
 *   - "function-call" events (single function calls)
 *
 * Returns { results: [...] } for tool-calls, { result: ... } for function-call.
 */

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as any;
    const msg = body.message;

    console.log("[Vapi Inbound] Type:", msg?.type ?? "unknown", JSON.stringify(body).substring(0, 500));

    // Handle tool-calls events (batch)
    if (msg && msg.type === "tool-calls" && msg.toolCallList) {
      const toolCallList = msg.toolCallList;
      const phoneNumber = msg.call?.customer?.number;
      const db = getDb();
      const results: Array<{ toolCallId: string; result: unknown }> = [];

      for (const toolCall of toolCallList) {
        const result = await executeToolLocally(toolCall, db, phoneNumber);
        results.push({ toolCallId: toolCall.id, result });
      }

      return Response.json({ results });
    }

    // Handle function-call events (single)
    if (msg && msg.type === "function-call" && msg.functionCall) {
      const toolCall = {
        id: msg.call?.id ?? generateId(),
        name: msg.functionCall.name,
        arguments: msg.functionCall.parameters as Record<string, unknown>,
      };
      const db = getDb();
      const phoneNumber = msg.call?.customer?.number;
      const result = await executeToolLocally(toolCall, db, phoneNumber);
      return Response.json({ result });
    }

    // For any other event type, just acknowledge
    return new Response(null, { status: 200 });
  } catch (err) {
    console.error("[Vapi Inbound] Error:", err);
    // Return 200 with error result to keep the call alive —
    // returning errors during a call can cause Vapi to hang up
    return Response.json({
      result: { success: false, message: "An error occurred processing the request" },
    });
  }
}
