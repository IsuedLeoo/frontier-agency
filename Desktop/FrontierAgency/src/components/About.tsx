"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  Cpu,
  Zap,
  ArrowRight,
  Bot,
  Globe,
  Shield,
  BarChart3,
  MessageSquare,
  FileText,
  Database,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface AgentTask {
  id: number;
  label: string;
  status: "queued" | "running" | "done";
  duration: number; // ms to complete
  icon: React.ReactNode;
}

interface LogEntry {
  id: number;
  text: string;
  type: "info" | "success" | "action";
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const TASK_TEMPLATES: Omit<AgentTask, "id" | "status">[] = [
  { label: "Scanning inbox for priority emails", duration: 2200, icon: <MessageSquare size={10} /> },
  { label: "Generating weekly KPI report", duration: 3000, icon: <BarChart3 size={10} /> },
  { label: "Processing support ticket #4821", duration: 1800, icon: <FileText size={10} /> },
  { label: "Syncing CRM pipeline data", duration: 2600, icon: <Database size={10} /> },
  { label: "Running compliance audit checks", duration: 3400, icon: <Shield size={10} /> },
  { label: "Deploying workflow automation", duration: 2800, icon: <Zap size={10} /> },
  { label: "Analyzing customer sentiment", duration: 2000, icon: <Activity size={10} /> },
  { label: "Updating knowledge base articles", duration: 2400, icon: <FileText size={10} /> },
  { label: "Qualifying inbound leads", duration: 1600, icon: <Globe size={10} /> },
  { label: "Reconciling invoice batch #119", duration: 3200, icon: <Database size={10} /> },
];

const LOG_MESSAGES: { text: string; type: LogEntry["type"] }[] = [
  { text: "Agent orchestrator initialized", type: "info" },
  { text: "Connected to 12 data sources", type: "info" },
  { text: "Email triage complete — 3 escalations", type: "success" },
  { text: "Generating KPI dashboard…", type: "action" },
  { text: "Ticket #4821 resolved automatically", type: "success" },
  { text: "CRM sync: 247 records updated", type: "success" },
  { text: "Compliance scan: 0 violations found", type: "success" },
  { text: "Deploying workflow: invoice-approval-v3", type: "action" },
  { text: "Sentiment analysis: 94% positive", type: "success" },
  { text: "Knowledge base: 3 articles updated", type: "success" },
  { text: "Lead scoring: 12 qualified, 34 nurtured", type: "success" },
  { text: "Invoice reconciliation: $47,200 processed", type: "success" },
  { text: "All systems nominal — monitoring", type: "info" },
  { text: "Queue depth: 0 — agent idle, standing by", type: "info" },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function MetricCard({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
      <span className={accent}>{icon}</span>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-semibold text-white leading-none" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {value}
        </p>
        <p className="text-[0.6rem] text-[#555555] mt-0.5 leading-none truncate" style={{ fontFamily: "var(--font-inter)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function TaskPipeline({ tasks }: { tasks: AgentTask[] }) {
  return (
    <div className="space-y-1.5">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-[0.6rem] sm:text-[0.65rem] transition-colors duration-500 ${
            task.status === "done"
              ? "bg-[#0a0a0a] border border-[#1a1a1a] opacity-60"
              : task.status === "running"
              ? "bg-[#C5A55A]/10 border border-[#C5A55A]/30"
              : "bg-transparent border border-transparent opacity-40"
          }`}
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <span className="shrink-0 text-[#555555]">{task.icon}</span>
          <span
            className={`flex-1 truncate ${
              task.status === "done"
                ? "text-[#555555] line-through"
                : task.status === "running"
                ? "text-[#C5A55A]"
                : "text-[#333333]"
            }`}
          >
            {task.label}
          </span>
          {task.status === "running" && (
            <span className="shrink-0 flex items-center gap-1 text-[#C5A55A]">
              <span className="w-1 h-1 rounded-full bg-[#C5A55A] animate-pulse" />
              <span className="hidden sm:inline">Running</span>
            </span>
          )}
          {task.status === "done" && (
            <CheckCircle2 size={10} className="shrink-0 text-green-500/60" />
          )}
          {task.status === "queued" && (
            <Clock size={10} className="shrink-0 text-[#333333]" />
          )}
        </div>
      ))}
    </div>
  );
}

function TerminalFeed({ logs }: { logs: LogEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={scrollRef}
      className="h-[140px] sm:h-[160px] overflow-y-auto rounded-lg bg-[#060606] border border-[#1a1a1a] p-3 font-mono text-[0.6rem] leading-relaxed scrollbar-thin"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {logs.map((log) => (
        <div
          key={log.id}
          className={`flex items-start gap-1.5 mb-0.5 animate-[fadeIn_0.3s_ease] ${
            log.type === "success"
              ? "text-green-400/80"
              : log.type === "action"
              ? "text-[#C5A55A]/80"
              : "text-[#555555]"
          }`}
        >
          <span className="shrink-0 text-[#333333] select-none">
            {log.type === "success" ? "✓" : log.type === "action" ? "→" : "·"}
          </span>
          <span>{log.text}</span>
        </div>
      ))}
      <div className="flex items-center gap-1 text-[#333333]">
        <span className="w-1.5 h-3 bg-[#555555] animate-[blink_1s_step-end_infinite]" />
      </div>
    </div>
  );
}

function NetworkPulse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; r: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = 160;
    const h = 160;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    // Init particles
    const particles = Array.from({ length: 12 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }));
    particlesRef.current = particles;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(85, 85, 85, ${1 - dist / 60})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#C5A55A";
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(197, 165, 90, 0.08)";
        ctx.fill();
      });

      // Update positions
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] lg:w-[160px] lg:h-[160px]"
    />
  );
}

/* ─── Main Visual ────────────────────────────────────────────────────────── */

function AgentDashboard() {
  const [tasks, setTasks] = useState<AgentTask[]>(() => {
    // Pre-populate with 5 tasks at different stages for a stable initial layout
    const initial: AgentTask[] = [
      { id: 1, label: "Scanning inbox for priority emails", duration: 2200, status: "done", icon: <MessageSquare size={10} /> },
      { id: 2, label: "Generating weekly KPI report", duration: 3000, status: "done", icon: <BarChart3 size={10} /> },
      { id: 3, label: "Processing support ticket #4821", duration: 1800, status: "running", icon: <FileText size={10} /> },
      { id: 4, label: "Syncing CRM pipeline data", duration: 2600, status: "running", icon: <Database size={10} /> },
      { id: 5, label: "Running compliance audit checks", duration: 3400, status: "queued", icon: <Shield size={10} /> },
    ];
    return initial;
  });
  const [logs, setLogs] = useState<LogEntry[]>(() => [
    { id: 1, text: "Agent orchestrator initialized", type: "info" },
    { id: 2, text: "Connected to 12 data sources", type: "info" },
    { id: 3, text: "Email triage complete — 3 escalations", type: "success" },
    { id: 4, text: "Generating KPI dashboard…", type: "action" },
  ]);
  const [completedCount, setCompletedCount] = useState(0);
  const [uptime, setUptime] = useState(0);
  const taskIdRef = useRef(5);
  const logIdRef = useRef(4);

  // Uptime counter
  useEffect(() => {
    const interval = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Spawn tasks continuously
  const spawnTask = useCallback(() => {
    const template = TASK_TEMPLATES[Math.floor(Math.random() * TASK_TEMPLATES.length)];
    const id = ++taskIdRef.current;
    const newTask: AgentTask = { ...template, id, status: "queued" };

    setTasks((prev) => {
      const filtered = prev.filter((t) => t.status !== "done" || t.id > id - 8);
      return [...filtered, newTask].slice(-8);
    });

    // Start task after brief delay
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "running" } : t))
      );
    }, 400);

    // Complete task after duration
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "done" } : t))
      );
      setCompletedCount((c) => c + 1);
    }, 400 + template.duration);
  }, []);

  // Spawn logs continuously
  const spawnLog = useCallback(() => {
    const msg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
    const id = ++logIdRef.current;
    setLogs((prev) => [...prev.slice(-20), { ...msg, id }]);
  }, []);

  // Kick off loops
  useEffect(() => {
    // Initial burst
    spawnTask();
    spawnLog();
    spawnLog();

    const taskInterval = setInterval(spawnTask, 2800);
    const logInterval = setInterval(spawnLog, 1800);

    return () => {
      clearInterval(taskInterval);
      clearInterval(logInterval);
    };
  }, [spawnTask, spawnLog]);

  const runningCount = tasks.filter((t) => t.status === "running").length;
  const queuedCount = tasks.filter((t) => t.status === "queued").length;

  const formatUptime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full max-w-[480px] lg:max-w-none mx-auto">
      {/* Outer frame */}
      <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden shadow-2xl shadow-black/50">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] bg-[#0e0e0e]">
          <div className="flex items-center gap-2">
            <Bot size={14} className="text-[#C5A55A]" />
            <span className="text-[0.65rem] sm:text-xs font-semibold text-white tracking-wide" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              AI Agent Control
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[0.55rem] sm:text-[0.6rem] text-[#555555]" style={{ fontFamily: "var(--font-inter)" }}>
              LIVE
            </span>
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 border-b border-[#1a1a1a]">
          <MetricCard
            icon={<CheckCircle2 size={14} />}
            value={completedCount.toString()}
            label="Tasks completed"
            accent="text-green-400"
          />
          <MetricCard
            icon={<Cpu size={14} />}
            value={runningCount.toString()}
            label="Active agents"
            accent="text-[#C5A55A]"
          />
          <MetricCard
            icon={<Clock size={14} />}
            value={queuedCount.toString()}
            label="Queued"
            accent="text-[#555555]"
          />
          <MetricCard
            icon={<Zap size={14} />}
            value={formatUptime(uptime)}
            label="Uptime"
            accent="text-blue-400"
          />
        </div>

        {/* Main content: pipeline + network */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 p-3 border-b border-[#1a1a1a]">
          <div className="overflow-hidden" style={{ height: "260px" }}>
            <TaskPipeline tasks={tasks} />
          </div>
          <div className="hidden sm:flex items-center justify-center pl-3 border-l border-[#1a1a1a]">
            <NetworkPulse />
          </div>
        </div>

        {/* Terminal feed */}
        <div className="p-3">
          <TerminalFeed logs={logs} />
        </div>
      </div>

      {/* Glow effect behind the card */}
      <div className="absolute -inset-4 bg-[#C5A55A]/5 rounded-2xl blur-2xl -z-10 opacity-40" />
    </div>
  );
}

/* ─── Section wrappers ───────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="reveal text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-8"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6"
      style={{ fontFamily: "var(--font-space-grotesk)" }}
    >
      {children}
    </h2>
  );
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="reveal text-sm sm:text-base md:text-lg font-light text-[#888888] max-w-[600px] leading-relaxed"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {children}
    </p>
  );
}

/* ─── Exported section ───────────────────────────────────────────────────── */

export default function About() {
  return (
    <section className="py-10 sm:py-16 md:py-32 px-6 md:px-12 max-w-[1400px] mx-auto" id="about">
      <SectionLabel>What We Do</SectionLabel>
      <SectionTitle>
        Your AI operations team.
        <br />
        Without the overhead.
      </SectionTitle>
      <SectionDesc>
        Frontier Agency builds personalized AI agencies — custom AI systems
        that handle operations, automate workflows, and scale with your
        business. No off-the-shelf agents. Everything is purpose-built.
      </SectionDesc>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-24 items-center mt-10 sm:mt-16">
        <div className="space-y-4 sm:space-y-6">
          <p
            className="reveal text-sm sm:text-base font-light text-[#e0e0e0] leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Today&apos;s businesses are drowning in repetitive operations —
            managing communications, processing data, coordinating teams,
            handling customer inquiries, tracking finances, and maintaining
            compliance. These tasks consume thousands of hours that could be
            spent on growth.
          </p>
          <p
            className="reveal text-sm sm:text-base font-light text-[#e0e0e0] leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <strong className="font-semibold text-white">
              We build AI agencies that handle all of it.
            </strong>{" "}
            Custom multi-agent systems designed around your specific operations.
            They manage workflows, make decisions, communicate with your team
            and customers, and execute entire business processes from start to
            finish. No hiring. No management. No overhead.
          </p>
          <p
            className="reveal text-sm sm:text-base font-light text-[#e0e0e0] leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Every engagement is built from the ground up for your business.
            Your AI agency learns your processes, integrates with your tools,
            and operates as a seamless extension of your organization.
          </p>
        </div>
        <div className="relative w-full max-w-[480px] lg:max-w-none mx-auto">
          <Image priority loading="eager"
            src="/image1.png"
            alt="Frontier Agency AI Operations"
            width={800}
            height={600}
            className="w-full h-auto rounded-xl border border-[#1a1a1a] shadow-2xl shadow-black/50"          />
        </div>
      </div>
    </section>
  );
}
