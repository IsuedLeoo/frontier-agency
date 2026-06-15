"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  website: string;
  business_description: string;
  service_type: string;
  monthly_retainer: string;
  contract_value: string;
  contract_start_date: string;
  contract_end_date: string;
  billing_email: string;
  address: string;
  timezone: string;
  priority: string;
  assigned_to: string;
  notes: string;
  source: string;
}

const SERVICE_TYPES = [
  "AI Receptionist",
  "Email Automation",
  "AI Booking System",
  "Competitor Research",
  "Lead Follow-Up",
  "Custom AI Solutions",
];

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

export default function CreateClientForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    website: "",
    business_description: "",
    service_type: "",
    monthly_retainer: "",
    contract_value: "",
    contract_start_date: "",
    contract_end_date: "",
    billing_email: "",
    address: "",
    timezone: "",
    priority: "medium",
    assigned_to: "",
    notes: "",
    source: "manual",
  });

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/crm/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: form.name,
            email: form.email || null,
            phone: form.phone || null,
            company: form.company || null,
            industry: form.industry || null,
            website: form.website || null,
            business_description: form.business_description || null,
            service_type: form.service_type || null,
            monthly_retainer: form.monthly_retainer ? parseFloat(form.monthly_retainer) : null,
            contract_value: form.contract_value ? parseFloat(form.contract_value) : null,
            contract_start_date: form.contract_start_date || null,
            contract_end_date: form.contract_end_date || null,
            billing_email: form.billing_email || null,
            address: form.address || null,
            timezone: form.timezone || null,
            priority: form.priority,
            assigned_to: form.assigned_to || null,
            notes: form.notes || null,
            source: form.source,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as { error?: string }).error || "Failed to create client");
        }

        setOpen(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create client");
      }
    });
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-gold">
        + Add Client
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-8">
      <div className="card w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            New Client
          </h3>
          <button onClick={() => setOpen(false)} className="text-[#555] hover:text-white text-sm">✕</button>
        </div>

        {error && (
          <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#C5A55A] mb-3">Basic Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Email</label>
                <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="john@company.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Company</label>
                <input type="text" value={form.company} onChange={(e) => updateField("company", e.target.value)} placeholder="Acme Inc." />
              </div>
            </div>
          </div>

          {/* Business */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#C5A55A] mb-3">Business Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Industry</label>
                <input type="text" value={form.industry} onChange={(e) => updateField("industry", e.target.value)} placeholder="Technology, Healthcare, etc." />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Website</label>
                <input type="text" value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://company.com" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>What They Do</label>
                <textarea value={form.business_description} onChange={(e) => updateField("business_description", e.target.value)} placeholder="Brief description of their business…" rows={3} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Timezone</label>
                <select value={form.timezone} onChange={(e) => updateField("timezone", e.target.value)}>
                  <option value="">Select timezone…</option>
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Address</label>
                <input type="text" value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="123 Main St, City, State" />
              </div>
            </div>
          </div>

          {/* Service & Billing */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#C5A55A] mb-3">Service & Billing</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Service Type</label>
                <select value={form.service_type} onChange={(e) => updateField("service_type", e.target.value)}>
                  <option value="">Select service…</option>
                  {SERVICE_TYPES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Monthly Retainer ($)</label>
                <input type="number" value={form.monthly_retainer} onChange={(e) => updateField("monthly_retainer", e.target.value)} placeholder="299" min="0" step="0.01" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Contract Value ($)</label>
                <input type="number" value={form.contract_value} onChange={(e) => updateField("contract_value", e.target.value)} placeholder="5000" min="0" step="0.01" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Billing Email</label>
                <input type="email" value={form.billing_email} onChange={(e) => updateField("billing_email", e.target.value)} placeholder="billing@company.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Contract Start</label>
                <input type="date" value={form.contract_start_date} onChange={(e) => updateField("contract_start_date", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Contract End</label>
                <input type="date" value={form.contract_end_date} onChange={(e) => updateField("contract_end_date", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Other */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#C5A55A] mb-3">Other</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Priority</label>
                <select value={form.priority} onChange={(e) => updateField("priority", e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Source</label>
                <select value={form.source} onChange={(e) => updateField("source", e.target.value)}>
                  <option value="manual">Manual</option>
                  <option value="web">Web</option>
                  <option value="referral">Referral</option>
                  <option value="voice_agent">Voice Agent</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Internal Notes</label>
                <textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Any internal notes about this client…" rows={2} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isPending} className="btn-gold flex-1 disabled:opacity-50">
              {isPending ? "Creating…" : "Create Client"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
