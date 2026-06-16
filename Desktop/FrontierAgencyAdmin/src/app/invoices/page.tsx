import { requireStaff } from "@/lib/auth";
import { getDb, invoiceQueries, userQueries } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import CreateInvoiceForm from "./CreateInvoiceForm";

export const dynamic = "force-dynamic";

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await requireStaff();
  const db = getDb();
  const params = await searchParams;
  const statusFilter = String(params.status || "");

  const allInvoices = await invoiceQueries.listAll(db);
  let invoices = allInvoices.results ?? [];

  if (statusFilter) {
    invoices = invoices.filter((i) => i.status === statusFilter);
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
              Invoices
            </h2>
            <p className="text-sm text-[#888] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
              Manage billing and track payments.
            </p>
          </div>
          {user.role === "admin" && <CreateInvoiceForm />}
        </div>

        {/* Status filter */}
        <form method="GET" className="flex flex-wrap gap-2">
          {["", "draft", "sent", "paid", "overdue", "cancelled"].map((s) => (
            <button
              key={s}
              type="submit"
              name="status"
              value={s}
              className={`px-4 py-2 text-xs uppercase tracking-[0.1em] border transition-colors ${
                statusFilter === s
                  ? "border-[#C5A55A] text-[#C5A55A] bg-[#C5A55A]/10"
                  : "border-[#333] text-[#888] hover:border-[#555] hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {s || "All"}
            </button>
          ))}
        </form>

        {/* Invoice table */}
        <div className="card overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Client</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-[#555] py-8">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-mono text-[#C5A55A]">
                      <Link href={`/invoices/${inv.id}`} className="hover:underline">
                        {inv.invoice_number}
                      </Link>
                    </td>
                    <td className="text-white">{inv.client_name ?? "—"}</td>
                    <td className="text-[#888] max-w-[200px] truncate">{inv.description ?? "—"}</td>
                    <td className="text-white">${inv.amount.toLocaleString()}</td>
                    <td><StatusBadge status={inv.status} /></td>
                    <td className="text-[#888]">{inv.due_date ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
