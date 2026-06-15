import { requireStaff } from "@/lib/auth";
import { getDb, invoiceQueries } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireStaff();
  const db = getDb();
  const { id } = await params;

  const invoice = await invoiceQueries.findById(db, id);
  if (!invoice) notFound();

  // Clients can only see their own invoices
  if (user.role === "client" && invoice.client_id !== user.id) {
    notFound();
  }

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <Link href="/invoices" className="text-[#888] hover:text-white text-xs uppercase tracking-[0.1em]">
          ← Back to Invoices
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {invoice.invoice_number}
            </h2>
            <p className="text-sm text-[#888]" style={{ fontFamily: "var(--font-inter)" }}>
              {invoice.client_name ?? "Unknown Client"}
            </p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        {/* Invoice details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <p className="text-[0.7rem] uppercase tracking-[0.15em] text-[#555] mb-1">Amount</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              ${invoice.amount.toLocaleString()} {invoice.currency}
            </p>
          </div>
          <div className="card">
            <p className="text-[0.7rem] uppercase tracking-[0.15em] text-[#555] mb-1">Due Date</p>
            <p className="text-lg" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {invoice.due_date ?? "Not set"}
            </p>
          </div>
          <div className="card">
            <p className="text-[0.7rem] uppercase tracking-[0.15em] text-[#555] mb-1">Paid Date</p>
            <p className="text-lg" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {invoice.paid_date ?? "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card">
            <p className="text-[0.7rem] uppercase tracking-[0.15em] text-[#555] mb-2">Service Type</p>
            <p className="text-sm text-white">{invoice.service_type ?? "—"}</p>
          </div>
          <div className="card">
            <p className="text-[0.7rem] uppercase tracking-[0.15em] text-[#555] mb-2">Invoice ID</p>
            <p className="text-sm text-[#888] font-mono">{invoice.id}</p>
          </div>
        </div>

        {invoice.description && (
          <div className="card">
            <p className="text-[0.7rem] uppercase tracking-[0.15em] text-[#555] mb-2">Description</p>
            <p className="text-sm text-[#ccc] whitespace-pre-wrap">{invoice.description}</p>
          </div>
        )}

        {/* Actions */}
        {(user.role === "admin" || user.role === "staff") && invoice.status !== "paid" && invoice.status !== "cancelled" && (
          <div className="card">
            <p className="text-[0.7rem] uppercase tracking-[0.15em] text-[#555] mb-4">Actions</p>
            <form action="/api/invoices/update" method="POST" className="flex flex-wrap gap-3">
              <input type="hidden" name="invoice_id" value={invoice.id} />
              {invoice.status === "draft" && (
                <button type="submit" name="status" value="sent" className="btn-secondary">
                  Mark as Sent
                </button>
              )}
              <button type="submit" name="status" value="paid" className="btn-gold">
                Mark as Paid
              </button>
              <button type="submit" name="status" value="overdue" className="btn-secondary">
                Mark Overdue
              </button>
              <button type="submit" name="status" value="cancelled" className="btn-danger">
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
