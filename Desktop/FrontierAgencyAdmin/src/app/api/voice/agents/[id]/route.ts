import { getSession } from "@/lib/auth";
import { getDb, agentProfileQueries } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const db = getDb();
    const agent = await agentProfileQueries.findById(db, id);
    if (!agent) return Response.json({ error: "Agent not found" }, { status: 404 });
    return Response.json({ agent });
  } catch (err) {
    // Agent fetch error
    return Response.json({ error: "Failed to fetch agent" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;

  try {
    const db = getDb();
    const existing = await agentProfileQueries.findById(db, id);
    if (!existing) return Response.json({ error: "Agent not found" }, { status: 404 });

    await agentProfileQueries.update(db, id, {
      name: (body.name as string) ?? existing.name,
      description: (body.description as string) ?? existing.description,
      system_prompt: (body.system_prompt as string) ?? existing.system_prompt,
      first_message: (body.first_message as string) ?? existing.first_message,
      wait_for_human_first: body.wait_for_human_first ? 1 : 0,
      voice_provider: (body.voice_provider as string) ?? existing.voice_provider,
      voice_id: (body.voice_id as string) ?? existing.voice_id,
      voice_stability: (body.voice_stability as number) ?? existing.voice_stability,
      voice_similarity_boost: (body.voice_similarity_boost as number) ?? existing.voice_similarity_boost,
      model_provider: (body.model_provider as string) ?? existing.model_provider,
      model_name: (body.model_name as string) ?? existing.model_name,
      model_temperature: (body.model_temperature as number) ?? existing.model_temperature,
      model_max_tokens: (body.model_max_tokens as number) ?? existing.model_max_tokens,
      silence_timeout_seconds: (body.silence_timeout_seconds as number) ?? existing.silence_timeout_seconds,
      response_delay_seconds: (body.response_delay_seconds as number) ?? existing.response_delay_seconds,
      max_duration_seconds: (body.max_duration_seconds as number) ?? existing.max_duration_seconds,
      tools_enabled: (body.tools_enabled as string) ?? existing.tools_enabled,
      is_active: (body.is_active as boolean) ?? existing.is_active,
    });

    return Response.json({ success: true, id });
  } catch (err) {
    // Agent update error
    return Response.json({ error: "Failed to update agent" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const db = getDb();
    await agentProfileQueries.delete(db, id);
    return Response.json({ success: true });
  } catch (err) {
    // Agent delete error
    return Response.json({ error: "Failed to delete agent" }, { status: 500 });
  }
}
