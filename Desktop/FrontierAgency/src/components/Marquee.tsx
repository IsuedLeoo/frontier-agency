const items = [
  "Custom AI Agency Builds",
  "End-to-End Automation",
  "Operations Management",
  "Workflow Design",
  "Process Optimization",
  "Client-Facing AI Systems",
  "Team Augmentation",
  "Strategy & Consulting",
  "Always On. Always Learning.",
  "Built for Scale",
];

const track = [...items, ...items];

export default function Marquee() {
  return (
    <div className="py-4 sm:py-5 border-t border-b border-[#333333] overflow-hidden">
      <div className="flex w-max animate-marquee">
        {track.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-8 px-8 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#888888] shrink-0" />
            <span
              className="text-xs font-medium uppercase tracking-[0.1em] text-[#888888]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
