import { requireStaff } from "@/lib/auth";
import { getDb, crmClientsQueries, invoiceQueries } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import CreateClientForm from "./CreateClientForm";

export const dynamic = "force-dynamic";

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await requireStaff();
  const db = getDb();
  const params = await searchParams;
  const search = String(params.search || "").toLowerCase();
  const statusFilter = String(params.status || "");
  const priorityFilter = String(params.priority || "");

  const clientsRes = await crmClientsQueries.listAll(db);
  let clients = (clientsRes.results ?? []) as any[];

  // Fetch invoice totals per client
  let clientsWithStats = await Promise.all(
    clients.map(async (c) => {
      const invoices = await invoiceQueries.findByClient(db, c.id);
      const results = (invoices.results ?? []) as any[];
      return {
        ...c,
        total_invoiced: results.reduce((sum, i) => sum + (i.amount || 0), 0),
        total_paid: results.filter((i) => i.status === "paid").reduce((sum, i) => sum + (i.amount || 0), 0),
        invoice_count: results.length,
      };
    })
  );

  if (search) {
    clientsWithStats = clientsWithStats.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        (c.email && c.email.toLowerCase().includes(search)) ||
        (c.company && c.company.toLowerCase().includes(search))
    );
  }

  if (statusFilter) {
    clientsWithStats = clientsWithStats.filter((c) => c.status === statusFilter);
  }

  if (priorityFilter) {
    clientsWithStats = clientsWithStats.filter((c) => c.priority === priorityFilter);
  }

  // Summary stats
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "customer").length;
  const totalRevenue = clientsWithStats.reduce((s, c) => s + c.total_paid, 0);
  const totalRetainers = clients.reduce((s, c) => s + (c.monthly_retainer || 0), 0);

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Clients
            </h2>
            <p className="text-sm text-[#888] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
              Manage your client relationships, contracts, and billing.
            </p>
          </div>
          {user.role === "admin" && <CreateClientForm />}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Total Clients</p>
            <p className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{totalClients}</p>
          </div>
          <div className="card">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Active Customers</p>
            <p className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{activeClients}</p>
          </div>
          <div className="card">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Monthly Retainers</p>
            <p className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>${totalRetainers.toLocaleString()}</p>
          </div>
          <div className="card">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Total Revenue</p>
            <p className="text-2xl font-bold mt-1 text-green-400" style={{ fontFamily: "var(--font-space-grotesk)" }}>${totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <form method="GET" className="flex gap-3 flex-wrap">
          <input
            type="text"
            name="search"
            placeholder="Search name, email, company…"
            defaultValue={search}
            className="max-w-xs"
          />
          <select name="status" defaultValue={statusFilter} className="w-auto">
            <option value="">All Statuses</option>
            <option value="lead">Lead</option>
            <option value="qualified">Qualified</option>
            <option value="customer">Customer</option>
            <option value="inactive">Inactive</option>
          </select>
          <select name="priority" defaultValue={priorityFilter} className="w-auto">
            <option value="">All Priorities</option>
            <option value="vip">VIP</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button type="submit" className="btn-secondary">Filter</button>
          {(search || statusFilter || priorityFilter) && (
            <Link href="/clients" className="btn-danger text-xs py-2 px-3">Clear</Link>
          )}
        </form>

        {/* Client table */}
        <div className="card overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Company</th>
                <th>Service</th>
                <th>Monthly</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Contract Ends</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {clientsWithStats.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-[#555] py-8">
                    No clients found. Add your first client to get started.
                  </td>
                </tr>
              ) : (
                clientsWithStats.map((client) => {
                  const contractEndDays = client.contract_end_date
                    ? Math.ceil((new Date(client.contract_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    : null;
                  return (
                    <tr key={client.id}>
                      <td>
                        <Link href={`/clients/${client.id}`} className="text-white hover:text-[#C5A55A] transition-colors">
                          {client.name}
                        </Link>
                        {client.email && (
                          <p className="text-xs text-[#555] mt-0.5">{client.email}</p>
                        )}
                      </td>
                      <td className="text-[#888]">{client.company || "—"}</td>
                      <td className="text-[#888] text-xs">{client.service_type || "—"}</td>
                      <td className="text-white text-sm">
                        {client.monthly_retainer ? `$${client.monthly_retainer.toLocaleString()}` : "—"}
                      </td>
                      <td><StatusBadge status={client.status} /></td>
                      <td><StatusBadge status={client.priority || "medium"} /></td>
                      <td>
                        <span className="text-[#888] text-sm">
                          {client.contract_end_date
                            ? new Date(client.contract_end_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                            : "—"
                          }
                        </span>
                        {contractEndDays !== null && contractEndDays <= 30 && contractEndDays > 0 && (
                          <p className="text-[0.6rem] text-orange-400 uppercase mt-0.5">expires in {contractEndDays}d</p>
                        )}
                        {contractEndDays !== null && contractEndDays <= 0 && (
                          <p className="text-[0.6rem] text-red-400 uppercase mt-0.5">expired</p>
                        )}
                      </td>
                      <td className="text-white text-sm">${client.total_paid.toLocaleString()}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
