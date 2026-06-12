"use client";

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "98%", label: "Client Retention" },
  { value: "10x", label: "Average ROI" },
  { value: "24/7", label: "Operations Covered" },
];

export default function SocialProof() {
  return (
    <div className="py-16 md:py-20 px-6 md:px-12 border-t border-b border-[#333333]">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6 max-w-[1200px] mx-auto text-center">
        {stats.map((stat) => (
          <div key={stat.label} className="reveal">
            <div
              className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-1 sm:mb-2"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {stat.value}
            </div>
            <div
              className="text-[0.65rem] sm:text-xs font-normal text-[#888888] uppercase tracking-[0.05em]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
