-- Named agent profiles — saves full assistant configurations
CREATE TABLE IF NOT EXISTS voice_agent_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  -- Full system prompt
  system_prompt TEXT NOT NULL DEFAULT '',
  -- First message (what AI says when call connects). Empty = wait for human.
  first_message TEXT NOT NULL DEFAULT '',
  -- If true, AI waits for human to speak first (first_message should be empty or very short)
  wait_for_human_first INTEGER NOT NULL DEFAULT 0,
  -- Voice settings
  voice_provider TEXT NOT NULL DEFAULT 'vapi',
  voice_id TEXT NOT NULL DEFAULT 'Elliot',
  voice_stability REAL NOT NULL DEFAULT 0.5,
  voice_similarity_boost REAL NOT NULL DEFAULT 0.75,
  -- Model
  model_provider TEXT NOT NULL DEFAULT 'openai',
  model_name TEXT NOT NULL DEFAULT 'gpt-4o',
  model_temperature REAL NOT NULL DEFAULT 0.3,
  model_max_tokens INTEGER NOT NULL DEFAULT 512,
  -- Timing
  silence_timeout_seconds INTEGER NOT NULL DEFAULT 45,
  response_delay_seconds INTEGER NOT NULL DEFAULT 3,
  max_duration_seconds INTEGER NOT NULL DEFAULT 300,
  -- Tools enabled (comma-separated list)
  tools_enabled TEXT NOT NULL DEFAULT '',
  -- Status
  is_active INTEGER NOT NULL DEFAULT 1,
  is_default INTEGER NOT NULL DEFAULT 0,
  -- Timestamps
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_agent_profiles_active ON voice_agent_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_default ON voice_agent_profiles(is_default);
