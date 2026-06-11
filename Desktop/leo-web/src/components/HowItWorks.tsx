"use client";

interface Step {
  number: string;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Discovery",
    desc: "We learn your operations, identify automation opportunities, and define the scope of your AI agency.",
  },
  {
    number: "02",
    title: "Design",
    desc: "We architect your custom AI agency — systems, workflows, and integrations tailored to your business.",
  },
  {
    number: "03",
    title: "Build & Deploy",
    desc: "We build your AI agents, integrate them into your stack, and test everything end-to-end.",
  },
  {
    number: "04",
    title: "Operate & Scale",
    desc: "Your AI agency runs daily. We monitor, optimize, and scale as your business grows.",
  },
];

export default function HowItWorks() {
  return (
    <div id="process" className="bg-[#f5f5f5] text-black py-10 sm:py-16 md:py-32 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <p className="reveal text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-8">
          Process
        </p>
        <h2
          className="reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          How we build
          <br />
          your AI agency.
        </h2>
        <p className="reveal text-sm sm:text-base md:text-lg font-light text-[#333333] max-w-[600px] leading-relaxed">
          A proven engagement model. From first conversation to fully
          operational AI systems in weeks, not months.
        </p>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#e0e0e0] bg-[#e0e0e0] gap-px">
          {steps.map((step) => (
            <div
              key={step.number}
              className="reveal bg-white p-5 sm:p-6 lg:p-10"
            >
              <div
                className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#e0e0e0] mb-4 sm:mb-6 leading-none"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {step.number}
              </div>
              <h3
                className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-xs sm:text-sm font-light text-[#888888] leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
