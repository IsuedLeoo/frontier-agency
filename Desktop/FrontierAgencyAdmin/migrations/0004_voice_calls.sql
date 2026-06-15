-- Voice Agent — Call Logs
CREATE TABLE IF NOT EXISTS voice_calls (
  id TEXT PRIMARY KEY,
  call_control_id TEXT UNIQUE,
  direction TEXT NOT NULL CHECK(direction IN ('inbound', 'outbound')),
  from_number TEXT,
  to_number TEXT,
  status TEXT DEFAULT 'initiated' CHECK(status IN ('initiated', 'ringing', 'in_progress', 'completed', 'failed', 'no_answer', 'busy', 'canceled')),
  started_at TEXT DEFAULT (datetime('now')),
  answered_at TEXT,
  ended_at TEXT,
  duration_seconds INTEGER,
  transcript TEXT,
  summary TEXT,
  recording_url TEXT,
  initiated_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_voice_calls_direction ON voice_calls(direction);
CREATE INDEX IF NOT EXISTS idx_voice_calls_status ON voice_calls(status);
CREATE INDEX IF NOT EXISTS idx_voice_calls_created ON voice_calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_calls_control ON voice_calls(call_control_id);
