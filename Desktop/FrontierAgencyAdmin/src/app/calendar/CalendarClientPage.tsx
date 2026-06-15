"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SafeUser, CrmClient } from "@/lib/types";

interface Appointment {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
}

interface CalendarClientPageProps {
  user: SafeUser;
  year: number;
  month: number;
  appointments: Appointment[];
  clientNames: Record<string, string>;
  clients: CrmClient[];
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const apptStatusColors: Record<string, string> = {
  scheduled: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  canceled: "bg-[#333] text-[#555]",
  no_show: "bg-red-500/20 text-red-400",
};

export default function CalendarClientPage({ user, year, month, appointments, clientNames, clients }: CalendarClientPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const now = new Date();
  const today = formatDate(now.getFullYear(), now.getMonth(), now.getDate());

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  // Group appointments by date
  const apptsByDate: Record<string, typeof appointments> = {};
  for (const appt of appointments) {
    const dateKey = appt.scheduled_at?.substring(0, 10);
    if (!dateKey) continue;
    if (!apptsByDate[dateKey]) apptsByDate[dateKey] = [];
    apptsByDate[dateKey].push(appt);
  }

  // Build grid cells
  const cells: Array<{ day: number; date: string; isCurrentMonth: boolean } | null> = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, date: formatDate(year, month, d), isCurrentMonth: true });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const filteredClients = searchQuery
    ? clients.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : clients.slice(0, 10);

  const handleCreateAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    const clientId = (formData.get("client_id") as string) || selectedClientId;
    const scheduledAt = formData.get("scheduled_at") as string;

    if (!clientId) {
      setFormError("Please select a client");
      return;
    }
    if (!scheduledAt) {
      setFormError("Date and time are required");
      return;
    }

    const body = {
      client_id: clientId,
      title: (formData.get("title") as string) || "Consultation",
      description: (formData.get("description") as string) || null,
      scheduled_at: new Date(scheduledAt).toISOString(),
      duration_minutes: parseInt(formData.get("duration_minutes") as string) || 30,
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
        throw new Error((data as { error?: string }).error || "Failed to create appointment");
      }
      setShowForm(false);
      setSelectedClientId("");
      setSearchQuery("");
      startTransition(() => router.refresh());
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create appointment");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Calendar
          </h2>
          <p className="text-sm text-[#888] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
            Appointments and scheduled consultations.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold text-sm">
          {showForm ? "Cancel" : "+ New Appointment"}
        </button>
      </div>

      {/* Create Appointment Form */}
      {showForm && (
        <div className="card border-[#C5A55A]/20">
          <h3 className="text-sm font-semibold tracking-tight mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Schedule New Appointment
          </h3>
          {formError && (
            <div className="mb-4 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
              {formError}
            </div>
          )}
          <form onSubmit={handleCreateAppointment} className="space-y-4">
            <div>
              <label className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] block mb-1">Client *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search clients…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowClientDropdown(true);
                    setSelectedClientId("");
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  className="w-full"
                />
                <input type="hidden" name="client_id" value={selectedClientId} />
                {showClientDropdown && searchQuery && filteredClients.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-[#111] border border-[#333] max-h-48 overflow-y-auto">
                    {filteredClients.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedClientId(c.id);
                          setSearchQuery(c.name);
                          setShowClientDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-[#ccc] hover:bg-[#1a1a1a] hover:text-white"
                      >
                        {c.name}
                        {c.company && <span className="text-[#555] ml-2">{c.company}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedClientId && (
                <p className="text-xs text-[#C5A55A] mt-1">
                  Selected: {clientNames[selectedClientId] || searchQuery}
                </p>
              )}
            </div>
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
            <div className="flex gap-3">
              <button type="submit" className="btn-gold text-sm" disabled={isPending}>
                {isPending ? "Scheduling…" : "Schedule Appointment"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setSelectedClientId(""); setSearchQuery(""); }} className="btn-secondary text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            const params = new URLSearchParams();
            params.set("year", String(prevYear));
            params.set("month", String(prevMonth));
            startTransition(() => router.push(`/calendar?${params}`));
          }}
          className="btn-secondary text-sm"
          disabled={isPending}
        >
          &larr; {MONTH_NAMES[prevMonth]}
        </button>
        <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          onClick={() => {
            const params = new URLSearchParams();
            params.set("year", String(nextYear));
            params.set("month", String(nextMonth));
            startTransition(() => router.push(`/calendar?${params}`));
          }}
          className="btn-secondary text-sm"
          disabled={isPending}
        >
          {MONTH_NAMES[nextMonth]} &rarr;
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="card overflow-hidden p-0">
        <div className="grid grid-cols-7 border-b border-[#1a1a1a]">
          {DAY_NAMES.map((d) => (
            <div key={d} className="py-2 text-center text-[0.65rem] uppercase tracking-[0.15em] text-[#555]">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((cell, idx) => {
            if (!cell) {
              return <div key={`empty-${idx}`} className="min-h-[80px] border-b border-r border-[#111] bg-[#080808]" />;
            }
            const dayAppts = apptsByDate[cell.date] ?? [];
            const isToday = cell.date === today;
            return (
              <div
                key={cell.date}
                className={`min-h-[80px] border-b border-r border-[#111] p-1.5 ${isToday ? "bg-[#C5A55A]/5" : ""}`}
              >
                <div className={`text-xs mb-1 ${isToday ? "text-[#C5A55A] font-bold" : "text-[#555]"}`}>
                  {cell.day}
                </div>
                <div className="space-y-0.5">
                  {dayAppts.slice(0, 3).map((appt) => (
                    <div
                      key={appt.id}
                      className={`text-[0.6rem] px-1 py-0.5 truncate ${apptStatusColors[appt.status] ?? "bg-[#222] text-[#888]"}`}
                      title={`${appt.title} — ${clientNames[appt.client_id] ?? "Unknown"}`}
                    >
                      {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {appt.title}
                    </div>
                  ))}
                  {dayAppts.length > 3 && (
                    <div className="text-[0.6rem] text-[#555] px-1">+{dayAppts.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Appointments List */}
      <div className="card">
        <h3 className="text-sm font-semibold tracking-tight mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Upcoming Appointments
        </h3>
        {appointments.filter((a) => a.status === "scheduled").length === 0 ? (
          <p className="text-sm text-[#555] text-center py-4">No scheduled appointments this month.</p>
        ) : (
          <div className="space-y-2">
            {appointments
              .filter((a) => a.status === "scheduled")
              .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))
              .map((appt) => (
                <div key={appt.id} className="flex items-center gap-3 p-3 border border-[#1a1a1a]">
                  <div className="text-xs text-[#555] w-20 shrink-0">
                    {new Date(appt.scheduled_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </div>
                  <div className="text-xs text-[#888] w-16 shrink-0">
                    {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{appt.title}</p>
                    <p className="text-xs text-[#666]">{clientNames[appt.client_id] ?? "Unknown Client"}</p>
                  </div>
                  <span className={`text-[0.6rem] uppercase tracking-wider px-2 py-0.5 ${apptStatusColors[appt.status] ?? "bg-[#333] text-[#888]"}`}>
                    {appt.status}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
