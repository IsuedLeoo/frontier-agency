import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  Activity,
  Users,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Bell,
  Settings,
} from "lucide-react";

export default async function DashboardSettingsIntegrationsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  // TODO: Fetch integrations from database
  // For now, we'll use placeholder data
  const integrations = [
    {
      id: 1,
      name: "Stripe",
      status: "connected",
      lastSynced: "2024-06-10T14:30:00Z",
      description: "Payment processing and subscription management",
    },
    {
      id: 2,
      name: "GitHub",
      status: "connected",
      lastSynced: "2024-06-08T09:15:00Z",
      description: "Repository management and deployment triggers",
    },
    {
      id: 3,
      name: "Google Analytics",
      status: "disconnected",
      lastSynced: null,
      description: "Website traffic and user behavior analytics",
    },
    {
      id: 4,
      name: "Slack",
      status: "connected",
      lastSynced: "2024-06-09T16:45:00Z",
      description: "Team communication and notifications",
    },
    {
      id: 5,
      name: "Zapier",
      status: "connected",
      lastSynced: "2024-06-05T11:20:00Z",
      description: "Automation and workflow integration",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Integrations
        </h1>
        <Link
          href="/dashboard/settings"
          className="text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white border-l-2 border-transparent hover:border-[#C5A55A] transition-colors duration-200 px-3 py-2.5"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          ← Back to Settings
        </Link>
      </div>

      {/* Connected integrations */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Connected Integrations
        </h2>
        <div className="space-y-4">
          {integrations
            .filter((i) => i.status === "connected")
            .map((integration) => (
              <div
                key={integration.id}
                className="flex items-start gap-3 py-3 border-b border-[#222222] last:border-b-0"
              >
                <div className="flex-shrink-0">
                  <Zap size={20} className="text-[#10b981]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-white">
                      {integration.name}
                    </h3>
                    <span className="text-xs text-[#888888]">
                      Active • Last synced: {new Date(integration.lastSynced).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#CCCCCC]">
                    {integration.description}
                  </p>
                </div>
                <Link
                  href={`/dashboard/settings/integrations/${integration.id}`}
                  className="text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white transition-colors duration-200"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Manage
                </Link>
              </div>
            ))}
        </div>
      </div>

      {/* Available integrations */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Available Integrations
        </h2>
        <div className="space-y-4">
          {integrations
            .filter((i) => i.status === "disconnected")
            .map((integration) => (
              <div
                key={integration.id}
                className="flex items-start gap-3 py-3 border-b border-[#222222] last:border-b-0"
              >
                <div className="flex-shrink-0">
                  <Zap size={20} className="text-[#666666]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-white">
                      {integration.name}
                    </h3>
                    <span className="text-xs text-[#888888]">
                      Not connected
                    </span>
                  </div>
                  <p className="text-sm text-[#CCCCCC]">
                    {integration.description}
                  </p>
                </div>
                <button
                  onClick={() => {
                    // TODO: Implement connect integration
                    alert(`Connect ${integration.name} feature coming soon!`);
                  }}
                  className="bg-[#C5A55A] px-4 py-2 rounded-sm font-medium text-xs hover:bg-[#D4B07A] transition-colors duration-200"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Connect
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Add integration button */}
      <div className="text-center">
        <Link
          href="/dashboard/settings/integrations/new"
          className="bg-black px-6 py-3 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
        >
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-[#C5A55A]" />
            <div>
              <h3 className="font-semibold text-white">Add Integration</h3>
              <p className="text-sm text-[#888888]">
                Connect a new service or platform
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}