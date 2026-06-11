import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Briefcase,
  Activity,
  Users,
  Clock,
  DollarSign,
  Zap,
  Bell,
  CheckCircle,
} from "lucide-react";

export default async function DashboardServiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  const serviceId = parseInt(params.id);

  // TODO: Fetch service from database
  // For now, we'll use placeholder data
  const service = {
    id: serviceId,
    name: "SEO Optimization",
    status: "active",
    progress: 80,
    priority: "high",
    startDate: "2024-03-15",
    lastUpdated: "2024-06-08",
    nextReview: "2024-06-15",
    monthlyHours: 12,
    description:
      "Comprehensive SEO optimization including keyword research, on-page optimization, technical SEO, and link building to improve search rankings and organic traffic.",
    deliverables: [
      "Monthly keyword research report",
      "On-page optimization recommendations",
      "Technical SEO audit",
      "Backlink analysis and strategy",
      "Content optimization guide",
      "Performance tracking dashboard",
    ],
    toolsUsed: [
      "Google Search Console",
      "Google Analytics",
      "SEMrush",
      "Ahrefs",
      "Screaming Frog",
    ],
  };

  // TODO: Fetch recent activity for this service
  const recentActivity = [
    {
      id: 1,
      action: "Completed keyword research for Q3",
      user: "Alex Specialist",
      timestamp: "2024-06-08T09:15:00Z",
      type: "milestone",
    },
    {
      id: 2,
      action: "Updated meta tags on homepage",
      user: "Sam Specialist",
      timestamp: "2024-06-05T14:30:00Z",
      type: "task",
    },
    {
      id: 3,
      action: "Client approved content strategy",
      user: "Taylor Manager",
      timestamp: "2024-06-03T11:20:00Z",
      type: "approval",
    },
  ];

  // TODO: Fetch performance metrics
  const metrics = {
    organicTraffic: {
      current: 1250,
      previous: 980,
      change: "+27.6%",
    },
    keywordRankings: {
      current: 45,
      previous: 32,
      change: "+40.6%",
    },
    backlinks: {
      current: 128,
      previous: 95,
      change: "+34.7%",
    },
    domainAuthority: {
      current: 34,
      previous: 31,
      change: "+9.7%",
    },
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {service.name}
        </h1>
        <div className="flex gap-3">
          <Link
            href="/dashboard/services"
            className="text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white border-l-2 border-transparent hover:border-[#C5A55A] transition-colors duration-200 px-3 py-2.5"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ← Back to Services
          </Link>
          <Link
            href={`/dashboard/services/${serviceId}/edit`}
            className="bg-[#C5A55A] px-4 py-2 rounded-sm font-medium hover:bg-[#D4B07A] transition-colors duration-200 text-xs"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Edit
          </Link>
        </div>
      </div>

      {/* Service overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Info */}
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <h2 className="text-lg font-semibold mb-4">
            Service Info
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Package size={16} className="text-[#C5A55A] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {service.name}
                </p>
                <p className="text-xs text-[#888888]">
                  {service.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase size={16} className="text-[#C5A55A] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Priority
                </p>
                <p className={`text-sm ${
                  service.priority === "low"
                    ? "text-[#6b7280]"
                    : service.priority === "medium"
                    ? "text-[#f59e0b]"
                    : "text-[#ef4444]"
                }`}>
                  {service.priority.charAt(0).toUpperCase() + service.priority.slice(1)}
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
                  service.status === "active"
                    ? "text-[#10b981]"
                    : service.status === "paused"
                    ? "text-[#f59e0b]"
                    : "text-[#ef4444]"
                }`}>
                  {service.status
                    .charAt(0)
                    .toUpperCase() + service.status.slice(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <h2 className="text-lg font-semibold mb-4">
            Progress & Timeline
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle
                size={16}
                className={`text-[#10b981] ${
                  service.progress === 100 ? "" : "text-[#666666]"
                }`}
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  Completion
                </p>
                <p className="text-2xl font-bold tracking-tight text-white">
                  {service.progress}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Started
                </p>
                <p className="text-xs text-[#888888]">
                  {new Date(service.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Last Updated
                </p>
                <p className="text-xs text-[#888888]">
                  {new Date(service.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Next Review
                </p>
                <p className="text-xs text-[#888888]">
                  {new Date(service.nextReview).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <h2 className="text-lg font-semibold mb-4">
            Usage & Resources
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <DollarSign size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Monthly Hours
                </p>
                <p className="text-sm text-[#CCCCCC]">
                  {service.monthlyHours} hrs
                </p>
              </div>
            }
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="mb-10">
        <h2
          className="text-lg font-semibold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          What's Included
        </h2>
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          {service.deliverables.length > 0 ? (
            <div className="space-y-3">
              {service.deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-start gap-3 py-2">
                  <div className="flex-shrink-0">
                    <CheckCircle size={14} className="text-[#C5A55A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#CCCCCC]">{deliverable}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#888888] text-center py-8">
              No deliverables defined
            </p>
          )}
        </div>
      </div>

      {/* Performance metrics */}
      <div className="mb-10">
        <h2
          className="text-lg font-semibold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Performance Metrics
        </h2>
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <div className="grid gap-4">
            {/* Mobile: single column */}
            {/* Tablet: two columns */}
            {/* Desktop: four columns */}
            <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <TrendingUp size={16} className="text-[#10b981]" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Organic Traffic
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-white">
                    {metrics.organicTraffic.current}
                  </p>
                  <p className="text-xs text-[#888888]">
                    {metrics.organicTraffic.change}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity size={16} className="text-[#f59e0b]" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Keyword Rankings
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-white">
                    {metrics.keywordRankings.current}
                  </p>
                  <p className="text-xs text-[#888888]">
                    {metrics.keywordRankings.change}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link size={16} className="text-[#8b5cf6]" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Backlinks
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-white">
                    {metrics.backlinks.current}
                  </p>
                  <p className="text-xs text-[#888888]">
                    {metrics.backlinks.change}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-[#6366f1]" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Domain Authority
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-white">
                    {metrics.domainAuthority.current}
                  </p>
                  <p className="text-xs text-[#888888]">
                    {metrics.domainAuthority.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools used */}
      <div className="mb-10">
        <h2
          className="text-lg font-semibold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Tools & Platforms
        </h2>
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          {service.toolsUsed.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {service.toolsUsed.map((tool, index) => (
                <div key={index} className="bg-[#222222] px-4 py-2 rounded-sm text-xs text-[#CCCCCC]">
                  {tool}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#888888] text-center py-8">
              No tools specified
            </p>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="mb-10">
        <h2
          className="text-lg font-semibold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Recent Activity
        </h2>
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 py-2">
                  <div className="flex-shrink-0">
                    <Activity size={14} className="text-[#C5A55A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-1">
                      {activity.action}
                    </p>
                    <p className="text-xs text-[#888888]">
                      by {activity.user} • {
                        new Date(activity.timestamp).toLocaleString()
                      }
                      {activity.type === "milestone" && (
                        <span className="ml-1 text-xs text-[#10b981]">
                          [Milestone]
                        </span>
                      )}
                      {activity.type === "task" && (
                        <span className="ml-1 text-xs text-[#f59e0b]">
                          [Task]
                        </span>
                      )}
                      {activity.type === "approval" && (
                        <span className="ml-1 text-xs text-[#8b5cf6]">
                          [Approval]
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#888888] text-center py-8">
              No recent activity
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <Link
          href={`/admin/services/${serviceId}`}
          className="flex-1 bg-black px-6 py-3 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
        >
          <div className="flex items-center gap-3">
            <Briefcase size={16} className="text-[#C5A55A]" />
            <div>
              <h3 className="font-semibold text-white">View in Admin</h3>
              <p className="text-sm text-[#888888]">
                See full service details in admin panel
              </p>
            </div>
          </div>
        </Link>
        {service.status === "active" ? (
          <button
            onClick={() => {
              // TODO: Implement pause service
              alert("Pause service feature coming soon!");
            }}
            className="flex-1 bg-[#f59e0b] px-6 py-3 rounded-xl font-medium text-xs hover:bg-[#fbbf24] transition-colors duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Pause Service
          </button>
        ) : (
          <button
            onClick={() => {
              // TODO: Implement resume service
              alert("Resume service feature coming soon!");
            }}
            className="flex-1 bg-[#10b981] px-6 py-3 rounded-xl font-medium text-xs hover:bg-[#34d399] transition-colors duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Resume Service
          </button>
        )}
      </div>
    </div>
  );
}