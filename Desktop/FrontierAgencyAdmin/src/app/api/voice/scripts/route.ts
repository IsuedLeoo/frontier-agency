import { getSession } from "@/lib/auth";
import { getDb, callScriptQueries, generateId } from "@/lib/db";
import type { CallScript } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const scripts = await callScriptQueries.listAll(db);
    return Response.json({ scripts: scripts.results ?? [] });
  } catch (err) {
    // Scripts list error
    return Response.json({ error: "Failed to fetch scripts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<CallScript>;
  if (!body.name || !body.system_prompt) {
    return Response.json({ error: "Name and system_prompt required" }, { status: 400 });
  }

  try {
    const db = getDb();
    const id = body.id ?? generateId();

    await callScriptQueries.create(db, {
      id,
      name: body.name,
      description: body.description ?? "",
      category: body.category ?? "general",
      system_prompt: body.system_prompt,
      first_message: body.first_message ?? "Hey, quick question.",
      persona: body.persona ?? "customer",
      target_business: body.target_business ?? "general",
      voice_speed: body.voice_speed ?? 0.9,
      created_by: user.id,
    });

    return Response.json({ success: true, id });
  } catch (err) {
    // Script create error
    return Response.json({ error: "Failed to create script" }, { status: 500 });
  }
}
