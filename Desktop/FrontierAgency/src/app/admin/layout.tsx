import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(await headers());

  // For now, we'll just check if user is logged in
  // In a real app, you'd have an admin role flag in the user table
  if (!session) {
    redirect("/login");
  }

  // TODO: Add proper admin role check
  // if (!session.user.isAdmin) {
  //   redirect("/dashboard");
  // }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Admin Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-black border-r border-[#333333] z-50 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#333333]">
          <a
            href="/admin"
            className="text-base font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Frontier Agency Admin
          </a>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            <li>
              <a
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white border-l-2 border-transparent hover:border-[#C5A55A] transition-colors duration-200"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/admin/clients"
                className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white border-l-2 border-transparent hover:border-[#C5A55A] transition-colors duration-200"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Clients
              </a>
            </li>
            <li>
              <a
                href="/admin/projects"
                className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white border-l-2 border-transparent hover:border-[#C5A55A] transition-colors duration-200"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Projects
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <main className="px-6 md:px-12 py-8">{children}</main>
      </div>
    </div>
  );
}