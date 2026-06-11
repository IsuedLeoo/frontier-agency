"use client";

import { useState, useEffect } from "react";
import PhoneLink from "./PhoneLink";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 flex justify-between items-center transition-all duration-300 ${
        scrolled ? "mix-blend-difference" : ""
      }`}
    >
      <a
        href="#"
        className="text-base font-bold tracking-tight text-white relative z-50"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Frontier Agency
      </a>

      {/* Desktop nav */}
      <ul className="hidden md:flex gap-10 list-none">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white transition-colors duration-300"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <PhoneLink
        className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.04em] text-white hover:text-[#C5A55A] transition-colors duration-300 cursor-pointer"
      />

      <a
        href="#pricing"
        className="hidden sm:inline-flex items-center px-5 py-2.5 text-xs font-medium uppercase tracking-[0.04em] text-white border border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
      >
        Contact
      </a>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        <span
          className={`block w-6 h-px bg-white transition-all duration-300 ${
            mobileOpen ? "rotate-45 translate-y-[3.5px]" : ""
          }`}
        />
        <span
          className={`block w-6 h-px bg-white transition-all duration-300 ${
            mobileOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-px bg-white transition-all duration-300 ${
            mobileOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
          }`}
        />
      </button>

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 bg-black z-40 flex flex-col justify-center items-center gap-8 transition-all duration-500 md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="list-none flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium uppercase tracking-[0.1em] text-[#888888] hover:text-white transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#pricing"
          onClick={() => setMobileOpen(false)}
          className="mt-4 inline-flex items-center px-8 py-4 text-sm font-medium uppercase tracking-[0.04em] text-white border border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
