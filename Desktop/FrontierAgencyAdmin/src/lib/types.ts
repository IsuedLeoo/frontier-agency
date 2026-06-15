export type UserRole = "admin" | "staff" | "client";

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
}

export interface User extends SafeUser {
  password_hash: string;
}

export interface Client {
  id: string;
  email: string;
  name: string;
  role: "client";
  is_active: boolean;
  created_at: string;
  created_by: string | null;
  project_count?: number;
  total_invoiced?: number;
  total_paid?: number;
}

export interface Invoice {
  id: string;
  client_id: string;
  client_name?: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  description: string | null;
  service_type: string | null;
  due_date: string | null;
  paid_date: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface Document {
  id: string;
  title: string;
  category: "handbook" | "intelligence" | "contracts" | "reports" | "other";
  content_type: string;
  content: string | null;
  file_size: number | null;
  version: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface DashboardStats {
  total_clients: number;
  total_staff: number;
  active_projects: number;
  monthly_revenue: number;
  outstanding_invoices: number;
  recent_invoices: Invoice[];
  recent_clients: Client[];
}

// ─── CRM Types ────────────────────────────────────────────────────────────────

export interface CrmClient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  industry: string | null;
  website: string | null;
  status: "lead" | "qualified" | "customer" | "inactive";
  source: "voice_agent" | "web" | "referral" | "manual";
  assigned_to: string | null;
  notes: string | null;
  last_contact_at: string | null;
  created_at: string;
  updated_at: string;
  business_description: string | null;
  service_type: string | null;
  monthly_retainer: number | null;
  contract_value: number | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  next_due_date: string | null;
  support_guarantee_end: string | null;
  billing_email: string | null;
  address: string | null;
  timezone: string | null;
  priority: "low" | "medium" | "high" | "vip";
}

export interface Appointment {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes: string | null;
  created_by: string | null;
  source: "manual" | "voice_agent" | "web";
  created_at: string;
  updated_at: string;
}

export interface ClientNote {
  id: string;
  client_id: string;
  type: "note" | "call" | "email" | "meeting" | "voice_call";
  content: string;
  created_by: string | null;
  created_at: string;
}

export interface ServiceDoc {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  tags: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface VoiceCall {
  id: string;
  call_control_id: string | null;
  direction: "inbound" | "outbound";
  from_number: string | null;
  to_number: string | null;
  status: string;
  started_at: string;
  answered_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  transcript: string | null;
  summary: string | null;
  recording_url: string | null;
  initiated_by: string | null;
  created_at: string;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface AnalyticsSession {
  id: string;
  fingerprint: string;
  first_seen_at: string;
  last_seen_at: string;
  user_agent: string | null;
  device_type: "mobile" | "tablet" | "desktop" | null;
  browser: string | null;
  os: string | null;
  screen_width: number | null;
  screen_height: number | null;
  country: string | null;
  city: string | null;
  region: string | null;
  timezone: string | null;
  language: string | null;
  visit_count: number;
}

export interface AnalyticsPageView {
  id: string;
  session_id: string;
  page_path: string;
  page_title: string | null;
  referrer: string | null;
  referrer_source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  viewed_at: string;
  duration_seconds: number | null;
  scroll_depth_max: number | null;
  is_bounce: number;
}

export interface AnalyticsEvent {
  id: string;
  session_id: string;
  page_path: string;
  event_type: "section_view" | "button_click" | "link_click" | "outbound_click" | "cta_click" | "form_submit" | "custom";
  event_name: string | null;
  event_data: string | null;
  created_at: string;
}

export interface AnalyticsDailyStats {
  date: string;
  page_path: string;
  page_views: number;
  unique_visitors: number;
  sessions_count: number;
  avg_duration_seconds: number;
  bounce_count: number;
  total_scroll_depth: number;
}

// ─── Voice Config ───────────────────────────────────────────────────────────

export interface VoiceConfig {
  id: string;
  outbound_system_prompt: string;
  outbound_welcome_message: string;
  outbound_voice_provider: string;
  outbound_voice_id: string;
  outbound_voice_stability: number;
  outbound_voice_similarity_boost: number;
  outbound_model: string;
  outbound_silence_timeout: number;
  outbound_response_delay: number;
  inbound_system_prompt: string;
  inbound_welcome_message: string;
  inbound_voice_provider: string;
  inbound_voice_id: string;
  inbound_voice_stability: number;
  inbound_voice_similarity_boost: number;
  inbound_model: string;
  inbound_silence_timeout: number;
  inbound_response_delay: number;
  phone_number: string;
  phone_number_id: string;
  updated_at: string;
  updated_by: string | null;
}

// ─── Scheduled Call ─────────────────────────────────────────────────────────

export interface ScheduledCall {
  id: string;
  phone_number: string;
  scheduled_at: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  initiated_by: string | null;
  metadata: string;
  created_at: string;
  completed_at: string | null;
}

// ─── Agent Profile ──────────────────────────────────────────────────────────

export interface AgentProfile {
  id: string;
  name: string;
  description: string;
  system_prompt: string;
  first_message: string;
  wait_for_human_first: boolean;
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
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

// ─── Call Script ─────────────────────────────────────────────────────────────

export interface CallScript {
  id: string;
  name: string;
  description: string;
  category: string;
  system_prompt: string;
  first_message: string;
  persona: string;
  target_business: string;
  voice_speed: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}
