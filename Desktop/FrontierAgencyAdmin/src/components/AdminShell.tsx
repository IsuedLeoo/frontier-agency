"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SafeUser } from "@/lib/types";
import Icon from "./Icons";
import type { IconName } from "./Icons";
import ChatSidebar from "./chat/ChatSidebar";

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  roles: ("admin" | "staff" | "client")[];
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "dashboard", roles: ["admin", "staff", "client"] },
  { href: "/crm", label: "CRM", icon: "clipboard", roles: ["admin"] },
  { href: "/calendar", label: "Calendar", icon: "calendar", roles: ["admin"] },
  { href: "/clients", label: "Clients", icon: "clients", roles: ["admin", "staff"] },
  { href: "/staff", label: "Staff", icon: "staff", roles: ["admin"] },
  { href: "/invoices", label: "Invoices", icon: "invoices", roles: ["admin", "staff"] },
  { href: "/storage", label: "Storage", icon: "storage", roles: ["admin", "staff"] },
  { href: "/docs", label: "Service Docs", icon: "tag", roles: ["admin"] },
  { href: "/voice", label: "Voice Config", icon: "phone", roles: ["admin"] },
  { href: "/voice/calls", label: "Call History", icon: "phone", roles: ["admin"] },
  { href: "/voice/agent", label: "Agent Performance", icon: "chart", roles: ["admin"] },
  { href: "/voice/dialer", label: "Auto-Dialer", icon: "phone", roles: ["admin"] },
  { href: "/analytics", label: "Analytics", icon: "chart", roles: ["admin"] },
];

interface AdminShellProps {
  user: SafeUser;
  children: React.ReactNode;
}

export default function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const visibleNav = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen">
      {/* ─── Left Nav Sidebar ─── */}
      <aside className="w-64 border-r border-[#1a1a1a] bg-[#0a0a0a] flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#1a1a1a]">
          <Link href="/" className="block">
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              <span className="text-[#C5A55A]">Frontier</span> Agency
            </span>
          </Link>
          <p className="text-[0.65rem] text-[#555] uppercase tracking-[0.15em] mt-1">
            Admin Console
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {visibleNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-200 ${
                      isActive
                        ? "bg-white/5 text-white border-l-2 border-[#C5A55A]"
                        : "text-[#888] hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent"
                    }`}
                  >
                    <Icon name={item.icon} size={18} />
                    <span style={{ fontFamily: "var(--font-inter)" }}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C5A55A]/20 flex items-center justify-center text-[#C5A55A] text-sm font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white truncate">{user.name}</p>
              <p className="text-[0.65rem] text-[#555] uppercase tracking-wider">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-[#1a1a1a] flex items-center justify-between px-8 bg-[#0a0a0a]">
          <h1
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {visibleNav.find((n) => pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href)))?.label || "Dashboard"}
          </h1>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-xs text-[#555] hover:text-white uppercase tracking-[0.1em] transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Logout
            </button>
          </form>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>

      {/* ─── AI Assistant Sidebar (permanent) ─── */}
      <aside className="w-[380px] shrink-0 border-l border-[#1a1a1a] bg-[#0a0a0a] flex flex-col">
        <ChatSidebar />
      </aside>
    </div>
  );
}
