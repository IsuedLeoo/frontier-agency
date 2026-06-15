import { requireStaff } from "@/lib/auth";
import { getDb, documentQueries } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import Link from "next/link";
import { notFound } from "next/navigation";

const categoryLabels: Record<string, string> = {
  handbook: "Worker Handbook",
  intelligence: "Miami Intelligence",
  contracts: "Client Contracts",
  reports: "Financial Reports",
  other: "Other Documents",
};

export const dynamic = "force-dynamic";

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireStaff();
  const db = getDb();
  const { id } = await params;

  const doc = await documentQueries.findById(db, id);
  if (!doc) notFound();

  return (
    <AdminShell user={user}>
      <div className="space-y-6 max-w-4xl">
        <Link href="/storage" className="text-[#888] hover:text-white text-xs uppercase tracking-[0.1em]">
          ← Back to Vault
        </Link>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-[#555] uppercase tracking-[0.15em]" style={{ fontFamily: "var(--font-inter)" }}>
              {categoryLabels[doc.category] ?? doc.category}
            </span>
            <span className="text-[#333]">·</span>
            <span className="text-xs text-[#555]">v{doc.version}</span>
          </div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {doc.title}
          </h2>
          <p className="text-xs text-[#555] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
            Last updated {new Date(doc.updated_at).toLocaleDateString()} · {doc.file_size ? `${Math.round(doc.file_size / 1024)}KB` : "—"}
          </p>
        </div>

        <div className="card">
          {doc.content ? (
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-[#ccc] font-mono leading-relaxed bg-transparent p-0 m-0">
                {doc.content}
              </pre>
            </div>
          ) : (
            <p className="text-[#555] text-sm">This document has no content yet.</p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
