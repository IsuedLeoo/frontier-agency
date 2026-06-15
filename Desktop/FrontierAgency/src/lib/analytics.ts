// Frontier Agency — Client-side analytics tracker
// Lightweight, privacy-friendly, no third-party cookies

const ANALYTICS_ENDPOINT = "https://admin.frontieragency.gstudios.dev/api/analytics/track";
const BATCH_INTERVAL = 5000; // Flush every 5s
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

interface QueuedEvent {
  type: "pageview" | "event" | "pageleave";
  fingerprint: string;
  sessionId?: string;
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

let eventQueue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let currentPageStart: number = Date.now();
let maxScrollDepth: number = 0;
let pageviewId: string | null = null;
let sessionId: string | null = null;
let initialized: boolean = false;

// ─── Fingerprinting (anonymous, no cookies) ─────────────────────────────────

function generateFingerprint(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 50;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 200, 50);
    ctx.fillStyle = "#fff";
    ctx.font = "14px Inter, system-ui, sans-serif";
    ctx.fillText("FA-" + navigator.userAgent.slice(0, 30), 5, 30);
  }
  const canvasData = canvas.toDataURL();
  const raw = [
    canvasData,
    navigator.language,
    screen.width + "x" + screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency || 0,
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 0,
  ].join("|");
  // Simple hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return "fp_" + Math.abs(hash).toString(36);
}

// ─── UTM Parsing ─────────────────────────────────────────────────────────────

function getUTMParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  const result: Record<string, string> = {};
  for (const key of utmKeys) {
    const val = params.get(key);
    if (val) result[key] = val;
  }
  return result;
}

// ─── Scroll Tracking ─────────────────────────────────────────────────────────

function getScrollDepth(): number {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  );
  const winHeight = window.innerHeight;
  if (docHeight <= winHeight) return 100;
  return Math.round((scrollTop / (docHeight - winHeight)) * 100);
}

function trackScroll(): void {
  const depth = getScrollDepth();
  if (depth > maxScrollDepth) {
    maxScrollDepth = depth;
  }
}

// ─── Section Visibility Tracking ─────────────────────────────────────────────

const observedSections = new Set<string>();

function initSectionObserver(): void {
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const sectionName = entry.target.getAttribute("data-section");
          if (sectionName && !observedSections.has(sectionName)) {
            observedSections.add(sectionName);
            queueEvent({
              type: "event",
              fingerprint: generateFingerprint(),
              sessionId: sessionId || undefined,
              pagePath: window.location.pathname,
              eventType: "section_view",
              eventName: sectionName,
            });
          }
        }
      }
    },
    { threshold: 0.3 }
  );
  document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
}

// ─── Click Tracking ──────────────────────────────────────────────────────────

function initClickTracking(): void {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    // Track elements with data-track attribute
    const trackEl = target.closest("[data-track]") as HTMLElement | null;
    if (trackEl) {
      const name = trackEl.getAttribute("data-track") || trackEl.textContent?.trim().slice(0, 50) || "unknown";
      const data = trackEl.getAttribute("data-track-data") || undefined;
      queueEvent({
        type: "event",
        fingerprint: generateFingerprint(),
        sessionId: sessionId || undefined,
        pagePath: window.location.pathname,
        eventType: "button_click",
        eventName: name,
        eventData: data ? { label: data } : undefined,
      });
      return;
    }
    // Track CTA buttons
    const ctaEl = target.closest("[data-cta]") as HTMLElement | null;
    if (ctaEl) {
      const name = ctaEl.getAttribute("data-cta") || ctaEl.textContent?.trim().slice(0, 50) || "cta";
      queueEvent({
        type: "event",
        fingerprint: generateFingerprint(),
        sessionId: sessionId || undefined,
        pagePath: window.location.pathname,
        eventType: "cta_click",
        eventName: name,
      });
      return;
    }
    // Track outbound links
    const linkEl = target.closest("a[href]") as HTMLAnchorElement | null;
    if (linkEl) {
      try {
        const href = new URL(linkEl.href, window.location.origin);
        if (href.hostname !== window.location.hostname) {
          queueEvent({
            type: "event",
            fingerprint: generateFingerprint(),
            sessionId: sessionId || undefined,
            pagePath: window.location.pathname,
            eventType: "outbound_click",
            eventName: href.hostname,
            eventData: { url: linkEl.href },
          });
        }
      } catch {
        // ignore invalid URLs
      }
    }
  });
}

