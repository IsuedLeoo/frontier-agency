import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import {
  Users,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default async function ClientsPage() {
  const session = await getSession(await headers());

  if (!session) {
    redirect("/login");
  }

  // TODO: Fetch clients from database
  // For now, we'll use placeholder data
  const clients = [
    {
      id: 1,
      name: "Acme Corp",
      email: "contact@acme.com",
      status: "active",
      plan: "pro",
      createdAt: "2024-01-15",
      lastLogin: "2024-06-10",
    },
    {
      id: 2,
      name: "Beta LLC",
      email: "hello@beta.com",
      status: "trial",
      plan: "starter",
      createdAt: "2024-05-20",
      lastLogin: "2024-06-09",
    },
    {
      id: 3,
      name: "Gamma Inc",
      email: "info@gamma.com",
      status: "active",
      plan: "enterprise",
      createdAt: "2024-03-10",
      lastLogin: "2024-06-11",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Clients
        </h1>
        <Link
          href="/admin/clients/new"
          className="bg-[#C5A55A] px-6 py-3 rounded-sm font-medium hover:bg-[#D4B07A] transition-colors duration-200"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <Plus size={16} className="mr-2" />
          New Client
        </Link>
      </div>

      {/* Search and filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search clients..."
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
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              className="px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <option value="all">All Plans</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients table */}
      <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
        {clients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#222222]">
              <thead>
                <tr className="bg-[#1a1a1a]">
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Email
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
                    Plan
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Created
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-[#888888] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Last Login
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
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#1a1a1a]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          client.status === "active"
                            ? "bg-[#10b981] text-white"
                            : client.status === "trial"
                            ? "bg-[#f59e0b] text-white"
                            : "bg-[#ef4444] text-white"
                        }`}
                      >
                        {client.status.charAt(0).toUpperCase() +
                          client.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#CCCCCC]">
                      {client.plan.charAt(0).toUpperCase() + client.plan.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#888888]">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#888888]">
                      {new Date(client.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                      <Link
                        href={`/admin/clients/${client.id}`}
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
                              `Are you sure you want to delete ${client.name}?`
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
            No clients found
          </p>
        )}
      </div>
    </div>
  );
}