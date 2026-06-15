"use client";

import { useState, useTransition, useEffect } from "react";
import { createInvoiceAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface ClientOption {
  id: string;
  name: string;
  email: string;
}

export default function CreateInvoiceForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (open) {
      fetch("/api/clients")
        .then((r) => r.json())
        .then((data: any) => setClients(data.clients ?? []))
        .catch(() => {});
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createInvoiceAction(formData, "system");
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-gold">
        + Create Invoice
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="card w-full max-w-lg">
        <h3
          className="text-xl font-semibold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          New Invoice
        </h3>

        {error && (
          <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
              Client
            </label>
            <select name="client_id" required>
              <option value="">Select a client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                Amount (USD)
              </label>
              <input type="number" name="amount" placeholder="0.00" step="0.01" min="0.01" required />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                Due Date
              </label>
              <input type="date" name="due_date" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
              Service Type
            </label>
            <input type="text" name="service_type" placeholder="e.g. AI Automation, SEO…" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
              Description
            </label>
            <textarea name="description" rows={2} placeholder="Brief description of services…" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isPending} className="btn-gold flex-1 disabled:opacity-50">
              {isPending ? "Creating…" : "Create Invoice"}
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