// ─── Event Queue + Flushing ──────────────────────────────────────────────────

function queueEvent(event: Omit<QueuedEvent, "fingerprint"> & { fingerprint: string }): void {
  eventQueue.push(event);
  if (!flushTimer) {
    flushTimer = setInterval(flushEvents, BATCH_INTERVAL);
  }
}

async function flushEvents(): Promise<void> {
  if (eventQueue.length === 0) return;
  const batch = [...eventQueue];
  eventQueue = [];
  try {
    const blob = new Blob([JSON.stringify(batch)], { type: "application/json" });
    navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
  } catch {
    // Fallback to fetch
    try {
      await fetch(ANALYTICS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batch),
        keepalive: true,
      });
    } catch {
      // Silently drop — analytics should never break the site
    }
  }
}

// ─── Page View Tracking ──────────────────────────────────────────────────────

function trackPageView(): void {
  currentPageStart = Date.now();
  maxScrollDepth = 0;
  const utm = getUTMParams();
  const fingerprint = generateFingerprint();

  queueEvent({
    type: "pageview",
    fingerprint,
    sessionId: sessionId || undefined,
    pagePath: window.location.pathname + window.location.search,
    pageTitle: document.title,
    referrer: document.referrer || undefined,
    utmSource: utm.utm_source,
    utmMedium: utm.utm_medium,
    utmCampaign: utm.utm_campaign,
    utmTerm: utm.utm_term,
    utmContent: utm.utm_content,
  });
}

function trackPageLeave(): void {
  const duration = (Date.now() - currentPageStart) / 1000;
  queueEvent({
    type: "pageleave",
    fingerprint: generateFingerprint(),
    sessionId: sessionId || undefined,
    pagePath: window.location.pathname,
    duration,
    scrollDepth: maxScrollDepth,
  });
  flushEvents();
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function initAnalytics(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  // Skip tracking on localhost
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return;
  }

  // Generate or restore session
  const stored = sessionStorage.getItem("fa_analytics_session");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.lastSeen < SESSION_TIMEOUT) {
        sessionId = parsed.id;
      }
    } catch {
      // ignore
    }
  }

  // Initial page view
  trackPageView();

  // Scroll tracking (throttled)
  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(() => {
        trackScroll();
        scrollTicking = false;
      });
    }
  }, { passive: true });

  // Section visibility
  initSectionObserver();

  // Click tracking
  initClickTracking();

  // Re-observe sections on DOM changes (for SPA navigation)
  const domObserver = new MutationObserver(() => {
    initSectionObserver();
  });
  domObserver.observe(document.body, { childList: true, subtree: true });

  // Track page leave
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      trackPageLeave();
    }
  });

  window.addEventListener("beforeunload", () => {
    trackPageLeave();
  });

  // Intercept Next.js client-side navigation
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    trackPageLeave();
    const result = originalPushState.apply(this, args);
    setTimeout(() => {
      trackPageView();
      initSectionObserver();
    }, 100);
    return result;
  };

  window.addEventListener("popstate", () => {
    trackPageLeave();
    setTimeout(() => {
      trackPageView();
      initSectionObserver();
    }, 100);
  });

  // Periodic session keepalive
  setInterval(() => {
    if (sessionId) {
      sessionStorage.setItem("fa_analytics_session", JSON.stringify({
        id: sessionId,
        lastSeen: Date.now(),
      }));
    }
  }, 60000);
}

export function trackEvent(name: string, data?: Record<string, unknown>): void {
  if (!initialized) return;
  queueEvent({
    type: "event",
    fingerprint: generateFingerprint(),
    sessionId: sessionId || undefined,
    pagePath: window.location.pathname,
    eventType: "custom",
    eventName: name,
    eventData: data,
  });
}
