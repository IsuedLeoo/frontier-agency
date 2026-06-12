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
  Trash2,
  Edit,
  Link as LinkIcon,
  Key,
} from "lucide-react";

export default async function DashboardWebhookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession(await headers());

  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  const webhookId = parseInt(params.id);

  // TODO: Fetch webhook from database
  // For now, we'll use placeholder data
  const webhook = {
    id: webhookId,
    name: "Stripe Payment Updates",
    url: "https://client-stripe.example.com/webhook",
    events: ["payment_succeeded", "payment_failed", "subscription_updated"],
    status: "active",
    lastTriggered: "2024-06-10T14:30:00Z",
    successRate: "98%",
    description: "Receives payment and subscription updates from Stripe to keep client records in sync.",
    secret: "whsec_********************", // Partially masked
    createdAt: "2024-05-15",
    updatedAt: "2024-06-10",
  };

  // TODO: Fetch recent triggers
  const recentTriggers = [
    {
      id: 1,
      event: "payment_succeeded",
      timestamp: "2024-06-10T14:30:00Z",
      status: "success",
      details: "Payment of $299.00 for subscription plan_pro",
    },
    {
      id: 2,
      event: "subscription_updated",
      timestamp: "2024-06-08T09:15:00Z",
      status: "success",
      details: "Subscription changed from plan_starter to plan_pro",
    },
    {
      id: 3,
      event: "payment_failed",
      timestamp: "2024-06-05T16:45:00Z",
      status: "retried",
      details: "Payment failed, retry attempt 1 of 3",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {webhook.name}
        </h1>
        <div className="flex gap-3">
          <Link
            href="/dashboard/webhooks"
            className="text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white border-l-2 border-transparent hover:border-[#C5A55A] transition-colors duration-200 px-3 py-2.5"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ← Back to Webhooks
          </Link>
          <Link
            href={`/dashboard/webhooks/${webhookId}/edit`}
            className="bg-[#C5A55A] px-4 py-2 rounded-sm font-medium hover:bg-[#D4B07A] transition-colors duration-200 text-xs"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Edit
          </Link>
          <button
            onClick={() => {
              // TODO: Implement delete confirmation
              if (
                window.confirm(
                  `Are you sure you want to delete ${webhook.name}? This action cannot be undone.`
                )
              ) {
                alert("Delete webhook feature coming soon!");
              }
            }}
            className="text-[#ef4444] hover:text-[#f87171] transition-colors duration-200"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Webhook overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Info */}
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <h2 className="text-lg font-semibold mb-4">
            Webhook Info
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Zap size={16} className="text-[#C5A55A] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {webhook.name}
                </p>
                <p className="text-xs text-[#888888]">
                  {webhook.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity size={16} className="text-[#C5A55A] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Status
                </p>
                <p className={`text-sm ${
                  webhook.status === "active"
                    ? "text-[#10b981]"
                    : webhook.status === "paused"
                    ? "text-[#f59e0b]"
                    : "text-[#ef4444]"
                }`}>
                  {webhook.status
                    .charAt(0)
                    .toUpperCase() + webhook.status.slice(1)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users size={16} className="text-[#C5A55A] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Created
                </p>
                <p className="text-xs text-[#888888]">
                  {new Date(webhook.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-[#C5A55A] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Last Updated
                </p>
                <p className="text-xs text-[#888888]">
                  {new Date(webhook.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <h2 className="text-lg font-semibold mb-4">
            Configuration
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <LinkIcon size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  URL
                </p>
                <p className="text-xs text-[#CCCCCC] break-all">
                  {webhook.url}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Key size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Secret
                </p>
                <p className="text-xs text-[#CCCCCC] font-mono">
                  {webhook.secret}
                </p>
                <button
                  onClick={() => {
                    // TODO: Implement copy to clipboard
                    alert("Secret copied to clipboard!");
                  }}
                  className="text-xs text-[#888888] hover:text-[#C5A55A] transition-colors duration-200 ml-2"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity size={16} className="text-[#C5A55A] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Events
                </p>
                <div className="flex flex-wrap gap-1">
                  {webhook.events.map((event) => (
                    <span
                      key={event}
                      className="bg-[#222222] px-2 py-0.5 rounded text-xs text-[#CCCCCC]"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <h2 className="text-lg font-semibold mb-4">
            Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Last Triggered
                </p>
                <p className="text-sm text-[#888888]">
                  {new Date(webhook.lastTriggered).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={16} className="text-[#10b981]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Success Rate
                </p>
                <p className="text-2xl font-bold tracking-tight text-white">
                  {webhook.successRate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[#C5A55A]" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Uptime
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-white">
                    99.9%
                  </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
              <Users size={16} className="text-[#C5A55A]" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Total Triggers
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-white">
                    1,247
                  </p>
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Recent triggers */}
      <div className="mb-10">
        <h2
          className="text-lg font-semibold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Recent Triggers
        </h2>
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          {recentTriggers.length > 0 ? (
            <div className="space-y-3">
              {recentTriggers.map((trigger) => (
                <div key={trigger.id} className="flex items-start gap-3 py-2">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        trigger.status === "success"
                          ? "bg-[#10b981]"
                          : trigger.status === "retried"
                          ? "bg-[#f59e0b]"
                          : "bg-[#ef4444]"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-white">
                        {trigger.event
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </h3>
                      <span className={`text-xs ${
                        trigger.status === "success"
                          ? "text-[#10b981]"
                          : trigger.status === "retried"
                          ? "text-[#f59e0b]"
                          : "text-[#ef4444]"
                      }`}>
                        {trigger.status
                          .charAt(0)
                          .toUpperCase() + trigger.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-[#888888]">
                      {trigger.details}
                    </p>
                    <p className="text-xs text-[#888888]">
                      {new Date(trigger.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#888888] text-center py-8">
              No recent triggers
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <Link
          href={`/admin/webhooks/${webhookId}`}
          className="flex-1 bg-black px-6 py-3 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
        >
          <div className="flex items-center gap-3">
            <Users size={16} className="text-[#C5A55A]" />
            <div>
              <h3 className="font-semibold text-white">View in Admin</h3>
              <p className="text-sm text-[#888888]">
                See full webhook details in admin panel
              </p>
            </div>
          </div>
        </Link>
        {webhook.status === "active" ? (
          <button
            onClick={() => {
              // TODO: Implement pause webhook
              alert("Pause webhook feature coming soon!");
            }}
            className="flex-1 bg-[#f59e0b] px-6 py-3 rounded-xl font-medium text-xs hover:bg-[#fbbf24] transition-colors duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Pause Webhook
          </button>
        ) : (
          <button
            onClick={() => {
              // TODO: Implement resume webhook
              alert("Resume webhook feature coming soon!");
            }}
            className="flex-1 bg-[#10b981] px-6 py-3 rounded-xl font-medium text-xs hover:bg-[#34d399] transition-colors duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Resume Webhook
          </button>
        )}
      </div>
    </div>
  );
}