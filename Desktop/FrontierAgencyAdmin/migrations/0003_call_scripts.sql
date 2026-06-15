-- Named call scripts library
CREATE TABLE IF NOT EXISTS voice_call_scripts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  -- The full system prompt passed to Vapi
  system_prompt TEXT NOT NULL,
  -- The first message the AI says
  first_message TEXT NOT NULL DEFAULT 'Hey, quick question.',
  -- Optional: which persona to use (customer, friend, professional, etc.)
  persona TEXT NOT NULL DEFAULT 'customer',
  -- Target business type this script is designed for
  target_business TEXT NOT NULL DEFAULT 'general',
  -- Speech settings override (optional)
  voice_speed REAL DEFAULT 0.9,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_call_scripts_category ON voice_call_scripts(category);
CREATE INDEX IF NOT EXISTS idx_call_scripts_active ON voice_call_scripts(is_active);

-- Seed scripts using json_each to avoid quote escaping issues
-- We will insert via the admin UI after deployment
-- Table is ready for use
