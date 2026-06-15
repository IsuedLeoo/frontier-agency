export interface VoiceCall {
  id: string;
  call_control_id: string | null;
  direction: "inbound" | "outbound";
  from_number: string | null;
  to_number: string | null;
  status: "initiated" | "ringing" | "in_progress" | "completed" | "failed" | "no_answer" | "busy" | "canceled";
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

export interface VoiceMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface VoiceContext {
  callId: string;
  callControlId: string;
  direction: "inbound" | "outbound";
  callerNumber: string;
  conversationHistory: VoiceMessage[];
}
