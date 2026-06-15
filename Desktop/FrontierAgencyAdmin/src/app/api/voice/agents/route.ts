import { getSession } from "@/lib/auth";
import { getDb, agentProfileQueries, generateId } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getDb();
    const agents = await agentProfileQueries.listAll(db);
    return Response.json({ agents: agents.results ?? [] });
  } catch (err) {
    console.error("[Agents] List error:", err);
    return Response.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Record<string, unknown>;
  if (!body.name || !body.system_prompt) {
    return Response.json({ error: "Name and system_prompt required" }, { status: 400 });
  }

  try {
    const db = getDb();
    const id = (body.id as string) ?? `agent_${generateId().slice(0, 8)}`;

    await agentProfileQueries.create(db, {
      id,
      name: body.name as string,
      description: (body.description as string) ?? "",
      system_prompt: body.system_prompt as string,
      first_message: (body.first_message as string) ?? "",
      wait_for_human_first: body.wait_for_human_first ? 1 : 0,
      voice_provider: (body.voice_provider as string) ?? "vapi",
      voice_id: (body.voice_id as string) ?? "Elliot",
      voice_stability: (body.voice_stability as number) ?? 0.5,
      voice_similarity_boost: (body.voice_similarity_boost as number) ?? 0.75,
      model_provider: (body.model_provider as string) ?? "openai",
      model_name: (body.model_name as string) ?? "gpt-4o",
      model_temperature: (body.model_temperature as number) ?? 0.3,
      model_max_tokens: (body.model_max_tokens as number) ?? 512,
      silence_timeout_seconds: (body.silence_timeout_seconds as number) ?? 45,
      response_delay_seconds: (body.response_delay_seconds as number) ?? 3,
      max_duration_seconds: (body.max_duration_seconds as number) ?? 300,
      tools_enabled: (body.tools_enabled as string) ?? "",
      created_by: user.id,
    });

    return Response.json({ success: true, id });
  } catch (err) {
    console.error("[Agents] Create error:", err);
    return Response.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
