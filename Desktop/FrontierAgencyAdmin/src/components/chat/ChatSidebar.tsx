"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Trash2, ChevronRight, Headphones } from "lucide-react";
import type { ChatMessage } from "@/lib/chat/types";

export default function ChatSidebar() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 60000): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }
      throw err;
    }
  };

  const streamResponse = async (response: Response, assistantId: string) => {
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");
    const decoder = new TextDecoder();
    let accumulated = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId ? { ...msg, content: accumulated } : msg
        )
      );
    }
  };

  const handleSend = async (retryCount = 0) => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: Date.now() },
    ]);

    try {
      const response = await fetchWithTimeout("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          (errData as { error?: string }).error || `Request failed (${response.status})`
        );
      }

      await streamResponse(response, assistantId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      if (retryCount === 0 && errorMsg !== "Request timed out. Please try again." && !errorMsg.includes("Request failed")) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: "Connection lost. Retrying…" } : msg
          )
        );
        handleSend(retryCount + 1);
        return;
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId ? { ...msg, content: `Error: ${errorMsg}. Click to retry.` } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  const suggestions = [
    "Show dashboard stats",
    "List all clients",
    "Create a client: John Doe, john@test.com",
    "Schedule an appointment",
  ];

  const handleSuggestionClick = (text: string) => {
    setInput("");
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const assistantId = crypto.randomUUID();
    const updatedMessages = [...messages, userMessage];
    setMessages([
      ...updatedMessages,
      { id: assistantId, role: "assistant", content: "", timestamp: Date.now() },
    ]);

    fetchWithTimeout("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ messages: updatedMessages }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            (errData as { error?: string }).error || `Request failed (${response.status})`
          );
        }
        return response;
      })
      .then((response) => streamResponse(response, assistantId))
      .catch((err) => {
        const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: `Error: ${errorMsg}. Click a suggestion to retry.` } : msg
          )
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // ─── Collapsed state: just the header bar ─── */
  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col items-center justify-between py-4 border-b border-[#1a1a1a]">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex flex-col items-center gap-2 p-2 hover:bg-white/5 transition-colors group w-full"
          title="Expand AI Assistant"
        >
          <Headphones size={20} className="text-[#C5A55A]" />
          <span
            className="text-[0.6rem] uppercase tracking-[0.15em] text-[#555] group-hover:text-[#C5A55A] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            AI
          </span>
          <ChevronRight size={14} className="text-[#333] group-hover:text-[#C5A55A] transition-colors" />
        </button>
        <button
          onClick={handleClear}
          className="p-2 hover:bg-white/5 transition-colors"
          title="Clear chat"
        >
          <Trash2 size={14} className="text-[#333]" />
        </button>
      </div>
    );
  }

  // ─── Full sidebar ─── */
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-[#1a1a1a] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#C5A55A] animate-pulse" />
          <span
            className="font-semibold text-sm text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            AI Assistant
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleClear}
            className="p-1.5 hover:bg-white/5 transition-colors"
            title="Clear chat"
          >
            <Trash2 size={14} className="text-[#555]" />
          </button>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 hover:bg-white/5 transition-colors"
            title="Minimize"
          >
            <ChevronRight size={14} className="text-[#888] rotate-180" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center mt-12 px-4">
            <p
              className="text-[#555] text-sm mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Ask me anything about your agency.
            </p>
            <div className="space-y-2 text-xs text-[#444]">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  disabled={isLoading}
                  className="w-full p-2 border border-[#1a1a1a] text-left hover:border-[#C5A55A]/40 hover:text-[#888] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-transparent"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  &ldquo;{s}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[88%] px-3 py-2.5 text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-[#C5A55A] text-black"
                  : "bg-[#141414] text-[#ccc] border border-[#1a1a1a]"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {message.content ? (
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              ) : isLoading ? (
                <div className="flex items-center gap-2 text-[#555]">
                  <Loader2 size={12} className="animate-spin" />
                  <span className="text-xs">Thinking...</span>
                </div>
              ) : null}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#1a1a1a] p-3 shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-[#111] border border-[#222] resize-none px-3 py-2.5 text-sm text-white placeholder-[#444] focus:border-[#C5A55A] focus:outline-none min-h-[40px] max-h-[120px]"
            style={{ fontFamily: "var(--font-inter)" }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-[#C5A55A] text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#d4b46a] transition-colors shrink-0"
            title="Send"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        <p className="text-[0.6rem] text-[#333] mt-1.5 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
