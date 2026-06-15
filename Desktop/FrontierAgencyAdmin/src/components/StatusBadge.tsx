interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  // Invoice statuses
  draft: "bg-white/10 text-white/70 border-white/20",
  sent: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  paid: "bg-green-500/10 text-green-400 border-green-500/30",
  overdue: "bg-red-500/10 text-red-400 border-red-500/30",
  cancelled: "bg-white/5 text-white/40 border-white/10",
  // User statuses
  active: "bg-green-500/10 text-green-400 border-green-500/30",
  inactive: "bg-red-500/10 text-red-400 border-red-500/30",
  // CRM statuses
  lead: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  qualified: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  customer: "bg-green-500/10 text-green-400 border-green-500/30",
  // Project statuses
  discovery: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  project_active: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  completed: "bg-green-500/10 text-green-400 border-green-500/30",
  paused: "bg-white/10 text-white/60 border-white/20",
  // Appointment statuses
  scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  no_show: "bg-red-500/10 text-red-400 border-red-500/30",
  // Priority levels
  low: "bg-white/5 text-white/50 border-white/10",
  medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  vip: "bg-[#C5A55A]/15 text-[#C5A55A] border-[#C5A55A]/30",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.draft;
  return (
    <span className={`badge border ${style}`}>
      {status}
    </span>
  );
}
