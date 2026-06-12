import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
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
} from "lucide-react";

export default async function DashboardWebhooksPage() {
  const session = await getSession(await headers());

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  // TODO: Fetch webhooks from database
  // For now, we'll use placeholder data
  const webhooks = [
    {
      id: 1,
      name: "Stripe Payment Updates",
      url: "https://client-stripe.example.com/webhook",
      events: ["payment_succeeded", "payment_failed", "subscription_updated"],
      status: "active",
      lastTriggered: "2024-06-10T14:30:00Z",
      successRate: "98%",
    },
    {
      id: 2,
      name: "GitHub Deployment Trigger",
      url: "https://api.github.com/repos/client/repo/dispatches",
      events: ["push", "pull_request"],
      status: "active",
      lastTriggered: "2024-06-08T09:15:00Z",
      successRate: "100%",
    },
    {
      id: 3,
      name: "Google Analytics Event",
      url: "https://analytics.example.com/collect",
      events: ["page_view", "purchase", "sign_up"],
      status: "paused",
      lastTriggered: "2024-06-05T16:45:00Z",
      successRate: "0%",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Webhooks & Integrations
        </h1>
        <Link
          href="/dashboard/webhooks/new"
          className="bg-[#C5A55A] px-6 py-3 rounded-sm font-medium hover:bg-[#D4B07A] transition-colors duration-200"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <Zap size={16} className="mr-2" />
          Add Webhook
        </Link>
      </div>

      {/* Webhooks grid */}
      <div className="grid gap-6">
        {/* Mobile: single column */}
        {/* Tablet: two columns */}
        {/* Desktop: three columns */}
        <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="reveal bg-black p-6 rounded-xl border border-[#333333]"
            >
              <div className="space-y-4">
                {/* Webhook header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2
                      className="text-lg font-semibold tracking-tight"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {webhook.name}
                    </h2>
                    <p className="text-sm text-[#888888] mt-1">
                      {webhook.url}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      webhook.status === "active"
                        ? "bg-[#10b981] text-white"
                        : webhook.status === "paused"
                        ? "bg-[#f59e0b] text-white"
                        : "bg-[#ef4444] text-white"
                    }`}
                  >
                    {webhook.status
                      .charAt(0)
                      .toUpperCase() + webhook.status.slice(1)}
                  </span>
                </div>

                {/* Events */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {webhook.events.map((event) => (
                    <span
                      key={event}
                      className="bg-[#222222] px-3 py-1 rounded-sm text-xs text-[#CCCCCC]"
                    >
                      {event}
                    </span>
                  ))}
                </div>

                {/* Status details */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Activity size={14} className="text-[#C5A55A] mt-0.5" />
                    <div className="text-sm text-[#888888]">
                      Last triggered:{" "}
                      {new Date(webhook.lastTriggered).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={14} className="text-[#10b981]" />
                    <div className="text-sm text-[#888888]">
                      Success rate: {webhook.successRate}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={14} className="text-[#C5A55A] mt-0.5" />
                    <div className="text-sm text-[#888888]">
                      Uptime: 99.9%
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href={`/dashboard/webhooks/${webhook.id}`}
                    className="text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white border-l-2 border-transparent hover:border-[#C5A55A] transition-colors duration-200 px-3 py-1.5"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    View Details
                  </Link>
                  {webhook.status === "active" ? (
                    <button
                      onClick={() => {
                        // TODO: Implement pause webhook
                        alert("Pause webhook feature coming soon!");
                      }}
                      className="text-xs font-medium uppercase tracking-[0.04em] text-[#f59e0b] hover:text-[#fbbf24] transition-colors duration-200 px-3 py-1.5"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // TODO: Implement resume webhook
                        alert("Resume webhook feature coming soon!");
                      }}
                      className="bg-[#10b981] px-4 py-1.5 rounded-sm font-medium text-xs hover:bg-[#34d399] transition-colors duration-200"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Resume
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {webhooks.length === 0 && (
        <div className="reveal bg-black p-12 rounded-xl border border-[#333333] text-center">
          <Zap size={32} className="mx-auto mb-4 text-[#333333]" />
          <h2 className="text-lg font-semibold tracking-tight mb-3">
            No webhooks yet
          </h2>
          <p className="text-sm text-[#888888] max-w-[320px]">
            Set up your first webhook to start receiving automated updates.
          </p>
          <Link
            href="/dashboard/webhooks/new"
            className="mt-6 inline-block bg-[#C5A55A] px-6 py-3 rounded-sm font-medium hover:bg-[#D4B07A] transition-colors duration-200"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <Zap size={16} className="mr-2" />
            Add First Webhook
          </Link>
        </div>
      )}
    </div>
  );
}