-- Frontier Agency Analytics Tables
-- Tracks page views, visitors, sessions, events for the main marketing site

-- Visitor sessions (anonymous)
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id TEXT PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  first_seen_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen_at TEXT NOT NULL DEFAULT (datetime('now')),
  user_agent TEXT,
  device_type TEXT CHECK(device_type IN ('mobile', 'tablet', 'desktop')),
  browser TEXT,
  os TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  country TEXT,
  city TEXT,
  region TEXT,
  timezone TEXT,
  language TEXT,
  visit_count INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_analytics_sessions_fingerprint ON analytics_sessions(fingerprint);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_last_seen ON analytics_sessions(last_seen_at);

-- Individual page views
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  referrer_source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  viewed_at TEXT NOT NULL DEFAULT (datetime('now')),
  duration_seconds INTEGER,
  scroll_depth_max INTEGER CHECK(scroll_depth_max BETWEEN 0 AND 100),
  is_bounce INTEGER DEFAULT 1,
  FOREIGN KEY (session_id) REFERENCES analytics_sessions(id)
);

CREATE INDEX IF NOT EXISTS idx_analytics_pv_viewed_at ON analytics_page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_analytics_pv_session ON analytics_page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_pv_page_path ON analytics_page_views(page_path, viewed_at);
CREATE INDEX IF NOT EXISTS idx_analytics_pv_referrer ON analytics_page_views(referrer_source, viewed_at);

-- Granular events (section visibility, clicks, outbound links)
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK(event_type IN ('section_view', 'button_click', 'link_click', 'outbound_click', 'cta_click', 'form_submit', 'custom')),
  event_name TEXT,
  event_data TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES analytics_sessions(id)
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_page ON analytics_events(page_path, event_type, created_at);

-- Pre-aggregated daily stats for fast dashboard queries
CREATE TABLE IF NOT EXISTS analytics_daily_stats (
  date TEXT NOT NULL,
  page_path TEXT NOT NULL DEFAULT '',
  page_views INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  sessions_count INTEGER NOT NULL DEFAULT 0,
  avg_duration_seconds REAL DEFAULT 0,
  bounce_count INTEGER NOT NULL DEFAULT 0,
  total_scroll_depth REAL DEFAULT 0,
  PRIMARY KEY (date, page_path)
);

CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON analytics_daily_stats(date);
