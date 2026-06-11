import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import LogoutButton from "./logout-button";
import Logo from "@/components/Logo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-black border-r border-[#333333] z-50 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#333333]">
          <Link href="/dashboard" className="block">
            <Logo variant="dark" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white border-l-2 border-transparent hover:border-[#C5A55A] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-[#333333]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div
              className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center text-[0.65rem] text-[#888888]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs text-white truncate"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {user.name}
              </p>
              <p
                className="text-[0.65rem] text-[#888888] truncate"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {user.email}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <main className="px-6 md:px-12 py-8">{children}</main>
      </div>
    </div>
  );
}
