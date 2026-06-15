"use client";

import {
  LayoutDashboard,
  Users,
  Shield,
  DollarSign,
  FolderOpen,
  BookOpen,
  Search,
  FileText,
  BarChart3,
  File,
  Clock,
  Phone,
  Calendar,
  CalendarPlus,
  UserPlus,
  Building,
  Tag,
  StickyNote,
  Mail,
  Globe,
  MapPin,
  Plus,
  Trash,
  Edit,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X,
  CheckCircle,
  AlertCircle,
  Star,
  ClipboardList,
  MessageSquare,
  MousePointerClick,
} from "lucide-react";

const iconMap = {
  dashboard: LayoutDashboard,
  clients: Users,
  staff: Shield,
  invoices: DollarSign,
  storage: FolderOpen,
  handbook: BookOpen,
  intelligence: Search,
  contracts: FileText,
  reports: BarChart3,
  other: File,
  outstanding: Clock,
  phone: Phone,
  calendar: Calendar,
  calendarPlus: CalendarPlus,
  userPlus: UserPlus,
  building: Building,
  tag: Tag,
  note: StickyNote,
  mail: Mail,
  globe: Globe,
  mapPin: MapPin,
  plus: Plus,
  trash: Trash,
  edit: Edit,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  arrowLeft: ArrowLeft,
  x: X,
  checkCircle: CheckCircle,
  alertCircle: AlertCircle,
  star: Star,
  clipboard: ClipboardList,
  chat: MessageSquare,
  chart: BarChart3,
  analytics: BarChart3,
  cursor: MousePointerClick,
} as const;

type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export default function Icon({ name, size = 18, className = "" }: IconProps) {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} />;
}

export type { IconName };
