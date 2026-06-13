"use client";

import AnthropicIcon from "@/components/AnthropicIcon";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-12 relative pt-24">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left: Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <h1
            className="reveal text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-[0.95] mb-4 sm:mb-6 md:mb-8"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Frontier Agency
            <span className="block font-light text-[#888888] text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl">Personalized AI. Built for your business.</span>
          </h1>

          <p
            className="reveal text-sm sm:text-base md:text-lg font-light text-[#888888] max-w-[600px] leading-relaxed mb-8 sm:mb-10 md:mb-12 mx-auto lg:mx-0"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            We design, build, and deploy custom AI agencies for businesses of
            every size. From solo founders to Fortune 500s — your operations,
            automated.
          </p>

          <div className="reveal flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-8 sm:mb-10">
            <span className="flex items-center gap-2 text-[0.65rem] sm:text-xs text-[#888888] tracking-[0.08em]" style={{ fontFamily: "var(--font-inter)" }}>
              <span className="text-[#555555]">OWNED BY</span>
              <span className="relative group">
                <a href="https://gstudios.co" target="_blank" rel="noopener noreferrer" className="font-semibold text-white tracking-wide hover:text-[#C5A55A] transition-colors duration-300 cursor-pointer">gStudios</a>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#333333] rounded text-[0.65rem] sm:text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ fontFamily: "var(--font-inter)" }}>
                  <span className="text-[#C5A55A]">Golden</span><span className="text-white"> Studios</span>
                </span>
              </span>
            </span>
            <span className="hidden sm:inline text-[#333333]">·</span>
            <span className="flex items-center gap-2 text-[0.65rem] sm:text-xs text-[#888888] tracking-[0.08em]" style={{ fontFamily: "var(--font-inter)" }}>
              <span className="text-[#555555]">PARTNERED WITH</span>
              <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-white tracking-wide hover:text-[#C5A55A] transition-colors duration-300"><AnthropicIcon className="w-3.5 h-3.5" />Anthropic</a>
              <span className="text-[#333333] mx-1">·</span>
              <a href="https://globallistarealty.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white tracking-wide hover:text-[#C5A55A] transition-colors duration-300">Global Lista Realty</a>
            </span>
          </div>

          <div className="reveal flex flex-col sm:flex-row gap-4 sm:gap-4 w-full sm:w-auto items-center justify-center lg:justify-start">
            <a
              href="#pricing"
              className="w-full sm:w-auto text-center px-8 py-4 bg-white text-black text-xs font-semibold uppercase tracking-[0.04em] border border-white hover:bg-transparent hover:text-white transition-all duration-300"
            >
              Start a Project
            </a>
            <a
              href="tel:+17867439361"
              className="w-full sm:w-auto text-center px-8 py-4 bg-transparent text-white text-xs font-medium uppercase tracking-[0.04em] border border-[#333333] hover:border-white transition-all duration-300"
            >
              Call (786) 743-9361
            </a>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="reveal flex-1 flex justify-center lg:justify-end">
          <img
            src="/herobuilding.png"
            alt="AI Agency Hero"
            className="w-full max-w-[500px] lg:max-w-[600px] h-auto object-contain"
          />
        </div>
      </div>

      <div className="reveal absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span
          className="text-[0.7rem] text-[#888888] uppercase tracking-[0.15em]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Discover
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[#888888] to-transparent animate-scroll-pulse" />
      </div>
    </section>
  );
}
