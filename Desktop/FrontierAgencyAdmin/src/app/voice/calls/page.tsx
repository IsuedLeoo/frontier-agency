import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import { getDb, voiceCallsQueries } from "@/lib/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

export default async function VoiceCallsPage() {
  const user = await requireAdmin();
  const { env } = getCloudflareContext();
  const db = env.frontier_agency_db as D1Database;

  const calls = await voiceCallsQueries.listAll(db, 50);

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Call History</h1>
          <p className="text-sm text-gray-400 mt-1">
            All inbound and outbound calls. {calls.results?.length ?? 0} total.
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a] text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Direction</th>
                <th className="text-left px-4 py-3">To/From</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Duration</th>
                <th className="text-left px-4 py-3">Summary</th>
              </tr>
            </thead>
            <tbody>
              {(calls.results ?? []).map((call) => (
                <tr key={call.id} className="border-b border-[#1a1a1a]/50 hover:bg-white/5">
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    {new Date(call.created_at).toLocaleDateString("en-US", {
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
                    <StatusBadge status={call.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {call.duration_seconds
                      ? `${Math.floor(call.duration_seconds / 60)}:${String(call.duration_seconds % 60).padStart(2, "0")}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 max-w-xs truncate">
                    {call.summary || call.transcript?.slice(0, 80) || "—"}
                  </td>
                </tr>
              ))}
              {(calls.results ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No calls yet. Place a test call to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: "bg-green-500/20 text-green-400",
    in_progress: "bg-yellow-500/20 text-yellow-400",
    failed: "bg-red-500/20 text-red-400",
    initiated: "bg-blue-500/20 text-blue-400",
    queued: "bg-gray-500/20 text-gray-400",
    no_answer: "bg-orange-500/20 text-orange-400",
    busy: "bg-orange-500/20 text-orange-400",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        colors[status] || "bg-gray-500/20 text-gray-400"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
