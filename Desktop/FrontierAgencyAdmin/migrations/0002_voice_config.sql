-- Voice Config table (singleton pattern — always one row with id='singleton')
CREATE TABLE IF NOT EXISTS voice_config (
  id TEXT PRIMARY KEY DEFAULT 'singleton',
  -- Outbound settings
  outbound_system_prompt TEXT NOT NULL DEFAULT '',
  outbound_welcome_message TEXT NOT NULL DEFAULT 'Hello, this is Frontier Agency. How can I help you today?',
  outbound_voice_provider TEXT NOT NULL DEFAULT 'elevenlabs',
  outbound_voice_id TEXT NOT NULL DEFAULT '',
  outbound_voice_stability REAL NOT NULL DEFAULT 0.5,
  outbound_voice_similarity_boost REAL NOT NULL DEFAULT 0.75,
  outbound_model TEXT NOT NULL DEFAULT 'openai/gpt-4o',
  outbound_silence_timeout INTEGER NOT NULL DEFAULT 45,
  outbound_response_delay INTEGER NOT NULL DEFAULT 3,
  -- Inbound settings
  inbound_system_prompt TEXT NOT NULL DEFAULT '',
  inbound_welcome_message TEXT NOT NULL DEFAULT 'Thank you for calling Frontier Agency. How can I assist you?',
  inbound_voice_provider TEXT NOT NULL DEFAULT 'elevenlabs',
  inbound_voice_id TEXT NOT NULL DEFAULT '',
  inbound_voice_stability REAL NOT NULL DEFAULT 0.5,
  inbound_voice_similarity_boost REAL NOT NULL DEFAULT 0.75,
  inbound_model TEXT NOT NULL DEFAULT 'openai/gpt-4o',
  inbound_silence_timeout INTEGER NOT NULL DEFAULT 45,
  inbound_response_delay INTEGER NOT NULL DEFAULT 3,
  -- Phone
  phone_number TEXT NOT NULL DEFAULT '+19862010858',
  phone_number_id TEXT NOT NULL DEFAULT '',
  -- Timestamps
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT
);

-- Seed default row
INSERT OR IGNORE INTO voice_config (id) VALUES ('singleton');

-- Scheduled outbound calls
CREATE TABLE IF NOT EXISTS voice_call_schedule (
  id TEXT PRIMARY KEY,
  phone_number TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  initiated_by TEXT,
  metadata TEXT DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_voice_schedule_status ON voice_call_schedule(status);
CREATE INDEX IF NOT EXISTS idx_voice_schedule_scheduled ON voice_call_schedule(scheduled_at);
