-- Agent Learning System Tables

-- Learning insights extracted from call analysis
CREATE TABLE IF NOT EXISTS agent_learnings (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('successful_pattern', 'objection_handler', 'phrase_improvement', 'timing')),
  content TEXT NOT NULL,
  source_calls TEXT DEFAULT '[]', -- JSON array of call IDs
  confidence REAL DEFAULT 0.5,
  applied INTEGER DEFAULT 0, -- 0 = not yet applied to prompt, 1 = applied
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_learnings_type ON agent_learnings(type);
CREATE INDEX IF NOT EXISTS idx_learnings_applied ON agent_learnings(applied);

-- Call analysis results
CREATE TABLE IF NOT EXISTS call_analyses (
  id TEXT PRIMARY KEY,
  call_id TEXT NOT NULL REFERENCES voice_calls(id),
  outcome TEXT CHECK(outcome IN ('booked', 'interested', 'not_interested', 'no_answer', 'failed')),
  booking_secured INTEGER DEFAULT 0,
  turn_count INTEGER,
  sentiment TEXT CHECK(sentiment IN ('positive', 'neutral', 'negative')),
  objections TEXT DEFAULT '[]', -- JSON array
  successful_patterns TEXT DEFAULT '[]', -- JSON array
  improvement_areas TEXT DEFAULT '[]', -- JSON array
  summary TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_call_analyses_call ON call_analyses(call_id);
CREATE INDEX IF NOT EXISTS idx_call_analyses_outcome ON call_analyses(outcome);

-- Business targets for auto-dialer
CREATE TABLE IF NOT EXISTS business_targets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  industry TEXT,
  address TEXT,
  last_called_at TEXT,
  call_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paused', 'converted', 'do_not_call')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_business_targets_phone ON business_targets(phone);
CREATE INDEX IF NOT EXISTS idx_business_targets_status ON business_targets(status);

-- Agent performance snapshots (daily)
CREATE TABLE IF NOT EXISTS agent_performance (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  total_calls INTEGER DEFAULT 0,
  completed_calls INTEGER DEFAULT 0,
  bookings INTEGER DEFAULT 0,
  booking_rate REAL DEFAULT 0,
  avg_duration REAL DEFAULT 0,
  top_objections TEXT DEFAULT '[]',
  top_phrases TEXT DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_agent_performance_date ON agent_performance(date DESC);
