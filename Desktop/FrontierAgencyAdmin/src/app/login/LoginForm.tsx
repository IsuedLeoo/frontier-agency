"use client";

import { useState } from "react";
import { loginAction } from "@/lib/actions";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="you@company.com"
          required
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
