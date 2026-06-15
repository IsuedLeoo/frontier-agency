"use client";

import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import type { CrmClient, SafeUser, Invoice, Appointment, ClientNote } from "@/lib/types";

interface ClientDetailTabsProps {
  client: CrmClient;
  invoices: Invoice[];
  appointments: Appointment[];
  notes: ClientNote[];
  user: SafeUser;
}

type TabKey = "overview" | "business" | "billing" | "schedule" | "notes" | "activity";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "business", label: "Business" },
  { key: "billing", label: "Billing" },
  { key: "schedule", label: "Schedule" },
  { key: "notes", label: "Notes" },
  { key: "activity", label: "Activity" },
];

function formatDate(d: string | null): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return d;
  }
}

function formatDateTime(d: string | null): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  } catch {
    return d;
  }
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ClientDetailTabs({ client, invoices, appointments, notes }: ClientDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const contractEndDays = daysUntil(client.contract_end_date);
  const supportEndDays = daysUntil(client.support_guarantee_end);
  const nextDueDays = daysUntil(client.next_due_date);

  const totalInvoiced = invoices.reduce((s, i) => s + (i.amount || 0), 0);
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + (i.amount || 0), 0);

  const timeline: Array<{ type: string; date: string; content: React.ReactNode }> = [
    ...notes.map((n) => ({
      type: n.type,
      date: n.created_at,
      content: (<div><span className="text-[#C5A55A] uppercase text-[0.65rem] tracking-[0.1em]">{n.type}</span><p className="text-sm text-[#ccc] mt-0.5">{n.content}</p></div>),
    })),
    ...appointments.map((a) => ({
      type: "appointment",
      date: a.created_at,
      content: (<div><span className="text-[#C5A55A] uppercase text-[0.65rem] tracking-[0.1em]">appointment</span><p className="text-sm text-[#ccc] mt-0.5">{a.title} — {formatDateTime(a.scheduled_at)}</p><div className="mt-1"><StatusBadge status={a.status} /></div></div>),
    })),
    ...invoices.map((inv) => ({
      type: "invoice",
      date: inv.created_at,
      content: (<div><span className="text-[#C5A55A] uppercase text-[0.65rem] tracking-[0.1em]">invoice</span><p className="text-sm text-[#ccc] mt-0.5">{inv.invoice_number} — ${inv.amount.toLocaleString()}</p><div className="mt-1"><StatusBadge status={inv.status} /></div></div>),
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <div className="border-b border-[#1a1a1a] mb-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-5 py-3 text-sm transition-colors whitespace-nowrap border-b-2 ${activeTab === tab.key ? "border-[#C5A55A] text-white" : "border-transparent text-[#555] hover:text-[#888]"}`} style={{ fontFamily: "var(--font-inter)" }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h4 className="text-xs uppercase tracking-[0.15em] text-[#555] mb-4">Contact</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[#555]">Email</span><span className="text-white">{client.email || "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#555]">Phone</span><span className="text-white">{client.phone || "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#555]">Website</span><span className="text-white">{client.website || "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#555]">Timezone</span><span className="text-white">{client.timezone || "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#555]">Source</span><span className="text-white">{client.source}</span></div>
              </div>
            </div>
            <div className="card">
              <h4 className="text-xs uppercase tracking-[0.15em] text-[#555] mb-4">Key Dates</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center"><span className="text-[#555]">Contract Start</span><span className="text-white">{formatDate(client.contract_start_date)}</span></div>
                <div className="flex justify-between items-center"><span className="text-[#555]">Contract End</span><div className="flex items-center gap-2"><span className="text-white">{formatDate(client.contract_end_date)}</span>{contractEndDays !== null && contractEndDays <= 30 && contractEndDays > 0 && (<span className="text-[0.6rem] text-orange-400 uppercase">expires in {contractEndDays}d</span>)}{contractEndDays !== null && contractEndDays <= 0 && (<span className="text-[0.6rem] text-red-400 uppercase">expired</span>)}</div></div>
                <div className="flex justify-between items-center"><span className="text-[#555]">Support Guarantee</span><div className="flex items-center gap-2"><span className="text-white">{formatDate(client.support_guarantee_end)}</span>{supportEndDays !== null && supportEndDays <= 30 && supportEndDays > 0 && (<span className="text-[0.6rem] text-orange-400 uppercase">expires in {supportEndDays}d</span>)}{supportEndDays !== null && supportEndDays <= 0 && (<span className="text-[0.6rem] text-red-400 uppercase">expired</span>)}</div></div>
                <div className="flex justify-between items-center"><span className="text-[#555]">Next Due</span><div className="flex items-center gap-2"><span className="text-white">{formatDate(client.next_due_date)}</span>{nextDueDays !== null && nextDueDays <= 7 && nextDueDays > 0 && (<span className="text-[0.6rem] text-yellow-400 uppercase">due in {nextDueDays}d</span>)}{nextDueDays !== null && nextDueDays <= 0 && (<span className="text-[0.6rem] text-red-400 uppercase">overdue</span>)}</div></div>
                <div className="flex justify-between"><span className="text-[#555]">Last Contact</span><span className="text-white">{formatDate(client.last_contact_at)}</span></div>
                <div className="flex justify-between"><span className="text-[#555]">Created</span><span className="text-white">{formatDate(client.created_at)}</span></div>
              </div>
            </div>
          </div>
          <div className="card">
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#555] mb-4">Service Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><p className="text-[#555] text-xs mb-1">Service Type</p><p className="text-white text-sm">{client.service_type || "—"}</p></div>
              <div><p className="text-[#555] text-xs mb-1">Monthly Retainer</p><p className="text-white text-sm">{client.monthly_retainer ? `$${client.monthly_retainer.toLocaleString()}/mo` : "—"}</p></div>
              <div><p className="text-[#555] text-xs mb-1">Contract Value</p><p className="text-white text-sm">{client.contract_value ? `$${client.contract_value.toLocaleString()}` : "—"}</p></div>
            </div>
            {client.business_description && (<div className="mt-4 pt-4 border-t border-[#1a1a1a]"><p className="text-[#555] text-xs mb-1">Business Description</p><p className="text-[#ccc] text-sm leading-relaxed">{client.business_description}</p></div>)}
          </div>
          {client.notes && (<div className="card"><h4 className="text-xs uppercase tracking-[0.15em] text-[#555] mb-2">Internal Notes</h4><p className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">{client.notes}</p></div>)}
        </div>
      )}

      {activeTab === "business" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h4 className="text-xs uppercase tracking-[0.15em] text-[#555] mb-4">Company</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[#555]">Company</span><span className="text-white">{client.company || "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#555]">Industry</span><span className="text-white">{client.industry || "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#555]">Website</span>{client.website ? (<a href={client.website.startsWith("http") ? client.website : `https://${client.website}`} target="_blank" rel="noopener noreferrer" className="text-[#C5A55A] hover:underline">{client.website}</a>) : (<span className="text-white">—</span>)}</div>
                <div className="flex justify-between"><span className="text-[#555]">Timezone</span><span className="text-white">{client.timezone || "—"}</span></div>
              </div>
            </div>
            <div className="card"><h4 className="text-xs uppercase tracking-[0.15em] text-[#555] mb-4">Location</h4><div className="text-sm"><p className="text-[#555] mb-1">Address</p><p className="text-white whitespace-pre-wrap">{client.address || "—"}</p></div></div>
          </div>
          <div className="card"><h4 className="text-xs uppercase tracking-[0.15em] text-[#555] mb-4">Business Details</h4><div className="space-y-4"><div><p className="text-[#555] text-xs mb-1">What They Do</p><p className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">{client.business_description || "No description yet."}</p></div><div className="pt-4 border-t border-[#1a1a1a]"><p className="text-[#555] text-xs mb-1">Service They Want</p><p className="text-[#ccc] text-sm">{client.service_type || "Not specified."}</p></div></div></div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card"><p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Monthly Retainer</p><p className="text-xl font-bold mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{client.monthly_retainer ? `$${client.monthly_retainer.toLocaleString()}` : "—"}</p></div>
            <div className="card"><p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Contract Value</p><p className="text-xl font-bold mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{client.contract_value ? `$${client.contract_value.toLocaleString()}` : "—"}</p></div>
            <div className="card"><p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Total Invoiced</p><p className="text-xl font-bold mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>${totalInvoiced.toLocaleString()}</p></div>
            <div className="card"><p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Total Paid</p><p className="text-xl font-bold mt-1 text-green-400" style={{ fontFamily: "var(--font-space-grotesk)" }}>${totalPaid.toLocaleString()}</p></div>
          </div>
          <div className="card"><h4 className="text-xs uppercase tracking-[0.15em] text-[#555] mb-4">Contract Period</h4><div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm"><div><p className="text-[#555] text-xs mb-1">Start Date</p><p className="text-white">{formatDate(client.contract_start_date)}</p></div><div><p className="text-[#555] text-xs mb-1">End Date</p><p className="text-white">{formatDate(client.contract_end_date)}</p></div><div><p className="text-[#555] text-xs mb-1">Billing Email</p><p className="text-white">{client.billing_email || client.email || "—"}</p></div></div></div>
          <div className="card"><h4 className="text-xs uppercase tracking-[0.15em] text-[#555] mb-4">Invoices</h4>{invoices.length === 0 ? (<p className="text-sm text-[#555]">No invoices for this client yet.</p>) : (<table><thead><tr><th>Invoice</th><th>Amount</th><th>Status</th><th>Due Date</th><th>Paid</th></tr></thead><tbody>{invoices.map((inv) => (<tr key={inv.id}><td className="font-mono text-[#C5A55A]">{inv.invoice_number}</td><td className="text-white">${inv.amount.toLocaleString()}</td><td><StatusBadge status={inv.status} /></td><td className="text-[#888]">{inv.due_date ?? "—"}</td><td className="text-[#888]">{inv.paid_date ?? "—"}</td></tr>))}</tbody></table>)}</div>
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="space-y-6">
          {client.next_due_date && (<div className="card border-l-2 border-l-[#C5A55A]"><p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">Next Due Date</p><p className="text-lg font-semibold mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{formatDate(client.next_due_date)}{nextDueDays !== null && nextDueDays > 0 && (<span className="text-xs text-[#888] ml-2">({nextDueDays} days)</span>)}</p></div>)}
          <div className="card"><h4 className="text-xs uppercase tracking-[0.15em] text-[#555] mb-4">Appointments ({appointments.length})</h4>{appointments.length === 0 ? (<p className="text-sm text-[#555]">No appointments scheduled.</p>) : (<table><thead><tr><th>Title</th><th>Date & Time</th><th>Duration</th><th>Status</th><th>Source</th></tr></thead><tbody>{appointments.map((apt) => (<tr key={apt.id}><td className="text-white">{apt.title}</td><td className="text-[#888]">{formatDateTime(apt.scheduled_at)}</td><td className="text-[#888]">{apt.duration_minutes} min</td><td><StatusBadge status={apt.status} /></td><td className="text-[#555] text-xs">{apt.source}</td></tr>))}</tbody></table>)}</div>
        </div>
      )}

      {activeTab === "notes" && (
        <div className="card"><h4 className="text-xs uppercase tracking-[0.15em] text-[#555] mb-4">Notes & Interactions ({notes.length})</h4>{notes.length === 0 ? (<p className="text-sm text-[#555]">No notes yet.</p>) : (<div className="space-y-4">{notes.map((note) => (<div key={note.id} className="border-b border-[#111] pb-4 last:border-0 last:pb-0"><div className="flex items-center gap-3 mb-1"><span className="text-[#C5A55A] uppercase text-[0.65rem] tracking-[0.1em]">{note.type}</span><span className="text-[#333] text-xs">{formatDateTime(note.created_at)}</span></div><p className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p></div>))}</div>)}</div>
      )}

      {activeTab === "activity" && (
        <div className="card"><h4 className="text-xs uppercase tracking-[0.15em] text-[#555] mb-4">Activity Timeline ({timeline.length})</h4>{timeline.length === 0 ? (<p className="text-sm text-[#555]">No activity yet.</p>) : (<div className="space-y-0">{timeline.map((item, idx) => (<div key={idx} className="flex gap-4 pb-4 last:pb-0"><div className="flex flex-col items-center"><div className="w-2 h-2 rounded-full bg-[#C5A55A] mt-1.5 shrink-0" />{idx < timeline.length - 1 && <div className="w-px flex-1 bg-[#1a1a1a] mt-1" />}</div><div className="pb-4 flex-1 min-w-0"><p className="text-[#333] text-[0.65rem] mb-1">{formatDateTime(item.date)}</p>{item.content}</div></div>))}</div>)}</div>
      )}
    </div>
  );
}
