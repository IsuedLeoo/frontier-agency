import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Activity,
  Clock,
  DollarSign,
  Zap,
} from "lucide-react";

export default async function AdminPage() {
  const session = await getSession(await headers());

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  // TODO: Fetch real stats from database
  // For now, we'll use placeholder data
  const stats = {
    totalClients: 0,
    activeProjects: 0,
    completedProjects: 0,
    monthlyRevenue: 0,
  };

  // TODO: Fetch recent activity
  const recentActivity: { action: string; details: string; createdAt: string }[] = [];

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-10">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p
          className="text-sm text-[#888888] mt-1"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Agency overview
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-[#C5A55A]" />
            <div>
              <p className="text-xs font-semibold text-white">
                Total Clients
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {stats.totalClients}
              </p>
            </div>
          </div>
        </div>

        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <div className="flex items-center gap-3">
            <Briefcase size={20} className="text-[#C5A55A]" />
            <div>
              <p className="text-xs font-semibold text-white">
                Active Projects
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {stats.activeProjects}
              </p>
            </div>
          </div>
        </div>

        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <div className="flex items-center gap-3">
            <Activity size={20} className="text-[#C5A55A]" />
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
                Monthly Revenue
              </p>
              <p className="text-2xl font-bold tracking-tight">
                ${stats.monthlyRevenue.toLocaleString()}
              </p>
            </div>
          </div>
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
            href="/admin/clients"
            className="bg-black px-6 py-4 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Users size={20} className="text-[#C5A55A]" />
              <div>
                <h3 className="font-semibold text-white">Manage Clients</h3>
                <p className="text-sm text-[#888888]">
                  View, add, and edit client accounts
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/projects"
            className="bg-black px-6 py-4 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Briefcase size={20} className="text-[#C5A55A]" />
              <div>
                <h3 className="font-semibold text-white">Manage Projects</h3>
                <p className="text-sm text-[#888888]">
                  Track all agency projects
                </p>
              </div>
            </div>
          </Link>

          <a
            href="#"
            className="bg-black px-6 py-4 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement create project modal
              alert("Create project feature coming soon!");
            }}
          >
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-[#C5A55A]" />
              <div>
                <h3 className="font-semibold text-white">New Project</h3>
                <p className="text-sm text-[#888888]">
                  Start a new client project
                </p>
              </div>
            </div>
          </a>
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
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 py-3 border-b border-[#222222] last:border-b-0">
                  <div className="flex-shrink-0">
                    <Activity size={16} className="text-[#C5A55A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-1">
                      {activity.action}
                    </p>
                    <p className="text-xs text-[#888888]">
                      {activity.details}
                    </p>
                    <p className="text-xs text-[#555555]">
                      {new Date(activity.createdAt).toLocaleString()}
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
    </div>
  );
}