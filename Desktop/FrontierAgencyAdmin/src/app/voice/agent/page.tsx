import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import { getDb, voiceCallsQueries } from "@/lib/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAgentStats } from "@/lib/voice/agent-learning";

export const dynamic = "force-dynamic";

export default async function AgentDashboardPage() {
  const user = await requireAdmin();
  const { env } = getCloudflareContext();
  const db = env.frontier_agency_db as D1Database;

  const stats = await getAgentStats(db);
  const recentCalls = await voiceCallsQueries.listAll(db, 10);

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Agent Performance</h1>
          <p className="text-sm text-gray-400 mt-1">
            Alex&apos;s learning progress and call analytics.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Calls" value={String(stats.totalCalls)} />
          <StatCard label="Bookings" value={String(stats.bookings)} />
          <StatCard
            label="Booking Rate"
            value={`${stats.bookingRate.toFixed(1)}%`}
            highlight={stats.bookingRate > 20}
          />
          <StatCard
            label="Recent Rate"
            value={`${stats.recentBookingRate.toFixed(1)}%`}
            sublabel="last 10 calls"
          />
        </div>

        {/* Trend */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Learning Trend</h2>
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                stats.trendDirection === "improving"
                  ? "bg-green-500/20"
                  : stats.trendDirection === "declining"
                  ? "bg-red-500/20"
                  : "bg-yellow-500/20"
              }`}
            >
              {stats.trendDirection === "improving"
                ? "📈"
                : stats.trendDirection === "declining"
                ? "📉"
                : "➡️"}
            </div>
            <div>
              <p className="text-white font-medium capitalize">{stats.trendDirection}</p>
              <p className="text-sm text-gray-400">
                {stats.trendDirection === "improving"
                  ? "Alex is getting better at booking appointments!"
                  : stats.trendDirection === "declining"
                  ? "Booking rate dropping — may need prompt adjustments."
                  : "Performance is stable. Keep running calls to improve."}
              </p>
            </div>
          </div>
        </div>

        {/* Performance Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Call Breakdown</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Completed Calls</span>
                <span className="text-white">{stats.completedCalls}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg Duration</span>
                <span className="text-white">
                  {stats.avgDuration > 0
                    ? `${Math.floor(stats.avgDuration / 60)}m ${stats.avgDuration % 60}s`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Calls</span>
                <span className="text-white">{stats.totalCalls}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Learning Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Auto-Dialer</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Calls Per Day</span>
                <span className="text-white">5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Learning Engine</span>
                <span className="text-green-400">Running</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Calls */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-lg font-semibold text-white">Recent Calls</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a] text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Time</th>
                <th className="text-left px-4 py-3">Direction</th>
                <th className="text-left px-4 py-3">Number</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Summary</th>
              </tr>
            </thead>
            <tbody>
              {(recentCalls.results ?? []).map((call) => (
                <tr key={call.id} className="border-b border-[#1a1a1a]/50 hover:bg-white/5">
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap text-xs">
                    {new Date(call.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        call.direction === "outbound"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {call.direction === "outbound" ? "OUT" : "IN"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 font-mono text-xs">
                    {call.direction === "outbound" ? call.to_number : call.from_number}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        call.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : call.status === "failed"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {call.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 max-w-xs truncate text-xs">
                    {call.summary || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
  sublabel,
  highlight,
}: {
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
      <p
        className={`text-2xl font-bold mt-1 ${
          highlight ? "text-green-400" : "text-white"
        }`}
      >
        {value}
      </p>
      {sublabel && <p className="text-xs text-gray-500 mt-1">{sublabel}</p>}
    </div>
  );
}
