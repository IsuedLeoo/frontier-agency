"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  getSession,
  signUp,
  signIn,
  signOut,
  deleteAccount,
  updateUser,
  type User,
} from "@/lib/auth";
import {
  getProviders,
  saveProvider,
  deleteProvider as deleteProviderConfig,
  getActiveProvider,
  setActiveProvider,
  getActiveModel,
  setActiveModel,
  getAllModels,
  searchModels,
  getDefaultProviders,
  fetchOllamaModels,
  type ProviderConfig,
  type AIModel,
} from "@/lib/models";
import { sendChatMessage, type ChatMessage } from "@/lib/chat";
import {
  getToolSystemPrompt,
  parseToolCalls,
  executeToolCalls,
  formatToolResults,
} from "@/lib/tools";
import { checkForUpdate, installUpdate, type UpdateInfo } from "@/lib/updater";
import MarkdownMessage from "@/components/MarkdownMessage";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  timestamp: number;
}

interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  providerId?: string;
  modelId?: string;
}

type View =
  | "chat"
  | "library"
  | "projects"
  | "terminal"
  | "settings"
  | "account";

type AuthMode = "signin" | "signup";

/* ------------------------------------------------------------------ */
/*  Persistence                                                        */
/* ------------------------------------------------------------------ */
const CHATS_KEY = "am_chats";
const ACTIVE_KEY = "am_active_chat";
const DRAWER_OPEN_KEY = "am_drawer_open";

function loadChats(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CHATS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveChats(chats: ChatThread[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

function loadActiveChatId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_KEY);
}

function saveActiveChatId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
}

/* ------------------------------------------------------------------ */
/*  Terminal Palette                                                    */
/* ------------------------------------------------------------------ */
const TERM_FG = "#00ff41";
const TERM_DIM = "#008f11";
const TERM_DARK = "#003b00";
const TERM_BORDER = "#005500";
const TERM_BG = "#0a0a0a";
const TERM_ERROR = "#ff3333";
const TERM_WARN = "#ffff00";
const TERM_CURSOR = "#00ff41";
const TERM_INFO = "#00ccff";

// Aliases for quick migration
const VIOLET = TERM_FG;
const VIOLET_LIGHT = TERM_FG;
const BG = TERM_BG;
const SURFACE = TERM_BG;
const SURFACE_ELEVATED = "#0f0f0f";
const BORDER = TERM_BORDER;
const TEXT_PRIMARY = TERM_FG;
const TEXT_SECONDARY = TERM_DIM;
const TEXT_TERTIARY = TERM_DARK;
const TEXT_DIM = "#002200";
const ERROR = TERM_ERROR;
const WARN = TERM_WARN;

