"use client";

import { useState, useEffect, useCallback } from "react";
import type { VoiceConfig, VoiceCall, ScheduledCall, CallScript, AgentProfile } from "@/lib/types";
import {
  Phone,
  Save,
  Loader2,
  Send,
  CalendarClock,
  X,
  Check,
  AlertCircle,
  Settings2,
  List,
  FileText,
  Play,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Zap,
  Bot,
  User,
  Star,
  Copy,
  PhoneIncoming,
  PhoneOutgoing,
  RotateCcw,
} from "lucide-react";
import { buildOutboundSystemPrompt, buildInboundSystemPrompt } from "@/lib/voice/system-prompt";

type Tab = "outbound" | "inbound" | "scheduled" | "scripts" | "agents";

const VOICE_PROVIDERS = [
  { value: "elevenlabs", label: "ElevenLabs" },
  { value: "playht", label: "PlayHT" },
  { value: "openai", label: "OpenAI" },
];

const MODELS = [
  { value: "openai/gpt-4o", label: "GPT-4o (Best quality)" },
  { value: "openai/gpt-4o-mini", label: "GPT-4o Mini (Faster, cheaper)" },
  { value: "anthropic/claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
];

export default function VoiceConfigClient() {
  const [activeTab, setActiveTab] = useState<Tab>("outbound");
  const [config, setConfig] = useState<VoiceConfig | null>(null);
  const [calls, setCalls] = useState<VoiceCall[]>([]);
  const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>([]);
  const [scripts, setScripts] = useState<CallScript[]>([]);
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Outbound call form
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  const [callSuccess, setCallSuccess] = useState<string | null>(null);

  // Schedule form
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  // Script selector for calls
  const [selectedScript, setSelectedScript] = useState<string>("");
  const [showScriptPicker, setShowScriptPicker] = useState(false);

  // Script editor
  const [editingScript, setEditingScript] = useState<CallScript | null>(null);
  const [isEditingScript, setIsEditingScript] = useState(false);
  const [isSavingScript, setIsSavingScript] = useState(false);

  // Agent editor
  const [editingAgent, setEditingAgent] = useState<AgentProfile | null>(null);
  const [isEditingAgent, setIsEditingAgent] = useState(false);
  const [isSavingAgent, setIsSavingAgent] = useState(false);

  // Collapsible config sections
  const [outboundConfigOpen, setOutboundConfigOpen] = useState(false);
  const [inboundConfigOpen, setInboundConfigOpen] = useState(false);

  // Active call tracking
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [activeCallStatus, setActiveCallStatus] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/voice/config", { credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as { config: VoiceConfig };
        setConfig(data.config);
      }
    } catch { /* silent */ }
  }, []);

  const fetchCalls = useCallback(async () => {
    try {
      const res = await fetch("/api/voice/calls?limit=50", { credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as { calls: VoiceCall[]; scheduled_calls: ScheduledCall[] };
        setCalls(data.calls ?? []);
        setScheduledCalls(data.scheduled_calls ?? []);
      }
    } catch { /* silent */ }
  }, []);

  const fetchScripts = useCallback(async () => {
    try {
      const res = await fetch("/api/voice/scripts", { credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as { scripts: CallScript[] };
        setScripts(data.scripts ?? []);
      }
    } catch { /* silent */ }
  }, []);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch("/api/voice/agents", { credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as { agents: AgentProfile[] };
        setAgents(data.agents ?? []);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchConfig(), fetchCalls(), fetchScripts(), fetchAgents()]).finally(() => setIsLoading(false));
  }, [fetchConfig, fetchCalls, fetchScripts, fetchAgents]);

  const activeScript = scripts.find((s) => s.id === selectedScript);

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/voice/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(config),
      });

      const data = (await res.json()) as { config?: VoiceConfig; error?: string; warning?: string };

      if (res.ok) {
        const msg = data.warning ?? "Configuration saved.";
        setSaveMessage({ type: "success", text: msg });
        if (data.config) setConfig(data.config);
      } else {
        setSaveMessage({ type: "error", text: data.error ?? "Failed to save" });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Network error" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  const handleCall = async () => {
    const trimmed = phoneNumber.trim();
    if (!trimmed) return;

    setIsCalling(true);
    setCallError(null);
    setCallSuccess(null);

    try {
      const body: Record<string, unknown> = { phone_number: trimmed };

      if (showSchedule && scheduleDate && scheduleTime) {
        body.scheduled_at = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      }

      // If a script is selected, send voice overrides
      if (activeScript) {
        body.voice_overrides = {
          system_prompt: activeScript.system_prompt,
          welcome_message: activeScript.first_message,
          model: config?.outbound_model ?? "openai/gpt-4o",
        };
      }

      const res = await fetch("/api/voice/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to initiate call");
      }

      setCallSuccess(data.message ?? "Call initiated");
      setPhoneNumber("");
      setShowSchedule(false);
      setScheduleDate("");
      setScheduleTime("");
      fetchCalls();
    } catch (err) {
      setCallError(err instanceof Error ? err.message : "Call failed");
    } finally {
      setIsCalling(false);
    }
  };

  const handleCancelSchedule = async (id: string) => {
    try {
      await fetch(`/api/voice/call/schedule/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "cancelled" }),
      });
      fetchCalls();
    } catch { /* silent */ }
  };

  const handleSaveScript = async () => {
    if (!editingScript) return;
    setIsSavingScript(true);

    try {
      const isNew = !scripts.find((s) => s.id === editingScript.id);
      const url = isNew ? "/api/voice/scripts" : `/api/voice/scripts/${editingScript.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editingScript),
      });

      if (res.ok) {
        setEditingScript(null);
        setIsEditingScript(false);
        fetchScripts();
      }
    } catch {
      // silent
    } finally {
      setIsSavingScript(false);
    }
  };

  const handleDeleteScript = async (id: string) => {
    if (!confirm("Delete this script?")) return;
    try {
      await fetch(`/api/voice/scripts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (selectedScript === id) setSelectedScript("");
      fetchScripts();
    } catch { /* silent */ }
  };

  const handleSaveAgent = async () => {
    if (!editingAgent) return;
    setIsSavingAgent(true);

    try {
      const isNew = !agents.find((a) => a.id === editingAgent.id);
      const url = isNew ? "/api/voice/agents" : `/api/voice/agents/${editingAgent.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editingAgent),
      });

      if (res.ok) {
        setEditingAgent(null);
        setIsEditingAgent(false);
        fetchAgents();
      }
    } catch {
      // silent
    } finally {
      setIsSavingAgent(false);
    }
  };

  const handleDeleteAgent = async (id: string) => {
    if (!confirm("Delete this agent?")) return;
    try {
      await fetch(`/api/voice/agents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchAgents();
    } catch { /* silent */ }
  };

  const handleDuplicateAgent = (agent: AgentProfile) => {
    const dup: AgentProfile = {
      ...agent,
      id: "",
      name: `${agent.name} (Copy)`,
      is_default: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEditingAgent(dup);
    setIsEditingAgent(true);
  };

  const handleRestoreOutbound = () => {
    if (!config) return;
    setConfig({
      ...config,
      outbound_system_prompt: buildOutboundSystemPrompt(),
      outbound_welcome_message: "",
    });
  };

  const handleRestoreInbound = () => {
    if (!config) return;
    setConfig({
      ...config,
      inbound_system_prompt: buildInboundSystemPrompt(),
      inbound_welcome_message: "Thank you for calling Frontier Agency, how can I help you?",
    });
  };

  const updateConfig = (field: keyof VoiceConfig, value: string | number) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  };

  const getDirectionCalls = (direction: "inbound" | "outbound") =>
    calls.filter((c) => c.direction === direction);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-[#555]" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-64 text-[#888]">
        Failed to load voice configuration.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Voice Agent
        </h2>
        <p className="text-sm text-[#888] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
          Configure AI phone agents and manage call scripts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#1a1a1a]">
        {([
          { key: "outbound" as Tab, label: "Outbound", icon: Send },
          { key: "inbound" as Tab, label: "Inbound", icon: Phone },
          { key: "scheduled" as Tab, label: "Scheduled", icon: CalendarClock },
          { key: "scripts" as Tab, label: "Scripts", icon: FileText },
          { key: "agents" as Tab, label: "Agents", icon: Bot },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === key
                ? "border-[#C5A55A] text-white"
                : "border-transparent text-[#555] hover:text-[#888]"
            }`}
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Save message */}
      {saveMessage && (
        <div
          className={`flex items-center gap-2 px-4 py-3 text-sm ${
            saveMessage.type === "success"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {saveMessage.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          {saveMessage.text}
        </div>
      )}

      {/* ─── OUTBOUND TAB ─── */}
      {activeTab === "outbound" && (
        <div className="space-y-6">
          {/* Active call banner */}
          {(isCalling || activeCallId) && (
            <div className="card border-[#C5A55A]/40 bg-[#C5A55A]/5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#C5A55A] animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-[#C5A55A]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {isCalling ? "Calling..." : `Call ${activeCallStatus ?? "in progress"}`}
                  </p>
                  <p className="text-[0.65rem] text-[#888]" style={{ fontFamily: "var(--font-inter)" }}>
                    {phoneNumber && `Dialing ${phoneNumber}`}
                    {activeCallId && ` · ID: ${activeCallId.slice(0, 8)}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Quick Call Form (at top) ── */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <PhoneOutgoing size={18} className="text-[#C5A55A]" />
              <h3 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Make an Outbound Call
              </h3>
            </div>
            <div className="space-y-4">
              {/* Script selector */}
              {scripts.length > 0 && (
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                    Call Script (optional — overrides system prompt)
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowScriptPicker(!showScriptPicker)}
                      className="w-full flex items-center justify-between bg-[#111] border border-[#222] px-4 py-2.5 text-sm text-left hover:border-[#333] transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      <span className={activeScript ? "text-white" : "text-[#555]"}>
                        {activeScript ? (
                          <span className="flex items-center gap-2">
                            <FileText size={14} className="text-[#C5A55A]" />
                            <span className="text-[#C5A55A] font-medium">{activeScript.name}</span>
                            <span className="text-[#555]">— {activeScript.target_business} ({activeScript.persona})</span>
                          </span>
                        ) : "No script selected (uses default prompt)"}
                      </span>
                      <ChevronDown size={14} className="text-[#555]" />
                    </button>
                    {showScriptPicker && (
                      <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-[#111] border border-[#222] shadow-xl max-h-64 overflow-y-auto">
                        <button
                          onClick={() => { setSelectedScript(""); setShowScriptPicker(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-[#555] hover:bg-white/5 hover:text-white transition-colors border-b border-[#1a1a1a]"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          No script (use default)
                        </button>
                        {scripts.filter((s) => s.is_active).map((script) => (
                          <button
                            key={script.id}
                            onClick={() => { setSelectedScript(script.id); setShowScriptPicker(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors border-b border-[#1a1a1a] ${
                              selectedScript === script.id ? "bg-[#C5A55A]/10 text-[#C5A55A]" : "text-white"
                            }`}
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            <div className="font-medium">{script.name}</div>
                            <div className="text-[0.65rem] text-[#555] mt-0.5">{script.target_business} · {script.persona}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !showScriptPicker) { e.preventDefault(); handleCall(); } }}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-[#111] border border-[#222] pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#444] focus:border-[#C5A55A] focus:outline-none"
                    style={{ fontFamily: "var(--font-inter)" }}
                  />
                </div>
                <button onClick={handleCall} disabled={!phoneNumber.trim() || isCalling} className="px-5 py-2.5 bg-[#C5A55A] text-black font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#d4b46a] transition-colors shrink-0 flex items-center gap-2" style={{ fontFamily: "var(--font-inter)" }}>
                  {isCalling ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} />}
                  {isCalling ? "Calling..." : "Call Now"}
                </button>
                <button onClick={() => setShowSchedule(!showSchedule)} className={`px-4 py-2.5 text-sm font-medium transition-colors shrink-0 flex items-center gap-2 border ${showSchedule ? "bg-[#C5A55A]/10 border-[#C5A55A]/30 text-[#C5A55A]" : "border-[#222] text-[#888] hover:text-white hover:border-[#444]"}`} style={{ fontFamily: "var(--font-inter)" }}>
                  <CalendarClock size={16} />
                  Schedule
                </button>
              </div>

              {showSchedule && (
                <div className="flex gap-2 items-end">
                  <div>
                    <label className="block text-[0.65rem] uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Date</label>
                    <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Time</label>
                    <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                  <button onClick={handleCall} disabled={!phoneNumber.trim() || !scheduleDate || !scheduleTime || isCalling} className="px-4 py-2 bg-[#C5A55A] text-black text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#d4b46a] transition-colors flex items-center gap-2" style={{ fontFamily: "var(--font-inter)" }}>
                    <CalendarClock size={14} />
                    Schedule Call
                  </button>
                </div>
              )}

              {callError && (<p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={12} /> {callError}</p>)}
              {callSuccess && (<p className="text-xs text-green-400 flex items-center gap-1"><Check size={12} /> {callSuccess}</p>)}
              <p className="text-[0.6rem] text-[#333]">Calling from: <span className="text-[#555]">{config.phone_number}</span></p>
            </div>
          </div>

          {/* ── Recent Outbound Calls (quick view) ── */}
          {getDirectionCalls("outbound").length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <List size={16} className="text-[#C5A55A]" />
                  <h4 className="text-sm font-semibold" style={{ fontFamily: "var(--font-space-grotesk)" }}>Recent Outbound Calls</h4>
                </div>
                <span className="text-[0.6rem] text-[#444]">{getDirectionCalls("outbound").length} total</span>
              </div>
              <div className="space-y-2">
                {getDirectionCalls("outbound").slice(0, 5).map((call) => (
                  <div key={call.id} className="flex items-center justify-between py-2 px-3 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#333] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <PhoneOutgoing size={12} className="text-[#555] shrink-0" />
                      <span className="text-sm text-white truncate">{call.to_number ?? "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <CallStatusBadge status={call.status} />
                      <span className="text-[0.6rem] text-[#444] w-16 text-right">
                        {call.duration_seconds ? `${Math.floor(call.duration_seconds / 60)}m ${call.duration_seconds % 60}s` : "—"}
                      </span>
                      <span className="text-[0.6rem] text-[#333] w-20 text-right">
                        {new Date(call.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Advanced Settings (collapsible) ── */}
          <div className="card">
            <button
              onClick={() => setOutboundConfigOpen(!outboundConfigOpen)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Settings2 size={16} className="text-[#C5A55A]" />
                <h4 className="text-sm font-semibold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  Advanced Settings
                </h4>
                <span className="text-[0.6rem] text-[#444]">· System prompt, voice, model</span>
              </div>
              {outboundConfigOpen ? <ChevronUp size={16} className="text-[#555]" /> : <ChevronDown size={16} className="text-[#555]" />}
            </button>

            {outboundConfigOpen && (
              <div className="mt-5 space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555]" style={{ fontFamily: "var(--font-inter)" }}>System Prompt</label>
                    <button onClick={handleRestoreOutbound} className="text-[0.6rem] text-[#C5A55A] hover:text-[#d4b46a] flex items-center gap-1" title="Restore default outbound prompt">
                      <RotateCcw size={10} /> Restore default
                    </button>
                  </div>
                  <textarea value={config.outbound_system_prompt} onChange={(e) => updateConfig("outbound_system_prompt", e.target.value)} rows={8} className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm text-white placeholder-[#444] focus:border-[#C5A55A] focus:outline-none resize-y font-mono" placeholder="You are the AI outbound caller for Frontier Agency..." style={{ fontFamily: "var(--font-inter)" }} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Welcome Message</label>
                  <textarea value={config.outbound_welcome_message} onChange={(e) => updateConfig("outbound_welcome_message", e.target.value)} rows={3} className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm text-white placeholder-[#444] focus:border-[#C5A55A] focus:outline-none resize-y" placeholder="Hello, this is Frontier Agency..." style={{ fontFamily: "var(--font-inter)" }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Voice Provider</label>
                    <select value={config.outbound_voice_provider} onChange={(e) => updateConfig("outbound_voice_provider", e.target.value)} className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }}>
                      {VOICE_PROVIDERS.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Voice ID</label>
                    <input type="text" value={config.outbound_voice_id} onChange={(e) => updateConfig("outbound_voice_id", e.target.value)} className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-sm text-white placeholder-[#444] focus:border-[#C5A55A] focus:outline-none" placeholder="e.g. 21m00Tcm4TlvDq8ikWAM" style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Voice Stability: {config.outbound_voice_stability}</label>
                    <input type="range" min="0" max="1" step="0.05" value={config.outbound_voice_stability} onChange={(e) => updateConfig("outbound_voice_stability", parseFloat(e.target.value))} className="w-full accent-[#C5A55A]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Similarity Boost: {config.outbound_voice_similarity_boost}</label>
                    <input type="range" min="0" max="1" step="0.05" value={config.outbound_voice_similarity_boost} onChange={(e) => updateConfig("outbound_voice_similarity_boost", parseFloat(e.target.value))} className="w-full accent-[#C5A55A]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>AI Model</label>
                  <select value={config.outbound_model} onChange={(e) => updateConfig("outbound_model", e.target.value)} className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }}>
                    {MODELS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Silence Timeout (seconds)</label>
                    <input type="number" value={config.outbound_silence_timeout} onChange={(e) => updateConfig("outbound_silence_timeout", parseInt(e.target.value) || 0)} className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-sm text-white focus:border-[#C5A55A] focus:outline-none" min={5} max={120} style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Response Delay (seconds)</label>
                    <input type="number" value={config.outbound_response_delay} onChange={(e) => updateConfig("outbound_response_delay", parseInt(e.target.value) || 0)} className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-sm text-white focus:border-[#C5A55A] focus:outline-none" min={0} max={10} step={0.5} style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                </div>
                <div className="pt-2 flex gap-2">
                  <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-[#C5A55A] text-black font-medium text-sm hover:bg-[#d4b46a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSaving ? "Saving..." : "Save Outbound Config"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── INBOUND TAB ─── */}
      {activeTab === "inbound" && (
        <div className="space-y-6">
          {/* Inbound stats */}
          {getDirectionCalls("inbound").length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="card text-center">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {getDirectionCalls("inbound").length}
                </p>
                <p className="text-[0.6rem] uppercase tracking-[0.1em] text-[#555] mt-1" style={{ fontFamily: "var(--font-inter)" }}>Total Calls</p>
              </div>
              <div className="card text-center">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {(() => {
                    const total = getDirectionCalls("inbound").reduce((sum, c) => sum + (c.duration_seconds ?? 0), 0);
                    const avg = Math.round(total / getDirectionCalls("inbound").length);
                    return `${Math.floor(avg / 60)}m ${avg % 60}s`;
                  })()}
                </p>
                <p className="text-[0.6rem] uppercase tracking-[0.1em] text-[#555] mt-1" style={{ fontFamily: "var(--font-inter)" }}>Avg Duration</p>
              </div>
              <div className="card text-center">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {getDirectionCalls("inbound").filter((c) => c.status === "completed").length}
                </p>
                <p className="text-[0.6rem] uppercase tracking-[0.1em] text-[#555] mt-1" style={{ fontFamily: "var(--font-inter)" }}>Completed</p>
              </div>
            </div>
          )}

          {/* Phone number info */}
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C5A55A]/10 flex items-center justify-center">
                <PhoneIncoming size={18} className="text-[#C5A55A]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>Inbound Number</p>
                <p className="text-lg font-bold text-[#C5A55A]" style={{ fontFamily: "var(--font-space-grotesk)" }}>{config.phone_number}</p>
                <p className="text-[0.6rem] text-[#444]" style={{ fontFamily: "var(--font-inter)" }}>Call this number to test inbound handling</p>
              </div>
            </div>
          </div>

          {/* Recent inbound calls */}
          {getDirectionCalls("inbound").length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <List size={16} className="text-[#C5A55A]" />
                  <h4 className="text-sm font-semibold" style={{ fontFamily: "var(--font-space-grotesk)" }}>Recent Inbound Calls</h4>
                </div>
              </div>
              <div className="space-y-2">
                {getDirectionCalls("inbound").slice(0, 5).map((call) => (
                  <div key={call.id} className="flex items-center justify-between py-2 px-3 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#333] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <PhoneIncoming size={12} className="text-[#555] shrink-0" />
                      <span className="text-sm text-white truncate">{call.from_number ?? "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <CallStatusBadge status={call.status} />
                      <span className="text-[0.6rem] text-[#444] w-16 text-right">
                        {call.duration_seconds ? `${Math.floor(call.duration_seconds / 60)}m ${call.duration_seconds % 60}s` : "—"}
                      </span>
                      <span className="text-[0.6rem] text-[#333] w-20 text-right">
                        {new Date(call.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {getDirectionCalls("inbound").length === 0 && (
            <div className="card">
              <p className="text-sm text-[#555] text-center py-6">No inbound calls yet. Call <span className="text-[#C5A55A]">{config.phone_number}</span> to test.</p>
            </div>
          )}

          {/* ── Advanced Settings (collapsible) ── */}
          <div className="card">
            <button
              onClick={() => setInboundConfigOpen(!inboundConfigOpen)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Settings2 size={16} className="text-[#C5A55A]" />
                <h4 className="text-sm font-semibold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  Advanced Settings
                </h4>
                <span className="text-[0.6rem] text-[#444]">· System prompt, voice, model</span>
              </div>
              {inboundConfigOpen ? <ChevronUp size={16} className="text-[#555]" /> : <ChevronDown size={16} className="text-[#555]" />}
            </button>

            {inboundConfigOpen && (
              <div className="mt-5 space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555]" style={{ fontFamily: "var(--font-inter)" }}>System Prompt</label>
                    <button onClick={handleRestoreInbound} className="text-[0.6rem] text-[#C5A55A] hover:text-[#d4b46a] flex items-center gap-1" title="Restore default inbound prompt">
                      <RotateCcw size={10} /> Restore default
                    </button>
                  </div>
                  <textarea value={config.inbound_system_prompt} onChange={(e) => updateConfig("inbound_system_prompt", e.target.value)} rows={8} className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm text-white placeholder-[#444] focus:border-[#C5A55A] focus:outline-none resize-y font-mono" placeholder="You are the AI phone receptionist for Frontier Agency..." style={{ fontFamily: "var(--font-inter)" }} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Welcome Message</label>
                  <textarea value={config.inbound_welcome_message} onChange={(e) => updateConfig("inbound_welcome_message", e.target.value)} rows={3} className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm text-white placeholder-[#444] focus:border-[#C5A55A] focus:outline-none resize-y" placeholder="Thank you for calling Frontier Agency..." style={{ fontFamily: "var(--font-inter)" }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Voice Provider</label>
                    <select value={config.inbound_voice_provider} onChange={(e) => updateConfig("inbound_voice_provider", e.target.value)} className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }}>
                      {VOICE_PROVIDERS.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Voice ID</label>
                    <input type="text" value={config.inbound_voice_id} onChange={(e) => updateConfig("inbound_voice_id", e.target.value)} className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-sm text-white placeholder-[#444] focus:border-[#C5A55A] focus:outline-none" placeholder="e.g. 21m00Tcm4TlvDq8ikWAM" style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Voice Stability: {config.inbound_voice_stability}</label>
                    <input type="range" min="0" max="1" step="0.05" value={config.inbound_voice_stability} onChange={(e) => updateConfig("inbound_voice_stability", parseFloat(e.target.value))} className="w-full accent-[#C5A55A]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Similarity Boost: {config.inbound_voice_similarity_boost}</label>
                    <input type="range" min="0" max="1" step="0.05" value={config.inbound_voice_similarity_boost} onChange={(e) => updateConfig("inbound_voice_similarity_boost", parseFloat(e.target.value))} className="w-full accent-[#C5A55A]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>AI Model</label>
                  <select value={config.inbound_model} onChange={(e) => updateConfig("inbound_model", e.target.value)} className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }}>
                    {MODELS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Silence Timeout (seconds)</label>
                    <input type="number" value={config.inbound_silence_timeout} onChange={(e) => updateConfig("inbound_silence_timeout", parseInt(e.target.value) || 0)} className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-sm text-white focus:border-[#C5A55A] focus:outline-none" min={5} max={120} style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-2" style={{ fontFamily: "var(--font-inter)" }}>Response Delay (seconds)</label>
                    <input type="number" value={config.inbound_response_delay} onChange={(e) => updateConfig("inbound_response_delay", parseInt(e.target.value) || 0)} className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-sm text-white focus:border-[#C5A55A] focus:outline-none" min={0} max={10} step={0.5} style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                </div>
                <div className="pt-2 flex gap-2">
                  <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-[#C5A55A] text-black font-medium text-sm hover:bg-[#d4b46a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSaving ? "Saving..." : "Save Inbound Config"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SCHEDULED TAB ─── */}
      {activeTab === "scheduled" && (
        <div className="space-y-8">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock size={18} className="text-[#C5A55A]" />
              <h3 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>Scheduled Calls</h3>
            </div>
            {scheduledCalls.length === 0 ? (
              <p className="text-sm text-[#555] text-center py-8">No scheduled calls.</p>
            ) : (
              <div className="overflow-x-auto">
                <table>
                  <thead><tr><th>Phone Number</th><th>Scheduled For</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
                  <tbody>
                    {scheduledCalls.map((sc) => (
                      <tr key={sc.id}>
                        <td className="text-white text-sm">{sc.phone_number}</td>
                        <td className="text-[#888] text-sm">{new Date(sc.scheduled_at).toLocaleString()}</td>
                        <td><ScheduledStatusBadge status={sc.status} /></td>
                        <td className="text-[#555] text-xs">{new Date(sc.created_at).toLocaleString()}</td>
                        <td>
                          {sc.status === "pending" && (
                            <button onClick={() => handleCancelSchedule(sc.id)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                              <X size={12} /> Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SCRIPTS TAB ─── */}
      {activeTab === "scripts" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Call Scripts
              </h3>
              <p className="text-xs text-[#555] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                Manage cold call scripts. Select one from the Outbound tab before placing a call.
              </p>
            </div>
            <button
              onClick={() => {
                const newScript: CallScript = {
                  id: "",
                  name: "New Script",
                  description: "",
                  category: "cold_call",
                  system_prompt: "You are a friendly caller. Write your prompt here.",
                  first_message: "Hey, quick question.",
                  persona: "customer",
                  target_business: "general",
                  voice_speed: 0.85,
                  is_active: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  created_by: null,
                };
                setEditingScript(newScript);
                setIsEditingScript(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#C5A55A] text-black text-sm font-medium hover:bg-[#d4b46a] transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <Plus size={14} />
              New Script
            </button>
          </div>

          {/* Script editor modal */}
          {isEditingScript && editingScript && (
            <div className="card border border-[#C5A55A]/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-[#C5A55A]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {editingScript.id ? "Edit Script" : "New Script"}
                </h4>
                <button onClick={() => { setIsEditingScript(false); setEditingScript(null); }} className="text-[#555] hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Name</label>
                    <input type="text" value={editingScript.name} onChange={(e) => setEditingScript({ ...editingScript, name: e.target.value })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Category</label>
                    <input type="text" value={editingScript.category} onChange={(e) => setEditingScript({ ...editingScript, category: e.target.value })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" placeholder="cold_call, follow_up, etc." style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Description</label>
                  <input type="text" value={editingScript.description} onChange={(e) => setEditingScript({ ...editingScript, description: e.target.value })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Persona</label>
                    <select value={editingScript.persona} onChange={(e) => setEditingScript({ ...editingScript, persona: e.target.value })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }}>
                      <option value="customer">Customer</option>
                      <option value="friend">Friend</option>
                      <option value="professional">Professional</option>
                      <option value="partner">Partner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Target Business</label>
                    <input type="text" value={editingScript.target_business} onChange={(e) => setEditingScript({ ...editingScript, target_business: e.target.value })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" placeholder="cigar_shop, roofing, etc." style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Voice Speed: {editingScript.voice_speed}</label>
                    <input type="range" min="0.5" max="1.5" step="0.05" value={editingScript.voice_speed} onChange={(e) => setEditingScript({ ...editingScript, voice_speed: parseFloat(e.target.value) })} className="w-full accent-[#C5A55A]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>First Message</label>
                  <input type="text" value={editingScript.first_message} onChange={(e) => setEditingScript({ ...editingScript, first_message: e.target.value })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>System Prompt</label>
                  <textarea value={editingScript.system_prompt} onChange={(e) => setEditingScript({ ...editingScript, system_prompt: e.target.value })} rows={12} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#C5A55A] focus:outline-none resize-y font-mono" style={{ fontFamily: "var(--font-inter)" }} />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveScript} disabled={isSavingScript} className="flex items-center gap-2 px-4 py-2 bg-[#C5A55A] text-black text-sm font-medium hover:bg-[#d4b46a] disabled:opacity-50 transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
                    {isSavingScript ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {isSavingScript ? "Saving..." : "Save Script"}
                  </button>
                  <button onClick={() => { setIsEditingScript(false); setEditingScript(null); }} className="px-4 py-2 border border-[#222] text-sm text-[#888] hover:text-white transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Scripts list */}
          {scripts.length === 0 ? (
            <div className="card">
              <p className="text-sm text-[#555] text-center py-8">No scripts yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scripts.map((script) => (
                <div key={script.id} className="card hover:border-[#333] transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-[#C5A55A] shrink-0" />
                        <h4 className="text-sm font-semibold text-white truncate" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          {script.name}
                        </h4>
                        <span className="text-[0.6rem] uppercase tracking-wider px-2 py-0.5 bg-[#1a1a1a] text-[#555] shrink-0">
                          {script.category}
                        </span>
                        {!script.is_active && (
                          <span className="text-[0.6rem] uppercase tracking-wider px-2 py-0.5 bg-red-500/10 text-red-400 shrink-0">
                            inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#666] mt-1 line-clamp-2" style={{ fontFamily: "var(--font-inter)" }}>
                        {script.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[0.6rem] text-[#444]">
                        <span>🎭 {script.persona}</span>
                        <span>🏢 {script.target_business}</span>
                        <span>⚡ {script.voice_speed}x speed</span>
                        <span className="text-[#333]">"{script.first_message.slice(0, 40)}..."</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-4">
                      <button
                        onClick={() => { navigator.clipboard.writeText(script.system_prompt); }}
                        className="p-2 text-[#555] hover:text-white transition-colors"
                        title="Copy prompt"
                      >
                        <FileText size={14} />
                      </button>
                      <button
                        onClick={() => { setEditingScript(script); setIsEditingScript(true); }}
                        className="p-2 text-[#555] hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Settings2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteScript(script.id)}
                        className="p-2 text-[#555] hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── AGENTS TAB ─── */}
      {activeTab === "agents" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Agent Profiles
              </h3>
              <p className="text-xs text-[#555] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                Save and manage full agent configurations. Each agent has its own voice, model, prompt, and behavior settings.
              </p>
            </div>
            <button
              onClick={() => {
                const newAgent: AgentProfile = {
                  id: "",
                  name: "New Agent",
                  description: "",
                  system_prompt: "You are a helpful AI assistant. Write your prompt here.",
                  first_message: "",
                  wait_for_human_first: true,
                  voice_provider: "vapi",
                  voice_id: "Elliot",
                  voice_stability: 0.5,
                  voice_similarity_boost: 0.75,
                  model_provider: "openai",
                  model_name: "gpt-4o",
                  model_temperature: 0.3,
                  model_max_tokens: 512,
                  silence_timeout_seconds: 45,
                  response_delay_seconds: 3,
                  max_duration_seconds: 300,
                  tools_enabled: "",
                  is_active: true,
                  is_default: false,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  created_by: null,
                };
                setEditingAgent(newAgent);
                setIsEditingAgent(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#C5A55A] text-black text-sm font-medium hover:bg-[#d4b46a] transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <Plus size={14} />
              New Agent
            </button>
          </div>

          {/* Agent editor modal */}
          {isEditingAgent && editingAgent && (
            <div className="card border border-[#C5A55A]/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-[#C5A55A]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {editingAgent.id ? "Edit Agent" : "New Agent"}
                </h4>
                <button onClick={() => { setIsEditingAgent(false); setEditingAgent(null); }} className="text-[#555] hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Name</label>
                    <input type="text" value={editingAgent.name} onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Description</label>
                    <input type="text" value={editingAgent.description} onChange={(e) => setEditingAgent({ ...editingAgent, description: e.target.value })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Voice Provider</label>
                    <select value={editingAgent.voice_provider} onChange={(e) => setEditingAgent({ ...editingAgent, voice_provider: e.target.value })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }}>
                      <option value="vapi">Vapi</option>
                      <option value="elevenlabs">ElevenLabs</option>
                      <option value="openai">OpenAI</option>
                      <option value="playht">PlayHT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Voice ID</label>
                    <input type="text" value={editingAgent.voice_id} onChange={(e) => setEditingAgent({ ...editingAgent, voice_id: e.target.value })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" placeholder="Elliot, Adam, etc." style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Model</label>
                    <select value={editingAgent.model_name} onChange={(e) => setEditingAgent({ ...editingAgent, model_name: e.target.value })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }}>
                      <option value="gpt-4o">GPT-4o</option>
                      <option value="gpt-4o-mini">GPT-4o Mini</option>
                      <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Temperature: {editingAgent.model_temperature}</label>
                    <input type="range" min="0" max="1" step="0.1" value={editingAgent.model_temperature} onChange={(e) => setEditingAgent({ ...editingAgent, model_temperature: parseFloat(e.target.value) })} className="w-full accent-[#C5A55A]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Silence Timeout: {editingAgent.silence_timeout_seconds}s</label>
                    <input type="number" value={editingAgent.silence_timeout_seconds} onChange={(e) => setEditingAgent({ ...editingAgent, silence_timeout_seconds: parseInt(e.target.value) || 45 })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" min={10} max={120} style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>Response Delay: {editingAgent.response_delay_seconds}s</label>
                    <input type="number" value={editingAgent.response_delay_seconds} onChange={(e) => setEditingAgent({ ...editingAgent, response_delay_seconds: parseInt(e.target.value) || 3 })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" min={0} max={10} step={0.5} style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingAgent.wait_for_human_first} onChange={(e) => setEditingAgent({ ...editingAgent, wait_for_human_first: e.target.checked })} className="accent-[#C5A55A]" />
                    <span className="text-xs text-[#888]" style={{ fontFamily: "var(--font-inter)" }}>Wait for human to speak first</span>
                  </label>
                </div>

                {!editingAgent.wait_for_human_first && (
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>First Message (what AI says first)</label>
                    <input type="text" value={editingAgent.first_message} onChange={(e) => setEditingAgent({ ...editingAgent, first_message: e.target.value })} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white focus:border-[#C5A55A] focus:outline-none" style={{ fontFamily: "var(--font-inter)" }} />
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#555] mb-1" style={{ fontFamily: "var(--font-inter)" }}>System Prompt</label>
                  <textarea value={editingAgent.system_prompt} onChange={(e) => setEditingAgent({ ...editingAgent, system_prompt: e.target.value })} rows={12} className="w-full bg-[#111] border border-[#222] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#C5A55A] focus:outline-none resize-y font-mono" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveAgent} disabled={isSavingAgent} className="flex items-center gap-2 px-4 py-2 bg-[#C5A55A] text-black text-sm font-medium hover:bg-[#d4b46a] disabled:opacity-50 transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
                    {isSavingAgent ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {isSavingAgent ? "Saving..." : "Save Agent"}
                  </button>
                  <button onClick={() => { setIsEditingAgent(false); setEditingAgent(null); }} className="px-4 py-2 border border-[#222] text-sm text-[#888] hover:text-white transition-colors" style={{ fontFamily: "var(--font-inter)" }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Agents list */}
          {agents.length === 0 ? (
            <div className="card">
              <p className="text-sm text-[#555] text-center py-8">No agents yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {agents.map((agent) => (
                <div key={agent.id} className={`card hover:border-[#333] transition-colors ${agent.is_default ? "border-[#C5A55A]/30" : ""}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Bot size={14} className="text-[#C5A55A] shrink-0" />
                        <h4 className="text-sm font-semibold text-white truncate" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          {agent.name}
                        </h4>
                        {agent.is_default && (
                          <span className="text-[0.6rem] uppercase tracking-wider px-2 py-0.5 bg-[#C5A55A]/10 text-[#C5A55A] shrink-0 flex items-center gap-1">
                            <Star size={10} /> Default
                          </span>
                        )}
                        {!agent.is_active && (
                          <span className="text-[0.6rem] uppercase tracking-wider px-2 py-0.5 bg-red-500/10 text-red-400 shrink-0">
                            inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#666] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
                        {agent.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[0.6rem] text-[#444]">
                        <span>🗣️ {agent.voice_provider}/{agent.voice_id}</span>
                        <span>🧠 {agent.model_name}</span>
                        <span>🌡️ {agent.model_temperature}</span>
                        {agent.wait_for_human_first ? (
                          <span className="text-[#C5A55A]/60">⏳ Waits for human</span>
                        ) : (
                          <span>🗣️ Speaks first</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-4">
                      <button
                        onClick={() => handleDuplicateAgent(agent)}
                        className="p-2 text-[#555] hover:text-white transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => { setEditingAgent(agent); setIsEditingAgent(true); }}
                        className="p-2 text-[#555] hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Settings2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteAgent(agent.id)}
                        className="p-2 text-[#555] hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CallStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    initiated: "bg-yellow-500/20 text-yellow-400",
    ringing: "bg-blue-500/20 text-blue-400",
    in_progress: "bg-green-500/20 text-green-400",
    completed: "bg-[#333] text-[#888]",
    failed: "bg-red-500/20 text-red-400",
    no_answer: "bg-orange-500/20 text-orange-400",
    busy: "bg-orange-500/20 text-orange-400",
    canceled: "bg-[#333] text-[#555]",
    scheduled: "bg-purple-500/20 text-purple-400",
  };
  return (
    <span className={`text-[0.6rem] uppercase tracking-wider px-2 py-0.5 ${colors[status] ?? "bg-[#333] text-[#888]"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function ScheduledStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    completed: "bg-green-500/20 text-green-400",
    failed: "bg-red-500/20 text-red-400",
    cancelled: "bg-[#333] text-[#555]",
  };
  return (
    <span className={`text-[0.6rem] uppercase tracking-wider px-2 py-0.5 ${colors[status] ?? "bg-[#333] text-[#888]"}`}>
      {status}
    </span>
  );
}
