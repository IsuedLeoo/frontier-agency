import { getSession } from "@/lib/auth";
import { getDb, clientNotesQueries, generateId } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("client_id");

  const db = getDb();

  let notes;
  if (clientId) {
    notes = await clientNotesQueries.findByClient(db, clientId);
  } else {
    notes = await clientNotesQueries.listAll(db, 100);
  }

  return Response.json({ notes: notes.results ?? [] });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Handle both JSON and form-encoded data
  const contentType = request.headers.get("content-type") ?? "";
  let body: Record<string, unknown>;

  if (contentType.includes("application/json")) {
    body = (await request.json()) as Record<string, unknown>;
  } else {
    const formData = await request.formData();
    body = {};
    formData.forEach((value, key) => { body[key] = value; });
  }

  const clientId = body.client_id as string;
  const content = body.content as string;
  const type = (body.type as string) ?? "note";

  if (!clientId || !content) {
    return Response.json({ error: "client_id and content are required" }, { status: 400 });
  }

  const db = getDb();
  const id = generateId();

  await clientNotesQueries.create(db, {
    id,
    client_id: clientId,
    type,
    content,
    created_by: user.id,
  });

  return Response.json({ success: true, id }, { status: 201 });
}
