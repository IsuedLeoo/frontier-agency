import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import {
  Briefcase,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
} from "lucide-react";

export default async function DashboardProjectsPage() {
  const session = await getSession(await headers());

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  // TODO: Fetch client projects from database
  // For now, we'll use placeholder data
  const projects = [
    {
      id: 101,
      name: "Website Redesign",
      status: "in-progress",
      progress: 65,
      startDate: "2024-05-01",
      dueDate: "2024-07-15",
      lastUpdated: "2024-06-10",
      services: ["Web Design", "SEO Optimization"],
    },
    {
      id: 102,
      name: "Social Media Management",
      status: "active",
      progress: 80,
      startDate: "2024-03-15",
      dueDate: "2024-12-31",
      lastUpdated: "2024-06-08",
      services: ["Content Creation", "Community Management"],
    },
    {
      id: 103,
      name: "Email Marketing Campaign",
      status: "completed",
      progress: 100,
      startDate: "2024-04-01",
      dueDate: "2024-05-30",
      completedDate: "2024-05-25",
      lastUpdated: "2024-05-25",
      services: ["Email Marketing", "Copywriting"],
    },
    {
      id: 104,
      name: "CRM Implementation",
      status: "planning",
      progress: 20,
      startDate: "2024-07-01",
      dueDate: "2024-09-15",
      lastUpdated: "2024-06-05",
      services: ["Process Automation", "Data Migration"],
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Your Projects
        </h1>
        <Link
          href="/dashboard/projects/new"
          className="bg-[#C5A55A] px-6 py-3 rounded-sm font-medium hover:bg-[#D4B07A] transition-colors duration-200"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <Zap size={16} className="mr-2" />
          New Project
        </Link>
      </div>

      {/* Projects grid */}
      <div className="grid gap-6">
        {/* Mobile: single column */}
        {/* Tablet: two columns */}
        {/* Desktop: three columns */}
        <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="reveal bg-black p-6 rounded-xl border border-[#333333]"
            >
              <div className="space-y-4">
                {/* Project header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2
                      className="text-lg font-semibold tracking-tight"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {project.name}
                    </h2>
                    <p className="text-sm text-[#888888] mt-1">
                      {project.services.join(" • ")}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      project.status === "in-progress"
                        ? "bg-[#f59e0b] text-white"
                        : project.status === "completed"
                        ? "bg-[#10b981] text-white"
                        : project.status === "planning"
                        ? "bg-[#6366f1] text-white"
                        : project.status === "active"
                        ? "bg-[#8b5cf6] text-white"
                        : "bg-[#ef4444] text-white"
                    }`}
                  >
                    {project.status
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="w-[80px] shrink-0">
                    <Activity size={16} className="text-[#C5A55A]" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-[#222222] rounded-full h-2.5">
                      <div
                        className="bg-[#C5A55A] h-2.5 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-[#888888] mt-1">
                      <span>{project.progress}%</span>
                      <span>
                        Estimated:{" "}
                        {new Date(project.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Project details */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock size={14} className="text-[#C5A55A] mt-0.5" />
                    <div className="text-sm text-[#888888]">
                      Started:{" "}
                      {new Date(project.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={14} className="text-[#C5A55A] mt-0.5" />
                    <div className="text-sm text-[#888888]">
                      Due:{" "}
                      {new Date(project.dueDate).toLocaleDateString()}
                      {project.status === "completed" && (
                        <span className="ml-2 text-xs text-[#10b981]">
                          Completed
                        </span>
                      )}
                      {project.status === "in-progress" && new Date() > new Date(project.dueDate) && (
                        <span className="ml-2 text-xs text-[#ef4444]">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={14} className="text-[#C5A55A] mt-0.5" />
                    <div className="text-sm text-[#888888]">
                      Last updated:{" "}
                      {new Date(project.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white border-l-2 border-transparent hover:border-[#C5A55A] transition-colors duration-200 px-3 py-1.5"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    View Details
                  </Link>
                  {project.status === "completed" ? (
                    <button
                      onClick={() => {
                        // TODO: Implement reopen project
                        alert("Reopen project feature coming soon!");
                      }}
                      className="text-xs font-medium uppercase tracking-[0.04em] text-[#10b981] hover:text-[#34d399] transition-colors duration-200 px-3 py-1.5"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Reopen
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // TODO: Implement complete project
                        alert("Complete project feature coming soon!");
                      }}
                      className="bg-[#C5A55A] px-4 py-1.5 rounded-sm font-medium text-xs hover:bg-[#D4B07A] transition-colors duration-200"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="reveal bg-black p-12 rounded-xl border border-[#333333] text-center">
          <Briefcase size={32} className="mx-auto mb-4 text-[#333333]" />
          <h2 className="text-lg font-semibold tracking-tight mb-3">
            No projects yet
          </h2>
          <p className="text-sm text-[#888888] max-w-[320px]">
            Start your first project to see it appear here.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="mt-6 inline-block bg-[#C5A55A] px-6 py-3 rounded-sm font-medium hover:bg-[#D4B07A] transition-colors duration-200"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <Zap size={16} className="mr-2" />
            Create First Project
          </Link>
        </div>
      )}
    </div>
  );
}