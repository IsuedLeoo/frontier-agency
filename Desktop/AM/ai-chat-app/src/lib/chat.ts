import { ProviderConfig, AIModel } from "./models";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface SendOptions {
  provider: ProviderConfig;
  model: AIModel;
  messages: ChatMessage[];
  onStream?: (chunk: string) => void;       // response tokens
  onReasoning?: (chunk: string) => void;    // reasoning / thinking tokens
  signal?: AbortSignal;
}

export interface SendResult {
  text: string;
  error?: string;
  reasoning?: string;
}

/* ------------------------------------------------------------------ */
/*  History trimming                                                    */
/* ------------------------------------------------------------------ */
export function trimHistory(
  messages: ChatMessage[],
  contextWindow?: number
): ChatMessage[] {
  const maxChars = contextWindow ? contextWindow * 3 : 200_000;
  let total = messages.reduce((s, m) => s + m.content.length, 0);
  if (total <= maxChars) return messages;

  const system = messages.find((m) => m.role === "system");
  const rest = messages.filter((m) => m.role !== "system");

  while (total > maxChars && rest.length > 2) {
    const dropped = rest.shift()!;
    total -= dropped.content.length;
  }

  return system ? [system, ...rest] : rest;
}

/* ------------------------------------------------------------------ */
/*  Unified send                                                        */
/* ------------------------------------------------------------------ */
export async function sendChatMessage(options: SendOptions): Promise<SendResult> {
  const { provider, model, messages, onStream, onReasoning, signal } = options;
  const trimmed = trimHistory(messages, model.contextWindow);

  try {
    switch (provider.preset) {
      case "openai":
        return await sendOpenAI({ provider, model, messages: trimmed, onStream, onReasoning, signal });
      case "anthropic":
        return await sendAnthropic({ provider, model, messages: trimmed, onStream, onReasoning, signal });
      case "ollama":
        return await sendOllama({ provider, model, messages: trimmed, onStream, onReasoning, signal });
      case "openrouter":
        return await sendOpenRouter({ provider, model, messages: trimmed, onStream, onReasoning, signal });
      case "custom":
        return await sendCustom({ provider, model, messages: trimmed, onStream, onReasoning, signal });
      default:
        return { text: "", error: `Unknown provider preset: ${provider.preset}` };
    }
  } catch (err) {
    return { text: "", error: err instanceof Error ? err.message : String(err) };
  }
}

/* ------------------------------------------------------------------ */
/*  Reasoning parser (shared)                                           */
/*  Splits <think>...</think> blocks from response text in real-time.   */
/* ------------------------------------------------------------------ */
function extractReasoning(raw: string): { text: string; reasoning?: string } {
  let s = raw.indexOf("<think>");
  let e = raw.indexOf("</think>");
  if (s !== -1 && e !== -1 && e > s) {
    return { text: (raw.slice(0, s) + raw.slice(e + 8)).trim(), reasoning: raw.slice(s + 7, e).trim() };
  }
  s = raw.indexOf("<thinking>");
  e = raw.indexOf("</thinking>");
  if (s !== -1 && e !== -1 && e > s) {
    return { text: (raw.slice(0, s) + raw.slice(e + 11)).trim(), reasoning: raw.slice(s + 10, e).trim() };
  }
  return { text: raw };
}

function createReasoningParser(
  onStream?: (chunk: string) => void,
  onReasoning?: (chunk: string) => void
) {
  let rawText = "";
  let reasoningEmitted = "";
  let responseEmitted = "";

  function flush() {
    const { text: response, reasoning } = extractReasoning(rawText);
    if (onReasoning && reasoning && reasoning.length > reasoningEmitted.length) {
      onReasoning(reasoning.slice(reasoningEmitted.length));
      reasoningEmitted = reasoning;
    }
    if (onStream && response.length > responseEmitted.length) {
      onStream(response.slice(responseEmitted.length));
      responseEmitted = response;
    }
  }

  function append(piece: string) {
    rawText += piece;
    flush();
  }

  function finalize(): { text: string; reasoning?: string } {
    return extractReasoning(rawText);
  }

  return { append, finalize };
}

