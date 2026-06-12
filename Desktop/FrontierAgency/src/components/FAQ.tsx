"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What exactly is a personalized AI agency?",
    answer:
      "We build custom AI systems tailored to your business operations. Think of it as an AI operations team designed specifically for how you work — handling tasks, managing workflows, and making decisions autonomously across your organization.",
  },
  {
    question: "How long does it take to build?",
    answer:
      "Most engagements launch in 2-4 weeks. Complex, enterprise-grade systems may take 6-8 weeks. We deliver incrementally so you see value from day one.",
  },
  {
    question: "Is this just another chatbot?",
    answer:
      "No. We build multi-agent systems that execute real tasks across your software stack — not just conversation. Your agency manages workflows, makes decisions, and takes action autonomously.",
  },
  {
    question: "What if our needs change?",
    answer:
      "Every engagement includes ongoing support and iteration. Your AI agency evolves with your business. We tune, expand, and optimize continuously.",
  },
  {
    question: "What tools and platforms do you integrate with?",
    answer:
      "We work with everything: CRMs, ERPs, communication tools, databases, custom software, APIs — if your business uses it, we integrate with it.",
  },
  {
    question: "Who owns the AI systems you build?",
    answer:
      "You do. All custom-built systems are yours. IP, configurations, and data remain under your control at all times.",
  },
];

function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-12 divide-y divide-[#333333]">
      {items.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className={`faq-item ${isOpen ? "open" : ""}`}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full bg-transparent border-none text-white text-left cursor-pointer flex justify-between items-start sm:items-center gap-4 sm:gap-8 py-6 sm:py-8 hover:text-[#888888] transition-colors duration-300"
            >
              <span
                className="text-sm sm:text-base font-normal leading-snug"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {faq.question}
              </span>
              <span
                className="text-xl sm:text-2xl font-light shrink-0 transition-transform duration-300 mt-0.5 sm:mt-0"
                style={{
                  fontFamily: "var(--font-inter)",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                +
              </span>
            </button>
            <div className="faq-answer">
              <p
                className="pb-6 sm:pb-8 text-xs sm:text-sm font-light text-[#888888] leading-relaxed pr-8 sm:pr-12"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="py-10 sm:py-16 md:py-32 px-6 md:px-12 max-w-[800px] mx-auto" id="faq">
      <p
        className="reveal text-xs font-medium uppercase tracking-[0.2em] text-[#888888] mb-8"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        FAQ
      </p>
      <h2
        className="reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Questions.
      </h2>

      <div className="reveal">
        <FAQAccordion items={faqs} />
      </div>
    </section>
  );
}
