import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import {
  Package,
  Briefcase,
  Activity,
  Users,
  DollarSign,
  Bell,
  CheckCircle,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession(await headers());

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  // TODO: Fetch real stats from database
  // For now, we'll use placeholder data
  const stats = {
    activeServices: 3,
    totalProjects: 5,
    completedProjects: 3,
    monthlyUsage: 85,
  };

  // TODO: Fetch recent activity
  const recentActivity = [
    {
      id: 1,
      action: "Website redesign project updated",
      service: "Web Design",
      timestamp: "2024-06-10T14:30:00Z",
    },
    {
      id: 2,
      action: "Monthly SEO report delivered",
      service: "SEO Optimization",
      timestamp: "2024-06-08T09:15:00Z",
    },
    {
      id: 3,
      action: "Social media content approved",
      service: "Community Management",
      timestamp: "2024-06-05T16:45:00Z",
    },
  ];

  // TODO: Fetch service status
  const services = [
    {
      id: 1,
      name: "Web Design",
      status: "active",
      progress: 65,
    },
    {
      id: 2,
      name: "SEO Optimization",
      status: "active",
      progress: 80,
    },
    {
      id: 3,
      name: "Content Creation",
      status: "active",
      progress: 45,
    },
    {
      id: 4,
      name: "Email Marketing",
      status: "paused",
      progress: 0,
    },
  ];

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
          Your agency services overview
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <div className="flex items-center gap-3">
            <Package size={20} className="text-[#C5A55A]" />
            <div>
              <p className="text-xs font-semibold text-white">
                Active Services
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {stats.activeServices}
              </p>
            </div>
          </div>
        </div>

        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <div className="flex items-center gap-3">
            <Briefcase size={20} className="text-[#C5A55A]" />
            <div>
              <p className="text-xs font-semibold text-white">
                Total Projects
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {stats.totalProjects}
              </p>
            </div>
          </div>
        </div>

        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-[#10b981]" />
            <div>
              <p className="text-xs font-semibold text-white">
                Completed Projects
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {stats.completedProjects}
              </p>
            </div>
          </div>
        </div>

        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <div className="flex items-center gap-3">
            <DollarSign size={20} className="text-[#C5A55A]" />
            <div>
              <p className="text-xs font-semibold text-white">
                Monthly Usage
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {stats.monthlyUsage}%
              </p>
              <div className="w-[80px] bg-[#222222] rounded-full h-2.5 mt-1">
                <div
                  className="bg-[#C5A55A] h-2.5 rounded-full"
                  style={{ width: `${stats.monthlyUsage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service status */}
      <div className="mb-10">
        <h2
          className="text-lg font-semibold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Your Services
        </h2>
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-start gap-3 py-3 border-b border-[#222222] last:border-b-0"
            >
              <div className="flex-shrink-0">
                <Package size={16} className="text-[#C5A55A]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-white">
                    {service.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      service.status === "active"
                        ? "bg-[#10b981] text-white"
                        : service.status === "paused"
                        ? "bg-[#f59e0b] text-white"
                        : "bg-[#ef4444] text-white"
                    }`}
                  >
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </div>
                <div className="w-full bg-[#222222] rounded-full h-2.5">
                  <div
                    className="bg-[#C5A55A] h-2.5 rounded-full"
                    style={{ width: `${service.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-[#888888] mt-1">
                  <span>{service.progress}%</span>
                  <span>
                    {service.status === "active"
                      ? "In Progress"
                      : service.status === "paused"
                      ? "Paused"
                      : "Not Started"}
                  </span>
                </div>
              </div>
            </div>
          ))}
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
                      via {activity.service} • {
                        new Date(activity.timestamp).toLocaleString()
                      }
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

      {/* Quick actions */}
      <div className="mb-10">
        <h2
          className="text-lg font-semibold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Link
            href="/dashboard/projects"
            className="bg-black px-6 py-4 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Briefcase size={20} className="text-[#C5A55A]" />
              <div>
                <h3 className="font-semibold text-white">Manage Projects</h3>
                <p className="text-sm text-[#888888]">
                  View and update your projects
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/services"
            className="bg-black px-6 py-4 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Users size={20} className="text-[#C5A55A]" />
              <div>
                <h3 className="font-semibold text-white">Manage Services</h3>
                <p className="text-sm text-[#888888]">
                  See your active services
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/webhooks"
            className="bg-black px-6 py-4 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-[#C5A55A]" />
              <div>
                <h3 className="font-semibold text-white">Webhooks</h3>
                <p className="text-sm text-[#888888]">
                  Manage your webhook endpoints
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}