function parseReasoning(text: string): { text: string; reasoning?: string } {
  // Handle <think>...</think> tags
  const thinkStart = text.indexOf("<think>");
  const thinkEnd = text.indexOf("</think>");
  if (thinkStart !== -1 && thinkEnd !== -1 && thinkEnd > thinkStart) {
    const reasoning = text.slice(thinkStart + 7, thinkEnd);
    const clean = text.slice(0, thinkStart) + text.slice(thinkEnd + 8);
    return { text: clean.trim(), reasoning: reasoning.trim() };
  }
  // Handle <thinking>...</thinking> tags (DeepSeek, etc.)
  const thinkingStart = text.indexOf("<thinking>");
  const thinkingEnd = text.indexOf("</thinking>");
  if (thinkingStart !== -1 && thinkingEnd !== -1 && thinkingEnd > thinkingStart) {
    const reasoning = text.slice(thinkingStart + 10, thinkingEnd);
    const clean = text.slice(0, thinkingStart) + text.slice(thinkingEnd + 11);
    return { text: clean.trim(), reasoning: reasoning.trim() };
  }
  return { text };
}

/* ------------------------------------------------------------------ */
/*  OpenAI format                                                       */
/* ------------------------------------------------------------------ */
async function sendOpenAI(opts: SendOptions): Promise<SendResult> {
  const { provider, model, messages, onStream, onReasoning, signal } = opts;
  const apiKey = provider.apiKey?.trim();
  if (!apiKey) return { text: "", error: "OpenAI API key is missing. Add it in Settings." };

  const url = `${provider.baseUrl || "https://api.openai.com/v1"}/chat/completions`;
  const body = {
    model: model.id,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    stream: !!(onStream || onReasoning),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const err = await res.text();
    return { text: "", error: `OpenAI error ${res.status}: ${err}` };
  }

  if ((onStream || onReasoning) && res.body) {
    return await readSSE(res.body, (line) => {
      if (line === "[DONE]") return {};
      try {
        const j = JSON.parse(line);
        const delta = j.choices?.[0]?.delta;
        return {
          content: delta?.content || "",
          reasoning: delta?.reasoning_content || delta?.reasoning || "",
        };
      } catch {
        return {};
      }
    }, signal, onStream, onReasoning);
  }

  const data = await res.json();
  const msg = data.choices?.[0]?.message;
  const content = msg?.content || "";
  const apiReasoning = msg?.reasoning_content || msg?.reasoning;
  if (apiReasoning) {
    return { text: content, reasoning: apiReasoning };
  }
  return parseReasoning(content);
}

/* ------------------------------------------------------------------ */
/*  OpenRouter                                                          */
/* ------------------------------------------------------------------ */
async function sendOpenRouter(opts: SendOptions): Promise<SendResult> {
  const { provider, model, messages, onStream, onReasoning, signal } = opts;
  const apiKey = provider.apiKey?.trim();
  if (!apiKey)
    return { text: "", error: "OpenRouter API key is missing. Add it in Settings." };

  const url = `${provider.baseUrl || "https://openrouter.ai/api/v1"}/chat/completions`;
  const body = {
    model: model.id,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    stream: !!(onStream || onReasoning),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://amchat.app",
      "X-Title": "A.M. Chat",
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const err = await res.text();
    return { text: "", error: `OpenRouter error ${res.status}: ${err}` };
  }

  if ((onStream || onReasoning) && res.body) {
    return await readSSE(res.body, (line) => {
      if (line === "[DONE]") return {};
      try {
        const j = JSON.parse(line);
        const delta = j.choices?.[0]?.delta;
        return {
          content: delta?.content || "",
          reasoning: delta?.reasoning_content || delta?.reasoning || "",
        };
      } catch {
        return {};
      }
    }, signal, onStream, onReasoning);
  }

  const data = await res.json();
  const msg = data.choices?.[0]?.message;
  const content = msg?.content || "";
  const apiReasoning = msg?.reasoning_content || msg?.reasoning;
  if (apiReasoning) {
    return { text: content, reasoning: apiReasoning };
  }
  return parseReasoning(content);
}

/* ------------------------------------------------------------------ */
/*  Anthropic                                                           */
/* ------------------------------------------------------------------ */
async function sendAnthropic(opts: SendOptions): Promise<SendResult> {
  const { provider, model, messages, onStream, onReasoning, signal } = opts;
  const apiKey = provider.apiKey?.trim();
  if (!apiKey)
    return { text: "", error: "Anthropic API key is missing. Add it in Settings." };

  const systemMsg = messages.find((m) => m.role === "system");
  const conversation = messages.filter((m) => m.role !== "system");

  const url = `${provider.baseUrl || "https://api.anthropic.com/v1"}/messages`;
  const body: Record<string, unknown> = {
    model: model.id,
    max_tokens: 4096,
    messages: conversation.map((m) => ({ role: m.role, content: m.content })),
    stream: !!(onStream || onReasoning),
  };
  if (systemMsg) body.system = systemMsg.content;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const err = await res.text();
    return { text: "", error: `Anthropic error ${res.status}: ${err}` };
  }

  if ((onStream || onReasoning) && res.body) {
    return await readSSE(res.body, (line) => {
      try {
        const j = JSON.parse(line);
        if (j.type === "content_block_delta") {
          return {
            content: j.delta?.text || "",
            reasoning: j.delta?.thinking || "",
          };
        }
        return {};
      } catch {
        return {};
      }
    }, signal, onStream, onReasoning);
  }

  const data = await res.json();
  const blocks: Array<{ type?: string; text?: string; thinking?: string }> = data.content || [];
  let text = "";
  let reasoning = "";
  for (const block of blocks) {
    if (block.type === "text" && block.text) text += block.text;
    if ((block.type === "thinking" || block.type === "thought") && block.thinking) reasoning += block.thinking;
  }
  if (reasoning) return { text, reasoning };
  return parseReasoning(text);
}

