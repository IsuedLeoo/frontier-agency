"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { allServices, slugify } from "./data";
import { DepartmentIcon } from "./icons";
import Logo from "@/components/Logo";
import ClaudeIcon from "@/components/ClaudeIcon";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState<string | null>(null);

  const totalServices = useMemo(
    () => allServices.reduce((sum, cat) => sum + cat.items.length, 0),
    []
  );

  const filtered = useMemo(() => {
    let results = allServices;
    if (activeDept) {
      results = results.filter((c) => c.slug === activeDept);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) =>
            item.name.toLowerCase().includes(q)
          ),
        }))
        .filter((cat) => cat.items.length > 0);
    }
    return results;
  }, [search, activeDept]);

  const filteredCount = useMemo(
    () => filtered.reduce((sum, cat) => sum + cat.items.length, 0),
    [filtered]
  );

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-[#333333]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="block">
            <Logo variant="dark" />
          </Link>
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-[0.1em] text-[#888888] hover:text-white transition-colors duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-20 md:py-28 px-6 md:px-12 text-center">
        <p
          className="text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-4 sm:mb-6"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Complete Service Index
        </p>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Everything your AI agency
          <br />
          can handle.
        </h1>
        <p
          className="text-sm sm:text-base md:text-lg font-light text-[#888888] max-w-[600px] leading-relaxed mx-auto mb-8"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {totalServices}+ services across {allServices.length} departments.
          Search or browse below.
        </p>

        {/* Search */}
        <div className="max-w-[500px] mx-auto relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-transparent border border-[#333333] rounded-lg px-5 py-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-white transition-colors duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          />
          {search && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.65rem] text-[#555555]" style={{ fontFamily: "var(--font-inter)" }}>
              {filteredCount} result{filteredCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </section>

      {/* Department filter pills */}
      <section className="px-6 md:px-12 pb-8 sm:pb-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveDept(null)}
              className={`px-4 py-2 text-[0.65rem] sm:text-xs font-medium uppercase tracking-[0.08em] border rounded-full transition-all duration-300 cursor-pointer ${
                activeDept === null
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-[#888888] border-[#333333] hover:border-white hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              All Departments
            </button>
            {allServices.map((cat) => (
              <button
                key={cat.slug}
                onClick={() =>
                  setActiveDept(
                    activeDept === cat.slug ? null : cat.slug
                  )
                }
                className={`px-4 py-2 text-[0.65rem] sm:text-xs font-medium uppercase tracking-[0.08em] border rounded-full transition-all duration-300 cursor-pointer ${
                  activeDept === cat.slug
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-[#888888] border-[#333333] hover:border-white hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {cat.department}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service categories */}
      <section className="px-6 md:px-12 pb-20 sm:pb-28">
        <div className="max-w-[1400px] mx-auto space-y-12 sm:space-y-16">
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p
                className="text-sm text-[#555555]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                No services match your search. Try a different keyword.
              </p>
            </div>
          )}
          {filtered.map((category) => (
            <div key={category.department}>
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <DepartmentIcon name={category.icon} size={20} className="sm:w-6 sm:h-6" />
                <h2
                  className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {category.department}
                </h2>
                <span
                  className="text-[0.65rem] sm:text-xs text-[#555555] ml-2"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {category.items.length} services
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#222222] border border-[#222222]">
                {category.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/services/${category.slug}/${item.slug}`}
                    className="bg-black px-5 py-3.5 hover:bg-[#111111] transition-colors duration-200 group"
                  >
                    <span
                      className="text-xs sm:text-sm text-[#e0e0e0] font-light leading-snug group-hover:text-white transition-colors duration-200"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-28 px-6 md:px-12 text-center border-t border-[#333333]">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Don&apos;t see what you need?
        </h2>
        <p
          className="text-sm sm:text-base md:text-lg font-light text-[#888888] max-w-[500px] leading-relaxed mx-auto mb-8 sm:mb-10"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          This is a starting point. Every engagement is fully custom — we build
          AI systems for whatever your business requires.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link
            href="/#pricing"
            className="inline-block px-8 py-4 bg-white text-black text-xs font-semibold uppercase tracking-[0.04em] border border-white hover:bg-transparent hover:text-white transition-all duration-300"
          >
            Schedule a Call
          </Link>
          <a
            href="tel:+19862010858"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#888888] hover:text-white transition-colors duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <span className="text-[#C5A55A]">☎</span> (986) 201-0858
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-[#333333]">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="text-xs text-[#888888]" style={{ fontFamily: "var(--font-inter)" }}>
              &copy; 2026 Frontier Agency. All rights reserved.
            </span>
            <a
              href="tel:+19862010858"
              className="text-xs text-[#888888] hover:text-white transition-colors duration-300"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              (986) 201-0858
            </a>
          </div>
          <div className="flex items-center gap-2 text-[0.65rem] sm:text-xs text-[#888888] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-inter)" }}>
            <span className="text-[#555555]">A</span>
            <a href="https://gstudios.co" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-[#C5A55A] transition-colors duration-300 tracking-wide">@gProd</a>
            <span className="text-[#555555]">company</span>
            <span className="text-[#333333] mx-1">·</span>
            <span className="text-[#555555]">Partnered with</span>
            <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#C5A55A] transition-colors duration-300 tracking-wide"><ClaudeIcon className="w-3.5 h-3.5" />Anthropic</a>
            <span className="text-[#333333] mx-1">·</span>
            <a href="https://globallistarealty.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-[#C5A55A] transition-colors duration-300 tracking-wide">Global Lista Realty</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
