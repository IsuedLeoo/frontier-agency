import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import { getDb } from "@/lib/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDialerStats, scheduleTodaysCalls } from "@/lib/voice/auto-dialer";

export const dynamic = "force-dynamic";

export default async function DialerPage() {
  const user = await requireAdmin();
  const { env } = getCloudflareContext();
  const db = env.frontier_agency_db as D1Database;

  const stats = await getDialerStats(db);

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Auto-Dialer</h1>
            <p className="text-sm text-gray-400 mt-1">
              Automatically calls 5 Miami businesses every morning.
            </p>
          </div>
          <form action="/api/voice/dialer/schedule" method="POST">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Schedule Today&apos;s Calls
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Scheduled" value={String(stats.totalScheduled)} />
          <StatCard label="Pending Today" value={String(stats.pendingToday)} />
          <StatCard label="Completed Today" value={String(stats.completedToday)} />
          <StatCard label="Failed Today" value={String(stats.failedToday)} />
        </div>

        {/* Config */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Configuration</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Calls Per Day</p>
              <p className="text-white font-medium">5</p>
            </div>
            <div>
              <p className="text-gray-400">Business Hours</p>
              <p className="text-white font-medium">9AM – 6PM Eastern</p>
            </div>
            <div>
              <p className="text-gray-400">Days</p>
              <p className="text-white font-medium">Monday – Friday</p>
            </div>
            <div>
              <p className="text-gray-400">Target Area</p>
              <p className="text-white font-medium">Miami, FL</p>
            </div>
            <div>
              <p className="text-gray-400">Agent</p>
              <p className="text-white font-medium">Alex (Outbound)</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <p className="text-green-400 font-medium">Active</p>
            </div>
          </div>
        </div>

        {/* Upcoming Calls */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-lg font-semibold text-white">Upcoming Calls</h2>
          </div>
          {stats.upcomingCalls.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a] text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Business</th>
                  <th className="text-left px-4 py-3">Phone</th>
                  <th className="text-left px-4 py-3">Scheduled</th>
                </tr>
              </thead>
              <tbody>
                {stats.upcomingCalls.map((call) => (
                  <tr key={call.id} className="border-b border-[#1a1a1a]/50 hover:bg-white/5">
                    <td className="px-4 py-3 text-white">{call.businessName}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono text-xs">{call.phone_number}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(call.scheduled_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              No upcoming calls scheduled. Click &quot;Schedule Today&apos;s Calls&quot; to get started.
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}
