"use client";

import { useState, useTransition } from "react";
import { createUserAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function CreateStaffForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createUserAction(formData, "system");
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
        + Add Staff
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="card w-full max-w-md">
        <h3
          className="text-xl font-semibold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          New Staff Member
        </h3>

        {error && (
          <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
              Full Name
            </label>
            <input type="text" name="name" placeholder="Jane Smith" required />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
              Email
            </label>
            <input type="email" name="email" placeholder="jane@company.com" required />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
              Temporary Password
            </label>
            <input type="password" name="password" placeholder="Min 8 characters" required minLength={8} />
          </div>
          <input type="hidden" name="role" value="staff" />

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isPending} className="btn-gold flex-1 disabled:opacity-50">
              {isPending ? "Creating…" : "Create Staff"}
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
