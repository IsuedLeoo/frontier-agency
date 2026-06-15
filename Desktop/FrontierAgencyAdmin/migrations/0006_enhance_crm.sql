-- Frontier Agency CRM Enhancement
-- Adds business, billing, scheduling, and priority fields to clients table

ALTER TABLE clients ADD COLUMN business_description TEXT;
ALTER TABLE clients ADD COLUMN service_type TEXT;
ALTER TABLE clients ADD COLUMN monthly_retainer REAL;
ALTER TABLE clients ADD COLUMN contract_value REAL;
ALTER TABLE clients ADD COLUMN contract_start_date TEXT;
ALTER TABLE clients ADD COLUMN contract_end_date TEXT;
ALTER TABLE clients ADD COLUMN next_due_date TEXT;
ALTER TABLE clients ADD COLUMN support_guarantee_end TEXT;
ALTER TABLE clients ADD COLUMN billing_email TEXT;
ALTER TABLE clients ADD COLUMN address TEXT;
ALTER TABLE clients ADD COLUMN timezone TEXT;
ALTER TABLE clients ADD COLUMN priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'vip'));

CREATE INDEX IF NOT EXISTS idx_clients_priority ON clients(priority);
