/**
 * Auto-Dialer Scheduler
 *
 * Schedules outbound calls to Miami businesses during business hours.
 * - 5 calls per morning (Mon-Fri, 9AM-6PM Eastern)
 * - Respects business hours
 * - Avoids duplicate calls to the same number
 * - Tracks call outcomes for learning
 */

import { generateId } from "@/lib/db";

export interface BusinessTarget {
  name: string;
  phone: string;
  industry: string;
  address?: string;
}

export interface DialerConfig {
  callsPerDay: number;
  startHour: number; // 9 = 9AM Eastern
  endHour: number; // 6 = 6PM Eastern
  timezone: string;
  daysOfWeek: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
}

export const DEFAULT_CONFIG: DialerConfig = {
  callsPerDay: 5,
  startHour: 9,
  endHour: 18,
  timezone: "America/New_York",
  daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
};

// ─── Miami Business Targets ──────────────────────────────────────────────────

/**
 * Sample Miami businesses for cold calling.
 * In production, this would come from a database or scraping pipeline.
 */
const MIAMI_BUSINESS_TARGETS: BusinessTarget[] = [
  { name: "Coral Gables Dental", phone: "+13055550101", industry: "Healthcare", address: "Coral Gables, FL" },
  { name: "Brickell Auto Repair", phone: "+13055550102", industry: "Automotive", address: "Brickell, FL" },
  { name: "Wynwood Marketing Group", phone: "+13055550103", industry: "Marketing", address: "Wynwood, FL" },
  { name: "Miami Beach Realty", phone: "+13055550104", industry: "Real Estate", address: "Miami Beach, FL" },
  { name: "Coconut Grove Law Firm", phone: "+13055550105", industry: "Legal", address: "Coconut Grove, FL" },
  { name: "Downtown Miami Accounting", phone: "+13055550106", industry: "Finance", address: "Downtown Miami, FL" },
  { name: "Key Biscayne Plumbing", phone: "+13055550107", industry: "Home Services", address: "Key Biscayne, FL" },
  { name: "Little Havana Restaurant Group", phone: "+13055550108", industry: "Restaurant", address: "Little Havana, FL" },
  { name: "South Miami Veterinary", phone: "+13055550109", industry: "Healthcare", address: "South Miami, FL" },
  { name: "Doral Insurance Agency", phone: "+13055550110", industry: "Insurance", address: "Doral, FL" },
  { name: "Pinecrest Home Services", phone: "+13055550111", industry: "Home Services", address: "Pinecrest, FL" },
  { name: "Edgewater Fitness Studio", phone: "+13055550112", industry: "Fitness", address: "Edgewater, FL" },
  { name: "Midtown Miami Salon", phone: "+13055550113", industry: "Beauty", address: "Midtown Miami, FL" },
  { name: "Overtown Construction", phone: "+13055550114", industry: "Construction", address: "Overtown, FL" },
  { name: "Vendome Medical Practice", phone: "+13055550115", industry: "Healthcare", address: "Miami, FL" },
];

// ─── Scheduling ──────────────────────────────────────────────────────────────

/**
 * Schedule today's calls. Returns the number of calls scheduled.
 */
export async function scheduleTodaysCalls(
  db: D1Database,
  config: DialerConfig = DEFAULT_CONFIG,
  userId: string | null = null
): Promise<{ scheduled: number; calls: string[] }> {
  const now = new Date();
  const dayOfWeek = now.getDay();

  // Check if today is a business day
  if (!config.daysOfWeek.includes(dayOfWeek)) {
    return { scheduled: 0, calls: [] };
  }

  // Check if we're within business hours
  const hour = now.getHours();
  if (hour < config.startHour || hour >= config.endHour) {
    return { scheduled: 0, calls: [] };
  }

  // Check how many calls already scheduled today
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const existingResult = await db
    .prepare(
      "SELECT COUNT(*) as count FROM voice_call_schedule WHERE scheduled_at >= ? AND scheduled_at <= ?"
    )
    .bind(todayStart.toISOString(), todayEnd.toISOString())
    .first<{ count: number }>();

  const existingCount = existingResult?.count ?? 0;
  const remainingSlots = config.callsPerDay - existingCount;

  if (remainingSlots <= 0) {
    return { scheduled: 0, calls: [] };
  }

  // Get numbers already called in the last 30 days to avoid duplicates
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentCalls = await db
    .prepare("SELECT to_number FROM voice_calls WHERE created_at >= ? AND direction = 'outbound'")
    .bind(thirtyDaysAgo.toISOString())
    .all<{ to_number: string }>();

  const recentNumbers = new Set(recentCalls.results?.map((c) => c.to_number) ?? []);

  // Filter available targets
  const availableTargets = MIAMI_BUSINESS_TARGETS.filter(
    (t) => !recentNumbers.has(t.phone)
  );

  // Pick targets for today (spread throughout the day)
  const scheduled: string[] = [];
  const targets = availableTargets.slice(0, remainingSlots);

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    // Space calls evenly through remaining business hours
    const hoursRemaining = config.endHour - hour;
    const spacing = Math.max(1, Math.floor(hoursRemaining / (targets.length - i)));
    const callHour = hour + (i * spacing);
    const callMinute = Math.floor(Math.random() * 60);

    const scheduledTime = new Date(now);
    scheduledTime.setHours(callHour, callMinute, 0, 0);

    const callId = generateId();
    await db
      .prepare(
        "INSERT INTO voice_call_schedule (id, phone_number, scheduled_at, status, initiated_by, metadata, created_at) VALUES (?, ?, ?, 'pending', ?, ?, datetime('now'))"
      )
      .bind(
        callId,
        target.phone,
        scheduledTime.toISOString(),
        userId,
        JSON.stringify({ businessName: target.name, industry: target.industry, address: target.address })
      )
      .run();

    scheduled.push(callId);
  }

  return { scheduled: scheduled.length, calls: scheduled };
}

