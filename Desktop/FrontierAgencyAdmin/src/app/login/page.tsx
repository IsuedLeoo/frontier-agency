import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSession();
  if (user) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            <span className="text-[#C5A55A]">Frontier</span> Agency
          </h1>
          <p
            className="text-xs uppercase tracking-[0.2em] text-[#555] mt-2"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Admin Console
          </p>
        </div>

        <div className="card">
          <h2
            className="text-xl font-semibold tracking-tight mb-6"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Sign in
          </h2>
          <LoginForm />
        </div>

        <p className="text-center text-[0.65rem] text-[#555] mt-6" style={{ fontFamily: "var(--font-inter)" }}>
          Authorized personnel only. All activity is monitored.
        </p>
      </div>
    </div>
  );
}
