"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SafeUser } from "@/lib/types";

interface CrmClient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  industry: string | null;
  website: string | null;
  status: string;
  source: string;
  notes: string | null;
  created_at: string;
  note_count: number;
  appointment_count: number;
}

interface CrmPageProps {
  user: SafeUser;
  clients: CrmClient[];
  total: number;
  leadCount: number;
  qualifiedCount: number;
  customerCount: number;
  search: string;
  status: string;
}

const statusColors: Record<string, string> = {
  lead: "bg-yellow-500/20 text-yellow-400",
  qualified: "bg-blue-500/20 text-blue-400",
  customer: "bg-green-500/20 text-green-400",
  inactive: "bg-[#333] text-[#555]",
};

export default function CrmPage({ user, clients, total, leadCount, qualifiedCount, customerCount, search: initialSearch, status: initialStatus }: CrmPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    startTransition(() => {
      router.push(`/crm${params.toString() ? `?${params}` : ""}`);
    });
  };

  const handleCreateClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    const body: Record<string, unknown> = {
      name: formData.get("name") || "",
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      company: (formData.get("company") as string) || null,
      industry: (formData.get("industry") as string) || null,
      notes: (formData.get("notes") as string) || null,
      source: "manual",
      status: "lead",
    };

    try {
      const res = await fetch("/api/crm/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "Failed to create client");
      }
      setShowForm(false);
      startTransition(() => router.refresh());
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create client");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            CRM
          </h2>
          <p className="text-sm text-[#888] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
            Leads and clients captured from voice calls and manual entry.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-gold text-sm"
        >
          {showForm ? "Cancel" : "+ New Lead"}
        </button>
      </div>

      {/* Create Client Form */}
      {showForm && (
        <div className="card border-[#C5A55A]/20">
          <h3
            className="text-sm font-semibold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Create New Lead
          </h3>
          {formError && (
            <div className="mb-4 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
              {formError}
            </div>
          )}
          <form onSubmit={handleCreateClient} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Name *</label>
                <input type="text" name="name" required placeholder="John Doe" className="w-full" />
              </div>
              <div>
                <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Email</label>
                <input type="email" name="email" placeholder="john@example.com" className="w-full" />
              </div>
              <div>
                <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Phone</label>
                <input type="tel" name="phone" placeholder="+1 (555) 123-4567" className="w-full" />
              </div>
              <div>
                <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Company</label>
                <input type="text" name="company" placeholder="Acme Inc." className="w-full" />
              </div>
              <div>
                <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Industry</label>
                <input type="text" name="industry" placeholder="Real Estate" className="w-full" />
              </div>
            </div>
            <div>
              <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Notes</label>
              <textarea name="notes" rows={2} placeholder="Initial contact notes…" className="w-full resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-gold text-sm" disabled={isPending}>
                {isPending ? "Creating…" : "Create Lead"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] mb-1">Total</p>
          <p className="text-2xl font-bold text-white">{total}</p>
        </div>
        <div className="card">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] mb-1">Leads</p>
          <p className="text-2xl font-bold text-yellow-400">{leadCount}</p>
        </div>
        <div className="card">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] mb-1">Qualified</p>
          <p className="text-2xl font-bold text-blue-400">{qualifiedCount}</p>
        </div>
        <div className="card">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] mb-1">Customers</p>
          <p className="text-2xl font-bold text-green-400">{customerCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Search</label>
          <input
            type="text"
            placeholder="Name, company, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div>
          <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-[#111] border border-[#222] text-white text-sm px-3 py-2">
            <option value="">All Statuses</option>
            <option value="lead">Lead</option>
            <option value="qualified">Qualified</option>
            <option value="customer">Customer</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button onClick={handleFilter} className="btn-secondary" disabled={isPending}>Filter</button>
      </div>

      {/* Client table */}
      <div className="card overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Source</th>
              <th>Notes</th>
              <th>Appts</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-[#555] py-8">
                  No leads yet. Create one above or the AI receptionist will add callers automatically.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <Link href={`/crm/${client.id}`} className="text-white hover:text-[#C5A55A] transition-colors">
                      {client.name}
                    </Link>
                  </td>
                  <td className="text-[#888]">{client.company ?? "—"}</td>
                  <td className="text-[#888] text-xs">
                    {client.email && <div>{client.email}</div>}
                    {client.phone && <div className="text-[#666]">{client.phone}</div>}
                    {!client.email && !client.phone && "—"}
                  </td>
                  <td>
                    <span className={`text-[0.6rem] uppercase tracking-wider px-2 py-0.5 ${statusColors[client.status] ?? "bg-[#333] text-[#888]"}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="text-[#666] text-xs">{client.source ?? "—"}</td>
                  <td className="text-[#666] text-xs">{client.note_count}</td>
                  <td className="text-[#666] text-xs">{client.appointment_count}</td>
                  <td className="text-[#555] text-xs">
                    {new Date(client.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
