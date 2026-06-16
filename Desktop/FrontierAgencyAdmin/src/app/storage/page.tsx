import { requireStaff } from "@/lib/auth";
import { getDb, documentQueries } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import Icon from "@/components/Icons";
import type { IconName } from "@/components/Icons";
import Link from "next/link";

const categoryLabels: Record<string, { label: string; icon: IconName }> = {
  handbook: { label: "Worker Handbook", icon: "handbook" },
  intelligence: { label: "Miami Intelligence", icon: "intelligence" },
  contracts: { label: "Client Contracts", icon: "contracts" },
  reports: { label: "Financial Reports", icon: "reports" },
  other: { label: "Other Documents", icon: "other" },
};

export const dynamic = "force-dynamic";

export default async function StoragePage() {
  const user = await requireStaff();
  const db = getDb();

  const docsRes = await documentQueries.listAll(db);
  const documents = docsRes.results ?? [];

  const grouped: Record<string, any[]> = {};
  for (const doc of documents) {
    if (!grouped[doc.category]) grouped[doc.category] = [];
    grouped[doc.category].push(doc);
  }

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Document Vault
          </h2>
          <p className="text-sm text-[#888] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
            Internal documents, handbooks, and intelligence reports.
          </p>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-[#555]">No documents in the vault yet.</p>
          </div>
        ) : (
          Object.entries(categoryLabels).map(([category, { label, icon }]) => {
            const docs = grouped[category];
            if (!docs || docs.length === 0) return null;
            return (
              <div key={category}>
                <h3
                  className="text-sm font-semibold uppercase tracking-[0.15em] text-[#555] mb-3 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <Icon name={icon} size={16} /> {label}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {docs.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/storage/${doc.id}`}
                      className="card hover:border-[#333] transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <h4
                          className="text-sm font-medium text-white group-hover:text-[#C5A55A] transition-colors"
                          style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                          {doc.title}
                        </h4>
                        <span className="text-[0.6rem] text-[#555] uppercase tracking-wider ml-2 shrink-0">
                          v{doc.version}
                        </span>
                      </div>
                      <p className="text-xs text-[#555] mt-2">
                        {doc.content_type} · {doc.file_size ? `${Math.round(doc.file_size / 1024)}KB` : "—"}
                      </p>
                      <p className="text-[0.65rem] text-[#444] mt-1">
                        Updated {new Date(doc.updated_at).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminShell>
  );
}
