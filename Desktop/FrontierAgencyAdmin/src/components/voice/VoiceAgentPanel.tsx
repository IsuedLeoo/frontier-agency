"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Phone, Loader2 } from "lucide-react";
import type { VoiceCall } from "@/lib/types";

interface VoiceAgentPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceAgentPanel({
  isOpen,
  onClose,
}: VoiceAgentPanelProps) {
  const [calls, setCalls] = useState<VoiceCall[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalls = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/voice/calls?limit=20", {
        credentials: "include",
      });
      if (res.ok) {
        const data = (await res.json()) as { calls?: VoiceCall[] };
        setCalls(data.calls ?? []);
      }
    } catch {
      // Silently fail on polling
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCalls();
      const interval = setInterval(fetchCalls, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen, fetchCalls]);

  const handleCall = async () => {
    const trimmed = phoneNumber.trim();
    if (!trimmed) return;

    setIsCalling(true);
    setError(null);

    try {
      const res = await fetch("/api/voice/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone_number: trimmed }),
      });

      const data = (await res.json()) as {
        call_id?: string;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to initiate call");
      }

      setPhoneNumber("");
      fetchCalls();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Call failed");
    } finally {
      setIsCalling(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCall();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-[380px] bg-[#0a0a0a] border-l border-[#1a1a1a] flex flex-col z-50 shadow-2xl">
      {/* Header */}
      <div className="h-14 border-b border-[#1a1a1a] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-[#C5A55A]" />
          <span
            className="font-semibold text-sm text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Voice Agent
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/5 transition-colors"
        >
          <X size={16} className="text-[#888]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Outbound Call Form */}
        <div className="p-4 border-b border-[#1a1a1a]">
          <p
            className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555] mb-2"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Make a Call
          </p>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="+1 (555) 123-4567"
              className="flex-1 bg-[#111] border border-[#222] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#C5A55A] focus:outline-none"
              style={{ fontFamily: "var(--font-inter)" }}
            />
            <button
              onClick={handleCall}
              disabled={!phoneNumber.trim() || isCalling}
              className="px-3 py-2 bg-[#C5A55A] text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#d4b46a] transition-colors shrink-0"
              title="Call"
            >
              {isCalling ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Phone size={16} />
              )}
            </button>
          </div>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          <p className="text-[0.6rem] text-[#333] mt-1.5">
            Calls from: +1 (986) 201-0858
          </p>
        </div>

        {/* Call History */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-[0.65rem] uppercase tracking-[0.15em] text-[#555]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Recent Calls
            </p>
            <button
              onClick={fetchCalls}
              className="text-[0.6rem] text-[#444] hover:text-[#888] transition-colors"
            >
              Refresh
            </button>
          </div>

          {isLoading && calls.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={16} className="animate-spin text-[#555]" />
            </div>
          ) : calls.length === 0 ? (
            <p className="text-xs text-[#444] text-center py-8">
              No calls yet. Make your first call above.
            </p>
          ) : (
            <div className="space-y-2">
              {calls.map((call) => (
                <div
                  key={call.id}
                  className="p-3 border border-[#1a1a1a] hover:border-[#333] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">
                      {call.direction === "inbound"
                        ? call.from_number ?? "Unknown"
                        : call.to_number ?? "Unknown"}
                    </span>
                    <span className="text-[0.6rem] uppercase tracking-wider text-[#555]">
                      {call.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[0.6rem] text-[#555]">
                    <span>
                      {call.duration_seconds
                        ? `${Math.floor(call.duration_seconds / 60)}m ${call.duration_seconds % 60}s`
                        : "—"}
                    </span>
                    <span>
                      {new Date(call.created_at).toLocaleString()}
                    </span>
                  </div>
                  {call.summary && (
                    <p className="text-[0.65rem] text-[#666] mt-1.5 line-clamp-2">
                      {call.summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
