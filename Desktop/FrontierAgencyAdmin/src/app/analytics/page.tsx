import { requireAdmin } from "@/lib/auth";
import { getDb, analyticsStatsQueries } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import StatsCard from "@/components/StatsCard";
import { Eye, Users, Clock, TrendingDown, Globe, Monitor, Smartphone, Tablet, MousePointerClick, BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

type DateRange = "7d" | "30d" | "90d" | "all";

function getDateRange(range: DateRange): { start: string; end: string } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  switch (range) {
    case "7d":
      start.setDate(start.getDate() - 7);
      break;
    case "30d":
      start.setDate(start.getDate() - 30);
      break;
    case "90d":
      start.setDate(start.getDate() - 90);
      break;
    case "all":
      start.setFullYear(2020, 0, 1);
      break;
  }
  start.setHours(0, 0, 0, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0] + "T23:59:59",
  };
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds < 1) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

function getDeviceIcon(device: string) {
  switch (device) {
    case "mobile": return <Smartphone size={16} />;
    case "tablet": return <Tablet size={16} />;
    case "desktop": return <Monitor size={16} />;
    default: return <Globe size={16} />;
  }
}

const RANGES: { value: DateRange; label: string }[] = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "all", label: "All Time" },
];

export default async function AnalyticsPage(props: { searchParams: Promise<{ range?: string }> }) {
  const user = await requireAdmin();
  const params = await props.searchParams;
  const range: DateRange = (["7d", "30d", "90d", "all"].includes(params.range || "") ? params.range : "30d") as DateRange;
  const { start, end } = getDateRange(range);
  const db = getDb();
  const stats = analyticsStatsQueries(db, start, end);

  const [totalPageViews, uniqueVisitors, avgDuration, bounceRate, topPages, topReferrers, trafficOverTime, deviceBreakdown, browserBreakdown, countryBreakdown, scrollDepthByPage, sectionEngagement, topClicks] = await Promise.all([
    stats.totalPageViews,
    stats.uniqueVisitors,
    stats.avgDuration,
    stats.bounceRate,
    stats.topPages,
    stats.topReferrers,
    stats.trafficOverTime,
    stats.deviceBreakdown,
    stats.browserBreakdown,
    stats.countryBreakdown,
    stats.scrollDepthByPage,
    stats.sectionEngagement,
    stats.topClicks,
  ]);

  const pvCount = totalPageViews?.count ?? 0;
  const uvCount = uniqueVisitors?.count ?? 0;
  const avgDur = avgDuration?.avg ?? 0;
  const bounceR = bounceRate?.rate ?? 0;

  const trafficData = (trafficOverTime.results as { date: string; views: number; visitors: number }[] | undefined) ?? [];
  const maxTrafficViews = Math.max(...trafficData.map((d) => d.views), 1);

  const deviceData = (deviceBreakdown.results as { device: string; visitors: number }[] | undefined) ?? [];
  const totalDeviceVisitors = deviceData.reduce((sum, d) => sum + d.visitors, 0) || 1;

  const browserData = (browserBreakdown.results as { browser: string; visitors: number }[] | undefined) ?? [];
  const totalBrowserVisitors = browserData.reduce((sum, d) => sum + d.visitors, 0) || 1;

  const countryData = (countryBreakdown.results as { country: string; city: string; visitors: number }[] | undefined) ?? [];
  const pagesData = (topPages.results as { page_path: string; views: number; avg_duration: number }[] | undefined) ?? [];
  const referrersData = (topReferrers.results as { source: string; views: number }[] | undefined) ?? [];
  const scrollData = (scrollDepthByPage.results as { page_path: string; avg_depth: number; views: number }[] | undefined) ?? [];
  const sectionData = (sectionEngagement.results as { section: string; views: number; unique_visitors: number }[] | undefined) ?? [];
  const clicksData = (topClicks.results as { element: string; event_data: string | null; clicks: number }[] | undefined) ?? [];

  return (
    <AdminShell user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Analytics
            </h2>
            <p className="text-sm text-[#888] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
              Visitor behavior and site engagement
            </p>
          </div>
          {/* Date range selector */}
          <div className="flex items-center gap-1 border border-[#1a1a1a] p-1">
            {RANGES.map((r) => (
              <a
                key={r.value}
                href={`/analytics?range=${r.value}`}
                className={`px-3 py-1.5 text-xs uppercase tracking-[0.1em] transition-colors ${
                  range === r.value
                    ? "bg-[#C5A55A] text-black font-semibold"
                    : "text-[#888] hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {r.label}
              </a>
            ))}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Page Views" value={pvCount.toLocaleString()} icon="chart" />
          <StatsCard title="Unique Visitors" value={uvCount.toLocaleString()} icon="clients" />
          <StatsCard title="Avg. Time on Page" value={formatDuration(avgDur)} icon="outstanding" />
          <StatsCard title="Bounce Rate" value={`${Math.round(bounceR)}%`} icon="outstanding" />
        </div>

        {/* Traffic over time */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-[#C5A55A]" />
            <h3 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Traffic Over Time
            </h3>
          </div>
          {trafficData.length === 0 ? (
            <p className="text-sm text-[#555]">No data for this period yet.</p>
          ) : (
            <div className="space-y-1">
              {trafficData.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="text-[0.65rem] text-[#555] w-24 shrink-0 font-mono" style={{ fontFamily: "var(--font-inter)" }}>
                    {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <div className="flex-1 h-6 bg-[#111] relative">
                    <div
                      className="h-full bg-[#C5A55A]/80 transition-all"
                      style={{ width: `${Math.max((day.views / maxTrafficViews) * 100, 2)}%` }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[0.65rem] text-[#888]">
                      {day.views.toLocaleString()} views · {day.visitors} visitors
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Pages + Top Referrers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Eye size={18} className="text-[#C5A55A]" />
              <h3 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Top Pages
              </h3>
            </div>
            {pagesData.length === 0 ? (
              <p className="text-sm text-[#555]">No data yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Views</th>
                    <th>Avg. Time</th>
                  </tr>
                </thead>
                <tbody>
                  {pagesData.map((p) => (
                    <tr key={p.page_path}>
                      <td className="font-mono text-[#C5A55A] text-xs">{p.page_path}</td>
                      <td className="text-white">{p.views.toLocaleString()}</td>
                      <td className="text-[#888]">{formatDuration(p.avg_duration)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Top Referrers */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-[#C5A55A]" />
              <h3 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Top Referrers
              </h3>
            </div>
            {referrersData.length === 0 ? (
              <p className="text-sm text-[#555]">No data yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Views</th>
                  </tr>
                </thead>
                <tbody>
                  {referrersData.map((r) => (
                    <tr key={r.source}>
                      <td className="text-[#888]">{r.source}</td>
                      <td className="text-white">{r.views.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Devices + Browsers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Breakdown */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Monitor size={18} className="text-[#C5A55A]" />
              <h3 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Devices
              </h3>
            </div>
            {deviceData.length === 0 ? (
              <p className="text-sm text-[#555]">No data yet.</p>
            ) : (
              <div className="space-y-3">
                {deviceData.map((d) => {
                  const pct = Math.round((d.visitors / totalDeviceVisitors) * 100);
                  return (
                    <div key={d.device}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-sm text-[#888]">
                          {getDeviceIcon(d.device)}
                          <span className="capitalize">{d.device}</span>
                        </div>
                        <span className="text-sm text-white">{d.visitors} <span className="text-[#555]">({pct}%)</span></span>
                      </div>
                      <div className="h-2 bg-[#111]">
                        <div className="h-full bg-[#C5A55A]/70" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Browser Breakdown */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-[#C5A55A]" />
              <h3 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Browsers
              </h3>
            </div>
            {browserData.length === 0 ? (
              <p className="text-sm text-[#555]">No data yet.</p>
            ) : (
              <div className="space-y-3">
                {browserData.map((b) => {
                  const pct = Math.round((b.visitors / totalBrowserVisitors) * 100);
                  return (
                    <div key={b.browser}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-[#888]">{b.browser}</span>
                        <span className="text-sm text-white">{b.visitors} <span className="text-[#555]">({pct}%)</span></span>
                      </div>
                      <div className="h-2 bg-[#111]">
                        <div className="h-full bg-[#C5A55A]/70" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top Locations + Section Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Locations */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-[#C5A55A]" />
              <h3 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Top Locations
              </h3>
            </div>
            {countryData.length === 0 ? (
              <p className="text-sm text-[#555]">No data yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {countryData.map((c, i) => (
                    <tr key={`${c.country}-${c.city}-${i}`}>
                      <td className="text-[#888]">
                        {c.city ? `${c.city}, ${c.country}` : c.country}
                      </td>
                      <td className="text-white">{c.visitors.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Section Engagement */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={18} className="text-[#C5A55A]" />
              <h3 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Section Engagement
              </h3>
            </div>
            {sectionData.length === 0 ? (
              <p className="text-sm text-[#555]">
                No section data yet. Add <code className="text-[#C5A55A]">data-section</code> attributes to page sections to track visibility.
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Views</th>
                    <th>Unique</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionData.map((s) => (
                    <tr key={s.section}>
                      <td className="text-[#C5A55A] font-mono text-xs">{s.section}</td>
                      <td className="text-white">{s.views.toLocaleString()}</td>
                      <td className="text-[#888]">{s.unique_visitors.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Scroll Depth + Top Clicks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scroll Depth */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={18} className="text-[#C5A55A]" />
              <h3 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Scroll Depth by Page
              </h3>
            </div>
            {scrollData.length === 0 ? (
              <p className="text-sm text-[#555]">No scroll data yet.</p>
            ) : (
              <div className="space-y-3">
                {scrollData.map((s) => (
                  <div key={s.page_path}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-[#C5A55A]">{s.page_path}</span>
                      <span className="text-sm text-white">{Math.round(s.avg_depth)}%</span>
                    </div>
                    <div className="h-2 bg-[#111]">
                      <div className="h-full bg-[#C5A55A]/70" style={{ width: `${Math.round(s.avg_depth)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Clicks */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <MousePointerClick size={18} className="text-[#C5A55A]" />
              <h3 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Top Clicks
              </h3>
            </div>
            {clicksData.length === 0 ? (
              <p className="text-sm text-[#555]">
                No click data yet. Add <code className="text-[#C5A55A]">data-track</code> attributes to buttons and links to track clicks.
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Element</th>
                    <th>Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {clicksData.map((c, i) => (
                    <tr key={`${c.element}-${i}`}>
                      <td className="text-[#888] text-xs">
                        {c.element}
                        {c.event_data && <span className="text-[#555] ml-1">{c.event_data}</span>}
                      </td>
                      <td className="text-white">{c.clicks.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
