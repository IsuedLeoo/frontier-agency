import { getSession } from "@/lib/auth";
import { getDb, voiceConfigQueries } from "@/lib/db";
import { updateAssistant } from "@/lib/voice/vapi";
import type { VoiceConfig } from "@/lib/types";

export const dynamic = "force-dynamic";

// Fields that are allowed to be updated from the UI
const ALLOWED_FIELDS = new Set([
  "outbound_system_prompt",
  "outbound_welcome_message",
  "outbound_voice_provider",
  "outbound_voice_id",
  "outbound_voice_stability",
  "outbound_voice_similarity_boost",
  "outbound_model",
  "outbound_silence_timeout",
  "outbound_response_delay",
  "inbound_system_prompt",
  "inbound_welcome_message",
  "inbound_voice_provider",
  "inbound_voice_id",
  "inbound_voice_stability",
  "inbound_voice_similarity_boost",
  "inbound_model",
  "inbound_silence_timeout",
  "inbound_response_delay",
  "phone_number",
  "phone_number_id",
]);

export async function GET() {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const config = await voiceConfigQueries.get(db);
    return Response.json({ config });
  } catch (err) {
    console.error("[Voice Config] GET error:", err);
    return Response.json({ error: "Failed to fetch config" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;

    // Filter to only allowed fields
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (ALLOWED_FIELDS.has(key)) {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const db = getDb();
    await voiceConfigQueries.update(db, updates, user.id);

    // Determine which direction(s) changed
    const outboundFields = Object.keys(updates).filter(k => k.startsWith("outbound_"));
    const inboundFields = Object.keys(updates).filter(k => k.startsWith("inbound_"));

    let direction: "inbound" | "outbound" | "both" = "both";
    if (outboundFields.length > 0 && inboundFields.length === 0) direction = "outbound";
    if (inboundFields.length > 0 && outboundFields.length === 0) direction = "inbound";

    // Push updated config to Vapi
    const updatedConfig = await voiceConfigQueries.get(db) as VoiceConfig;
    try {
      await updateAssistant(updatedConfig, direction);
    } catch (vapiErr) {
      console.error("[Voice Config] Vapi update error:", vapiErr);
      // Still return success — DB was updated, Vapi sync can be retried
      return Response.json({
        success: true,
        warning: "Config saved to database but Vapi sync failed. Changes will apply on next manual sync.",
        config: updatedConfig,
      });
    }

    return Response.json({ success: true, config: updatedConfig });
  } catch (err) {
    console.error("[Voice Config] PUT error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to update config" },
      { status: 500 }
    );
  }
}
