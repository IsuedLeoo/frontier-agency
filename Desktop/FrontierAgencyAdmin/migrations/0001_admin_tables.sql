-- FrontierAgency Admin Console — Database Migration
-- Adds role system, invoicing, and document storage to existing frontier-agency-db

-- ─── 1. Add columns to existing users table (idempotent) ─────────────────────
-- Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- These may fail if columns already exist — that's OK, just re-run.

-- ─── 2. Invoices table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES users(id),
  invoice_number TEXT UNIQUE NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  description TEXT,
  service_type TEXT,
  due_date TEXT,
  paid_date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by TEXT REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- ─── 3. Documents table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('handbook', 'intelligence', 'contracts', 'reports', 'other')),
  content_type TEXT DEFAULT 'markdown',
  content TEXT,
  file_size INTEGER,
  version INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  created_by TEXT REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);

-- ─── 4. Sessions table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
