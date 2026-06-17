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
    priceRange: "$2,000 – $5,000",
    exampleNote: "Example: an automated receptionist that answers your phones, takes messages, and books appointments — 24/7.",
    note: "Perfect for solo founders and small businesses that want to stop missing calls and start looking bigger than they are.",
    features: [
      "One automated system handling one job (phones, email, scheduling, or chat)",
      "Answers your calls within 3 rings — even at 2am on a Sunday",
      "Books appointments directly into your calendar without you lifting a finger",
      "Sends you a daily text summary of everything that happened",
      "Connects to 2 of your existing tools (Google Calendar, Gmail, etc.)",
      "You get a real human to call if anything weird comes up",
    ],
  },
  {
    name: "Growth",
    priceRange: "$5,000 – $15,000",
    exampleNote: "Example: automated systems handle your front desk, follow up with every lead, and chase unpaid invoices — all at the same time.",
    note: "For businesses ready to stop doing repetitive work by hand and start scaling without hiring.",
    features: [
      "Multiple automated systems working together (phones + email + CRM + scheduling)",
      "Every new lead gets called back within 5 minutes — day or night",
      "Unpaid invoices get polite but firm reminders sent automatically",
      "Your calendar fills itself — no more 'does Tuesday work?' email chains",
      "Connects to 5+ tools (CRM, calendar, email, payment processor, etc.)",
      "Weekly report showing exactly how many hours you got back",
      "One monthly 30-minute call with our team to tweak and improve",
    ],
    highlight: true,
  },
  {
    name: "Scale",
    priceRange: "$15,000 – $50,000",
    exampleNote: "Example: full AI operations — receptionist, sales follow-up, invoicing, customer check-ins, and reporting — all running 24/7.",
    note: "For companies that want an entire AI department for less than the cost of one employee.",
    features: [
      "Comprehensive automation across your phones, email, sales, billing, and customer success",
      "Leads get called in under 5 minutes, followed up for 30 days, and handed to you when they're ready to buy",
      "Invoices go out on time, overdue payments get chased, and your books stay clean",
      "Customers get checked on automatically — problems get caught before they cancel",
      "Connects to every tool you use (unlimited integrations)",
      "Real-time dashboard showing calls answered, leads contacted, invoices sent, and money collected",
      "Dedicated account manager who knows your business and proactively finds new ways to save you time",
      "Same-day support — if something breaks, we fix it today, not tomorrow",
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
        Pricing
      </p>
      <h2
        className="reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Custom AI automation.
        <br />
        Starting at $2,000.
      </h2>
      <p
        className="reveal text-sm sm:text-base md:text-lg font-light text-[#888888] max-w-[600px] leading-relaxed mx-auto mb-8 sm:mb-12 md:mb-16"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Every project is scoped to your needs. These ranges reflect what
        most businesses invest — we provide a custom estimate after
        understanding what you actually need.
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
        All prices are project estimates based on scope. We&apos;ll build a custom
        plan if none of these fit — <a href="/contact" className="underline underline-offset-2 hover:text-white transition-colors">call us</a> and
        we&apos;ll figure it out in 15 minutes. Most projects fall between $5,000 and $15,000.
      </p>
    </section>
  );
}
