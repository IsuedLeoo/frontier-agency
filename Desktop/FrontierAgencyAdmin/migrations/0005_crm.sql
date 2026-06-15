-- Frontier Agency CRM: Appointments, Clients, Service Docs

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_by TEXT,
  source TEXT DEFAULT 'manual' CHECK(source IN ('manual', 'voice_agent', 'web')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Clients table (CRM)
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  industry TEXT,
  website TEXT,
  status TEXT DEFAULT 'lead' CHECK(status IN ('lead', 'qualified', 'customer', 'inactive')),
  source TEXT DEFAULT 'voice_agent' CHECK(source IN ('voice_agent', 'web', 'referral', 'manual')),
  assigned_to TEXT,
  notes TEXT,
  last_contact_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);

-- Client interactions / notes log
CREATE TABLE IF NOT EXISTS client_notes (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  type TEXT DEFAULT 'note' CHECK(type IN ('note', 'call', 'email', 'meeting', 'voice_call')),
  content TEXT NOT NULL,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_client_notes_client ON client_notes(client_id);

-- Service documentation for Alex
CREATE TABLE IF NOT EXISTS service_docs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT DEFAULT '[]',
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_service_docs_slug ON service_docs(slug);
CREATE INDEX IF NOT EXISTS idx_service_docs_category ON service_docs(category);

-- Insert default service docs
INSERT OR IGNORE INTO service_docs (id, title, slug, category, content, tags) VALUES
('svc-001', 'AI Receptionist', 'ai-receptionist', 'services',
'Frontier Agency AI Receptionist service: An automated phone answering system that handles inbound calls 24/7. Features include intelligent call routing, message taking, appointment scheduling, and natural conversation. Pricing starts at $299/month. Perfect for businesses that miss calls or want to scale their phone operations without hiring receptionists.',
'["receptionist", "phone", "automated", "24/7", "call routing", "appointment scheduling"]'),

('svc-002', 'Email Automation', 'email-automation', 'services',
'Frontier Agency Email Automation: AI-powered email management that sorts, prioritizes, and responds to emails automatically. Learns your writing style and handles routine inquiries. Integrates with Gmail, Outlook, and most email providers. Pricing starts at $199/month. Ideal for businesses drowning in email volume.',
'["email", "automation", "sorting", "responses", "AI"]'),

('svc-003', 'AI Booking System', 'ai-booking', 'services',
'Frontier Agency AI Booking: Automated appointment scheduling system that integrates with your calendar. Handles booking, rescheduling, reminders, and follow-ups via phone, text, or web. Supports multiple staff members and locations. Pricing starts at $249/month. Great for service businesses, medical offices, salons, and consultants.',
'["booking", "scheduling", "calendar", "appointments", "reminders"]'),

('svc-004', 'Competitor Research', 'competitor-research', 'services',
'Frontier Agency Competitor Research: Automated market monitoring that tracks your competitors pricing, marketing moves, hiring, and product changes. Delivered as weekly reports or real-time alerts. Pricing starts at $399/month. Essential for businesses that want to stay ahead of market changes.',
'["competitor", "research", "market", "monitoring", "intelligence"]'),

('svc-005', 'Lead Follow-Up', 'lead-follow-up', 'services',
'Frontier Agency Lead Follow-Up: Automated customer engagement system that nurtures leads through personalized follow-up sequences via phone, email, and text. Never let a lead go cold again. Integrates with your CRM. Pricing starts at $349/month. Perfect for sales teams and businesses with long sales cycles.',
'["leads", "follow-up", "nurturing", "sales", "CRM", "engagement"]'),

('svc-006', 'Custom AI Solutions', 'custom-ai', 'services',
'Frontier Agency Custom AI Solutions: Tailored automation for any business process. Our team builds custom AI agents, workflows, and integrations specific to your needs. From data entry automation to complex decision-making systems. Pricing varies — book a consultation for a custom quote. We serve businesses of all sizes.',
'["custom", "AI", "automation", "bespoke", "enterprise", "consultation"]'),

('svc-007', 'About Frontier Agency', 'about', 'company',
'Frontier Agency is an AI automation company based in Miami, Florida. We help businesses automate repetitive tasks using artificial intelligence. Our services include AI receptionists, email automation, booking systems, competitor research, lead follow-up, and custom AI solutions. We serve businesses of all sizes, from solopreneurs to enterprises. Business hours: Monday-Friday 9AM-6PM Eastern. Contact: (986) 201-0858.',
'["about", "company", "Miami", "Florida", "contact", "hours"]'),

('svc-008', 'Pricing Overview', 'pricing', 'company',
'Frontier Agency Pricing: AI Receptionist from $299/mo. Email Automation from $199/mo. AI Booking from $249/mo. Competitor Research from $399/mo. Lead Follow-Up from $349/mo. Custom AI Solutions — consultation required for pricing. All plans include setup, training, and ongoing support. Annual plans get 2 months free. Book a call for custom enterprise pricing.',
'["pricing", "cost", "plans", "monthly", "annual", "enterprise"]');
