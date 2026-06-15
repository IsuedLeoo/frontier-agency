import { getDb, analyticsSessionQueries, analyticsPageViewQueries, analyticsEventQueries, generateId } from "@/lib/db";
import type { AnalyticsSession } from "@/lib/types";

export const dynamic = "force-dynamic";

type DeviceType = "mobile" | "tablet" | "desktop";

interface TrackEvent {
  type: "pageview" | "event" | "pageleave";
  sessionId?: string;
  fingerprint: string;
  pagePath: string;
  pageTitle?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  duration?: number;
  scrollDepth?: number;
  eventType?: string;
  eventName?: string;
  eventData?: Record<string, unknown>;
}

function parseUserAgent(ua: string | null): { deviceType: DeviceType | null; browser: string | null; os: string | null } {
  if (!ua) return { deviceType: null, browser: null, os: null };
  const lower = ua.toLowerCase();
  const deviceType: DeviceType | null = /mobile|android|iphone|ipad/.test(lower)
    ? (/ipad|tablet/.test(lower) ? "tablet" : "mobile")
    : "desktop";
  const browser = /firefox/.test(lower) ? "Firefox" :
    /edg/.test(lower) ? "Edge" :
    /chrome/.test(lower) ? "Chrome" :
    /safari/.test(lower) ? "Safari" :
    /opera|opr/.test(lower) ? "Opera" : "Other";
  const os = /windows/.test(lower) ? "Windows" :
    /macintosh|mac os/.test(lower) ? "macOS" :
    /linux/.test(lower) ? "Linux" :
    /android/.test(lower) ? "Android" :
    /ios|iphone|ipad/.test(lower) ? "iOS" : "Other";
  return { deviceType, browser, os };
}

function parseReferrer(ref: string | null): string | null {
  if (!ref) return null;
  try {
    const url = new URL(ref);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TrackEvent[];
    if (!Array.isArray(body) || body.length === 0) {
      return Response.json({ error: "Invalid body" }, { status: 400 });
    }

    const db = getDb();
    const headers = request.headers;
    const ua = headers.get("user-agent");
    const { deviceType, browser, os } = parseUserAgent(ua);
    const country = headers.get("cf-ipcountry") || null;
    const city = headers.get("cf-ipcity") || null;
    const region = headers.get("cf-region") || null;
    const timezone = headers.get("cf-timezone") || null;
    const acceptLang = headers.get("accept-language");
    const language = acceptLang ? acceptLang.split(",")[0] : null;

    const sessionCache = new Map<string, AnalyticsSession>();

    for (const event of body) {
      const fingerprint = event.fingerprint;

      let session = sessionCache.get(fingerprint);
      if (!session) {
        const existing = await analyticsSessionQueries.findStaleSession(db, fingerprint);
        if (existing) {
          await analyticsSessionQueries.updateLastSeen(db, existing.id);
          session = {
            id: existing.id,
            fingerprint: existing.fingerprint,
            first_seen_at: existing.first_seen_at,
            last_seen_at: existing.last_seen_at,
            user_agent: existing.user_agent,
            device_type: existing.device_type,
            browser: existing.browser,
            os: existing.os,
            screen_width: existing.screen_width,
            screen_height: existing.screen_height,
            country: existing.country,
            city: existing.city,
            region: existing.region,
            timezone: existing.timezone,
            language: existing.language,
            visit_count: existing.visit_count + 1,
          };
        } else {
          const now = new Date().toISOString();
          const id = generateId();
          const newSession = {
            id,
            fingerprint,
            user_agent: ua,
            device_type: deviceType,
            browser,
            os,
            screen_width: null,
            screen_height: null,
            country,
            city,
            region,
            timezone,
            language,
          };
          await analyticsSessionQueries.create(db, newSession);
          session = { ...newSession, first_seen_at: now, last_seen_at: now, visit_count: 1 };
        }
        sessionCache.set(fingerprint, session);
      }

      const sid = session.id;

      if (event.type === "pageview") {
        const pvId = generateId();
        await analyticsPageViewQueries.create(db, {
          id: pvId,
          session_id: sid,
          page_path: event.pagePath,
          page_title: event.pageTitle || null,
          referrer: event.referrer || null,
          referrer_source: parseReferrer(event.referrer || null),
          utm_source: event.utmSource || null,
          utm_medium: event.utmMedium || null,
          utm_campaign: event.utmCampaign || null,
          utm_term: event.utmTerm || null,
          utm_content: event.utmContent || null,
        });
        await analyticsPageViewQueries.markSessionNotBounce(db, sid);
      } else if (event.type === "pageleave") {
        const duration = event.duration || 0;
        const scroll = event.scrollDepth || 0;
        const lastPv = await db.prepare(
          "SELECT id FROM analytics_page_views WHERE session_id = ? AND duration_seconds IS NULL ORDER BY viewed_at DESC LIMIT 1"
        ).bind(sid).first<{ id: string } | null>();
        if (lastPv) {
          await analyticsPageViewQueries.updateDuration(db, lastPv.id, Math.round(duration), Math.min(scroll, 100));
        }
      } else if (event.type === "event") {
        await analyticsEventQueries.create(db, {
          id: generateId(),
          session_id: sid,
          page_path: event.pagePath,
          event_type: event.eventType || "custom",
          event_name: event.eventName || null,
          event_data: event.eventData ? JSON.stringify(event.eventData) : null,
        });
      }
    }

    return Response.json({ ok: true }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.error("Analytics track error:", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
