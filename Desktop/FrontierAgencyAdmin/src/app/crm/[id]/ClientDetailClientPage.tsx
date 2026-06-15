"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SafeUser, CrmClient } from "@/lib/types";

interface Appointment {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  notes: string | null;
}

interface ClientNote {
  id: string;
  type: string;
  content: string;
  created_by: string | null;
  created_at: string;
}

interface Props {
  user: SafeUser;
  client: CrmClient;
  notes: ClientNote[];
  appointments: Appointment[];
}

const statusColors: Record<string, string> = {
  lead: "bg-yellow-500/20 text-yellow-400",
  qualified: "bg-blue-500/20 text-blue-400",
  customer: "bg-green-500/20 text-green-400",
  inactive: "bg-[#333] text-[#555]",
};

const apptStatusColors: Record<string, string> = {
  scheduled: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  canceled: "bg-[#333] text-[#555]",
  no_show: "bg-red-500/20 text-red-400",
};

export default function ClientDetailClientPage({ user, client: initialClient, notes, appointments: initialAppointments }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showApptForm, setShowApptForm] = useState(false);
  const [apptError, setApptError] = useState<string | null>(null);
  const [client, setClient] = useState(initialClient);

  const handleCreateAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApptError(null);
    const formData = new FormData(e.currentTarget);

    const scheduledAt = formData.get("scheduled_at") as string;
    if (!scheduledAt) {
      setApptError("Date and time are required");
      return;
    }

    const body = {
      client_id: client.id,
      title: (formData.get("title") as string) || "Consultation",
      description: (formData.get("description") as string) || null,
      scheduled_at: new Date(scheduledAt).toISOString(),
      duration_minutes: parseInt(formData.get("duration_minutes") as string) || 30,
      notes: (formData.get("notes") as string) || null,
    };

    try {
      const res = await fetch("/api/crm/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "Failed to schedule appointment");
      }
      setShowApptForm(false);
      startTransition(() => router.refresh());
    } catch (err) {
      setApptError(err instanceof Error ? err.message : "Failed to schedule appointment");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch("/api/crm/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: client.id, status: newStatus }),
      });
      if (res.ok) {
        setClient((prev) => ({ ...prev, status: newStatus as CrmClient["status"] }));
        startTransition(() => router.refresh());
      }
    } catch {
      // silently fail
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/crm" className="text-[#555] hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {client.name}
            </h2>
            <span className={`text-[0.6rem] uppercase tracking-wider px-2 py-0.5 ${statusColors[client.status] ?? "bg-[#333] text-[#888]"}`}>
              {client.status}
            </span>
          </div>
          {client.company && <p className="text-sm text-[#888] mt-1">{client.company}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Info Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <h3 className="text-sm font-semibold tracking-tight mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Contact Info
            </h3>
            <div className="space-y-3 text-sm">
              {client.email && (
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] mb-0.5">Email</p>
                  <p className="text-white">{client.email}</p>
                </div>
              )}
              {client.phone && (
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] mb-0.5">Phone</p>
                  <p className="text-white">{client.phone}</p>
                </div>
              )}
              {client.industry && (
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] mb-0.5">Industry</p>
                  <p className="text-white">{client.industry}</p>
                </div>
              )}
              {client.website && (
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] mb-0.5">Website</p>
                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-[#C5A55A] hover:underline">
                    {client.website}
                  </a>
                </div>
              )}
              {client.source && (
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] mb-0.5">Source</p>
                  <p className="text-[#888]">{client.source}</p>
                </div>
              )}
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] mb-0.5">Added</p>
                <p className="text-[#888]">{new Date(client.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="card">
            <h3 className="text-sm font-semibold tracking-tight mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Update Status
            </h3>
            <select
              value={client.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full bg-[#111] border border-[#222] text-white text-sm px-3 py-2"
            >
              <option value="lead">Lead</option>
              <option value="qualified">Qualified</option>
              <option value="customer">Customer</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Notes & Appointments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Note */}
          <div className="card">
            <h3 className="text-sm font-semibold tracking-tight mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Add Note
            </h3>
            <form action="/api/crm/notes" method="POST" className="space-y-3">
              <input type="hidden" name="client_id" value={client.id} />
              <textarea
                name="content"
                rows={3}
                placeholder="Add notes about this client — their business, needs, pain points…"
                className="w-full bg-[#111] border border-[#222] text-white text-sm px-3 py-2 resize-none"
                required
              />
              <div className="flex gap-3">
                <select name="type" defaultValue="note" className="bg-[#111] border border-[#222] text-white text-sm px-3 py-2">
                  <option value="note">Note</option>
                  <option value="call">Call</option>
                  <option value="voice_call">Voice Call</option>
                </select>
                <button type="submit" className="btn-secondary text-sm">Add Note</button>
              </div>
            </form>
          </div>

          {/* Schedule Appointment */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Schedule Appointment
              </h3>
              <button
                onClick={() => setShowApptForm(!showApptForm)}
                className="btn-gold text-xs"
              >
                {showApptForm ? "Cancel" : "+ New Appointment"}
              </button>
            </div>

            {showApptForm && (
              <div className="mb-6 p-4 border border-[#C5A55A]/20 rounded-none bg-[#C5A55A]/5">
                {apptError && (
                  <div className="mb-4 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                    {apptError}
                  </div>
                )}
                <form onSubmit={handleCreateAppointment} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Title *</label>
                      <input type="text" name="title" required defaultValue="Consultation" className="w-full" />
                    </div>
                    <div>
                      <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Date & Time *</label>
                      <input type="datetime-local" name="scheduled_at" required className="w-full" />
                    </div>
                    <div>
                      <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Duration (min)</label>
                      <input type="number" name="duration_minutes" defaultValue={30} min={5} max={240} className="w-full" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Description</label>
                    <textarea name="description" rows={2} placeholder="What's this appointment about?" className="w-full resize-none" />
                  </div>
                  <div>
                    <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Internal Notes</label>
                    <textarea name="notes" rows={1} placeholder="Internal notes…" className="w-full resize-none" />
                  </div>
                  <button type="submit" className="btn-gold text-sm" disabled={isPending}>
                    {isPending ? "Scheduling…" : "Schedule Appointment"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Notes List */}
          <div className="card">
            <h3 className="text-sm font-semibold tracking-tight mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Notes ({notes.length})
            </h3>
            {notes.length === 0 ? (
              <p className="text-sm text-[#555] text-center py-4">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="border border-[#1a1a1a] p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[0.6rem] uppercase tracking-wider text-[#555]">{note.type}</span>
                      <span className="text-[0.6rem] text-[#444]">by {note.created_by}</span>
                      <span className="text-[0.6rem] text-[#444] ml-auto">
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-[#ccc] whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointments List */}
          <div className="card">
            <h3 className="text-sm font-semibold tracking-tight mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Appointments ({initialAppointments.length})
            </h3>
            {initialAppointments.length === 0 ? (
              <p className="text-sm text-[#555] text-center py-4">No appointments scheduled.</p>
            ) : (
              <div className="space-y-3">
                {initialAppointments.map((appt) => (
                  <div key={appt.id} className="border border-[#1a1a1a] p-3 flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm text-white font-medium">{appt.title}</p>
                        <span className={`text-[0.6rem] uppercase tracking-wider px-2 py-0.5 ${apptStatusColors[appt.status] ?? "bg-[#333] text-[#888]"}`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#888]">
                        {new Date(appt.scheduled_at).toLocaleString()} &middot; {appt.duration_minutes}min
                      </p>
                      {appt.description && (
                        <p className="text-xs text-[#666] mt-1">{appt.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