/**
 * Get pending calls that should be executed now.
 */
export async function getPendingCalls(db: D1Database): Promise<
  Array<{ id: string; phone_number: string; metadata: string; scheduled_at: string }>
> {
  const now = new Date().toISOString();
  const result = await db
    .prepare(
      "SELECT id, phone_number, metadata, scheduled_at FROM voice_call_schedule WHERE status = 'pending' AND scheduled_at <= ? ORDER BY scheduled_at ASC LIMIT 10"
    )
    .bind(now)
    .all<{ id: string; phone_number: string; metadata: string; scheduled_at: string }>();

  return result.results ?? [];
}

/**
 * Mark a scheduled call as completed/failed.
 */
export async function completeScheduledCall(
  db: D1Database,
  scheduleId: string,
  status: "completed" | "failed" | "cancelled"
): Promise<void> {
  await db
    .prepare("UPDATE voice_call_schedule SET status = ?, completed_at = datetime('now') WHERE id = ?")
    .bind(status, scheduleId)
    .run();
}

// ─── Dialer Stats ────────────────────────────────────────────────────────────

export interface DialerStats {
  totalScheduled: number;
  pendingToday: number;
  completedToday: number;
  failedToday: number;
  upcomingCalls: Array<{ id: string; phone_number: string; businessName: string; scheduled_at: string }>;
}

export async function getDialerStats(db: D1Database): Promise<DialerStats> {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const totalScheduled = await db
    .prepare("SELECT COUNT(*) as count FROM voice_call_schedule")
    .first<{ count: number }>();

  const pendingToday = await db
    .prepare("SELECT COUNT(*) as count FROM voice_call_schedule WHERE status = 'pending' AND scheduled_at >= ? AND scheduled_at <= ?")
    .bind(todayStart.toISOString(), todayEnd.toISOString())
    .first<{ count: number }>();

  const completedToday = await db
    .prepare("SELECT COUNT(*) as count FROM voice_call_schedule WHERE status = 'completed' AND completed_at >= ? AND completed_at <= ?")
    .bind(todayStart.toISOString(), todayEnd.toISOString())
    .first<{ count: number }>();

  const failedToday = await db
    .prepare("SELECT COUNT(*) as count FROM voice_call_schedule WHERE status = 'failed' AND completed_at >= ? AND completed_at <= ?")
    .bind(todayStart.toISOString(), todayEnd.toISOString())
    .first<{ count: number }>();

  const upcoming = await db
    .prepare("SELECT id, phone_number, metadata, scheduled_at FROM voice_call_schedule WHERE status = 'pending' AND scheduled_at > ? ORDER BY scheduled_at ASC LIMIT 10")
    .bind(now.toISOString())
    .all<{ id: string; phone_number: string; metadata: string; scheduled_at: string }>();

  return {
    totalScheduled: totalScheduled?.count ?? 0,
    pendingToday: pendingToday?.count ?? 0,
    completedToday: completedToday?.count ?? 0,
    failedToday: failedToday?.count ?? 0,
    upcomingCalls: (upcoming.results ?? []).map((c) => {
      let businessName = c.phone_number;
      try {
        const meta = JSON.parse(c.metadata);
        businessName = meta.businessName || c.phone_number;
      } catch { /* ignore */ }
      return { id: c.id, phone_number: c.phone_number, businessName, scheduled_at: c.scheduled_at };
    }),
  };
}
