import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getToolDefinitions, executeTool } from "@/lib/chat/tools";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import type { ChatMessage, ToolCall } from "@/lib/chat/types";

export const dynamic = "force-dynamic";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const FREE_MODEL = "openrouter/owl-alpha";
const MAX_TOOL_ITERATIONS = 5;

export async function POST(request: Request) {
  // ── Auth ─────────────────────────────────────────────────────────────────
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const { env } = getCloudflareContext();
  const apiKey = (env as unknown as { OPENROUTER_API_KEY: string }).OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "OpenRouter API key not configured" }, { status: 500 });
  }

  // ── Parse request ────────────────────────────────────────────────────────
  const { messages }: { messages: ChatMessage[] } = await request.json();

  const systemMessage = {
    role: "system" as const,
    content: buildSystemPrompt(user.name),
  };

  const apiMessages: Array<{
    role: string;
    content: string;
    tool_calls?: ToolCall[];
    tool_call_id?: string;
  }> = [systemMessage];

  for (const msg of messages) {
    if (msg.role === "system") continue;
    if (msg.role === "tool") {
      apiMessages.push({
        role: "tool",
        content: msg.content,
        tool_call_id: msg.tool_call_id,
      });
    } else {
      const entry: { role: string; content: string; tool_calls?: ToolCall[] } = {
        role: msg.role,
        content: msg.content,
      };
      if (msg.tool_calls) {
        entry.tool_calls = msg.tool_calls;
      }
      apiMessages.push(entry);
    }
  }

  // ── Tool execution loop ──────────────────────────────────────────────────
  const tools = getToolDefinitions();
  let iteration = 0;
  let finalContent = "";

  while (iteration < MAX_TOOL_ITERATIONS) {
    iteration++;

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://admin.frontieragency.gstudios.dev",
        "X-Title": "Frontier Agency Admin Console",
      },
      body: JSON.stringify({
        model: FREE_MODEL,
        messages: apiMessages,
        tools,
        tool_choice: "auto",
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json(
        { error: `OpenRouter error: ${response.status} — ${errText}` },
        { status: 502 }
      );
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string; tool_calls?: ToolCall[] } }>;
    };

    const assistantMsg = data.choices[0]?.message;
    if (!assistantMsg) {
      return Response.json({ error: "Empty response from model" }, { status: 502 });
    }

    // If there are tool calls, execute them and loop
    if (assistantMsg.tool_calls && assistantMsg.tool_calls.length > 0) {
      // Add assistant message with tool_calls
      apiMessages.push({
        role: "assistant",
        content: assistantMsg.content ?? "",
        tool_calls: assistantMsg.tool_calls,
      });

      // Execute all tool calls
      for (const toolCall of assistantMsg.tool_calls) {
        let result: unknown;
        try {
          result = await executeTool(toolCall, db, user.id);
        } catch (err) {
          result = {
            error: err instanceof Error ? err.message : "Tool execution failed",
          };
        }

        apiMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      // Continue loop — send back to model with tool results
      continue;
    }

    // No tool calls — this is the final response
    finalContent = assistantMsg.content ?? "I couldn't generate a response. Please try again.";
    break;
  }

  // ── Stream the response ──────────────────────────────────────────────────
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(finalContent));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
