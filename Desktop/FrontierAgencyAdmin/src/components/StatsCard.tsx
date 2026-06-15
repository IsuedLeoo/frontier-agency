import Icon, { type IconName } from "./Icons";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: IconName;
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-[0.7rem] uppercase tracking-[0.15em] text-[#555] mb-2"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {title}
          </p>
          <p
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-[#888] mt-1" style={{ fontFamily: "var(--font-inter)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && <Icon name={icon} size={24} className="text-[#C5A55A]" />}
      </div>
    </div>
  );
}
