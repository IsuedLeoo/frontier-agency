"use client";

const differentiators = [
  {
    title: "Purpose-Built, Not Off-the-Shelf",
    desc: "Every AI system we build is designed around your specific operations. No generic solutions. No one-size-fits-all. Your automation understands your business before it takes action.",
  },
  {
    title: "Integrated, Not Isolated",
    desc: "Your AI systems connect to the tools you already use — CRMs, ERPs, communication platforms, databases, custom software. Everything works within your stack, not outside it.",
  },
  {
    title: "Custom-Scoped to Your Needs",
    desc: "We don't sell packages. We learn what you need, provide an estimate, and build exactly that. If you need one automated workflow, we build one. If you need twenty, we build twenty.",
  },
  {
    title: "Operate and Scale",
    desc: "We don't disappear after launch. Your AI systems are monitored, tuned, and expanded continuously as your business evolves. Operations that improve every week.",
  },
];

export default function WhyFrontier() {
  return (
    <section className="py-10 sm:py-16 md:py-32 px-6 md:px-12 max-w-[1200px] mx-auto" id="why">
      <p
        className="reveal text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-8"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Why Frontier Agency
      </p>
      <h2
        className="reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Not an agency.
        <br />
        Your agency.
      </h2>
      <p
        className="reveal text-sm sm:text-base md:text-lg font-light text-[#888888] max-w-[600px] leading-relaxed mb-8 sm:mb-12 md:mb-16"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        The difference is in how we build, deploy, and operate your AI systems.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#333333] border border-[#333333]">
        {differentiators.map((d) => (
          <div
            key={d.title}
            className="reveal bg-black p-6 sm:p-8 lg:p-12"
          >
            <h3
              className="text-sm sm:text-base font-semibold tracking-[-0.01em] mb-3 sm:mb-4"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {d.title}
            </h3>
            <p
              className="text-xs sm:text-sm font-light text-[#888888] leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {d.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
