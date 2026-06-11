import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Mail,
  Briefcase,
  Activity,
  Clock,
  DollarSign,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default async function ClientPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const clientId = parseInt(params.id);

  // TODO: Fetch client from database
  // For now, we'll use placeholder data
  const client = {
    id: clientId,
    name: "Acme Corp",
    email: "contact@acme.com",
    phone: "+1 (555) 123-4567",
    website: "https://acme.com",
    status: "active",
    plan: "pro",
    createdAt: "2024-01-15",
    lastLogin: "2024-06-10",
    billing: {
      nextInvoice: "2024-06-15",
      amount: 299,
      currency: "USD",
    },
  };

  // TODO: Fetch client projects
  const projects = [
    {
      id: 101,
      name: "Website Redesign",
      status: "in-progress",
      progress: 65,
      startDate: "2024-05-01",
      dueDate: "2024-07-15",
    },
    {
      id: 102,
      name: "SEO Optimization",
      status: "completed",
      progress: 100,
      startDate: "2024-04-15",
      dueDate: "2024-05-30",
      completedDate: "2024-05-25",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {client.name}
        </h1>
        <div className="flex gap-3">
          <Link
            href="/admin/clients"
            className="text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white border-l-2 border-transparent hover:border-[#C5A55A] transition-colors duration-200 px-3 py-2.5"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ← Back to Clients
          </Link>
          <Link
            href={`/admin/clients/${clientId}/edit`}
            className="bg-[#C5A55A] px-4 py-2 rounded-sm font-medium hover:bg-[#D4B07A] transition-colors duration-200 text-xs"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Edit
          </Link>
        </div>
      </div>

      {/* Client info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Overview */}
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <h2 className="text-lg font-semibold mb-4">
            Overview
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Users size={16} className="text-[#C5A55A] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {client.name}
                </p>
                <p className="text-xs text-[#888888]">
                  {client.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={16} className="text-[#C5A55A] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {client.website}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity size={16} className="text-[#C5A55A] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {client.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <h2 className="text-lg font-semibold mb-4">
            Account Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle
                size={16}
                className={`text-[#10b981] ${
                  client.status === "active" ? "" : "text-[#666666]"
                }`}
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  Status
                </p>
                <p className={`text-xs ${
                  client.status === "active"
                    ? "text-[#10b981]"
                    : client.status === "trial"
                    ? "text-[#f59e0b]"
                    : "text-[#ef4444]"
                }`}>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Plan
                </p>
                <p className="text-sm text-[#CCCCCC]">
                  {client.plan.charAt(0).toUpperCase() + client.plan.slice(1)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Member Since
                </p>
                <p className="text-xs text-[#888888]">
                  {new Date(client.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Last Login
                </p>
                <p className="text-xs text-[#888888]">
                  {new Date(client.lastLogin).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          <h2 className="text-lg font-semibold mb-4">
            Billing
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <DollarSign size={16} className="text-[#C5A55A]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Next Invoice
                </p>
                <p className="text-2xl font-bold tracking-tight text-white">
                  ${client.billing.amount}
                </p>
                <p className="text-xs text-[#888888]">
                  Due {new Date(client.billing.nextInvoice).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle size={16} className="text-[#f59e0b]" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Currency
                </p>
                <p className="text-sm text-[#CCCCCC]">
                  {client.billing.currency}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="mb-10">
        <h2
          className="text-lg font-semibold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Projects
        </h2>
        <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="flex items-start gap-3 py-3 border-b border-[#222222] last:border-b-0">
                  <div className="flex-shrink-0">
                    <Briefcase size={16} className="text-[#C5A55A]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-white">
                        {project.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          project.status === "in-progress"
                            ? "bg-[#f59e0b] text-white"
                            : project.status === "completed"
                            ? "bg-[#10b981] text-white"
                            : "bg-[#ef4444] text-white"
                        }`}
                      >
                        {project.status.charAt(0).toUpperCase() +
                          project.status.slice(1)}
                      </span>
                    </div>
                    <div className="w-full bg-[#222222] rounded-full h-2 mb-2">
                      <div
                        className="bg-[#C5A55A] h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-[#888888]">
                      <span>
                        {project.progress}%
                      </span>
                      <span>
                        {new Date(project.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#888888] text-center py-8">
              No projects found for this client
            </p>
          )}
        </div>
      </div>
    </div>
  );
}