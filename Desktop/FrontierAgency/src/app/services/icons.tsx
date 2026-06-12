"use client";

import {
  Settings,
  RefreshCw,
  MessageCircle,
  BarChart3,
  Users,
  Target,
  Banknote,
  Megaphone,
  Headphones,
  ClipboardList,
  Search,
  Shield,
  Building2,
  Scale,
  Monitor,
  Palette,
  Compass,
  FolderOpen,
  Hotel,
  UtensilsCrossed,
  Warehouse,
  Stethoscope,
  Landmark,
  Briefcase,
  ShoppingCart,
  GraduationCap,
  Plane,
  Home,
  Car,
  Factory,
  Sprout,
  Phone,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export type IconName =
  | "settings"
  | "refreshcw"
  | "messagecircle"
  | "barchart3"
  | "users"
  | "target"
  | "banknote"
  | "megaphone"
  | "headphones"
  | "clipboardlist"
  | "search"
  | "shield"
  | "building2"
  | "scale"
  | "monitor"
  | "palette"
  | "compass"
  | "folderopen"
  | "hotel"
  | "utensilscrossed"
  | "warehouse"
  | "stethoscope"
  | "landmark"
  | "briefcase"
  | "shoppingcart"
  | "graduationcap"
  | "plane"
  | "home"
  | "car"
  | "factory"
  | "sprout"
  | "phone"
  | "calendar";

const iconMap: Record<IconName, LucideIcon> = {
  settings: Settings,
  refreshcw: RefreshCw,
  messagecircle: MessageCircle,
  barchart3: BarChart3,
  users: Users,
  target: Target,
  banknote: Banknote,
  megaphone: Megaphone,
  headphones: Headphones,
  clipboardlist: ClipboardList,
  search: Search,
  shield: Shield,
  building2: Building2,
  scale: Scale,
  monitor: Monitor,
  palette: Palette,
  compass: Compass,
  folderopen: FolderOpen,
  hotel: Hotel,
  utensilscrossed: UtensilsCrossed,
  warehouse: Warehouse,
  stethoscope: Stethoscope,
  landmark: Landmark,
  briefcase: Briefcase,
  shoppingcart: ShoppingCart,
  graduationcap: GraduationCap,
  plane: Plane,
  home: Home,
  car: Car,
  factory: Factory,
  sprout: Sprout,
  phone: Phone,
  calendar: Calendar,
};

interface DepartmentIconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function DepartmentIcon({ name, size = 20, strokeWidth = 1.5, className }: DepartmentIconProps): ReactNode {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} />;
}

export function getIconName(emoji: string): IconName {
  const map: Record<string, IconName> = {
    "⚙️": "settings",
    "🔄": "refreshcw",
    "💬": "messagecircle",
    "📊": "barchart3",
    "👥": "users",
    "🎯": "target",
    "💰": "banknote",
    "📣": "megaphone",
    "🎧": "headphones",
    "📋": "clipboardlist",
    "🔍": "search",
    "🛡️": "shield",
    "🏢": "building2",
    "⚖️": "scale",
    "💻": "monitor",
    "🎨": "palette",
    "🧭": "compass",
    "📁": "folderopen",
    "🏨": "hotel",
    "🍽️": "utensilscrossed",
    "🏭": "warehouse",
    "🏥": "stethoscope",
    "🏛️": "landmark",
    "💼": "briefcase",
    "🛒": "shoppingcart",
    "🎓": "graduationcap",
    "✈️": "plane",
    "🏠": "home",
    "🚗": "car",
    "🏗️": "factory",
    "🌱": "sprout",
    "📞": "phone",
    "📅": "calendar",
  };
  return map[emoji] ?? "settings";
}
