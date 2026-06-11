"use client";

interface Tier {
  name: string;
  priceRange: string;
  exampleNote: string;
  note: string;
  features: string[];
  highlight?: boolean;
}

const tiers: Tier[] = [
  {
    name: "Starter",
    priceRange: "$1,500 – $5,000",
    exampleNote: "Example: a single-agent automation for email triage and scheduling.",
    note: "Best for small businesses and solo founders getting started with AI automation.",
    features: [
      "Single-domain automation",
      "Up to 3 tool integrations",
      "Dedicated AI agent team",
      "30 days of operation support",
      "Performance reporting",
    ],
  },
  {
    name: "Growth",
    priceRange: "$5,000 – $25,000",
    exampleNote: "Example: multi-agent system handling CRM, support tickets, and reporting.",
    note: "For scaling companies ready to automate core operations across departments.",
    features: [
      "Multi-domain automation",
      "Unlimited integrations",
      "Multi-agent system architecture",
      "90 days of operation support",
      "Workflow analytics dashboard",
      "Quarterly strategy reviews",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    priceRange: "$25,000 – $100,000+",
    exampleNote: "Example: full AI operations team replacing 10+ manual workflows.",
    note: "For organizations that need a fully custom AI operations team at scale.",
    features: [
      "Full-scope operations takeover",
      "Custom agent development",
      "Dedicated success engineer",
      "12 months of continuous optimization",
      "SLA guarantees",
      "On-premise deployment option",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="py-10 sm:py-16 md:py-32 px-6 md:px-12 text-center" id="pricing">
      <p
        className="reveal text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-8"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Engagement
      </p>
      <h2
        className="reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Built for
        <br />
        your scale.
      </h2>
      <p
        className="reveal text-sm sm:text-base md:text-lg font-light text-[#888888] max-w-[600px] leading-relaxed mx-auto mb-8 sm:mb-12 md:mb-16"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Every engagement is priced around the scope of work. The ranges below
        are examples — your final price is always negotiated based on your
        specific needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#333333] border border-[#333333] max-w-[1200px] mx-auto text-left">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`reveal p-6 sm:p-8 lg:p-10 flex flex-col ${tier.highlight ? "bg-white text-black" : "bg-black text-white"}`}
          >
            <p
              className={`text-[0.65rem] sm:text-xs font-medium uppercase tracking-[0.2em] mb-4 sm:mb-6 ${tier.highlight ? "text-[#888888]" : "text-[#888888]"}`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {tier.name}
            </p>

            <div
              className="text-3xl sm:text-4xl font-bold tracking-tight leading-none mb-1"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {tier.priceRange}
            </div>

            <p
              className={`text-[0.6rem] sm:text-[0.65rem] font-light leading-relaxed mb-4 ${tier.highlight ? "text-[#888888]" : "text-[#555555]"}`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {tier.exampleNote}
            </p>

            <p
              className={`text-xs sm:text-sm font-light leading-relaxed mb-6 sm:mb-8 ${tier.highlight ? "text-[#333333]" : "text-[#888888]"}`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {tier.note}
            </p>

            <ul className="mb-10 list-none space-y-0 flex-1">
              {tier.features.map((f) => (
                <li
                  key={f}
                  className={`py-2.5 sm:py-3 text-xs sm:text-sm font-light border-b flex items-center gap-3 sm:gap-4 last:border-b-0 ${tier.highlight ? "border-[#e0e0e0] text-[#333333]" : "border-[#333333] text-[#e0e0e0]"}`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <span className={tier.highlight ? "text-[#888888]" : "text-[#888888]"}>—</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#pricing"
              className={`block w-full text-center px-8 py-4 text-xs font-semibold uppercase tracking-[0.04em] border transition-all duration-300 ${
                tier.highlight
                  ? "bg-black text-white border-black hover:bg-transparent hover:text-black"
                  : "bg-white text-black border-white hover:bg-transparent hover:text-white"
              }`}
            >
              Get a Quote
            </a>
          </div>
        ))}
      </div>

      <p
        className="reveal text-xs text-[#555555] mt-8 sm:mt-10 max-w-[500px] mx-auto leading-relaxed"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        All prices are example ranges. Your final cost depends on the services
        you need, the complexity of your workflows, and the level of support
        required. Call us and we&apos;ll scope it together.
      </p>
    </section>
  );
}
