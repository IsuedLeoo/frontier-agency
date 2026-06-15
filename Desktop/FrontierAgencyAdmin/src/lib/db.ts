import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { SafeUser, User, Invoice, Document, DashboardStats, VoiceCall, CrmClient, Appointment, ClientNote, ServiceDoc, AnalyticsSession, AnalyticsPageView, AnalyticsEvent, VoiceConfig, ScheduledCall, CallScript, AgentProfile } from "./types";

// ─── D1 Adapter ──────────────────────────────────────────────────────────────

export function getDb() {
  const { env } = getCloudflareContext();
  return env.frontier_agency_db as D1Database;
}

// ─── User Queries ────────────────────────────────────────────────────────────

export const userQueries = {
  findByEmail: (db: D1Database, email: string) =>
    db.prepare("SELECT * FROM users WHERE email = ? AND is_active = 1").bind(email.toLowerCase()).first<User>(),

  findById: (db: D1Database, id: string) =>
    db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first<User>(),

  findByRole: (db: D1Database, role: string) =>
    db.prepare("SELECT id, email, name, role, is_active, created_at, created_by FROM users WHERE role = ? ORDER BY created_at DESC").bind(role).all<SafeUser>(),

  listAll: (db: D1Database) =>
    db.prepare("SELECT id, email, name, role, is_active, created_at, created_by FROM users ORDER BY created_at DESC").all<SafeUser>(),

  create: (db: D1Database, user: { id: string; email: string; password_hash: string; name: string; role: string; created_by: string | null }) =>
    db.prepare("INSERT INTO users (id, email, password_hash, name, role, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))")
      .bind(user.id, user.email.toLowerCase(), user.password_hash, user.name, user.role, user.created_by).run(),

  updateRole: (db: D1Database, id: string, role: string) =>
    db.prepare("UPDATE users SET role = ? WHERE id = ?").bind(role, id).run(),

  setActive: (db: D1Database, id: string, isActive: boolean) =>
    db.prepare("UPDATE users SET is_active = ? WHERE id = ?").bind(isActive ? 1 : 0, id).run(),

  countByRole: (db: D1Database, role: string) =>
    db.prepare("SELECT COUNT(*) as count FROM users WHERE role = ?").bind(role).first<{ count: number }>(),
};

// ─── Session Queries ─────────────────────────────────────────────────────────

export const sessionQueries = {
  create: (db: D1Database, id: string, userId: string, expiresAt: string) =>
    db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").bind(id, userId, expiresAt).run(),

  findById: (db: D1Database, id: string) =>
    db.prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')").bind(id).first<{ id: string; user_id: string; expires_at: string }>(),

  delete: (db: D1Database, id: string) =>
    db.prepare("DELETE FROM sessions WHERE id = ?").bind(id).run(),

  deleteExpired: (db: D1Database) =>
    db.prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')").run(),
};

// ─── Invoice Queries ─────────────────────────────────────────────────────────

