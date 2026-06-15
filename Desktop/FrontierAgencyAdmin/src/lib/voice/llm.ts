/**
 * LLM Integration via OpenRouter
 *
 * Uses OWL Alpha (free model) for conversation generation.
 * OpenRouter provides a unified API to many LLM providers.
 */

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

export interface LLMConfig {
  apiKey: string;
  model: string; // e.g. "openrouter/owl-alpha"
  maxTokens?: number;
  temperature?: number;
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Send a chat completion request to OpenRouter.
 * Returns the assistant's response text.
 */
export async function chatCompletion(
  config: LLMConfig,
  messages: Message[]
): Promise<string> {
  const response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://frontieragency.com",
      "X-Title": "Frontier Agency Voice Agent",
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens ?? 256,
      temperature: config.temperature ?? 0.9,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${errText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content ?? "";
}

/**
 * Streaming chat completion — yields chunks of text as they arrive.
 */
export async function* streamChatCompletion(
  config: LLMConfig,
  messages: Message[]
): AsyncGenerator<string> {
  const response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://frontieragency.com",
      "X-Title": "Frontier Agency Voice Agent",
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens ?? 256,
      temperature: config.temperature ?? 0.9,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${errText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;

      try {
        const parsed = JSON.parse(data) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const chunk = parsed.choices?.[0]?.delta?.content;
        if (chunk) yield chunk;
      } catch {
        // skip malformed JSON
      }
    }
  }
}

// ─── Model Presets ───────────────────────────────────────────────────────────

export const MODELS = {
  /** OWL Alpha — free, fast, good quality */
  owlAlpha: "openrouter/owl-alpha",
  /** Claude Haiku — cheap, fast */
  claudeHaiku: "anthropic/claude-haiku-4-5",
  /** GPT-4o — high quality */
  gpt4o: "openai/gpt-4o",
  /** GPT-4o-mini — cheap, fast */
  gpt4oMini: "openai/gpt-4o-mini",
} as const;

export type ModelName = keyof typeof MODELS;
