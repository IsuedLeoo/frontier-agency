"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Eye,
  MousePointer,
  TrendingUp,
  Globe,
  Clock,
} from "lucide-react";

interface AnalyticsData {
  ok: boolean;
  range: number;
  totalEvents: number;
  pageviewsByDay: { day: string; views: number }[];
  topPages: { page_path: string; views: number }[];
  uniqueVisitors: { day: string; visitors: number }[];
  eventCounts: { event_type: string; count: number }[];
  recentEvents: {
    id: string;
    event_type: string;
    event_name: string | null;
    page_path: string | null;
    fingerprint: string | null;
    created_at: string;
  }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [range, setRange] = useState("30");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/analytics/stats?range=${range}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) {
          setData(json);
        } else {
          setError(json.error || "Failed to load analytics");
        }
      })
      .catch(() => setError("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, [range]);

  const totalPageviews = data?.pageviewsByDay.reduce((sum, d) => sum + d.views, 0) || 0;
  const totalVisitors = data?.uniqueVisitors
    ? new Set(data.uniqueVisitors.map((v) => v.visitors)).size
    : 0;
  const totalUniqueFingerprints = data?.uniqueVisitors
    ? data.uniqueVisitors.reduce((max, v) => Math.max(max, v.visitors), 0)
    : 0;

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Analytics
          </h1>
          <p
            className="text-sm text-[#888888] mt-1"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Site traffic and visitor insights
          </p>
        </div>
        <div className="flex gap-2">
          {["7", "30", "90"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg border transition-colors duration-200 ${
                range === r
                  ? "bg-[#C5A55A] text-black border-[#C5A55A]"
                  : "bg-transparent text-[#888888] border-[#333333] hover:border-[#C5A55A] hover:text-white"
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-20">
          <p className="text-sm text-[#888888]">Loading analytics...</p>
        </div>
      )}

      {error && (
        <div className="bg-black p-6 rounded-xl border border-red-500/30">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {data && !loading && (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-black p-6 rounded-xl border border-[#333333]">
              <div className="flex items-center gap-3">
                <Eye size={20} className="text-[#C5A55A]" />
                <div>
                  <p className="text-xs font-semibold text-white">Pageviews</p>
                  <p className="text-2xl font-bold tracking-tight">
                    {totalPageviews.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black p-6 rounded-xl border border-[#333333]">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-[#C5A55A]" />
                <div>
                  <p className="text-xs font-semibold text-white">Unique Visitors</p>
                  <p className="text-2xl font-bold tracking-tight">
                    {totalUniqueFingerprints.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black p-6 rounded-xl border border-[#333333]">
              <div className="flex items-center gap-3">
                <MousePointer size={20} className="text-[#C5A55A]" />
                <div>
                  <p className="text-xs font-semibold text-white">Total Events</p>
                  <p className="text-2xl font-bold tracking-tight">
                    {data.totalEvents.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black p-6 rounded-xl border border-[#333333]">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-[#C5A55A]" />
                <div>
                  <p className="text-xs font-semibold text-white">Top Page</p>
                  <p className="text-lg font-bold tracking-tight truncate">
                    {data.topPages[0]?.page_path || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Event breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-black p-6 rounded-xl border border-[#333333]">
              <h2
                className="text-lg font-semibold tracking-tight mb-4"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Events by Type
              </h2>
              {data.eventCounts.length > 0 ? (
                <div className="space-y-3">
                  {data.eventCounts.map((ec) => {
                    const maxCount = Math.max(...data.eventCounts.map((e) => e.count));
                    const pct = maxCount > 0 ? (ec.count / maxCount) * 100 : 0;
                    return (
                      <div key={ec.event_type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#888888] capitalize">
                            {ec.event_type}
                          </span>
                          <span className="text-white font-medium">
                            {ec.count.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 bg-[#222222] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C5A55A] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[#888888] text-center py-8">
                  No events recorded yet
                </p>
              )}
            </div>

            <div className="bg-black p-6 rounded-xl border border-[#333333]">
              <h2
                className="text-lg font-semibold tracking-tight mb-4"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Top Pages
              </h2>
              {data.topPages.length > 0 ? (
                <div className="space-y-3">
                  {data.topPages.map((page, i) => (
                    <div
                      key={page.page_path}
                      className="flex items-center gap-3 py-2 border-b border-[#222222] last:border-b-0"
                    >
                      <span className="text-xs text-[#555555] w-5 text-right">
                        {i + 1}
                      </span>
                      <Globe size={14} className="text-[#C5A55A] flex-shrink-0" />
                      <span className="text-sm text-white flex-1 truncate">
                        {page.page_path}
                      </span>
                      <span className="text-xs text-[#888888]">
                        {page.views.toLocaleString()} views
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#888888] text-center py-8">
                  No pageviews recorded yet
                </p>
              )}
            </div>
          </div>

          {/* Pageviews chart (simple bar visualization) */}
          <div className="bg-black p-6 rounded-xl border border-[#333333] mb-10">
            <h2
              className="text-lg font-semibold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Pageviews ({data.range} days)
            </h2>
            {data.pageviewsByDay.length > 0 ? (
              <>
                <div className="flex items-end gap-1 h-40">
                  {data.pageviewsByDay.map((d) => {
                    const maxViews = Math.max(...data.pageviewsByDay.map((p) => p.views));
                    const height = maxViews > 0 ? (d.views / maxViews) * 100 : 0;
                    return (
                      <div
                        key={d.day}
                        className="flex-1 flex flex-col items-center justify-end group relative"
                      >
                        <div className="absolute -top-8 bg-[#333333] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {d.day}: {d.views} views
                        </div>
                        <div
                          className="w-full bg-[#C5A55A] rounded-t-sm min-h-[2px] transition-all duration-300 hover:bg-[#d4b46a]"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-1 mt-2">
                  {data.pageviewsByDay.map((d) => (
                    <div
                      key={d.day}
                      className="flex-1 text-center text-[10px] text-[#555555] truncate"
                    >
                      {d.day.slice(5)}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-[#888888] text-center py-8">
                No pageview data yet
              </p>
            )}
          </div>

          {/* Recent events */}
          <div className="mb-10">
            <h2
              className="text-lg font-semibold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Recent Events
            </h2>
            <div className="bg-black rounded-xl border border-[#333333] overflow-hidden">
              {data.recentEvents.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#333333]">
                      <th className="text-left text-xs font-medium text-[#888888] uppercase tracking-wider px-6 py-3">
                        Type
                      </th>
                      <th className="text-left text-xs font-medium text-[#888888] uppercase tracking-wider px-6 py-3">
                        Event
                      </th>
                      <th className="text-left text-xs font-medium text-[#888888] uppercase tracking-wider px-6 py-3">
                        Page
                      </th>
                      <th className="text-left text-xs font-medium text-[#888888] uppercase tracking-wider px-6 py-3">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentEvents.map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-[#222222] last:border-b-0"
                      >
                        <td className="px-6 py-3">
                          <span className="text-xs font-medium text-[#C5A55A] uppercase">
                            {event.event_type}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-white">
                          {event.event_name || "—"}
                        </td>
                        <td className="px-6 py-3 text-sm text-[#888888] truncate max-w-[200px]">
                          {event.page_path || "—"}
                        </td>
                        <td className="px-6 py-3 text-xs text-[#555555]">
                          {new Date(event.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-[#888888] text-center py-8">
                  No events recorded yet. Analytics will appear here once visitors browse the site.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
