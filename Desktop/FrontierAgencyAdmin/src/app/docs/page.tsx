import { requireAdmin } from "@/lib/auth";
import { getDb, serviceDocsQueries } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DocsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await requireAdmin();
  const db = getDb();
  const params = await searchParams;
  const search = String(params.search || "").toLowerCase();

  const docsRes = await serviceDocsQueries.listAll(db);
  let docs = docsRes.results ?? [];

  if (search) {
    docs = docs.filter(
      (d) =>
        d.title?.toLowerCase().includes(search) ||
        d.content?.toLowerCase().includes(search) ||
        d.category?.toLowerCase().includes(search)
    );
  }

  // Group by category
  const categories: Record<string, any[]> = {};
  for (const doc of docs) {
    const cat = doc.category || "Other";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(doc);
  }

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Service Docs
            </h2>
            <p className="text-sm text-[#888] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
              Documentation that Alex uses to answer questions about services and pricing.
            </p>
          </div>
        </div>

        {/* Search */}
        <form method="GET" className="flex gap-3">
          <input
            type="text"
            name="search"
            placeholder="Search docs…"
            defaultValue={search}
            className="max-w-xs"
          />
          <button type="submit" className="btn-secondary">Search</button>
        </form>

        {/* Docs by category */}
        {Object.keys(categories).length === 0 ? (
          <div className="card">
            <p className="text-sm text-[#555] text-center py-8">No documents found.</p>
          </div>
        ) : (
          Object.entries(categories).map(([category, catDocs]) => (
            <div key={category} className="card">
              <h3
                className="text-sm font-semibold tracking-tight mb-4"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {category}
              </h3>
              <div className="space-y-3">
                {catDocs.map((doc: any) => (
                  <div key={doc.id} className="border border-[#1a1a1a] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white mb-1">{doc.title}</h4>
                        <p className="text-xs text-[#666] line-clamp-2">
                          {doc.content.substring(0, 200)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[0.6rem] uppercase tracking-wider text-[#555] bg-[#111] px-2 py-0.5">
                            {doc.slug}
                          </span>
                          {doc.tags && (
                            <span className="text-[0.6rem] text-[#444]">
                              {typeof doc.tags === "string" ? doc.tags : JSON.stringify(doc.tags)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Slug Reference */}
        <div className="card">
          <h3
            className="text-sm font-semibold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Available Slugs for Alex
          </h3>
          <p className="text-xs text-[#666] mb-3">
            These are the document slugs Alex can look up via <code className="text-[#C5A55A]">get_doc</code>:
          </p>
          <div className="flex flex-wrap gap-2">
            {docs.map((doc: any) => (
              <span key={doc.id} className="text-xs bg-[#111] border border-[#222] px-2 py-1 text-[#888]">
                {doc.slug}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
