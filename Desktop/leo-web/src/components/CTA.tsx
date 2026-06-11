"use client";

import PhoneLink from "./PhoneLink";

export default function CTA() {
  return (
    <section className="py-12 sm:py-16 md:py-24 lg:py-40 px-6 md:px-12 text-center">
      <h2
        className="reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-none mb-4 sm:mb-6 md:mb-8"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Ready to build
        <br />
        your AI agency.
      </h2>
      <p
        className="reveal text-sm sm:text-base md:text-lg font-light text-[#888888] max-w-[500px] leading-relaxed mx-auto mb-6 sm:mb-8 md:mb-12"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Tell us about your business. We will show you what is possible.
      </p>
      <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        <a
          href="#"
          className="inline-block px-8 py-4 bg-white text-black text-xs font-semibold uppercase tracking-[0.04em] border border-white hover:bg-transparent hover:text-white transition-all duration-300"
        >
          Schedule a Call
        </a>
        <PhoneLink
          className="inline-flex items-center gap-2 text-sm font-medium text-[#888888] hover:text-white transition-colors duration-300"
          icon={<span className="text-[#C5A55A]">☎</span>}
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>
    </section>
  );
}
