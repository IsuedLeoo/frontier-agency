import type { IconName } from "./icons";

export interface ServiceDocumentation {
  overview: string;
  howItWorks: { step: number; title: string; description: string }[];
  benefits: { title: string; description: string; metric: string }[];
  useCases: { title: string; description: string }[];
}

export interface ServiceItem {
  name: string;
  slug: string;
  description: string;
  capabilities: string[];
  documentation: ServiceDocumentation;
}

export interface ServiceCategory {
  department: string;
  slug: string;
  icon: IconName;
  items: ServiceItem[];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ─── Import department data ──────────────────────────────────────────────────

import { departments } from "./departments";

// ─── Build allServices with slugs ────────────────────────────────────────────

function addSlugs(depts: { department: string; icon: IconName; items: Omit<ServiceItem, "slug">[] }[]): ServiceCategory[] {
  return depts.map((dept) => ({
    department: dept.department,
    slug: slugify(dept.department),
    icon: dept.icon,
    items: dept.items.map((item) => ({
      ...item,
      slug: slugify(item.name),
    })),
  }));
}

export const allServices: ServiceCategory[] = addSlugs(departments);

// ─── Lookup helpers ──────────────────────────────────────────────────────────

export function getService(
  deptSlug: string,
  serviceSlug: string
): { category: ServiceCategory; service: ServiceItem } | null {
  const category = allServices.find((c) => c.slug === deptSlug);
  if (!category) return null;
  const service = category.items.find((s) => s.slug === serviceSlug);
  if (!service) return null;
  return { category, service };
}

export function getAllServicePaths(): { department: string; service: string }[] {
  return allServices.flatMap((cat) =>
    cat.items.map((item) => ({
      department: cat.slug,
      service: item.slug,
    }))
  );
}
