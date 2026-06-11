import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-10">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Welcome, {user.name.split(" ")[0]}
        </h1>
        <p
          className="text-sm text-[#888888] mt-1"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Your services and tools
        </p>
      </div>

      <div className="flex items-center justify-center min-h-[400px] border border-[#333333] rounded-lg">
        <div className="text-center px-6 py-16">
          <Package
            size={40}
            className="text-[#333333] mx-auto mb-5"
            strokeWidth={1}
          />
          <h2
            className="text-base font-semibold text-white mb-2"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            No services yet
          </h2>
          <p
            className="text-sm text-[#888888] max-w-[320px] leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Your custom-built services will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
