import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Zap, Clock, TrendingUp, Users, Shield, ChevronRight } from "lucide-react";
import { getService, getAllServicePaths, allServices } from "../../data";
import type { ServiceCategory, ServiceItem, ServiceDocumentation } from "../../data";
import { DepartmentIcon } from "../../icons";
import Logo from "@/components/Logo";

interface Props {
  params: Promise<{ department: string; service: string }>;
}

export async function generateStaticParams() {
  return getAllServicePaths();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { department, service } = await params;
  const result = getService(department, service);
  if (result) {
    return {
      title: `${result.service.name} | Frontier Agency`,
      description: result.service.description,
    };
  }
  return { title: "Service | Frontier Agency" };
}

// ─── Section components ─────────────────────────────────────────────────────

function OverviewSection({ overview }: { overview: string }) {
  const paragraphs = overview.split("\n\n");
  return (
    <section id="overview" className="scroll-mt-24">
      <h2
        className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-6 sm:mb-8"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Overview
      </h2>
      <div className="max-w-[720px] space-y-5">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-sm sm:text-base text-[#b0b0b0] leading-[1.8]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection({ steps }: { steps: ServiceDocumentation["howItWorks"] }) {
  return (
    <section id="how-it-works" className="scroll-mt-24">
      <h2
        className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-6 sm:mb-8"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        How It Works
      </h2>
      <div className="max-w-[720px] space-y-8">
        {steps.map((step) => (
          <div key={step.step} className="flex gap-5 sm:gap-6">
            <div className="shrink-0">
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C5A55A]/10 border border-[#C5A55A]/30 flex items-center justify-center text-sm font-bold text-[#C5A55A]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {step.step}
              </div>
            </div>
            <div className="flex-1 pt-1">
              <h3
                className="text-base sm:text-lg font-semibold text-white mb-2"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm sm:text-base text-[#888888] leading-[1.7]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BenefitsSection({ benefits }: { benefits: ServiceDocumentation["benefits"] }) {
  const icons = [Zap, Clock, TrendingUp, Shield, Users, Check];
  return (
    <section id="benefits" className="scroll-mt-24">
      <h2
        className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-6 sm:mb-8"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Business Benefits
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {benefits.map((benefit, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className="group rounded-xl border border-[#222222] bg-[#0a0a0a] p-5 sm:p-6 hover:border-[#333333] transition-colors duration-300"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#C5A55A]/10 flex items-center justify-center">
                  <Icon size={16} className="text-[#C5A55A]" />
                </div>
                <span
                  className="text-2xl sm:text-3xl font-bold text-[#C5A55A]"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {benefit.metric}
                </span>
              </div>
              <h3
                className="text-sm sm:text-base font-semibold text-white mb-2"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {benefit.title}
              </h3>
              <p
                className="text-xs sm:text-sm text-[#888888] leading-[1.7]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function UseCasesSection({ useCases }: { useCases: ServiceDocumentation["useCases"] }) {
  return (
    <section id="use-cases" className="scroll-mt-24">
      <h2
        className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-6 sm:mb-8"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Use Cases
      </h2>
      <div className="space-y-5">
        {useCases.map((uc, i) => (
          <article
            key={i}
            className="rounded-xl border border-[#222222] bg-[#080808] p-5 sm:p-7 hover:border-[#333333] transition-colors duration-300"
          >
            <h3
              className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              <ChevronRight size={16} className="text-[#C5A55A] shrink-0" />
              {uc.title}
            </h3>
            <p
              className="text-sm sm:text-base text-[#888888] leading-[1.8]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {uc.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CapabilitiesSection({ capabilities }: { capabilities: string[] }) {
  return (
    <section id="capabilities" className="scroll-mt-24">
      <h2
        className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-6 sm:mb-8"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        What Our AI Handles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#222222] border border-[#222222]">
        {capabilities.map((cap, i) => (
          <div
            key={i}
            className="bg-black px-5 py-4 sm:px-6 sm:py-5 hover:bg-[#111111] transition-colors duration-200"
          >
            <div className="flex items-start gap-3">
              <Check size={14} className="text-[#C5A55A] mt-0.5 shrink-0" />
              <span
                className="text-xs sm:text-sm text-[#e0e0e0] font-light leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {cap}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Sidebar navigation ──────────────────────────────────────────────────────

function Sidebar({
  doc,
  deptSlug,
  serviceSlug,
  related,
}: {
  doc: ServiceDocumentation;
  deptSlug: string;
  serviceSlug: string;
  related: ServiceItem[];
}) {
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "how-it-works", label: "How It Works" },
    { id: "benefits", label: "Benefits" },
    { id: "use-cases", label: "Use Cases" },
    { id: "capabilities", label: "Capabilities" },
  ];

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <nav className="sticky top-20 space-y-6">
        {/* Section nav */}
        <div>
          <p
            className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-[#555555] mb-3"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            On this page
          </p>
          <ul className="space-y-1 border-l border-[#222222]">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block pl-3 py-1.5 text-xs text-[#888888] hover:text-white border-l -ml-px border-transparent hover:border-[#C5A55A] transition-colors duration-200"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Related services */}
        {related.length > 0 && (
          <div>
            <p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-[#555555] mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Related
            </p>
            <ul className="space-y-1">
              {related.slice(0, 5).map((rel) => {
                const relDept = allServices.find((c) =>
                  c.items.some((s) => s.slug === rel.slug)
                );
                return (
                  <li key={rel.slug}>
                    <Link
                      href={`/services/${relDept ? relDept.slug : deptSlug}/${rel.slug}`}
                      className="block py-1.5 text-xs text-[#888888] hover:text-white transition-colors duration-200 truncate"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {rel.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ServicePage({ params }: Props) {
  const { department, service } = await params;
  const result = getService(department, service);

  if (!result) notFound();

  const { category, service: svc } = result;
  const doc = svc.documentation;

  // Get related services (same department, excluding current)
  const related = category.items
    .filter((s) => s.slug !== svc.slug)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-[#333333]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="block">
            <Logo variant="dark" />
          </Link>
          <Link
            href="/services"
            className="text-xs font-medium uppercase tracking-[0.1em] text-[#888888] hover:text-white transition-colors duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ← All Services
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-6 sm:pt-8">
        <nav
          className="flex items-center gap-2 text-[0.65rem] sm:text-xs text-[#555555]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <Link
            href="/services"
            className="hover:text-white transition-colors duration-300"
          >
            Services
          </Link>
          <span>/</span>
          <Link
            href="/services"
            className="hover:text-white transition-colors duration-300"
          >
            {category.department}
          </Link>
          <span>/</span>
          <span className="text-[#888888]">{svc.name}</span>
        </nav>
      </div>

      {/* Main content area with sidebar */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-8 sm:pt-12 pb-20 sm:pb-28">
        <div className="flex gap-10">
          {/* Sidebar */}
          <Sidebar
            doc={doc}
            deptSlug={category.slug}
            serviceSlug={svc.slug}
            related={related}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Hero */}
            <div className="mb-12 sm:mb-16">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <DepartmentIcon
                  name={category.icon}
                  size={20}
                  className="sm:w-8 sm:h-8"
                />
                <span
                  className="text-[0.65rem] sm:text-xs font-medium uppercase tracking-[0.15em] text-[#555555]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {category.department}
                </span>
              </div>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {svc.name}
              </h1>
              <p
                className="text-sm sm:text-base md:text-lg font-light text-[#888888] max-w-[700px] leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {svc.description}
              </p>
            </div>

            {/* Documentation sections */}
            <div className="space-y-16 sm:space-y-20">
              <OverviewSection overview={doc.overview} />
              <HowItWorksSection steps={doc.howItWorks} />
              <BenefitsSection benefits={doc.benefits} />
              <UseCasesSection useCases={doc.useCases} />
              <CapabilitiesSection capabilities={svc.capabilities} />
            </div>

            {/* Related Services */}
            {related.length > 0 && (
              <section className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-[#222222]">
                <h2
                  className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight mb-6 sm:mb-8"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Related services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#222222] border border-[#222222]">
                  {related.map((rel, i) => {
                    const relDept = allServices.find((c) =>
                      c.items.some((s) => s.slug === rel.slug)
                    );
                    return (
                      <Link
                        key={i}
                        href={`/services/${relDept ? relDept.slug : category.slug}/${rel.slug}`}
                        className="bg-black px-5 py-4 sm:px-6 sm:py-5 hover:bg-[#111111] transition-colors duration-200 group"
                      >
                        <span
                          className="text-xs sm:text-sm text-[#e0e0e0] font-light leading-snug group-hover:text-white transition-colors duration-200"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {rel.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-24 px-6 md:px-12 text-center border-t border-[#333333]">
        <h2
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.05] mb-3 sm:mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Ready to automate
          <br />
          {svc.name.toLowerCase()}?
        </h2>
        <p
          className="text-xs sm:text-sm md:text-base font-light text-[#888888] max-w-[500px] leading-relaxed mx-auto mb-6 sm:mb-8"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Every engagement is custom. Tell us about your business and we
          will show you what is possible.
        </p>
        <Link
          href="/#pricing"
          className="inline-block px-8 py-4 bg-white text-black text-xs font-semibold uppercase tracking-[0.04em] border border-white hover:bg-transparent hover:text-white transition-all duration-300"
        >
          Schedule a Call
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-[#333333]">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <span
            className="text-xs text-[#888888]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            © 2026 Frontier Agency. All rights reserved.
          </span>
          <div
            className="flex items-center gap-2 text-[0.65rem] sm:text-xs text-[#888888] tracking-[0.1em] uppercase"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <span className="text-[#555555]">A</span>
            <a
              href="https://gstudios.co"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:text-[#C5A55A] transition-colors duration-300 tracking-wide"
            >
              @gProd
            </a>
            <span className="text-[#555555]">company</span>
            <span className="text-[#333333] mx-1">·</span>
            <span className="text-[#555555]">Partnered with</span>
            <a
              href="https://anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:text-[#C5A55A] transition-colors duration-300 tracking-wide"
            >
              Anthropic
            </a>
            <span className="text-[#333333] mx-1">·</span>
            <a
              href="https://globallistarealty.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:text-[#C5A55A] transition-colors duration-300 tracking-wide"
            >
              Globallista Realty
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
