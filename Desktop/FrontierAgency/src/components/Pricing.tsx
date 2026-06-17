"use client";

export default function Pricing() {
  return (
    <section className="py-10 sm:py-16 md:py-32 px-6 md:px-12 text-center" id="pricing">
      <p
        className="reveal text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-8"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Pricing
      </p>
      <h2
        className="reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Custom automation.
        <br />
        Custom quotes.
      </h2>
      <p
        className="reveal text-sm sm:text-base md:text-lg font-light text-[#888888] max-w-[600px] leading-relaxed mx-auto mb-8 sm:mb-12 md:mb-16"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Every business is different, so every project is scoped individually.
        We learn what you need, then provide a clear estimate — no packages,
        no tiers, no surprises.
      </p>

      <div className="max-w-[600px] mx-auto">
        <div className="reveal border border-[#333333] p-8 sm:p-10 lg:p-12 text-left bg-black">
          <h3
            className="text-xl sm:text-2xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            How it works
          </h3>
          <ul className="space-y-4 mb-8">
            {[
              "Tell us about your business and where the bottlenecks are",
              "We identify the highest-impact automation opportunities",
              "You receive a custom scope and estimate — usually within 48 hours",
              "If it makes sense, we build. If not, no hard feelings.",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 sm:gap-4 text-xs sm:text-sm font-light text-[#e0e0e0]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <span className="text-[#888888] font-mono text-xs mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href="/contact"
            className="block w-full text-center px-8 py-4 text-xs font-semibold uppercase tracking-[0.04em] border border-white bg-white text-black hover:bg-transparent hover:text-white transition-all duration-300"
          >
            Get Your Custom Quote
          </a>
        </div>
      </div>

      <p
        className="reveal text-xs text-[#555555] mt-8 sm:mt-10 max-w-[500px] mx-auto leading-relaxed"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        No commitment to start. A 15-minute call is all it takes to get a
        real estimate.
      </p>
    </section>
  );
}
