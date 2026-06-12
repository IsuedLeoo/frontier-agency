import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Activity,
  Clock,
  DollarSign,
  CheckCircle,
  Trash2,
  Edit,
  AlertTriangle,
} from "lucide-react";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession(await headers());

  if (!session) {
    redirect("/login");
  }

  const projectId = parseInt(params.id);

  // TODO: Fetch project from database
  // For now, we'll use placeholder data
  const project = {
    id: projectId,
    name: "Website Redesign",
    client: {
      id: 1,
      name: "Acme Corp",
      email: "contact@acme.com",
    },
    description: "Complete redesign of company website with modern UI/UX principles",
    status: "in-progress",
    progress: 65,
    priority: "high",
    startDate: "2024-05-01",
    dueDate: "2024-07-15",
    estimatedHours: 80,
    loggedHours: 52,
    budget: 5000,
    spent: 3250,
  };

  // TODO: Fetch project tasks/activity
  const tasks = [
    {
      id: 1,
      title: "Wireframe homepage",
      completed: true,
      assignee: "Alex Designer",
      dueDate: "2024-05-05",
    },
    {
      id: 2,
      title: "Design homepage mockups",
      completed: true,
      assignee: "Alex Designer",
      dueDate: "2024-05-10",
    },
    {
      id: 3,
      title: "Frontend development",
      completed: false,
      assignee: "Sam Developer",
      dueDate: "2024-06-20",
    },
    {
      id: 4,
      title: "Backend API integration",
      completed: false,
      assignee: "Sam Developer",
      dueDate: "2024-06-25",
    },
    {
      id: 5,
      title: "Quality assurance testing",
      completed: false,
      assignee: "Taylor QA",
      dueDate: "2024-07-10",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {project.name}
        </h1>
        <div className="flex gap-3">
          <Link
            href="/admin/projects"
            className="text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white border-l-2 border-transparent hover:border-[#C5A55A] transition-colors duration-200 px-3 py-2.5"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ← Back to Projects
          </Link>
          <Link
            href={`/admin/projects/${projectId}/edit`}
            className="bg-[#C5A55A] px-4 py-2 rounded-sm font-medium hover:bg-[#D4B07A] transition-colors duration-200 text-xs"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Edit
          </Link>
        </div>
      </div>

      {/* Project overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Info */}
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <h2 className="text-lg font-semibold mb-4">
            Project Info
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Briefcase size={16} className="text-[#C5A55A] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {project.name}
                </p>
                <p className="text-xs text-[#888888]">
                  For {project.client.name}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users size={16} className="text-[#C5A55A] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Client
                </p>
                <p className="text-xs text-[#888888]">
                  {project.client.name}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity size={16} className="text-[#C5A55A] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Description
                </p>
                <p className="text-sm text-[#CCCCCC] line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <h2 className="text-lg font-semibold mb-4">
            Progress & Timeline
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle
                size={16}
                className={`text-[#10b981] ${
                  project.status === "completed" ? "" : "text-[#666666]"
                }`}
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  Status
                </p>
                <p className={`text-xs ${
                  project.status === "in-progress"
                    ? "text-[#f59e0b]"
                    : project.status === "completed"
                    ? "text-[#10b981]"
                    : project.status === "planning"
                    ? "text-[#6366f1]"
                    : "text-[#ef4444]"
                }`}>
                  {project.status
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Budget
                </p>
                <p className="text-2xl font-bold tracking-tight text-white">
                  ${project.budget}
                </p>
                <p className="text-xs text-[#888888]">
                  Spent: ${project.spent}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Start Date
                </p>
                <p className="text-xs text-[#888888]">
                  {new Date(project.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Due Date
                </p>
                <p className="text-xs text-[#888888]">
                  {new Date(project.dueDate).toLocaleDateString()}
                </p>
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
          </div>
        </div>

        {/* Metrics */}
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <h2 className="text-lg font-semibold mb-4">
            Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Progress
                </p>
                <div className="flex-1 mt-1">
                  <div className="w-full bg-[#222222] rounded-full h-3">
                    <div
                      className="bg-[#C5A55A] h-3 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-[#888888] text-right mt-1">
                    {project.progress}%
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle size={16} className="text-[#f59e0b]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Priority
                </p>
                <p className={`text-sm ${
                  project.priority === "low"
                    ? "text-[#6b7280]"
                    : project.priority === "medium"
                    ? "text-[#f59e0b]"
                    : "text-[#ef4444]"
                }`}>
                  {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Time Tracking
                </p>
                <p className="text-sm text-[#CCCCCC]">
                  {project.loggedHours}/{project.estimatedHours} hrs
                </p>
                <p className="text-xs text-[#888888]">
                  {(project.loggedHours / project.estimatedHours) * 100}%
                  of estimated time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="mb-10">
        <h2
          className="text-lg font-semibold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Tasks
        </h2>
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 py-2">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        task.completed ? "bg-[#10b981]" : "bg-[#666666]"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-white">
                        {task.title}
                      </h3>
                      <span className="text-xs text-[#888888]">
                        {task.assignee}
                      </span>
                    </div>
                    <p className="text-xs text-[#888888]">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#888888] text-center py-8">
              No tasks found for this project
            </p>
          )}
        </div>
      </div>
    </div>
  );
}