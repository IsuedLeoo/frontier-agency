import { requireStaff, requireAdmin } from "@/lib/auth";
import { getDb, crmClientsQueries, invoiceQueries, appointmentsQueries, clientNotesQueries, userQueries } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClientDetailTabs from "./ClientDetailTabs";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireStaff();
  const db = getDb();
  const { id } = await params;

  const client = await crmClientsQueries.getFullProfile(db, id);
  if (!client) notFound();

  // Fetch related data in parallel
  const [invoicesRes, appointmentsRes, notesRes] = await Promise.all([
    invoiceQueries.findByClient(db, client.id),
    appointmentsQueries.findByClient(db, client.id),
    clientNotesQueries.findByClient(db, client.id),
  ]);

  const invoiceList = invoicesRes.results ?? [];
  const appointmentList = appointmentsRes.results ?? [];
  const noteList = notesRes.results ?? [];

  const totalInvoiced = invoiceList.reduce((s, i) => s + (i.amount || 0), 0);
  const totalPaid = invoiceList.filter((i) => i.status === "paid").reduce((s, i) => s + (i.amount || 0), 0);
  const upcomingAppointments = appointmentList.filter((a) => a.status === "scheduled");

  // Get assigned staff name
  let assignedStaffName: string | null = null;
  if (client.assigned_to) {
    const staff = await userQueries.findById(db, client.assigned_to);
    assignedStaffName = staff?.name ?? null;
  }

  const stats = {
    totalInvoiced,
    totalPaid,
    invoiceCount: invoiceList.length,
    appointmentCount: appointmentList.length,
    upcomingCount: upcomingAppointments.length,
    noteCount: noteList.length,
  };

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/clients" className="text-[#888] hover:text-white text-xs uppercase tracking-[0.1em]">
            ← Back to Clients
          </Link>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {client.name}
              </h2>
              <StatusBadge status={client.status} />
              <StatusBadge status={client.priority} />
            </div>
            {client.company && (
              <p className="text-sm text-[#888] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                {client.company}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-[#555] flex-wrap">
              {client.email && <span>{client.email}</span>}
              {client.phone && <span>{client.phone}</span>}
              {assignedStaffName && <span>Assigned: {assignedStaffName}</span>}
            </div>
          </div>
          {user.role === "admin" && (
            <Link href={`/clients/${id}/edit`} className="btn-secondary text-xs">
              Edit Client
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="card">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Invoices</p>
            <p className="text-xl font-bold mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {stats.invoiceCount}
            </p>
          </div>
          <div className="card">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Total Invoiced</p>
            <p className="text-xl font-bold mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              ${totalInvoiced.toLocaleString()}
            </p>
          </div>
          <div className="card">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Total Paid</p>
            <p className="text-xl font-bold mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              ${totalPaid.toLocaleString()}
            </p>
          </div>
          <div className="card">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Monthly</p>
            <p className="text-xl font-bold mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {client.monthly_retainer ? `$${client.monthly_retainer.toLocaleString()}` : "—"}
            </p>
          </div>
          <div className="card">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Contract</p>
            <p className="text-xl font-bold mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {client.contract_value ? `$${client.contract_value.toLocaleString()}` : "—"}
            </p>
          </div>
          <div className="card">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Appointments</p>
            <p className="text-xl font-bold mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {stats.appointmentCount}
              {stats.upcomingCount > 0 && (
                <span className="text-xs text-[#C5A55A] ml-1">({stats.upcomingCount} upcoming)</span>
              )}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <ClientDetailTabs
          client={client}
          invoices={invoiceList}
          appointments={appointmentList}
          notes={noteList}
          user={user}
        />
      </div>
    </AdminShell>
  );
}
