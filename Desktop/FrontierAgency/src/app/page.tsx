"use client";

import { useReveal } from "@/hooks/useReveal";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import WhyFrontier from "@/components/WhyFrontier";
import HowItWorks from "@/components/HowItWorks";
import SocialProof from "@/components/SocialProof";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  useReveal();

  return (
    <>
      <SmoothScroll />
      <Navbar />
      <section data-section="hero"><Hero /></section>
      <section data-section="marquee"><Marquee /></section>
      <section data-section="about"><About /></section>
      <section data-section="capabilities"><Capabilities /></section>
      <section data-section="why-frontier"><WhyFrontier /></section>
      <section data-section="how-it-works"><HowItWorks /></section>
      <section data-section="social-proof"><SocialProof /></section>
      <section data-section="pricing"><Pricing /></section>
      <section data-section="faq"><FAQ /></section>
      <section data-section="cta"><CTA /></section>
      <Footer />
    </>
  );
}
