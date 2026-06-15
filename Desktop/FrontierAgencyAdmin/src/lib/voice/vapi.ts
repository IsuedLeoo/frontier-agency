import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { VoiceConfig } from "@/lib/types";

const VAPI_BASE = "https://api.vapi.ai";

function getApiKey(): string {
  const { env } = getCloudflareContext();
  return (env as unknown as { VAPI_PRIVATE_KEY: string }).VAPI_PRIVATE_KEY;
}

function getAssistantId(): string {
  const { env } = getCloudflareContext();
  return (env as unknown as { VAPI_ASSISTANT_ID: string }).VAPI_ASSISTANT_ID;
}

function getPhoneNumberId(): string {
  const { env } = getCloudflareContext();
  return (env as unknown as { VAPI_PHONE_NUMBER_ID: string })
    .VAPI_PHONE_NUMBER_ID;
}

async function vapiRequest(
  method: string,
  path: string,
  body?: unknown
): Promise<unknown> {
  const apiKey = getApiKey();
  const response = await fetch(`${VAPI_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Vapi API error ${response.status}: ${errText}`);
  }

  return response.json();
}

// ─── Outbound Call ───────────────────────────────────────────────────────────

export interface OutboundCallOptions {
  to: string;
  metadata?: Record<string, string>;
  /** Optional voice/model overrides for this specific call */
  voiceOverrides?: {
    voiceProvider?: string;
    voiceId?: string;
    model?: string;
    systemPrompt?: string;
    welcomeMessage?: string;
  };
}

export async function initiateOutboundCall(
  options: OutboundCallOptions
): Promise<{ callId: string }> {
  const { to, metadata, voiceOverrides } = options;
  const phoneNumberId = getPhoneNumberId();
  const assistantId = getAssistantId();

  const body: Record<string, unknown> = {
    assistantId,
    phoneNumberId,
    customer: { number: to },
  };

  if (metadata) {
    body.metadata = metadata;
  }

  // If voice overrides are provided, use assistantOverrides
  if (voiceOverrides) {
    const assistantOverrides: Record<string, unknown> = {};

    if (voiceOverrides.voiceProvider || voiceOverrides.voiceId) {
      assistantOverrides.voice = {
        provider: voiceOverrides.voiceProvider ?? "elevenlabs",
        voiceId: voiceOverrides.voiceId ?? "",
      };
    }

    if (voiceOverrides.model || voiceOverrides.systemPrompt) {
      assistantOverrides.model = {
        provider: "openai",
        model: voiceOverrides.model ?? "gpt-4o",
        ...(voiceOverrides.systemPrompt ? { systemPrompt: voiceOverrides.systemPrompt } : {}),
      };
    }

    if (voiceOverrides.welcomeMessage) {
      assistantOverrides.firstMessage = voiceOverrides.welcomeMessage;
    }

    if (Object.keys(assistantOverrides).length > 0) {
      body.assistantOverrides = assistantOverrides;
    }
  }

  const result = (await vapiRequest("POST", "/call", body)) as { id: string };
  return { callId: result.id };
}

// ─── Assistant Management ────────────────────────────────────────────────────

export async function getAssistant(): Promise<Record<string, unknown>> {
  const assistantId = getAssistantId();
  return vapiRequest("GET", `/assistant/${assistantId}`) as Promise<Record<string, unknown>>;
}

/**
 * Update the Vapi assistant with new voice/model/prompt settings.
 * This pushes the DB config to Vapi so it takes effect on the next call.
 */
