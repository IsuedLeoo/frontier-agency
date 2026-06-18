"use client";

import Link from "next/link";
import {
  Target,
  Headphones,
  Search,
  ArrowRight,
  Phone,
  Calendar,
  Banknote,
  Settings,
} from "lucide-react";

interface Service {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const services: Service[] = [
  {
    icon: <Phone size={24} strokeWidth={1.5} />,
    title: "Front Office",
    desc: "First point of contact — receptionists, greeters, and intake handled automatically.",
  },
  {
    icon: <Calendar size={24} strokeWidth={1.5} />,
    title: "Scheduling & Bookings",
    desc: "Calendar management, appointments, and booking systems working around the clock.",
  },
  {
    icon: <Target size={24} strokeWidth={1.5} />,
    title: "Sales & Outreach",
    desc: "Lead follow-up, sales calls, and outreach campaigns that never miss a prospect.",
  },
  {
    icon: <Headphones size={24} strokeWidth={1.5} />,
    title: "Customer Success",
    desc: "Support, onboarding, retention, and review management — all handled.",
  },
  {
    icon: <Banknote size={24} strokeWidth={1.5} />,
    title: "Finance & Billing",
    desc: "Invoicing, payment collection, expense tracking, and financial reporting.",
  },
  {
    icon: <Settings size={24} strokeWidth={1.5} />,
    title: "Operations",
    desc: "Workflow automation, data entry, and internal processes running smoothly.",
  },
  {
    icon: <Search size={24} strokeWidth={1.5} />,
    title: "Competitive Intelligence",
    desc: "Competitive monitoring, price tracking, and market intelligence that keeps you ahead.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="reveal text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-8">
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
    <p className="reveal text-sm sm:text-base md:text-lg font-light text-[#333333] max-w-[600px] leading-relaxed">
      {children}
    </p>
  );
}

export default function Capabilities() {
  return (
    <div id="services" className="bg-white text-black py-10 sm:py-16 md:py-32 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <SectionLabel>Services</SectionLabel>
        <SectionTitle>
          What we automate
          <br />
          for your business.
        </SectionTitle>
        <SectionDesc>
          Every engagement is custom. These are the domains we routinely
          automate for clients.
        </SectionDesc>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-[#e0e0e0] bg-[#e0e0e0] gap-px">
          {services.map((service) => (
            <div
              key={service.title}
              className="reveal bg-white p-6 sm:p-8 lg:p-12 hover:bg-[#f5f5f5] transition-colors duration-300 cursor-default"
            >
              <span className="block mb-6 text-black">{service.icon}</span>
              <h3
                className="text-base font-semibold tracking-[-0.01em] mb-3"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {service.title}
              </h3>
              <p
                className="text-sm font-light text-[#888888] leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-medium uppercase tracking-[0.1em] text-[#333333] border border-[#e0e0e0] hover:border-black hover:text-black transition-all duration-300 group"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <span>View All Services</span>
            <ArrowRight size={16} className="leading-none group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