/* ------------------------------------------------------------------ */
/*  Ollama                                                              */
/* ------------------------------------------------------------------ */
async function sendOllama(opts: SendOptions): Promise<SendResult> {
  const { provider, model, messages, onStream, onReasoning, signal } = opts;
  const url = `${provider.baseUrl || "http://localhost:11434"}/api/chat`;
  const body = {
    model: model.id,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    stream: !!(onStream || onReasoning),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const err = await res.text();
    return { text: "", error: `Ollama error ${res.status}: ${err}` };
  }

  if ((onStream || onReasoning) && res.body) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    const parser = createReasoningParser(onStream, onReasoning);
    try {
      while (true) {
        if (signal?.aborted) throw new Error("Aborted");
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.trim()) continue;
          try {
            const j = JSON.parse(line);
            const piece = j.message?.content || "";
            if (piece) parser.append(piece);
          } catch {
            // ignore malformed JSON lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
    return parser.finalize();
  }

  const data = await res.json();
  const content = data.message?.content || "";
  const apiReasoning = data.message?.reasoning;
  if (apiReasoning) {
    return { text: content, reasoning: apiReasoning };
  }
  return parseReasoning(content);
}

/* ------------------------------------------------------------------ */
/*  Custom (OpenAI-compatible by default)                               */
/* ------------------------------------------------------------------ */
async function sendCustom(opts: SendOptions): Promise<SendResult> {
  const { provider, model, messages, onStream, onReasoning, signal } = opts;
  const apiKey = provider.apiKey?.trim();
  if (!apiKey) return { text: "", error: "Custom provider API key is missing." };
  if (!provider.baseUrl)
    return { text: "", error: "Custom provider base URL is missing." };

  const url = `${provider.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const body = {
    model: model.id,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    stream: !!(onStream || onReasoning),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const err = await res.text();
    return { text: "", error: `Custom provider error ${res.status}: ${err}` };
  }

  if ((onStream || onReasoning) && res.body) {
    return await readSSE(res.body, (line) => {
      if (line === "[DONE]") return {};
      try {
        const j = JSON.parse(line);
        const delta = j.choices?.[0]?.delta;
        return {
          content: delta?.content || "",
          reasoning: delta?.reasoning_content || delta?.reasoning || "",
        };
      } catch {
        return {};
      }
    }, signal, onStream, onReasoning);
  }

  const data = await res.json();
  const msg = data.choices?.[0]?.message;
  const content = msg?.content || "";
  const apiReasoning = msg?.reasoning_content || msg?.reasoning;
  if (apiReasoning) {
    return { text: content, reasoning: apiReasoning };
  }
  return parseReasoning(content);
}

/* ------------------------------------------------------------------ */
/*  SSE reader helper                                                   */
/*  extract() may return { content, reasoning } for providers that     */
/*  stream reasoning in a separate field (OpenRouter, OpenAI o1, etc.)  */
/* ------------------------------------------------------------------ */
async function readSSE(
  body: ReadableStream<Uint8Array>,
  extract: (line: string) => { content?: string; reasoning?: string },
  signal?: AbortSignal,
  onStream?: (chunk: string) => void,
  onReasoning?: (chunk: string) => void
): Promise<{ text: string; reasoning?: string }> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const parser = createReasoningParser(onStream, onReasoning);
  let reasoningAcc = "";

  try {
    while (true) {
      if (signal?.aborted) throw new Error("Aborted");
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      for (let line of chunk.split("\n")) {
        line = line.trim();
        if (!line || !line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        const { content, reasoning } = extract(payload);
        if (reasoning) {
          reasoningAcc += reasoning;
          onReasoning?.(reasoning);
        }
        if (content) {
          parser.append(content);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
  const result = parser.finalize();
  if (reasoningAcc) return { ...result, reasoning: reasoningAcc };
  return result;
}
