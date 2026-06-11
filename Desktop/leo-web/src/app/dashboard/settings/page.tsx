import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Settings,
  User,
  Zap,
  Key,
  Bell,
} from "lucide-react";

export default async function DashboardSettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Settings
        </h1>
        <Link
          href="/dashboard/settings/profile"
          className="bg-[#C5A55A] px-6 py-3 rounded-sm font-medium hover:bg-[#D4B07A] transition-colors duration-200"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <User size={16} className="mr-2" />
          Profile
        </Link>
      </div>

      {/* Settings grid */}
      <div className="grid gap-6">
        {/* Mobile: single column */}
        {/* Tablet: two columns */}
        {/* Desktop: three columns */}
        <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Profile Settings */}
          <Link
            href="/dashboard/settings/profile"
            className="reveal bg-black p-6 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
          >
            <div className="flex items-center gap-3">
              <User size={20} className="text-[#C5A55A]" />
              <div>
                <h2 className="font-semibold text-white">
                  Profile
                </h2>
                <p className="text-sm text-[#888888]">
                  Update your personal information
                </p>
              </div>
            </div>
          </Link>

          {/* Integrations */}
          <Link
            href="/dashboard/settings/integrations"
            className="reveal bg-black p-6 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-[#C5A55A]" />
              <div>
                <h2 className="font-semibold text-white">
                  Integrations
                </h2>
                <p className="text-sm text-[#888888]">
                  Connect to external services
                </p>
              </div>
            </div>
          </Link>

          {/* API Keys */}
          <Link
            href="/dashboard/settings/api-keys"
            className="reveal bg-black p-6 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Key size={20} className="text-[#C5A55A]" />
              <div>
                <h2 className="font-semibold text-white">
                  API Keys
                </h2>
                <p className="text-sm text-[#888888]">
                  Manage your API access
                </p>
              </div>
            </div>
          </Link>

          {/* Notifications */}
          <Link
            href="/dashboard/settings/notifications"
            className="reveal bg-black p-6 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-[#C5A55A]" />
              <div>
                <h2 className="font-semibold text-white">
                  Notifications
                </h2>
                <p className="text-sm text-[#888888]">
                  Manage email and push notifications
                </p>
              </div>
            </div>
          </Link>

          {/* Security */}
          <Link
            href="/dashboard/settings/security"
            className="reveal bg-black p-6 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-[#C5A55A]" />
              <div>
                <h2 className="font-semibold text-white">
                  Security
                </h2>
                <p className="text-sm text-[#888888]">
                  Password, 2FA, and account security
                </p>
              </div>
            </div>
          </Link>

          {/* Billing */}
          <Link
            href="/dashboard/settings/billing"
            className="reveal bg-black p-6 rounded-xl border border-[#333333] hover:border-[#C5A55A] transition-colors duration-300 group"
          >
            <div className="flex items-center gap-3">
              <DollarSign size={20} className="text-[#C5A55A]" />
              <div>
                <h2 className="font-semibold text-white">
                  Billing
                </h2>
                <p className="text-sm text-[#888888]">
                  Subscription and payment methods
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}