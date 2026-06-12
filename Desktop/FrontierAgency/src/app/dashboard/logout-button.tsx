"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2.5 mt-1 w-full text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white transition-colors duration-200"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <LogOut size={16} />
      Log Out
    </button>
  );
}