export const invoiceQueries = {
  listAll: (db: D1Database) =>
    db.prepare(`
      SELECT i.*, u.name as client_name
      FROM invoices i
      LEFT JOIN users u ON i.client_id = u.id
      ORDER BY i.created_at DESC
    `).all<Invoice & { client_name: string }>(),

  findByClient: (db: D1Database, clientId: string) =>
    db.prepare("SELECT * FROM invoices WHERE client_id = ? ORDER BY created_at DESC").bind(clientId).all<Invoice>(),

  findById: (db: D1Database, id: string) =>
    db.prepare(`
      SELECT i.*, u.name as client_name, u.email as client_email
      FROM invoices i
      LEFT JOIN users u ON i.client_id = u.id
      WHERE i.id = ?
    `).bind(id).first<Invoice & { client_name: string; client_email: string }>(),

  create: (db: D1Database, invoice: Omit<Invoice, "client_name" | "created_at" | "updated_at">) =>
    db.prepare(`
      INSERT INTO invoices (id, client_id, invoice_number, amount, currency, status, description, service_type, due_date, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(invoice.id, invoice.client_id, invoice.invoice_number, invoice.amount, invoice.currency, invoice.status, invoice.description, invoice.service_type, invoice.due_date, invoice.created_by).run(),

  updateStatus: (db: D1Database, id: string, status: string, paidDate?: string) =>
    db.prepare(`UPDATE invoices SET status = ?, paid_date = ?, updated_at = datetime('now') WHERE id = ?`).bind(status, paidDate ?? null, id).run(),

  getNextNumber: (db: D1Database) =>
    db.prepare("SELECT COUNT(*) as count FROM invoices").first<{ count: number }>(),

  stats: (db: D1Database) => ({
    totalRevenue: db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE status = 'paid'").first<{ total: number }>(),
    outstanding: db.prepare("SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count FROM invoices WHERE status IN ('sent', 'overdue')").first<{ total: number; count: number }>(),
    thisMonth: db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE status = 'paid' AND strftime('%Y-%m', paid_date) = strftime('%Y-%m', 'now')").first<{ total: number }>(),
  }),
};

// ─── Document Queries ────────────────────────────────────────────────────────

export const documentQueries = {
  listAll: (db: D1Database) =>
    db.prepare("SELECT id, title, category, content_type, file_size, version, created_at, updated_at, created_by FROM documents ORDER BY category, title").all<Document>(),

  findByCategory: (db: D1Database, category: string) =>
    db.prepare("SELECT id, title, category, content_type, file_size, version, created_at, updated_at FROM documents WHERE category = ? ORDER BY title").bind(category).all<Document>(),

  findById: (db: D1Database, id: string) =>
    db.prepare("SELECT * FROM documents WHERE id = ?").bind(id).first<Document>(),

  create: (db: D1Database, doc: { id: string; title: string; category: string; content_type: string; content: string; file_size: number; created_by: string }) =>
    db.prepare("INSERT INTO documents (id, title, category, content_type, content, file_size, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(doc.id, doc.title, doc.category, doc.content_type, doc.content, doc.file_size, doc.created_by).run(),

  update: (db: D1Database, id: string, content: string) =>
    db.prepare("UPDATE documents SET content = ?, file_size = ?, version = version + 1, updated_at = datetime('now') WHERE id = ?").bind(content, new TextEncoder().encode(content).length, id).run(),
};

// ─── Project Queries (from existing schema) ──────────────────────────────────

export const projectQueries = {
  countActive: (db: D1Database) =>
    db.prepare("SELECT COUNT(*) as count FROM projects WHERE status != 'completed'").first<{ count: number }>(),
};

// ─── Voice Call Queries ──────────────────────────────────────────────────────

export const voiceCallsQueries = {
  create: (db: D1Database, call: { id: string; call_control_id: string | null; direction: string; from_number: string | null; to_number: string | null; status: string; initiated_by: string | null }) =>
    db.prepare(`
      INSERT INTO voice_calls (id, call_control_id, direction, from_number, to_number, status, initiated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(call.id, call.call_control_id, call.direction, call.from_number, call.to_number, call.status, call.initiated_by).run(),

  findByCallControlId: (db: D1Database, callControlId: string) =>
    db.prepare("SELECT * FROM voice_calls WHERE call_control_id = ?").bind(callControlId).first<VoiceCall>(),

  findById: (db: D1Database, id: string) =>
    db.prepare("SELECT * FROM voice_calls WHERE id = ?").bind(id).first<VoiceCall>(),

  updateStatus: (db: D1Database, id: string, status: string) =>
    db.prepare("UPDATE voice_calls SET status = ? WHERE id = ?").bind(status, id).run(),

  updateAnswered: (db: D1Database, id: string) =>
    db.prepare("UPDATE voice_calls SET status = 'in_progress', answered_at = datetime('now') WHERE id = ?").bind(id).run(),

  updateOnEnd: (db: D1Database, id: string, status: string, durationSeconds: number | null, transcript: string | null, summary: string | null, recordingUrl: string | null) =>
    db.prepare(`
      UPDATE voice_calls
      SET status = ?, ended_at = datetime('now'), duration_seconds = ?, transcript = ?, summary = ?, recording_url = ?
      WHERE id = ?
    `).bind(status, durationSeconds, transcript, summary, recordingUrl, id).run(),

  updateTranscript: (db: D1Database, id: string, transcript: string) =>
    db.prepare("UPDATE voice_calls SET transcript = ? WHERE id = ?").bind(transcript, id).run(),

  listAll: (db: D1Database, limit = 50, offset = 0) =>
    db.prepare("SELECT * FROM voice_calls ORDER BY created_at DESC LIMIT ? OFFSET ?").bind(limit, offset).all<VoiceCall>(),

  countAll: (db: D1Database) =>
    db.prepare("SELECT COUNT(*) as count FROM voice_calls").first<{ count: number }>(),

  countByDirection: (db: D1Database, direction: string) =>
    db.prepare("SELECT COUNT(*) as count FROM voice_calls WHERE direction = ?").bind(direction).first<{ count: number }>(),
};

// ─── CRM Client Queries ─────────────────────────────────────────────────────

export const crmClientsQueries = {
  create: (db: D1Database, c: {
    id: string; name: string; email: string | null; phone: string | null;
    company: string | null; industry: string | null; website: string | null;
    status: string; source: string; assigned_to: string | null; notes: string | null;
    business_description?: string | null; service_type?: string | null;
    monthly_retainer?: number | null; contract_value?: number | null;
    contract_start_date?: string | null; contract_end_date?: string | null;
    next_due_date?: string | null; support_guarantee_end?: string | null;
    billing_email?: string | null; address?: string | null; timezone?: string | null;
    priority?: string;
  }) =>
    db.prepare(`
      INSERT INTO clients (id, name, email, phone, company, industry, website, status, source, assigned_to, notes, business_description, service_type, monthly_retainer, contract_value, contract_start_date, contract_end_date, next_due_date, support_guarantee_end, billing_email, address, timezone, priority, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(c.id, c.name, c.email, c.phone, c.company, c.industry, c.website, c.status, c.source, c.assigned_to, c.notes, c.business_description ?? null, c.service_type ?? null, c.monthly_retainer ?? null, c.contract_value ?? null, c.contract_start_date ?? null, c.contract_end_date ?? null, c.next_due_date ?? null, c.support_guarantee_end ?? null, c.billing_email ?? null, c.address ?? null, c.timezone ?? null, c.priority ?? 'medium').run(),

  findByPhone: (db: D1Database, phone: string) =>
    db.prepare("SELECT * FROM clients WHERE phone = ?").bind(phone).first<CrmClient>(),

  findByEmail: (db: D1Database, email: string) =>
    db.prepare("SELECT * FROM clients WHERE email = ?").bind(email).first<CrmClient>(),

  findById: (db: D1Database, id: string) =>
    db.prepare("SELECT * FROM clients WHERE id = ?").bind(id).first<CrmClient>(),

  listAll: (db: D1Database, limit = 50, offset = 0) =>
    db.prepare("SELECT * FROM clients ORDER BY created_at DESC LIMIT ? OFFSET ?").bind(limit, offset).all<CrmClient>(),

  update: (db: D1Database, id: string, updates: Partial<CrmClient>) => {
    const fields: string[] = [];
    const values: unknown[] = [];
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    fields.push("updated_at = datetime('now')");
    values.push(id);
    return db.prepare(`UPDATE clients SET ${fields.join(", ")} WHERE id = ?`).bind(...values).run();
  },

  countAll: (db: D1Database) =>
    db.prepare("SELECT COUNT(*) as count FROM clients").first<{ count: number }>(),

  countByStatus: (db: D1Database, status: string) =>
    db.prepare("SELECT COUNT(*) as count FROM clients WHERE status = ?").bind(status).first<{ count: number }>(),

  getFullProfile: async (db: D1Database, clientId: string) => {
    const client = db.prepare("SELECT * FROM clients WHERE id = ?").bind(clientId).first<CrmClient>();
    return client;
  },

  hasCrmClient: (db: D1Database, id: string) =>
    db.prepare("SELECT id FROM clients WHERE id = ?").bind(id).first<{ id: string }>(),
};

// ─── Appointment Queries ────────────────────────────────────────────────────

export const appointmentsQueries = {
  create: (db: D1Database, a: { id: string; client_id: string; title: string; description: string | null; scheduled_at: string; duration_minutes: number; status: string; notes: string | null; created_by: string | null; source: string }) =>
    db.prepare(`
      INSERT INTO appointments (id, client_id, title, description, scheduled_at, duration_minutes, status, notes, created_by, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(a.id, a.client_id, a.title, a.description, a.scheduled_at, a.duration_minutes, a.status, a.notes, a.created_by, a.source).run(),

  findById: (db: D1Database, id: string) =>
    db.prepare("SELECT * FROM appointments WHERE id = ?").bind(id).first<Appointment>(),

  findByClient: (db: D1Database, clientId: string) =>
    db.prepare("SELECT * FROM appointments WHERE client_id = ? ORDER BY scheduled_at DESC").bind(clientId).all<Appointment>(),

  listUpcoming: (db: D1Database, limit = 20) =>
    db.prepare("SELECT * FROM appointments WHERE scheduled_at >= datetime('now') AND status = 'scheduled' ORDER BY scheduled_at ASC LIMIT ?").bind(limit).all<Appointment>(),

  listAll: (db: D1Database, limit = 50, offset = 0) =>
    db.prepare("SELECT * FROM appointments ORDER BY scheduled_at DESC LIMIT ? OFFSET ?").bind(limit, offset).all<Appointment>(),

  updateStatus: (db: D1Database, id: string, status: string) =>
    db.prepare("UPDATE appointments SET status = ?, updated_at = datetime('now') WHERE id = ?").bind(status, id).run(),

  update: (db: D1Database, id: string, updates: Partial<Appointment>) => {
    const fields: string[] = [];
    const values: unknown[] = [];
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    fields.push("updated_at = datetime('now')");
    values.push(id);
    return db.prepare(`UPDATE appointments SET ${fields.join(", ")} WHERE id = ?`).bind(...values).run();
  },

  countAll: (db: D1Database) =>
    db.prepare("SELECT COUNT(*) as count FROM appointments").first<{ count: number }>(),

  countByStatus: (db: D1Database, status: string) =>
    db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status = ?").bind(status).first<{ count: number }>(),
};

// ─── Client Notes Queries ───────────────────────────────────────────────────

export const clientNotesQueries = {
  create: (db: D1Database, n: { id: string; client_id: string; type: string; content: string; created_by: string | null }) =>
    db.prepare(`
      INSERT INTO client_notes (id, client_id, type, content, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).bind(n.id, n.client_id, n.type, n.content, n.created_by).run(),

  findByClient: (db: D1Database, clientId: string) =>
    db.prepare("SELECT * FROM client_notes WHERE client_id = ? ORDER BY created_at DESC").bind(clientId).all<ClientNote>(),

  listAll: (db: D1Database, limit = 100) =>
    db.prepare("SELECT * FROM client_notes ORDER BY created_at DESC LIMIT ?").bind(limit).all<ClientNote>(),
};

// ─── Service Docs Queries ───────────────────────────────────────────────────

export const serviceDocsQueries = {
  findBySlug: (db: D1Database, slug: string) =>
    db.prepare("SELECT * FROM service_docs WHERE slug = ? AND is_active = 1").bind(slug).first<ServiceDoc>(),

  findByCategory: (db: D1Database, category: string) =>
    db.prepare("SELECT * FROM service_docs WHERE category = ? AND is_active = 1 ORDER BY title").bind(category).all<ServiceDoc>(),

  listAll: (db: D1Database) =>
    db.prepare("SELECT * FROM service_docs WHERE is_active = 1 ORDER BY category, title").all<ServiceDoc>(),

  search: (db: D1Database, query: string) =>
    db.prepare("SELECT * FROM service_docs WHERE is_active = 1 AND (title LIKE ? OR content LIKE ? OR tags LIKE ?) ORDER BY title").bind(`%${query}%`, `%${query}%`, `%${query}%`).all<ServiceDoc>(),

  create: (db: D1Database, d: { id: string; title: string; slug: string; category: string; content: string; tags: string }) =>
    db.prepare(`
      INSERT INTO service_docs (id, title, slug, category, content, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(d.id, d.title, d.slug, d.category, d.content, d.tags).run(),

  update: (db: D1Database, id: string, content: string) =>
    db.prepare("UPDATE service_docs SET content = ?, updated_at = datetime('now') WHERE id = ?").bind(content, id).run(),
};

// ─── Analytics Session Queries ───────────────────────────────────────────────

export const analyticsSessionQueries = {
  findByFingerprint: (db: D1Database, fingerprint: string) =>
    db.prepare("SELECT * FROM analytics_sessions WHERE fingerprint = ?").bind(fingerprint).first<AnalyticsSession>(),

  create: (db: D1Database, s: { id: string; fingerprint: string; user_agent: string | null; device_type: string | null; browser: string | null; os: string | null; screen_width: number | null; screen_height: number | null; country: string | null; city: string | null; region: string | null; timezone: string | null; language: string | null }) =>
    db.prepare(`
      INSERT INTO analytics_sessions (id, fingerprint, user_agent, device_type, browser, os, screen_width, screen_height, country, city, region, timezone, language)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(s.id, s.fingerprint, s.user_agent, s.device_type, s.browser, s.os, s.screen_width, s.screen_height, s.country, s.city, s.region, s.timezone, s.language).run(),

  updateLastSeen: (db: D1Database, id: string) =>
    db.prepare("UPDATE analytics_sessions SET last_seen_at = datetime('now'), visit_count = visit_count + 1 WHERE id = ?").bind(id).run(),

  findStaleSession: (db: D1Database, fingerprint: string) =>
    db.prepare("SELECT * FROM analytics_sessions WHERE fingerprint = ? AND last_seen_at > datetime('now', '-30 minutes')").bind(fingerprint).first<AnalyticsSession>(),
};

// ─── Analytics Page View Queries ─────────────────────────────────────────────

export const analyticsPageViewQueries = {
  create: (db: D1Database, pv: { id: string; session_id: string; page_path: string; page_title: string | null; referrer: string | null; referrer_source: string | null; utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; utm_term: string | null; utm_content: string | null }) =>
    db.prepare(`
      INSERT INTO analytics_page_views (id, session_id, page_path, page_title, referrer, referrer_source, utm_source, utm_medium, utm_campaign, utm_term, utm_content)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(pv.id, pv.session_id, pv.page_path, pv.page_title, pv.referrer, pv.referrer_source, pv.utm_source, pv.utm_medium, pv.utm_campaign, pv.utm_term, pv.utm_content).run(),

  updateDuration: (db: D1Database, id: string, duration: number, scrollDepth: number) =>
    db.prepare("UPDATE analytics_page_views SET duration_seconds = ?, scroll_depth_max = ?, is_bounce = ? WHERE id = ?").bind(duration, scrollDepth, duration > 5 ? 0 : 1, id).run(),

  markSessionNotBounce: (db: D1Database, sessionId: string) =>
    db.prepare("UPDATE analytics_page_views SET is_bounce = 0 WHERE session_id = ?").bind(sessionId).run(),
};

// ─── Analytics Event Queries ─────────────────────────────────────────────────

export const analyticsEventQueries = {
  create: (db: D1Database, e: { id: string; session_id: string; page_path: string; event_type: string; event_name: string | null; event_data: string | null }) =>
    db.prepare(`
      INSERT INTO analytics_events (id, session_id, page_path, event_type, event_name, event_data)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(e.id, e.session_id, e.page_path, e.event_type, e.event_name, e.event_data).run(),
};

// ─── Analytics Dashboard Stats ───────────────────────────────────────────────

export function analyticsStatsQueries(db: D1Database, startDate: string, endDate: string) {
  const dateFilter = "viewed_at >= ? AND viewed_at < ?";
  const params = [startDate, endDate];

  return {
    totalPageViews: db.prepare(`SELECT COUNT(*) as count FROM analytics_page_views WHERE ${dateFilter}`).bind(...params).first<{ count: number }>(),

    uniqueVisitors: db.prepare(`SELECT COUNT(DISTINCT session_id) as count FROM analytics_page_views WHERE ${dateFilter}`).bind(...params).first<{ count: number }>(),

    avgDuration: db.prepare(`SELECT COALESCE(AVG(duration_seconds), 0) as avg FROM analytics_page_views WHERE ${dateFilter} AND duration_seconds IS NOT NULL`).bind(...params).first<{ avg: number }>(),

    bounceRate: db.prepare(`SELECT CAST(SUM(is_bounce) AS REAL) * 100 / COUNT(*) as rate FROM analytics_page_views WHERE ${dateFilter}`).bind(...params).first<{ rate: number }>(),

    topPages: db.prepare(`
      SELECT page_path, COUNT(*) as views, COALESCE(AVG(duration_seconds), 0) as avg_duration
      FROM analytics_page_views
      WHERE ${dateFilter}
      GROUP BY page_path
      ORDER BY views DESC
      LIMIT 15
    `).bind(...params).all<{ page_path: string; views: number; avg_duration: number }>(),

    topReferrers: db.prepare(`
      SELECT COALESCE(referrer_source, '(direct)') as source, COUNT(*) as views
      FROM analytics_page_views
      WHERE ${dateFilter}
      GROUP BY referrer_source
      ORDER BY views DESC
      LIMIT 10
    `).bind(...params).all<{ source: string; views: number }>(),

    trafficOverTime: db.prepare(`
      SELECT strftime('%Y-%m-%d', viewed_at) as date, COUNT(*) as views, COUNT(DISTINCT session_id) as visitors
      FROM analytics_page_views
      WHERE ${dateFilter}
      GROUP BY strftime('%Y-%m-%d', viewed_at)
      ORDER BY date ASC
    `).bind(...params).all<{ date: string; views: number; visitors: number }>(),

    deviceBreakdown: db.prepare(`
      SELECT COALESCE(s.device_type, 'unknown') as device, COUNT(DISTINCT pv.session_id) as visitors
      FROM analytics_page_views pv
      JOIN analytics_sessions s ON pv.session_id = s.id
      WHERE ${dateFilter}
      GROUP BY s.device_type
      ORDER BY visitors DESC
    `).bind(...params).all<{ device: string; visitors: number }>(),

    browserBreakdown: db.prepare(`
      SELECT COALESCE(s.browser, 'unknown') as browser, COUNT(DISTINCT pv.session_id) as visitors
      FROM analytics_page_views pv
      JOIN analytics_sessions s ON pv.session_id = s.id
      WHERE ${dateFilter}
      GROUP BY s.browser
      ORDER BY visitors DESC
    `).bind(...params).all<{ browser: string; visitors: number }>(),

    countryBreakdown: db.prepare(`
      SELECT COALESCE(s.country, 'unknown') as country, COALESCE(s.city, '') as city, COUNT(DISTINCT pv.session_id) as visitors
      FROM analytics_page_views pv
      JOIN analytics_sessions s ON pv.session_id = s.id
      WHERE ${dateFilter}
      GROUP BY s.country, s.city
      ORDER BY visitors DESC
      LIMIT 15
    `).bind(...params).all<{ country: string; city: string; visitors: number }>(),

    scrollDepthByPage: db.prepare(`
      SELECT page_path, COALESCE(AVG(scroll_depth_max), 0) as avg_depth, COUNT(*) as views
      FROM analytics_page_views
      WHERE ${dateFilter} AND scroll_depth_max IS NOT NULL
      GROUP BY page_path
      ORDER BY views DESC
      LIMIT 15
    `).bind(...params).all<{ page_path: string; avg_depth: number; views: number }>(),

    sectionEngagement: db.prepare(`
      SELECT event_name as section, COUNT(*) as views, COUNT(DISTINCT session_id) as unique_visitors
      FROM analytics_events
      WHERE event_type = 'section_view' AND created_at >= ? AND created_at < ?
      GROUP BY event_name
      ORDER BY views DESC
      LIMIT 20
    `).bind(...params).all<{ section: string; views: number; unique_visitors: number }>(),

    topClicks: db.prepare(`
      SELECT event_name as element, event_data, COUNT(*) as clicks
      FROM analytics_events
      WHERE event_type IN ('button_click', 'cta_click', 'link_click') AND created_at >= ? AND created_at < ?
      GROUP BY event_name, event_data
      ORDER BY clicks DESC
      LIMIT 20
    `).bind(...params).all<{ element: string; event_data: string | null; clicks: number }>(),
  };
}

// ─── Voice Config Queries ──────────────────────────────────────────────────

const DEFAULT_VOICE_CONFIG = {
  id: "singleton",
  outbound_system_prompt: "",
  outbound_welcome_message: "Hello, this is Frontier Agency. How can I help you today?",
  outbound_voice_provider: "elevenlabs",
  outbound_voice_id: "",
  outbound_voice_stability: 0.5,
  outbound_voice_similarity_boost: 0.75,
  outbound_model: "openai/gpt-4o",
  outbound_silence_timeout: 45,
  outbound_response_delay: 3,
  inbound_system_prompt: "",
  inbound_welcome_message: "Thank you for calling Frontier Agency. How can I assist you?",
  inbound_voice_provider: "elevenlabs",
  inbound_voice_id: "",
  inbound_voice_stability: 0.5,
  inbound_voice_similarity_boost: 0.75,
  inbound_model: "openai/gpt-4o",
  inbound_silence_timeout: 45,
  inbound_response_delay: 3,
  phone_number: "+19862010858",
  phone_number_id: "",
  updated_at: new Date().toISOString(),
  updated_by: null,
};

export const voiceConfigQueries = {
  get: async (db: D1Database): Promise<VoiceConfig> => {
    const row = await db.prepare("SELECT * FROM voice_config WHERE id = 'singleton'").first<VoiceConfig>();
    return row ?? DEFAULT_VOICE_CONFIG as unknown as VoiceConfig;
  },

  update: async (db: D1Database, updates: Record<string, unknown>, userId: string | null) => {
    const updateKeys = Object.keys(updates).filter(k => k !== "id");

    // Try UPDATE first
    const setClauses = updateKeys.map(k => `${k} = ?`).join(", ");
    const updateValues = updateKeys.map(k => updates[k]);
    updateValues.push(userId);

    const updateResult = await db.prepare(`
      UPDATE voice_config SET ${setClauses}, updated_at = datetime('now'), updated_by = ?
      WHERE id = 'singleton'
    `).bind(...updateValues).run();

    // If no row was updated, INSERT
    if (!updateResult.meta.changes) {
      const allKeys = [...updateKeys, "updated_by"];
      const placeholders = allKeys.map(() => "?").join(", ");
      const allValues = [...updateKeys.map(k => updates[k]), userId];

      await db.prepare(`
        INSERT INTO voice_config (id, ${allKeys.join(", ")})
        VALUES ('singleton', ${placeholders})
      `).bind(...allValues).run();
    }
  },
};

// ─── Voice Call Schedule Queries ───────────────────────────────────────────

export const voiceCallScheduleQueries = {
  create: (db: D1Database, data: { id: string; phone_number: string; scheduled_at: string; initiated_by: string | null; metadata?: string }) =>
    db.prepare(`
      INSERT INTO voice_call_schedule (id, phone_number, scheduled_at, status, initiated_by, metadata, created_at)
      VALUES (?, ?, ?, 'pending', ?, ?, datetime('now'))
    `).bind(data.id, data.phone_number, data.scheduled_at, data.initiated_by, data.metadata ?? "{}").run(),

  listAll: (db: D1Database, limit = 50) =>
    db.prepare("SELECT * FROM voice_call_schedule ORDER BY scheduled_at DESC LIMIT ?").bind(limit).all<ScheduledCall>(),

  listPending: (db: D1Database) =>
    db.prepare("SELECT * FROM voice_call_schedule WHERE status = 'pending' AND scheduled_at > datetime('now') ORDER BY scheduled_at ASC").all<ScheduledCall>(),

  updateStatus: (db: D1Database, id: string, status: string) =>
    db.prepare("UPDATE voice_call_schedule SET status = ?, completed_at = datetime('now') WHERE id = ?").bind(status, id).run(),

  findById: (db: D1Database, id: string) =>
    db.prepare("SELECT * FROM voice_call_schedule WHERE id = ?").bind(id).first<ScheduledCall>(),
};

// ─── Call Script Queries ────────────────────────────────────────────────────

export const callScriptQueries = {
  listAll: (db: D1Database) =>
    db.prepare("SELECT * FROM voice_call_scripts ORDER BY category, name").all<CallScript>(),

  findById: (db: D1Database, id: string) =>
    db.prepare("SELECT * FROM voice_call_scripts WHERE id = ?").bind(id).first<CallScript>(),

  create: (db: D1Database, script: {
    id: string;
    name: string;
    description: string;
    category: string;
    system_prompt: string;
    first_message: string;
    persona: string;
    target_business: string;
    voice_speed: number;
    created_by: string | null;
  }) =>
    db.prepare(`
      INSERT INTO voice_call_scripts (id, name, description, category, system_prompt, first_message, persona, target_business, voice_speed, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(script.id, script.name, script.description, script.category, script.system_prompt, script.first_message, script.persona, script.target_business, script.voice_speed, script.created_by).run(),

  update: (db: D1Database, id: string, updates: Partial<CallScript>) => {
    const fields: string[] = [];
    const values: unknown[] = [];
    for (const [key, value] of Object.entries(updates)) {
      if (key === "id") continue;
      fields.push(`${key} = ?`);
      values.push(value);
    }
    fields.push("updated_at = datetime('now')");
    values.push(id);
    return db.prepare(`UPDATE voice_call_scripts SET ${fields.join(", ")} WHERE id = ?`).bind(...values).run();
  },

  delete: (db: D1Database, id: string) =>
    db.prepare("DELETE FROM voice_call_scripts WHERE id = ?").bind(id).run(),
};

// ─── Agent Profile Queries ──────────────────────────────────────────────────

export const agentProfileQueries = {
  listAll: (db: D1Database) =>
    db.prepare("SELECT * FROM voice_agent_profiles ORDER BY is_default DESC, name ASC").all<AgentProfile>(),

  findById: (db: D1Database, id: string) =>
    db.prepare("SELECT * FROM voice_agent_profiles WHERE id = ?").bind(id).first<AgentProfile>(),

  findDefault: (db: D1Database) =>
    db.prepare("SELECT * FROM voice_agent_profiles WHERE is_default = 1 AND is_active = 1 LIMIT 1").first<AgentProfile>(),

  create: (db: D1Database, profile: {
    id: string;
    name: string;
    description: string;
    system_prompt: string;
    first_message: string;
    wait_for_human_first: number;
    voice_provider: string;
    voice_id: string;
    voice_stability: number;
    voice_similarity_boost: number;
    model_provider: string;
    model_name: string;
    model_temperature: number;
    model_max_tokens: number;
    silence_timeout_seconds: number;
    response_delay_seconds: number;
    max_duration_seconds: number;
    tools_enabled: string;
    created_by: string | null;
  }) =>
    db.prepare(`
      INSERT INTO voice_agent_profiles (id, name, description, system_prompt, first_message, wait_for_human_first, voice_provider, voice_id, voice_stability, voice_similarity_boost, model_provider, model_name, model_temperature, model_max_tokens, silence_timeout_seconds, response_delay_seconds, max_duration_seconds, tools_enabled, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(profile.id, profile.name, profile.description, profile.system_prompt, profile.first_message, profile.wait_for_human_first, profile.voice_provider, profile.voice_id, profile.voice_stability, profile.voice_similarity_boost, profile.model_provider, profile.model_name, profile.model_temperature, profile.model_max_tokens, profile.silence_timeout_seconds, profile.response_delay_seconds, profile.max_duration_seconds, profile.tools_enabled, profile.created_by).run(),

  update: (db: D1Database, id: string, updates: Record<string, unknown>) => {
    const fields: string[] = [];
    const values: unknown[] = [];
    for (const [key, value] of Object.entries(updates)) {
      if (key === "id") continue;
      fields.push(`${key} = ?`);
      values.push(value);
    }
    fields.push("updated_at = datetime('now')");
    values.push(id);
    return db.prepare(`UPDATE voice_agent_profiles SET ${fields.join(", ")} WHERE id = ?`).bind(...values).run();
  },

  delete: (db: D1Database, id: string) =>
    db.prepare("DELETE FROM voice_agent_profiles WHERE id = ?").bind(id).run(),

  setDefault: (db: D1Database, id: string) => {
    db.prepare("UPDATE voice_agent_profiles SET is_default = 0").run();
    return db.prepare("UPDATE voice_agent_profiles SET is_default = 1 WHERE id = ?").bind(id).run();
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateInvoiceNumber(count: number): string {
  return `INV-${String(count + 1).padStart(4, "0")}`;
}
