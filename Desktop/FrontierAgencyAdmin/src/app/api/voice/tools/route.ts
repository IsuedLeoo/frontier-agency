import { getDb } from "@/lib/db";
import { executeToolLocally } from "../tools-locally";

export const dynamic = "force-dynamic";

interface VapiToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

interface VapiMessage {
  type: string;
  toolCallList?: VapiToolCall[];
  call?: { id: string; customer?: { number?: string } };
  [key: string]: unknown;
}

/**
 * Vapi function calling endpoint.
 *
 * Vapi sends a POST with:
 *   { message: { type: "tool-calls", toolCallList: [{ id, name, arguments }], call: { id, customer: { number } } } }
 *
 * We must respond with:
 *   { results: [{ toolCallId: <id>, result: <string|object> }, ...] }
 */
export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as { message?: VapiMessage };
    const message = raw.message ?? (raw as unknown as VapiMessage);
    const toolCallList: VapiToolCall[] = message.toolCallList ?? [];
    const phoneNumber = message.call?.customer?.number;

    // Processing tool calls

    const db = getDb();
    const results: Array<{ toolCallId: string; result: unknown }> = [];

    for (const toolCall of toolCallList) {
      const result = await executeToolLocally(toolCall, db, phoneNumber);
      results.push({ toolCallId: toolCall.id, result });
    }

    return Response.json({ results });
  } catch (err) {
    // Vapi tool route error
    return Response.json(
      { results: [{ toolCallId: "unknown", result: { success: false, message: "An error occurred processing the request" } }] },
      { status: 200 }
    );
  }
}