/* ------------------------------------------------------------------ */
/*  Logo                                                               */
/* ------------------------------------------------------------------ */
function Logo({ size = 32 }: { size?: number }) {
  return (
    <span
      className="font-mono font-bold"
      style={{
        color: VIOLET,
        fontSize: size * 0.6,
        textShadow: `0 0 8px ${VIOLET}`,
        letterSpacing: "-0.02em",
      }}
    >
      A.M.
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main App                                                           */
/* ------------------------------------------------------------------ */
export default function Home() {
  /* -- auth -- */
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [authError, setAuthError] = useState("");

  /* -- chats -- */
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [streamingReasoning, setStreamingReasoning] = useState("");
  const [showReasoning, setShowReasoning] = useState<Record<string, boolean>>({});

  /* -- models / providers -- */
  const [allModels, setAllModels] = useState<AIModel[]>([]);
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [testStatus, setTestStatus] = useState<
    Record<string, { ok?: boolean; msg?: string; loading?: boolean }>
  >({});

  /* -- UI -- */
  const [view, setView] = useState<View>("chat");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatConfirm, setShowNewChatConfirm] = useState(false);

  /* -- updater -- */
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [updateInstalling, setUpdateInstalling] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  /* -- derived active provider / model -- */
  const activeProvider =
    providers.find(
      (p) =>
        p.id === (activeChat?.providerId || getActiveProvider()?.id)
    ) ||
    providers[0] ||
    null;

  const activeModel =
    allModels.find(
      (m) =>
        m.id === (activeChat?.modelId || getActiveModel())
    ) ||
    allModels[0] ||
    null;

  /* -- init -- */
  useEffect(() => {
    setUser(getSession());
    const saved = loadChats();
    const active = loadActiveChatId();
    setProviders(getProviders());
    getAllModels().then((models) => {
      setAllModels(models);
      const am = getActiveModel();
      if (!am || !models.find((m) => m.id === am)) {
        const first = models[0];
        if (first) setActiveModel(first.id);
      }
    });
    if (saved.length) {
      setChats(saved);
      if (active && saved.find((c) => c.id === active)) {
        setActiveChatId(active);
      } else {
        setActiveChatId(saved[0].id);
      }
    } else {
      createNewChat();
    }
    if (typeof window !== "undefined") {
      setDrawerOpen(localStorage.getItem(DRAWER_OPEN_KEY) === "1");
    }
  }, []);

  /* -- check for app updates on launch -- */
  useEffect(() => {
    checkForUpdate().then((info) => {
      if (info) setUpdateInfo(info);
    });
  }, []);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  useEffect(() => {
    saveActiveChatId(activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isLoading, streamingText]);

  useEffect(() => {
    if (!showModelSelector) return;
    const handle = (e: MouseEvent) => {
      if (!modelSelectorRef.current?.contains(e.target as Node)) {
        setShowModelSelector(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showModelSelector]);

  /* -- helpers -- */
  const isEmpty = !activeChat || activeChat.messages.length === 0;
  const filteredModels = searchModels(allModels, modelSearch);

  const createNewChat = useCallback(() => {
    const chat: ChatThread = {
      id: crypto.randomUUID(),
      title: "Untitled",
      messages: [],
      updatedAt: Date.now(),
      providerId: activeProvider?.id,
      modelId: activeModel?.id,
    };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
    setView("chat");
    return chat.id;
  }, [activeProvider, activeModel]);

  const deleteChat = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      const remaining = chats.filter((c) => c.id !== id);
      setActiveChatId(remaining[0]?.id || null);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading || !activeChatId) return;
    const text = input.trim();

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              messages: [...c.messages, userMsg],
              title: c.messages.length === 0 ? text.slice(0, 40) : c.title,
              updatedAt: Date.now(),
              providerId: activeProvider?.id,
              modelId: activeModel?.id,
            }
          : c
      )
    );
    setInput("");
    setIsLoading(true);

    if (!activeProvider || !activeModel) {
      setIsLoading(false);
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "No AI provider configured. Go to Settings → AI Providers to add your API key, or make sure Ollama is running locally.",
        timestamp: Date.now(),
      };
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, messages: [...c.messages, errMsg], updatedAt: Date.now() }
            : c
        )
      );
      return;
    }

    const history: ChatMessage[] = [
      {
        role: "system",
        content:
          "You are A.M., a helpful AI assistant.\n\n" + getToolSystemPrompt(),
        timestamp: Date.now(),
      },
      ...activeChat!.messages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
        timestamp: m.timestamp,
      })),
      { role: "user" as const, content: text, timestamp: Date.now() },
    ];

    abortRef.current = new AbortController();
    setIsStreaming(true);
    setStreamingText("");
    setStreamingReasoning("");

    let result = await sendChatMessage({
      provider: activeProvider,
      model: activeModel,
      messages: history,
      onStream: (chunk) => {
        setStreamingText((prev) => prev + chunk);
      },
      onReasoning: (chunk) => {
        setStreamingReasoning((prev) => prev + chunk);
      },
      signal: abortRef.current.signal,
    });

    setIsStreaming(false);

    /* ── Tool calling loop ── */
    const MAX_TOOL_ITERATIONS = 3;
    let toolIterations = 0;
    let currentHistory = [...history];

    while (toolIterations < MAX_TOOL_ITERATIONS) {
      if (result.error) break;
      const toolCalls = parseToolCalls(result.text || "");
      if (toolCalls.length === 0) break;

      // Persist assistant's tool-using turn
      const toolAssistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.text || "",
        reasoning: result.reasoning,
        timestamp: Date.now(),
      };
      currentHistory.push({
        role: "assistant",
        content: result.text || "",
        timestamp: Date.now(),
      });
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                messages: [...c.messages, toolAssistantMsg],
                updatedAt: Date.now(),
              }
            : c
        )
      );
      if (result.reasoning) {
        setShowReasoning((prev) => ({
          ...prev,
          [toolAssistantMsg.id]: true,
        }));
      }

      // Execute tools
      setIsLoading(true);
      const toolResults = await executeToolCalls(toolCalls);

      // Persist tool results as a user turn
      const toolResultContent = formatToolResults(toolResults);
      const toolResultMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: `[tool results]\n${toolResultContent}`,
        timestamp: Date.now(),
      };
      currentHistory.push({
        role: "user",
        content: toolResultContent,
        timestamp: Date.now(),
      });
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                messages: [...c.messages, toolResultMsg],
                updatedAt: Date.now(),
              }
            : c
        )
      );

      // Re-send with tool results
      abortRef.current = new AbortController();
      setIsStreaming(true);
      setStreamingText("");
      setStreamingReasoning("");

      result = await sendChatMessage({
        provider: activeProvider,
        model: activeModel,
        messages: currentHistory,
        onStream: (chunk) => {
          setStreamingText((prev) => prev + chunk);
        },
        onReasoning: (chunk) => {
          setStreamingReasoning((prev) => prev + chunk);
        },
        signal: abortRef.current.signal,
      });

      setIsStreaming(false);
      toolIterations++;
    }

    setIsLoading(false);
    const finalText = result.error
      ? `Error: ${result.error}`
      : result.text || "No response.";

    const aiMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: finalText,
      reasoning: result.reasoning,
      timestamp: Date.now(),
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, messages: [...c.messages, aiMsg], updatedAt: Date.now() }
          : c
      )
    );
    if (result.reasoning) {
      setShowReasoning((prev) => ({ ...prev, [aiMsg.id]: true }));
    }
    setStreamingText("");
    setStreamingReasoning("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const name = String(fd.get("name") || "").trim();

    if (!email || !password) {
      setAuthError("Email and password are required.");
      return;
    }
    if (authMode === "signup" && !name) {
      setAuthError("Name is required.");
      return;
    }

    if (authMode === "signup") {
      const res = signUp(name, email, password);
      if (res.success) {
        setUser(getSession());
        setShowAuth(false);
      } else {
        setAuthError(res.error || "Signup failed.");
      }
    } else {
      const res = signIn(email, password);
      if (res.success) {
        setUser(getSession());
        setShowAuth(false);
      } else {
        setAuthError(res.error || "Sign in failed.");
      }
    }
  };

  const handleSignOut = () => {
    signOut();
    setUser(null);
  };

  const handleDeleteAccount = () => {
    if (!confirm("Permanently delete your account and all data?")) return;
    deleteAccount();
    setUser(null);
    setChats([]);
    createNewChat();
    setView("chat");
  };

  /* -- keyboard shortcuts -- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setDrawerOpen((v) => {
          const next = !v;
          localStorage.setItem(DRAWER_OPEN_KEY, next ? "1" : "0");
          return next;
        });
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((v) => !v);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
        setShowAuth(false);
        setShowNewChatConfirm(false);
        setShowModelSelector(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* -- search results -- */
  const searchResults = searchQuery.trim()
    ? chats.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.messages.some((m) =>
            m.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : [];

  /* -- provider / model helpers -- */
  const handleSetActiveProvider = (id: string) => {
    setActiveProvider(id);
    setProviders(getProviders());
  };

  const handleSaveProvider = (provider: ProviderConfig) => {
    saveProvider(provider);
    setProviders(getProviders());
  };

  const handleDeleteProvider = (id: string) => {
    deleteProviderConfig(id);
    setProviders(getProviders());
  };

  const handleSelectModel = (model: AIModel) => {
    setActiveModel(model.id);
    setShowModelSelector(false);
    setModelSearch("");
    if (activeChatId) {
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, modelId: model.id, providerId: model.provider }
            : c
        )
      );
    }
    const modelProvider = providers.find((p) => p.id === model.provider);
    if (modelProvider) {
      setActiveProvider(modelProvider.id);
    }
  };

  const handleRefreshOllama = async () => {
    const ollamaProvider = providers.find((p) => p.id === "ollama");
    const models = await fetchOllamaModels(
      ollamaProvider?.baseUrl || "http://localhost:11434"
    );
    setAllModels((prev) => {
      const nonOllama = prev.filter((m) => m.provider !== "ollama");
      return [...models, ...nonOllama];
    });
  };

  const handleTestProvider = async (provider: ProviderConfig) => {
    setTestStatus((prev) => ({
      ...prev,
      [provider.id]: { loading: true },
    }));
    try {
      const url =
        provider.preset === "ollama"
          ? `${provider.baseUrl || "http://localhost:11434"}/api/tags`
          : `${provider.baseUrl || "https://api.openai.com/v1"}/models`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (provider.apiKey) {
        headers.Authorization = `Bearer ${provider.apiKey}`;
      }
      if (provider.preset === "anthropic") {
        headers["x-api-key"] = provider.apiKey || "";
        headers["anthropic-version"] = "2023-06-01";
      }
      const res = await fetch(url, { method: "GET", headers });
      if (res.ok) {
        setTestStatus((prev) => ({
          ...prev,
          [provider.id]: { ok: true, msg: "Connected" },
        }));
      } else {
        const txt = await res.text();
        setTestStatus((prev) => ({
          ...prev,
          [provider.id]: {
            ok: false,
            msg: `Error ${res.status}: ${txt.slice(0, 100)}`,
          },
        }));
      }
    } catch (err) {
      setTestStatus((prev) => ({
        ...prev,
        [provider.id]: {
          ok: false,
          msg: err instanceof Error ? err.message : String(err),
        },
      }));
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Model Selector                                                    */
  /* ---------------------------------------------------------------- */
  const ModelSelectorDropdown = () => {
    const grouped = filteredModels.reduce<Record<string, AIModel[]>>(
      (acc, m) => {
        const key = m.provider;
        if (!acc[key]) acc[key] = [];
        acc[key].push(m);
        return acc;
      },
      {}
    );

    const providerNames: Record<string, string> = {
      openrouter: "OpenRouter",
      openai: "OpenAI",
      anthropic: "Anthropic",
      ollama: "Ollama",
      custom: "Custom",
    };

    return (
      <div
        ref={modelSelectorRef}
        className="absolute bottom-full left-0 mb-2 w-80 max-h-[60vh] overflow-y-auto border z-50"
        style={{
          backgroundColor: SURFACE,
          borderColor: BORDER,
        }}
      >
        <div className="px-3 py-2 border-b" style={{ borderColor: BORDER }}>
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ backgroundColor: SURFACE_ELEVATED }}
          >
            
            <input
              autoFocus
              type="text"
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              placeholder="Search models..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: TEXT_PRIMARY }}
            />
            {modelSearch && (
              <button onClick={() => setModelSearch("")}>
                <span className="font-mono text-xs" style={{ color: TEXT_TERTIARY }}>[x]</span>
              </button>
            )}
          </div>
        </div>
        {Object.entries(grouped).map(([providerKey, models]) => (
          <div key={providerKey}>
            <div
              className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider flex items-center justify-between"
              style={{ color: TEXT_TERTIARY }}
            >
              <span>{providerNames[providerKey] || providerKey}</span>
              {providerKey === "ollama" && (
                <button
                  onClick={handleRefreshOllama}
                  className="p-1 hover:bg-white/5"
                  title="Refresh"
                >
                  <span className="font-mono text-xs">[↻]</span>
                </button>
              )}
            </div>
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-white/[0.04] transition-colors"
                style={{
                  backgroundColor:
                    activeModel?.id === model.id
                      ? "rgba(0,210,106,0.08)"
                      : "transparent",
                }}
              >
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm truncate flex items-center gap-2"
                    style={{ color: TEXT_PRIMARY }}
                  >
                    {model.name}
                    {activeModel?.id === model.id && (
                      <span className="font-mono text-xs" style={{ color: VIOLET }}>[ok]</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {model.contextWindow && (
                      <span className="text-[10px]" style={{ color: TEXT_TERTIARY }}>
                        {model.contextWindow >= 1000
                          ? `${Math.round(model.contextWindow / 1000)}k ctx`
                          : `${model.contextWindow} ctx`}
                      </span>
                    )}
                    {model.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1 py-0.5 "
                        style={{
                          backgroundColor: "rgba(0,210,106,0.12)",
                          color: VIOLET_LIGHT,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
        {filteredModels.length === 0 && (
          <div
            className="px-4 py-6 text-center text-sm"
            style={{ color: TEXT_TERTIARY }}
          >
            No models found
          </div>
        )}
      </div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  Settings View                                                    */
  /* ---------------------------------------------------------------- */
  const SettingsView = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [newPreset, setNewPreset] =
      useState<ProviderConfig["preset"]>("custom");

    const presets: { id: ProviderConfig["preset"]; label: string }[] = [
      { id: "ollama", label: "Ollama (Local)" },
      { id: "openrouter", label: "OpenRouter" },
      { id: "openai", label: "OpenAI" },
      { id: "anthropic", label: "Anthropic" },
      { id: "custom", label: "Custom (OpenAI-compatible)" },
    ];

    return (
      <div className="max-w-2xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-semibold mb-8" style={{ color: TEXT_PRIMARY }}>
          Settings
        </h1>

        <div className="space-y-6">
          <section
            className="p-5"
            style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-sm font-semibold flex items-center gap-2"
                style={{ color: TEXT_PRIMARY }}
              >
                <span className="font-mono text-xs" style={{ color: TEXT_SECONDARY }}>[srv]</span>
                AI Providers
              </h2>
              <button
                onClick={() => {
                  setShowAdd(true);
                  setEditingId(null);
                }}
                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 transition-colors"
                style={{ backgroundColor: VIOLET, color: "white" }}
              >
                <span className="font-mono text-xs">[+]</span>
                Add
              </button>
            </div>

            <div className="space-y-3">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="p-3 transition-colors"
                  style={{
                    border: `1px solid ${BORDER}`,
                    backgroundColor:
                      activeProvider?.id === provider.id
                        ? "rgba(0,210,106,0.06)"
                        : "rgba(255,255,255,0.02)",
                  }}
                >
                  {editingId === provider.id ? (
                    <ProviderEditForm
                      provider={provider}
                      onSave={(p) => {
                        handleSaveProvider(p);
                        setEditingId(null);
                      }}
                      onCancel={() => setEditingId(null)}
                      onTest={() => handleTestProvider(provider)}
                      testResult={testStatus[provider.id]}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-medium"
                            style={{ color: TEXT_PRIMARY }}
                          >
                            {provider.name}
                          </span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 "
                            style={{
                              backgroundColor: "rgba(255,255,255,0.05)",
                              color: TEXT_TERTIARY,
                            }}
                          >
                            {provider.preset}
                          </span>
                          {activeProvider?.id === provider.id && (
                            <span
                              className="text-[10px] px-1.5 py-0.5 flex items-center gap-1"
                              style={{
                                backgroundColor: "rgba(0,210,106,0.12)",
                                color: VIOLET_LIGHT,
                              }}
                            >
                              <span className="font-mono text-xs">[ok]</span>
                              Active
                            </span>
                          )}
                        </div>
                        <div
                          className="text-xs mt-1 truncate"
                          style={{ color: TEXT_TERTIARY }}
                        >
                          {provider.baseUrl || "Default endpoint"}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: TEXT_TERTIARY }}
                        >
                          {provider.apiKey
                            ? `Key: ${provider.apiKey.slice(0, 4)}••••${provider.apiKey.slice(-4)}`
                            : "No API key"}
                        </div>
                        {testStatus[provider.id]?.msg && (
                          <div
                            className="text-xs mt-1"
                            style={{
                              color: testStatus[provider.id]?.ok
                                ? VIOLET_LIGHT
                                : "#ff6b6b",
                            }}
                          >
                            {testStatus[provider.id]?.msg}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <button
                          onClick={() => handleSetActiveProvider(provider.id)}
                          className="p-1.5 transition-colors hover:bg-white/5"
                          title="Set active"
                        >
                          <span
                            className="w-4 h-4"
                            style={{
                              color:
                                activeProvider?.id === provider.id
                                  ? VIOLET
                                  : TEXT_TERTIARY,
                            }}
                          />
                        </button>
                        <button
                          onClick={() => setEditingId(provider.id)}
                          className="p-1.5 hover:bg-white/5 transition-colors"
                          title="Edit"
                        >
                          <span className="font-mono text-xs" style={{ color: TEXT_TERTIARY }}>[edit]</span>
                        </button>
                        <button
                          onClick={() => handleTestProvider(provider)}
                          className="p-1.5 hover:bg-white/5 transition-colors"
                          title="Test"
                        >
                          <span
                            className="w-4 h-4"
                            style={{ color: TEXT_TERTIARY }}
                          />
                        </button>
                        {!getDefaultProviders().find(
                          (d) => d.id === provider.id
                        ) && (
                          <button
                            onClick={() => handleDeleteProvider(provider.id)}
                            className="p-1.5 hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <span className="font-mono text-xs text-red-400">[del]</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {showAdd && (
              <div
                className="mt-4 p-4"
                style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                <h3 className="text-sm font-medium mb-3" style={{ color: TEXT_PRIMARY }}>
                  Add provider
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: TEXT_SECONDARY }}>
                      Preset
                    </label>
                    <select
                      value={newPreset}
                      onChange={(e) =>
                        setNewPreset(e.target.value as ProviderConfig["preset"])
                      }
                      className="w-full px-3 py-2 text-sm outline-none border"
                      style={{
                        backgroundColor: SURFACE_ELEVATED,
                        borderColor: BORDER,
                        color: TEXT_PRIMARY,
                      }}
                    >
                      {presets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      const defaults = getDefaultProviders();
                      const base = defaults.find((d) => d.preset === newPreset);
                      const id = `custom_${Date.now()}`;
                      const newProvider: ProviderConfig = {
                        id: base?.id || id,
                        name: base?.name || "Custom",
                        preset: newPreset,
                        baseUrl: base?.baseUrl || "",
                      };
                      handleSaveProvider(newProvider);
                      setShowAdd(false);
                    }}
                    className="text-sm font-medium px-4 py-2 transition-colors"
                    style={{ backgroundColor: VIOLET, color: "white" }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAdd(false)}
                    className="ml-2 text-sm"
                    style={{ color: TEXT_SECONDARY }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

          <section
            className="p-5"
            style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <h2
              className="text-sm font-semibold mb-4 flex items-center gap-2"
              style={{ color: TEXT_PRIMARY }}
            >
              <span className="font-mono text-xs text-red-400">[del]</span>
              Danger Zone
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm" style={{ color: TEXT_PRIMARY }}>
                  Delete all chats
                </div>
                <div className="text-xs" style={{ color: TEXT_TERTIARY }}>
                  Cannot be undone.
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm("Delete all chats?")) {
                    setChats([]);
                    createNewChat();
                  }
                }}
                className="px-3 py-1.5 text-sm text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-colors"
              >
                Delete all
              </button>
            </div>
            {user && (
              <div
                className="flex items-center justify-between mt-4 pt-4"
                style={{ borderTop: `1px solid ${BORDER}` }}
              >
                <div>
                  <div className="text-sm" style={{ color: TEXT_PRIMARY }}>
                    Delete account
                  </div>
                  <div className="text-xs" style={{ color: TEXT_TERTIARY }}>
                    Permanently remove everything.
                  </div>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="px-3 py-1.5 text-sm text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  Provider Edit Form                                               */
  /* ---------------------------------------------------------------- */
  const ProviderEditForm = ({
    provider,
    onSave,
    onCancel,
    onTest,
    testResult,
  }: {
    provider: ProviderConfig;
    onSave: (p: ProviderConfig) => void;
    onCancel: () => void;
    onTest: () => void;
    testResult?: { ok?: boolean; msg?: string; loading?: boolean };
  }) => {
    const [form, setForm] = useState(provider);

    return (
      <div className="space-y-3">
        <div>
          <label className="block text-xs mb-1" style={{ color: TEXT_SECONDARY }}>
            Name
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 text-sm outline-none border"
            style={{
              backgroundColor: SURFACE_ELEVATED,
              borderColor: BORDER,
              color: TEXT_PRIMARY,
            }}
          />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: TEXT_SECONDARY }}>
            Base URL (optional)
          </label>
          <input
            value={form.baseUrl || ""}
            onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
            placeholder={
              form.preset === "ollama"
                ? "http://localhost:11434"
                : "https://api.example.com/v1"
            }
            className="w-full px-3 py-2 text-sm outline-none border"
            style={{
              backgroundColor: SURFACE_ELEVATED,
              borderColor: BORDER,
              color: TEXT_PRIMARY,
            }}
          />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: TEXT_SECONDARY }}>
            API Key
          </label>
          <input
            type="password"
            value={form.apiKey || ""}
            onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
            placeholder="sk-..."
            className="w-full px-3 py-2 text-sm outline-none border"
            style={{
              backgroundColor: SURFACE_ELEVATED,
              borderColor: BORDER,
              color: TEXT_PRIMARY,
            }}
          />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onSave(form)}
            className="text-sm font-medium px-4 py-2 transition-colors"
            style={{ backgroundColor: VIOLET, color: "white" }}
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="text-sm px-3 py-2"
            style={{ color: TEXT_SECONDARY }}
          >
            Cancel
          </button>
          <button
            onClick={onTest}
            disabled={testResult?.loading}
            className="ml-auto flex items-center gap-1 text-xs border px-3 py-2 hover:bg-white/5 disabled:opacity-50 transition-colors"
            style={{ borderColor: BORDER, color: TEXT_SECONDARY }}
          >
            {testResult?.loading ? (
              <span className="font-mono text-xs">[↻]</span>
            ) : (
              <span className="font-mono text-xs">[↗]</span>
            )}
            Test
          </button>
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  Account View                                                     */
  /* ---------------------------------------------------------------- */
  const AccountView = () => {
    if (!user) {
      return (
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <span className="font-mono text-2xl mx-auto mb-4 block text-center" style={{ color: TEXT_TERTIARY }}>[usr]</span>
          <h1 className="text-xl font-semibold mb-2" style={{ color: TEXT_PRIMARY }}>
            Not signed in
          </h1>
          <p className="text-sm mb-6" style={{ color: TEXT_SECONDARY }}>
            Sign in to sync your chats.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="font-medium text-sm px-5 py-2.5 transition-colors"
            style={{ backgroundColor: VIOLET, color: "white" }}
          >
            Sign in
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-8" style={{ color: TEXT_PRIMARY }}>
          My Account
        </h1>

        <div
          className="p-5 space-y-4"
          style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <div>
            <label className="block text-xs mb-1" style={{ color: TEXT_SECONDARY }}>
              Name
            </label>
            <input
              defaultValue={user.name}
              onBlur={(e) => {
                const val = e.target.value.trim();
                if (val) {
                  updateUser({ name: val });
                  setUser(getSession());
                }
              }}
              className="w-full px-3 py-2 text-sm outline-none border"
              style={{
                backgroundColor: SURFACE_ELEVATED,
                borderColor: BORDER,
                color: TEXT_PRIMARY,
              }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: TEXT_SECONDARY }}>
              Email
            </label>
            <div className="text-sm px-3 py-2" style={{ color: TEXT_PRIMARY }}>
              {user.email}
            </div>
          </div>
          <div
            className="pt-3 flex items-center justify-between"
            style={{ borderTop: `1px solid ${BORDER}` }}
          >
            <span className="text-xs" style={{ color: TEXT_TERTIARY }}>
              Since {new Date(user.createdAt).toLocaleDateString()}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
            >
              <span className="font-mono text-xs">[out]</span>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  Placeholder Views                                                */
  /* ---------------------------------------------------------------- */
  const PlaceholderView = ({
    title,
    description,
    action,
    actionLabel,
  }: {
    title: string;
    description: string;
    action?: () => void;
    actionLabel?: string;
  }) => (
    <div className="flex flex-col items-center justify-center h-full pb-32 text-center px-6">
      <span className="font-mono text-2xl mb-4" style={{ color: TEXT_TERTIARY }}>[*]</span>
      <h1 className="text-xl font-semibold mb-2" style={{ color: TEXT_PRIMARY }}>
        {title}
      </h1>
      <p className="text-sm max-w-sm mb-6" style={{ color: TEXT_SECONDARY }}>
        {description}
      </p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="font-medium text-sm px-4 py-2 transition-colors"
          style={{ backgroundColor: VIOLET, color: "white" }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Auth Modal                                                       */
  /* ---------------------------------------------------------------- */
  const AuthModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: "rgba(11,11,15,0.7)" }}>
      <div
        className="w-full max-w-sm p-6"
        style={{
          backgroundColor: SURFACE,
          border: `1px solid ${BORDER}`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: TEXT_PRIMARY }}>
            {authMode === "signin" ? "Sign in" : "Create account"}
          </h2>
          <button
            onClick={() => setShowAuth(false)}
            className="p-1 hover:bg-white/5"
          >
            <span className="font-mono text-xs" style={{ color: TEXT_SECONDARY }}>[x]</span>
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-3">
          {authMode === "signup" && (
            <div>
              <label className="block text-xs mb-1" style={{ color: TEXT_SECONDARY }}>
                Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Your name"
                className="w-full px-3 py-2 text-sm outline-none border"
                style={{
                  backgroundColor: SURFACE_ELEVATED,
                  borderColor: BORDER,
                  color: TEXT_PRIMARY,
                }}
              />
            </div>
          )}
          <div>
            <label className="block text-xs mb-1" style={{ color: TEXT_SECONDARY }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 text-sm outline-none border"
              style={{
                backgroundColor: SURFACE_ELEVATED,
                borderColor: BORDER,
                color: TEXT_PRIMARY,
              }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: TEXT_SECONDARY }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm outline-none border"
              style={{
                backgroundColor: SURFACE_ELEVATED,
                borderColor: BORDER,
                color: TEXT_PRIMARY,
              }}
            />
          </div>

          {authError && (
            <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2">
              {authError}
            </p>
          )}

          <button
            type="submit"
            className="w-full font-medium text-sm py-2.5 transition-colors"
            style={{ backgroundColor: VIOLET, color: "white" }}
          >
            {authMode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: TEXT_TERTIARY }}>
          {authMode === "signin" ? (
            <>
              No account?{" "}
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setAuthError("");
                }}
                className="hover:underline"
                style={{ color: TEXT_SECONDARY }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Have an account?{" "}
              <button
                onClick={() => {
                  setAuthMode("signin");
                  setAuthError("");
                }}
                className="hover:underline"
                style={{ color: TEXT_SECONDARY }}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Search Overlay                                                   */
  /* ---------------------------------------------------------------- */
  const SearchOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{ backgroundColor: "rgba(11,11,15,0.7)" }}>
      <div
        className="w-full max-w-lg overflow-hidden"
        style={{
          backgroundColor: SURFACE,
          border: `1px solid ${BORDER}`,
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: BORDER }}>
          
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: TEXT_PRIMARY }}
          />
          <button
            onClick={() => {
              setShowSearch(false);
              setSearchQuery("");
            }}
            className="p-1 hover:bg-white/5"
          >
            <span className="font-mono text-xs" style={{ color: TEXT_SECONDARY }}>[x]</span>
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto">
          {searchQuery.trim() ? (
            searchResults.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm" style={{ color: TEXT_TERTIARY }}>
                No chats found
              </div>
            ) : (
              searchResults.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    setView("chat");
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/[0.04] transition-colors text-left"
                >
                  <span className="font-mono text-xs" style={{ color: TEXT_TERTIARY }}>[clk]</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate" style={{ color: TEXT_PRIMARY }}>
                      {chat.title}
                    </div>
                    <div className="text-xs" style={{ color: TEXT_TERTIARY }}>
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="font-mono text-xs" style={{ color: TEXT_TERTIARY }}>[&gt;]</span>
                </button>
              ))
            )
          ) : (
            <div className="px-4 py-3 text-xs" style={{ color: TEXT_TERTIARY }}>
              Recent chats
            </div>
          )}
          {!searchQuery.trim() &&
            chats.slice(0, 6).map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setView("chat");
                  setShowSearch(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-white/[0.04] transition-colors text-left"
              >
                <span className="font-mono text-xs" style={{ color: TEXT_TERTIARY }}>[clk]</span>
                <span className="text-sm truncate" style={{ color: TEXT_PRIMARY }}>
                  {chat.title}
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Main Render                                                      */
  /* ---------------------------------------------------------------- */
  return (
    <div
      className="flex h-screen w-screen overflow-hidden select-none"
      style={{ backgroundColor: BG, color: TEXT_PRIMARY }}
    >
      {/* ---- Slide-over Drawer ---- */}
      <aside
        className="flex-shrink-0 flex flex-col border-r transition-all duration-300 ease-out"
        style={{
          width: drawerOpen ? 280 : 0,
          opacity: drawerOpen ? 1 : 0,
          borderColor: BORDER,
          backgroundColor: BG,
          overflow: "hidden",
        }}
      >
        <div className="w-[280px] flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Logo size={24} />
              <span style={{ color: TEXT_PRIMARY }}>A.M.</span>
            </span>
            <button
              onClick={() => {
                setDrawerOpen(false);
                localStorage.setItem(DRAWER_OPEN_KEY, "0");
              }}
              className="p-1 hover:bg-white/5 transition-colors"
            >
              <span className="font-mono text-xs" style={{ color: TEXT_SECONDARY }}>[x]</span>
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors hover:bg-white/[0.04]"
              style={{ color: TEXT_PRIMARY }}
            >
              
              <span className="flex-1 text-left">Search</span>
              <span className="text-xs" style={{ color: TEXT_TERTIARY }}>⌘K</span>
            </button>
            <button
              onClick={() => setView("library")}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors"
              style={{
                color: view === "library" ? TEXT_PRIMARY : TEXT_SECONDARY,
                backgroundColor: view === "library" ? "rgba(0,210,106,0.08)" : "transparent",
              }}
            >
              <span className="font-mono text-xs">[lib]</span>
              <span className="flex-1 text-left">Library</span>
            </button>
            <button
              onClick={() => setView("projects")}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors"
              style={{
                color: view === "projects" ? TEXT_PRIMARY : TEXT_SECONDARY,
                backgroundColor: view === "projects" ? "rgba(0,210,106,0.08)" : "transparent",
              }}
            >
              <span className="font-mono text-xs">[prj]</span>
              <span className="flex-1 text-left">Projects</span>
            </button>
            <button
              onClick={() => setView("terminal")}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors"
              style={{
                color: view === "terminal" ? TEXT_PRIMARY : TEXT_SECONDARY,
                backgroundColor: view === "terminal" ? "rgba(0,210,106,0.08)" : "transparent",
              }}
            >
              <span className="font-mono text-xs">[cmd]</span>
              <span className="flex-1 text-left font-mono text-xs">TERMINAL</span>
            </button>

            {/* Recent chats */}
            {chats.length > 0 && (
              <>
                <div
                  className="pt-4 pb-1 px-3 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: TEXT_TERTIARY }}
                >
                  Conversations
                </div>
                {chats.slice(0, 12).map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setView("chat");
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors group"
                    style={{
                      color:
                        activeChatId === chat.id ? TEXT_PRIMARY : TEXT_SECONDARY,
                      backgroundColor:
                        activeChatId === chat.id
                          ? "rgba(0,210,106,0.08)"
                          : "transparent",
                    }}
                  >
                    <span className="flex-1 text-left truncate">{chat.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 transition-opacity"
                    >
                      <span className="font-mono text-xs" style={{ color: TEXT_TERTIARY }}>[del]</span>
                    </button>
                  </button>
                ))}
              </>
            )}
          </nav>

          {/* Bottom actions */}
          <div className="px-3 py-3 border-t" style={{ borderColor: BORDER }}>
            <button
              onClick={() => {
                if (activeChat && activeChat.messages.length > 0) {
                  setShowNewChatConfirm(true);
                } else {
                  createNewChat();
                }
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-white/[0.04]"
              style={{ color: TEXT_PRIMARY }}
            >
              <span className="font-mono text-xs" style={{ color: VIOLET }}>[+]</span>
              New chat
            </button>
            <button
              onClick={() => {
                setView("settings");
                setDrawerOpen(false);
                localStorage.setItem(DRAWER_OPEN_KEY, "0");
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-white/[0.04]"
              style={{ color: TEXT_SECONDARY }}
            >
              <span className="font-mono text-xs">[cfg]</span>
              Settings
            </button>
            {user ? (
              <button
                onClick={() => {
                  setView("account");
                  setDrawerOpen(false);
                  localStorage.setItem(DRAWER_OPEN_KEY, "0");
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-white/[0.04]"
                style={{ color: TEXT_SECONDARY }}
              >
                <span className="font-mono text-xs">[usr]</span>
                {user.name}
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowAuth(true);
                  setAuthMode("signin");
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-white/[0.04]"
                style={{ color: TEXT_SECONDARY }}
              >
                <span className="font-mono text-xs">[out]</span>
                Sign in
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ---- Main Area ---- */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            {!drawerOpen && (
              <button
                onClick={() => {
                  setDrawerOpen(true);
                  localStorage.setItem(DRAWER_OPEN_KEY, "1");
                }}
                className="p-1.5 hover:bg-white/5 transition-colors"
                title="Open sidebar (⌘B)"
              >
                <span className="font-mono text-xs" style={{ color: TEXT_SECONDARY }}>[≡]</span>
              </button>
            )}
            {view !== "chat" && (
              <button
                onClick={() => setView("chat")}
                className="text-xs hover:underline"
                style={{ color: TEXT_TERTIARY }}
              >
                ← Back
              </button>
            )}
            {view === "chat" && activeChat && (
              <span className="text-sm truncate max-w-xs" style={{ color: TEXT_SECONDARY }}>
                {activeChat.title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeChat && activeChat.messages.length > 0) {
                  setShowNewChatConfirm(true);
                } else {
                  createNewChat();
                }
              }}
              className="p-1.5 hover:bg-white/5 transition-colors"
              title="New chat"
            >
              <span className="font-mono text-xs" style={{ color: TEXT_SECONDARY }}>[edit]</span>
            </button>
            <button
              onClick={() => {
                if (user) {
                  setView("account");
                } else {
                  setShowAuth(true);
                }
              }}
              className="w-8 h-8 border flex items-center justify-center hover:bg-white/5 transition-colors"
              style={{ borderColor: BORDER }}
            >
              {user ? (
                <span className="text-xs font-bold" style={{ color: VIOLET }}>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              ) : (
                <span className="font-mono text-xs" style={{ color: TEXT_SECONDARY }}>[usr]</span>
              )}
            </button>
          </div>
        </div>

        {/* Update Banner */}
        {updateInfo && (
          <div
            className="shrink-0 flex items-center justify-between px-4 py-2 text-xs"
            style={{ backgroundColor: "rgba(0,210,106,0.12)", borderBottom: `1px solid ${BORDER}` }}
          >
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5" style={{ color: VIOLET }} />
              <span style={{ color: VIOLET_LIGHT }}>
                A.M. v{updateInfo.version} is available.
              </span>
              <span style={{ color: TEXT_SECONDARY }}>
                {updateInstalling ? "Downloading…" : "Restart to apply after installing."}
              </span>
            </span>
            <button
              onClick={async () => {
                setUpdateInstalling(true);
                const ok = await installUpdate();
                if (ok) {
                  setUpdateInfo(null);
                  // Tauri restarts the app automatically after passive install
                } else {
                  setUpdateInstalling(false);
                }
              }}
              disabled={updateInstalling}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-colors"
              style={{
                backgroundColor: updateInstalling ? "rgba(0,210,106,0.2)" : VIOLET,
                color: "#fff",
                opacity: updateInstalling ? 0.7 : 1,
              }}
            >
              <span className="font-mono text-xs">[dl]</span>
              {updateInstalling ? "Installing…" : "Install Update"}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {view === "chat" && (
            <>
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center h-full pb-24 px-6">
                  <Logo size={48} />
                  <h1
                    className="text-3xl font-light mt-8 mb-3"
                    style={{ color: TEXT_PRIMARY }}
                  >
                    A.M.
                  </h1>
                  <p className="text-sm max-w-xs text-center" style={{ color: TEXT_SECONDARY }}>
                    Your private AI workspace. Ask anything, create, and explore.
                  </p>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                  {activeChat!.messages.map((msg) => (
                    <div key={msg.id}>
                      {msg.role === "user" ? (
                        <div className="flex gap-3">
                          <span className="font-mono text-sm flex-shrink-0 select-none" style={{ color: TEXT_SECONDARY }}>
                            you&gt;
                          </span>
                          <div className="flex-1 min-w-0 space-y-1">
                            <MarkdownMessage content={msg.content} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <span className="font-mono text-sm flex-shrink-0 select-none" style={{ color: VIOLET }}>
                            am&gt;
                          </span>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-medium uppercase tracking-wider font-mono" style={{ color: VIOLET }}>
                                A.M.
                              </span>
                              <span className="text-[10px]" style={{ color: TEXT_TERTIARY }}>
                                {activeModel?.name}
                              </span>
                              {msg.reasoning && (
                                <button
                                  onClick={() => setShowReasoning((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                                  className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 border transition-colors hover:bg-white/5"
                                  style={{ borderColor: BORDER, color: TEXT_TERTIARY }}
                                >
                                  <span className="font-mono text-xs">[~]</span>
                                  {showReasoning[msg.id] ? "Hide reasoning" : "Show reasoning"}
                                </button>
                              )}
                            </div>
                            {msg.reasoning && showReasoning[msg.id] && (
                              <div
                                className="border overflow-hidden"
                                style={{
                                  backgroundColor: "rgba(255,255,255,0.03)",
                                  borderColor: BORDER,
                                }}
                              >
                                <div
                                  className="flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wider border-b"
                                  style={{
                                    color: TEXT_TERTIARY,
                                    borderColor: BORDER,
                                    backgroundColor: "rgba(255,255,255,0.02)",
                                  }}
                                >
                                  <span className="font-mono text-xs">[~]</span>
                                  Reasoning
                                </div>
                                <div className="px-3 py-2 max-h-40 overflow-y-auto">
                                  <div
                                    className="text-[13px] leading-relaxed whitespace-pre-wrap"
                                    style={{ color: TEXT_SECONDARY }}
                                  >
                                    {msg.reasoning}
                                  </div>
                                </div>
                              </div>
                            )}
                            <div style={{ textShadow: "0 0 12px rgba(0,210,106,0.06)" }}>
                              <MarkdownMessage content={msg.content} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Streaming */}
                  {isStreaming && (
                    <div className="flex gap-3">
                      <span className="font-mono text-sm flex-shrink-0 select-none animate-pulse" style={{ color: VIOLET }}>
                        am&gt;
                      </span>
                      <div className="flex-1 min-w-0 space-y-1">
                        {streamingReasoning && (
                          <div
                            className="border overflow-hidden"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.03)",
                              borderColor: BORDER,
                            }}
                          >
                            <div
                              className="flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wider border-b font-mono"
                              style={{
                                color: TEXT_TERTIARY,
                                borderColor: BORDER,
                                backgroundColor: "rgba(255,255,255,0.02)",
                              }}
                            >
                              <span>[~]</span>
                              Thinking
                            </div>
                            <div className="px-3 py-2 max-h-40 overflow-y-auto">
                              <div
                                className="text-[13px] leading-relaxed whitespace-pre-wrap"
                                style={{ color: TEXT_SECONDARY }}
                              >
                                {streamingReasoning}
                                <span className="inline-block w-1.5 h-3 align-middle ml-0.5 animate-pulse"
                                  style={{ backgroundColor: TEXT_TERTIARY }} />
                              </div>
                            </div>
                          </div>
                        )}
                        <div
                          className="text-[15px] leading-relaxed whitespace-pre-wrap font-mono"
                          style={{ color: TEXT_PRIMARY, textShadow: "0 0 12px rgba(0,210,106,0.06)" }}
                        >
                          {streamingText}
                          <span className="inline-block w-2.5 h-4 align-middle ml-0.5"
                            style={{
                              backgroundColor: VIOLET,
                              animation: "blink 1s step-end infinite",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading dots */}
                  {isLoading && !isStreaming && (
                    <div className="flex gap-3">
                      <span className="font-mono text-sm flex-shrink-0 select-none" style={{ color: VIOLET }}>
                        am&gt;
                      </span>
                      <div className="flex items-center gap-1 py-3">
                        <span className="font-mono text-xs animate-pulse" style={{ color: VIOLET }}>_</span>
                        <span className="font-mono text-xs animate-pulse" style={{ color: TEXT_TERTIARY }}>loading</span>
                        <span className="font-mono text-xs" style={{ color: TEXT_DIM }}>...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </>
          )}

          {view === "library" && (
            <PlaceholderView
              title="Library"
              description="Save and organize prompts, files, and references."
              action={() => setView("chat")}
              actionLabel="Start chatting"
            />
          )}

          {view === "projects" && (
            <PlaceholderView
              title="Projects"
              description="Group chats and files by project."
              action={() => createNewChat()}
              actionLabel="New project"
            />
          )}

          {view === "terminal" && (
            <PlaceholderView
              title="TERMINAL"
              description="Code snippets, snippets, and technical notes."
            />
          )}

          {view === "settings" && <SettingsView />}
          {view === "account" && <AccountView />}
        </div>

        {/* Input area */}
        {view === "chat" && (
          <div className="shrink-0 px-4 pb-5 pt-2">
            <div className="max-w-3xl mx-auto">
              <div
                className="relative border transition-colors focus-within:border-opacity-30"
                style={{ backgroundColor: BG, borderColor: BORDER }}
              >
                <div className="flex items-start gap-2 px-3 py-3">
                  <span className="font-mono text-sm flex-shrink-0 select-none pt-0.5" style={{ color: TEXT_SECONDARY }}>
                    you&gt;
                  </span>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="type command..."
                    rows={1}
                    className="flex-1 bg-transparent text-[15px] outline-none resize-none font-mono"
                    style={{ color: TEXT_PRIMARY, minHeight: 24, maxHeight: 200, lineHeight: 1.5 }}
                    onInput={(e) => {
                      const el = e.target as HTMLTextAreaElement;
                      el.style.height = "auto";
                      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
                    }}
                  />
                </div>
                <div className="flex items-center justify-between px-3 pb-2 border-t" style={{ borderColor: BORDER }}>
                  <div className="flex items-center gap-1">
                    <div className="relative">
                      <button
                        onClick={() => setShowModelSelector((v) => !v)}
                        className="flex items-center gap-1.5 px-2 py-1 text-[11px] transition-colors hover:bg-white/5 font-mono"
                        style={{ color: TEXT_SECONDARY }}
                      >
                        <span>[cpu]</span>
                        {activeModel ? (
                          <span className="truncate max-w-[140px]">
                            {activeModel.name}
                          </span>
                        ) : (
                          <span style={{ color: TEXT_TERTIARY }}>Select model</span>
                        )}
                        <span>[v]</span>
                      </button>
                      {showModelSelector && <ModelSelectorDropdown />}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {isLoading && (
                      <button
                        onClick={() => {
                          abortRef.current?.abort();
                        }}
                        className="p-1.5 hover:bg-white/5 transition-colors font-mono"
                        title="Stop"
                      >
                        <span className="text-xs" style={{ color: TEXT_SECONDARY }}>[||]</span>
                      </button>
                    )}
                    <button
                      onClick={handleSubmit}
                      disabled={!input.trim() || isLoading}
                      className="px-2 py-1 disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:opacity-90 font-mono text-xs"
                      style={{
                        color: input.trim() && !isLoading ? VIOLET : TEXT_DIM,
                      }}
                    >
                      [↵]
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-center text-[11px] mt-1 font-mono" style={{ color: TEXT_DIM }}>
                Enter=send  Shift+Enter=newline
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ---- CRT Overlay ---- */}
      <div className="crt-overlay" />

      {/* ---- Overlays ---- */}
      {showAuth && <AuthModal />}
      {showSearch && <SearchOverlay />}

      {/* New chat confirmation */}
      {showNewChatConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(11,11,15,0.7)" }}
        >
          <div
            className="p-6 w-full max-w-xs"
            style={{
              backgroundColor: SURFACE,
              border: `1px solid ${BORDER}`,
            }}
          >
            <h3 className="text-sm font-semibold mb-2" style={{ color: TEXT_PRIMARY }}>
              New conversation?
            </h3>
            <p className="text-xs mb-4" style={{ color: TEXT_TERTIARY }}>
              Current chat will be saved.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowNewChatConfirm(false)}
                className="flex-1 py-2 text-sm hover:bg-white/5 transition-colors"
                style={{ color: TEXT_SECONDARY }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  createNewChat();
                  setShowNewChatConfirm(false);
                }}
                className="flex-1 py-2 text-sm font-medium transition-colors"
                style={{ backgroundColor: VIOLET, color: "white" }}
              >
                New chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
