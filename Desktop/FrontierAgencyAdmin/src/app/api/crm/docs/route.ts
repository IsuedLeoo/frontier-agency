import { getSession } from "@/lib/auth";
import { getDb, serviceDocsQueries, generateId } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const db = getDb();

  if (slug) {
    const doc = await serviceDocsQueries.findBySlug(db, slug);
    return Response.json({ doc });
  }

  if (search) {
    const docs = await serviceDocsQueries.search(db, search);
    return Response.json({ docs: docs.results ?? [] });
  }

  if (category) {
    const docs = await serviceDocsQueries.findByCategory(db, category);
    return Response.json({ docs: docs.results ?? [] });
  }

  const docs = await serviceDocsQueries.listAll(db);
  return Response.json({ docs: docs.results ?? [] });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    title?: string;
    slug?: string;
    category?: string;
    content?: string;
    tags?: string;
  };

  if (!body.title || !body.slug || !body.category || !body.content) {
    return Response.json({ error: "title, slug, category, and content are required" }, { status: 400 });
  }

  const db = getDb();
  const id = generateId();

  await serviceDocsQueries.create(db, {
    id,
    title: body.title,
    slug: body.slug,
    category: body.category,
    content: body.content,
    tags: body.tags ?? "[]",
  });

  return Response.json({ success: true, id }, { status: 201 });
}