export async function updateAssistant(config: VoiceConfig, direction: "inbound" | "outbound" | "both"): Promise<void> {
  const assistantId = getAssistantId();
  const updateBody: Record<string, unknown> = {};

  const applyDirection = (dir: "inbound" | "outbound") => {
    const prefix = dir === "outbound" ? "outbound" : "inbound";

    // Voice settings
    const voiceProvider = config[`${prefix}_voice_provider` as keyof VoiceConfig] as string;
    const voiceId = config[`${prefix}_voice_id` as keyof VoiceConfig] as string;
    if (voiceProvider && voiceId) {
      updateBody.voice = {
        provider: voiceProvider,
        voiceId: voiceId,
        stability: config[`${prefix}_voice_stability` as keyof VoiceConfig] ?? 0.5,
        similarityBoost: config[`${prefix}_voice_similarity_boost` as keyof VoiceConfig] ?? 0.75,
      };
    }

    // Model settings
    const model = config[`${prefix}_model` as keyof VoiceConfig] as string;
    const systemPrompt = config[`${prefix}_system_prompt` as keyof VoiceConfig] as string;
    if (model) {
      updateBody.model = {
        provider: model.startsWith("anthropic") ? "anthropic" : "openai",
        model: model.split("/").pop(),
        ...(systemPrompt ? { systemPrompt } : {}),
      };
    }

    // Welcome / first message
    const welcomeMessage = config[`${prefix}_welcome_message` as keyof VoiceConfig] as string;
    if (welcomeMessage) {
      updateBody.firstMessage = welcomeMessage;
    }

    // Timeouts
    const silenceTimeout = config[`${prefix}_silence_timeout` as keyof VoiceConfig] as number;
    const responseDelay = config[`${prefix}_response_delay` as keyof VoiceConfig] as number;
    if (silenceTimeout) {
      updateBody.silenceTimeoutSeconds = silenceTimeout;
    }
    if (responseDelay !== undefined) {
      updateBody.responseDelaySeconds = responseDelay;
    }
  };

  if (direction === "outbound" || direction === "both") applyDirection("outbound");
  if (direction === "inbound" || direction === "both") applyDirection("inbound");

  if (Object.keys(updateBody).length > 0) {
    await vapiRequest("PATCH", `/assistant/${assistantId}`, updateBody);
  }
}

// ─── Inbound Call Webhook Handler ─────────────────────────────────────────────

export interface VapiWebhookEvent {
  message:
    | {
        type: "assistant-request";
        phoneNumberId: string;
        customer: { number: string; name?: string };
        timestamp: string;
      }
    | {
        type: "status-update";
        callId: string;
        status: string;
        endedReason?: string;
        timestamp: string;
      }
    | {
        type: "end-of-call-report";
        callId: string;
        durationSeconds: number;
        transcript: string;
        summary: string;
        timestamp: string;
      }
    | {
        type: "hang";
        callId: string;
        timestamp: string;
      }
    | {
        type: "speech-update";
        callId: string;
        role: "assistant" | "user";
        status: string;
        timestamp: string;
      }
    | {
        type: "transcript";
        callId: string;
        role: "assistant" | "user";
        transcript: string;
        timestamp: string;
      }
    | {
        type: "function-call";
        callId: string;
        functionCall: { name: string; parameters: unknown };
        timestamp: string;
      }
    | {
        type: "transfer-destination-request";
        callId: string;
        timestamp: string;
      }
    | {
        type: "model-output";
        callId: string;
        output: string;
        timestamp: string;
      };
}

/**
 * Handle an inbound call webhook from Vapi.
 * Returns the assistant config for Vapi to use.
 */
export function handleInboundWebhook(
  event: VapiWebhookEvent
): Record<string, unknown> | null {
  const { message } = event;

  switch (message.type) {
    case "assistant-request":
      return {
        assistantId: getAssistantId(),
      };

    case "status-update":
      console.log(`[Vapi] Call ${message.callId} status: ${message.status}`);
      return null;

    case "end-of-call-report":
      console.log(
        `[Vapi] Call ${message.callId} ended. Duration: ${message.durationSeconds}s`
      );
      console.log(`[Vapi] Summary: ${message.summary}`);
      return null;

    case "hang":
      console.log(`[Vapi] Call ${message.callId} hung up`);
      return null;

    case "transcript":
      console.log(`[Vapi] ${message.role}: ${message.transcript}`);
      return null;

    case "speech-update":
      return null;

    case "function-call":
      console.log(`[Vapi] Function call: ${message.functionCall.name}`);
      return {
        result: `The ${message.functionCall.name} function will be processed. Please continue the conversation.`,
      };

    case "transfer-destination-request":
      return null;

    case "model-output":
      return null;

    default:
      console.log(`[Vapi] Unhandled event type`);
      return null;
  }
}

// ─── Call Management ─────────────────────────────────────────────────────────

export async function getCall(callId: string): Promise<unknown> {
  return vapiRequest("GET", `/call/${callId}`);
}

export async function endCall(callId: string): Promise<void> {
  await vapiRequest("PATCH", `/call/${callId}`, { status: "ended" });
}

export async function listCalls(
  limit = 50
): Promise<{ calls: unknown[]; total: number }> {
  const result = (await vapiRequest(
    "GET",
    `/call?limit=${limit}`
  )) as unknown[];
  return { calls: result, total: result.length };
}
