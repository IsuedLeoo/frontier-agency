"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push(redirectTo);
      router.refresh();
    } else {
      setError(result.error || "Login failed");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-xs uppercase tracking-[0.04em] text-[#888888] mb-2"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Email
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]"
          />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-3 bg-transparent border border-[#333333] text-white text-sm placeholder:text-[#555555] focus:outline-none focus:border-[#888888] transition-colors duration-200"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs uppercase tracking-[0.04em] text-[#888888] mb-2"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Password
        </label>
        <div className="relative">
          <Lock
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]"
          />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            className="w-full pl-10 pr-4 py-3 bg-transparent border border-[#333333] text-white text-sm placeholder:text-[#555555] focus:outline-none focus:border-[#888888] transition-colors duration-200"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black text-xs font-semibold uppercase tracking-[0.04em] border border-white hover:bg-transparent hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {loading ? (
          "Signing in..."
        ) : (
          <>
            Sign In
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Frontier Agency
          </Link>
          <p
            className="text-sm text-[#888888] mt-2"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Sign in to your account
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p
          className="text-center text-sm text-[#888888] mt-8"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Do not have an account?{" "}
          <Link
            href="/register"
            className="text-white hover:text-[#C5A55A] transition-colors duration-200 underline underline-offset-2"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
