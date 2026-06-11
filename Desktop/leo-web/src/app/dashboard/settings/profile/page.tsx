import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default async function DashboardSettingsProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  // TODO: Fetch user data from database
  // For now, we'll use placeholder data
  const formData = {
    firstName: user.name.split(" ")[0] || "",
    lastName: user.name.split(" ").slice(1).join(" ") || "",
    email: user.email,
    phone: "",
    company: "",
    website: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    timezone: "America/New_York",
    language: "English",
    dateFormat: "MM/DD/YYYY",
  };

  // TODO: Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Update user profile in database
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Profile Settings
        </h1>
        <Link
          href="/dashboard/settings"
          className="text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white border-l-2 border-transparent hover:border-[#C5A55A] transition-colors duration-200 px-3 py-2.5"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          ← Back to Settings
        </Link>
      </div>

      {/* Profile form */}
      <div className="reveal bg-black p-6 rounded-xl border border-[#333333]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-3">
              Personal Information
            </h2>
            <div className="grid gap-4">
              {/* Name fields */}
              <div className="grid-cols-1 sm:grid-cols-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-white mb-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  defaultValue={formData.firstName}
                  className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-white mb-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  defaultValue={formData.lastName}
                  className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
              </div>

              {/* Email */}
              <label
                htmlFor="email"
                className="text-sm font-medium text-white mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                defaultValue={formData.email}
                className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
                style={{ fontFamily: "var(--font-inter)" }}
                readOnly
              />

              {/* Phone */}
              <label
                htmlFor="phone"
                className="text-sm font-medium text-white mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                defaultValue={formData.phone}
                className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
                style={{ fontFamily: "var(--font-inter)" }}
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-3">
              Company Information
            </h2>
            <div className="grid gap-4">
              <label
                htmlFor="company"
                className="text-sm font-medium text-white mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Company Name
              </label>
              <input
                type="text"
                id="company"
                defaultValue={formData.company}
                className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
                style={{ fontFamily: "var(--font-inter)" }}
              />
              <label
                htmlFor="website"
                className="text-sm font-medium text-white mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Website URL
              </label>
              <input
                type="url"
                id="website"
                defaultValue={formData.website}
                className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
                style={{ fontFamily: "var(--font-inter)" }}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-3">
              Address
            </h2>
            <div className="grid gap-4">
              <label
                htmlFor="address"
                className="text-sm font-medium text-white mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Street Address
              </label>
              <input
                type="text"
                id="address"
                defaultValue={formData.address}
                className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
                style={{ fontFamily: "var(--font-inter)" }}
              />
              <div className="grid-cols-1 sm:grid-cols-2">
                <label
                  htmlFor="city"
                  className="text-sm font-medium text-white mb-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  defaultValue={formData.city}
                  className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
                <label
                  htmlFor="state"
                  className="text-sm font-medium text-white mb-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  State / Province
                </label>
                <input
                  type="text"
                  id="state"
                  defaultValue={formData.state}
                  className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
              </div>
              <div className="grid-cols-1 sm:grid-cols-2">
                <label
                  htmlFor="zipCode"
                  className="text-sm font-medium text-white mb-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  defaultValue={formData.zipCode}
                  className="w-half px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
                <label
                  htmlFor="country"
                  className="text-sm font-medium text-white mb-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Country
                </label>
                <select
                  id="country"
                  defaultValue={formData.country}
                  className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-3">
              Preferences
            </h2>
            <div className="grid gap-4">
              <label
                htmlFor="timezone"
                className="text-sm font-medium text-white mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Timezone
              </label>
              <select
                id="timezone"
                defaultValue={formData.timezone}
                className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <option value="America/New_York">Eastern Time (New York)</option>
                <option value="America/Chicago">Central Time (Chicago)</option>
                <option value="America/Denver">Mountain Time (Denver)</option>
                <option value="America/Los_Angeles">Pacific Time (Los Angeles)</option>
                <option value="America/Anchorage">Alaska Time</option>
                <option value="America/Hawaii">Hawaii Time</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">London Time</option>
                <option value="Europe/Paris">Paris Time</option>
                <option value="Asia/Tokyo">Tokyo Time</option>
                <option value="Asia/Shanghai">Shanghai Time</option>
                <option value="Asia/Dubai">Dubai Time</option>
                <option value="Asia/Singapore">Singapore Time</option>
                <option value="Australia/Sydney">Sydney Time</option>
              </select>
              <label
                htmlFor="language"
                className="text-sm font-medium text-white mb-1"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Language
              </label>
              <select
                id="language"
                defaultValue={formData.language}
                className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
              </select>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#C5A55A] px-6 py-3 rounded-sm font-medium text-white hover:bg-[#D4B07A] transition-colors duration-200"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}