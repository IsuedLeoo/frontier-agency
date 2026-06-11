import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Activity,
  DollarSign,
} from "lucide-react";

export default async function ProjectsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // TODO: Fetch projects from database
  // For now, we'll use placeholder data
  const projects = [
    {
      id: 101,
      name: "Website Redesign",
      client: "Acme Corp",
      status: "in-progress",
      progress: 65,
      priority: "high",
      startDate: "2024-05-01",
      dueDate: "2024-07-15",
      estimatedHours: 80,
      loggedHours: 52,
    },
    {
      id: 102,
      name: "SEO Optimization",
      client: "Acme Corp",
      status: "completed",
      progress: 100,
      priority: "medium",
      startDate: "2024-04-15",
      dueDate: "2024-05-30",
      completedDate: "2024-05-25",
      estimatedHours: 40,
      loggedHours: 38,
    },
    {
      id: 103,
      name: "Social Media Setup",
      client: "Beta LLC",
      status: "planning",
      progress: 10,
      priority: "low",
      startDate: "2024-06-15",
      dueDate: "2024-07-01",
      estimatedHours: 20,
      loggedHours: 2,
    },
    {
      id: 104,
      name: "Custom Integration",
      client: "Gamma Inc",
      status: "in-progress",
      progress: 30,
      priority: "high",
      startDate: "2024-06-01",
      dueDate: "2024-08-15",
      estimatedHours: 120,
      loggedHours: 36,
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Projects
        </h1>
        <Link
          href="/admin/projects/new"
          className="bg-[#C5A55A] px-6 py-3 rounded-sm font-medium hover:bg-[#D4B07A] transition-colors duration-200"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <Plus size={16} className="mr-2" />
          New Project
        </Link>
      </div>

      {/* Search and filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
              style={{ fontFamily: "var(--font-inter)" }}
            />
          </div>
          <div className="flex sm:flex-row flex-col gap-3 w-full sm:w-auto">
            <select
              className="px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects table */}
      <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
        {projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#222222]">
              <thead>
                <tr className="bg-[#1a1a1a]">
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Project
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Client
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Priority
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Progress
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Timeline
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Hours
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-[#1a1a1a]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {project.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {project.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          project.status === "in-progress"
                            ? "bg-[#f59e0b] text-white"
                            : project.status === "completed"
                            ? "bg-[#10b981] text-white"
                            : project.status === "planning"
                            ? "bg-[#6366f1] text-white"
                            : project.status === "on-hold"
                            ? "bg-[#8b5cf6] text-white"
                            : "bg-[#ef4444] text-white"
                        }`}
                      >
                        {project.status
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          project.priority === "low"
                            ? "bg-[#6b7280] text-white"
                            : project.priority === "medium"
                            ? "bg-[#f59e0b] text-white"
                            : project.priority === "high"
                            ? "bg-[#ef4444] text-white"
                            : "bg-[#dc2626] text-white"
                        }`}
                      >
                        {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-[60px] bg-[#222222] rounded-full h-2"
                        >
                          <div
                            className="bg-[#C5A55A] h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-[#888888]">
                          {project.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#888888]">
                      {new Date(project.startDate).toLocaleDateString()} -
                      {new Date(project.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#CCCCCC]">
                      {project.loggedHours}/{project.estimatedHours} hrs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-[#888888] hover:text-[#C5A55A] transition-colors duration-200"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => {
                          // TODO: Implement delete confirmation
                          if (
                            window.confirm(
                              `Are you sure you want to delete ${project.name}?`
                            )
                          ) {
                            alert("Delete functionality coming soon!");
                          }
                        }}
                        className="text-[#ef4444] hover:text-[#f87171] transition-colors duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-[#888888] text-center py-8">
            No projects found
          </p>
        )}
      </div>
    </div>
  );
}