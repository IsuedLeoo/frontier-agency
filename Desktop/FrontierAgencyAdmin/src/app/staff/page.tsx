import { requireAdmin } from "@/lib/auth";
import { getDb, userQueries } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import StatusBadge from "@/components/StatusBadge";
import CreateStaffForm from "./CreateStaffForm";
import DeactivateButton from "./DeactivateButton";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const user = await requireAdmin();
  const db = getDb();

  const staffRes = await userQueries.findByRole(db, "staff");
  const staff = staffRes.results ?? [];

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Staff Management
            </h2>
            <p className="text-sm text-[#888] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
              Admin-only: add, manage, and deactivate staff accounts.
            </p>
          </div>
          <CreateStaffForm />
        </div>

        <div className="card overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-[#555] py-8">
                    No staff members yet. Add your first staff member to get started.
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id}>
                    <td className="text-white">{member.name}</td>
                    <td className="text-[#888]">{member.email}</td>
                    <td>
                      <StatusBadge status={member.is_active ? "active" : "inactive"} />
                    </td>
                    <td className="text-[#888]">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      {member.is_active && member.id !== user.id && (
                        <DeactivateButton userId={member.id} />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
