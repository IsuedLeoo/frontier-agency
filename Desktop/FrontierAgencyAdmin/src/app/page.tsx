import { requireStaff } from "@/lib/auth";
import { getDb, userQueries, invoiceQueries, projectQueries } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireStaff();
  const db = getDb();

  // Fetch stats
  const [clients, staff, revenue, outstanding, activeProjects, recentInvoices] = await Promise.all([
    userQueries.countByRole(db, "client"),
    userQueries.countByRole(db, "staff"),
    invoiceQueries.stats(db).thisMonth,
    invoiceQueries.stats(db).outstanding,
    projectQueries.countActive(db),
    invoiceQueries.listAll(db),
  ]);

  return (
    <AdminShell user={user}>
      <div className="space-y-8">
        <div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Welcome back, {user.name}
          </h2>
          <p className="text-sm text-[#888] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
            Here&apos;s what&apos;s happening with Frontier Agency today.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Clients"
            value={clients?.count ?? 0}
            icon="clients"
          />
          <StatsCard
            title="Active Projects"
            value={activeProjects?.count ?? 0}
            icon="reports"
          />
          <StatsCard
            title="Monthly Revenue"
            value={`$${Number(revenue?.total ?? 0).toLocaleString()}`}
            icon="invoices"
          />
          <StatsCard
            title="Outstanding"
            value={`$${Number(outstanding?.total ?? 0).toLocaleString()}`}
            subtitle={`${outstanding?.count ?? 0} invoices`}
            icon="outstanding"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent invoices */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Recent Invoices
              </h3>
              <Link
                href="/invoices"
                className="text-xs text-[#888] hover:text-white uppercase tracking-[0.1em]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                View all →
              </Link>
            </div>
            {!recentInvoices.results || recentInvoices.results.length === 0 ? (
              <p className="text-sm text-[#555]">No invoices yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentInvoices.results as Array<{ id: string; invoice_number: string; client_name: string | null; amount: number; status: string }>).slice(0, 5).map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="font-mono text-[#C5A55A]">{invoice.invoice_number}</td>
                      <td>{invoice.client_name ?? "—"}</td>
                      <td className="text-white">${invoice.amount.toLocaleString()}</td>
                      <td><StatusBadge status={invoice.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Quick actions */}
          <div className="card">
            <h3
              className="text-lg font-semibold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link href="/clients" className="block p-4 border border-[#1a1a1a] hover:border-[#333] transition-colors">
                <p className="text-sm font-medium">Manage Clients</p>
                <p className="text-xs text-[#555] mt-1">Add, edit, or view client details and projects.</p>
              </Link>
              <Link href="/invoices" className="block p-4 border border-[#1a1a1a] hover:border-[#333] transition-colors">
                <p className="text-sm font-medium">Create Invoice</p>
                <p className="text-xs text-[#555] mt-1">Generate and send invoices to clients.</p>
              </Link>
              <Link href="/storage" className="block p-4 border border-[#1a1a1a] hover:border-[#333] transition-colors">
                <p className="text-sm font-medium">Document Vault</p>
                <p className="text-xs text-[#555] mt-1">Access the Worker Handbook, Miami intel, and more.</p>
              </Link>
              {user.role === "admin" && (
                <Link href="/staff" className="block p-4 border border-[#1a1a1a] hover:border-[#333] transition-colors">
                  <p className="text-sm font-medium">Manage Staff</p>
                  <p className="text-xs text-[#555] mt-1">Add, deactivate, or change staff permissions.</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
