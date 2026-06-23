"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Footer from "@/components/marketing/Footer";

function ScrollReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        } ${className}`}
    >
      {children}
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#222] py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-sm font-medium text-[#EDEDED] focus:outline-none py-1 group select-none"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span className="text-lg text-[#555] group-hover:text-[#888] font-mono transition-colors">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden text-xs md:text-sm text-[#888] ${isOpen ? "max-h-[300px] mt-2 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <p className="pb-2 leading-relaxed whitespace-pre-line">{answer}</p>
      </div>
    </div>
  );
}

export default function LandingPageClient() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev < 8) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 450);
    return () => clearInterval(timer);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-[#EDEDED] selection:text-[#0A0A0A] overflow-x-hidden">

      {/* SECTION 1: NAV */}
      <nav className="fixed top-0 left-0 right-0 h-12 bg-[#0A0A0A]/80 backdrop-blur border-b border-[#222] z-50 flex items-center justify-between px-4 md:px-8">
        <Link href="/" className="font-mono font-semibold text-sm text-[#EDEDED] tracking-tight hover:opacity-85 select-none">
          hostfa.st
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs text-[#888] hover:text-[#EDEDED] px-3 py-1.5 transition-colors font-medium"
            aria-label="Log in to hostfa.st"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="text-xs bg-[#EDEDED] text-[#0A0A0A] hover:bg-[#DCDCDC] px-3 py-1.5 rounded-sm transition-colors font-medium"
            aria-label="Register on hostfa.st"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* SECTION 2: HERO */}
      <header className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-16 px-4 max-w-4xl mx-auto text-center">




        {/* H1 Headline */}
        <h1 className="text-[#EDEDED] leading-[1.08] font-bold tracking-tight mb-6 flex flex-col items-center">
          <span style={{ fontSize: "clamp(38px, 6.5vw, 72px)" }}>Your Framer site.</span>
          <span style={{ fontSize: "clamp(38px, 6.5vw, 72px)" }}>Your domain.</span>
          <span style={{ fontSize: "clamp(38px, 6.5vw, 72px)" }} className="text-[#888] font-mono font-medium">
            $3/month.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-sm md:text-base text-[#888] max-w-lg mx-auto leading-relaxed mt-2">
          Keep designing in Framer. We automatically deploy your site to your own custom domain — and sync it every time you publish.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full max-w-xs sm:max-w-md">
          <Link
            href="/register"
            className="w-full sm:w-auto text-center text-sm font-medium bg-[#EDEDED] text-[#0A0A0A] hover:bg-[#DCDCDC] px-6 py-2.5 rounded-sm transition-colors"
            aria-label="Get Started Free on hostfa.st"
          >
            Get Started Free
          </Link>
          <a
            href="#how-it-works"
            onClick={(e) => handleSmoothScroll(e, "how-it-works")}
            className="w-full sm:w-auto text-center text-sm font-medium border border-[#222] bg-[#111] hover:bg-[#1A1A1A] text-[#888] hover:text-[#EDEDED] px-6 py-2.5 rounded-sm transition-colors"
            aria-label="See how it works section"
          >
            See how it works ↓
          </a>
        </div>

        {/* Social Proof Row */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <span className="text-[10px] md:text-xs text-[#555] uppercase tracking-wider font-semibold">
            Trusted by founders, designers, and indie hackers
          </span>
          <div className="flex items-center gap-1.5 mt-1 select-none">
            <div className="flex -space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#1A1A1A] border border-[#222] flex items-center justify-center text-[7px] font-mono text-[#555]">A</span>
              <span className="w-5 h-5 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-[7px] font-mono text-[#888]">B</span>
              <span className="w-5 h-5 rounded-full bg-[#333] border border-[#444] flex items-center justify-center text-[7px] font-mono text-[#EDEDED]">C</span>
            </div>
            <span className="text-xs text-[#888] font-mono">140+ deployed already</span>
          </div>
        </div>

        {/* Terminal Visual Mockup */}
        <div className="w-full max-w-2xl mt-16 text-left">
          <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden font-mono text-xs md:text-sm">
            {/* Terminal Header */}
            <div className="relative border-b border-[#222] h-8 flex items-center px-4 bg-[#0A0A0A]">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#222]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#222]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#222]" />
              </div>
              <span className="absolute inset-x-0 mx-auto text-[10px] text-[#555] text-center select-none pt-0.5">
                hostfa.st
              </span>
            </div>
            {/* Terminal Body */}
            <div className="p-5 space-y-1.5 h-48 select-all">
              {visibleLines >= 1 && (
                <div>
                  <span className="text-[#555] select-none">$ </span>
                  <span className="text-[#888]">you design in Framer</span>
                </div>
              )}
              {visibleLines >= 2 && (
                <div>
                  <span className="text-[#555] select-none">$ </span>
                  <span className="text-[#888]">you hit publish</span>
                </div>
              )}
              {visibleLines >= 3 && <div className="h-2" />}
              {visibleLines >= 4 && (
                <div className="text-[#22C55E]">
                  ✓ hostfa.st detected change
                </div>
              )}
              {visibleLines >= 5 && (
                <div className="text-[#22C55E]">
                  ✓ crawling your site...
                </div>
              )}
              {visibleLines >= 6 && (
                <div className="text-[#22C55E]">
                  ✓ deploying to mysite.com
                </div>
              )}
              {visibleLines >= 7 && <div className="h-2" />}
              {visibleLines >= 8 && (
                <div className="text-[#EDEDED] font-semibold">
                  🎉 Live at{" "}
                  <a href="https://mysite.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                    https://mysite.com
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 3: SOCIAL PROOF BAR */}
      <section className="border-y border-[#222] py-8 bg-[#0C0C0C]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-[10px] text-[#555] uppercase tracking-widest text-center font-bold mb-4 select-none">
            Works with your favorite no-code builder
          </div>
          <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap text-sm font-medium tracking-tight text-[#555]">
            <span className="hover:text-[#888] cursor-default transition-colors">Framer</span>
            <span className="hover:text-[#888] cursor-default transition-colors">Webflow</span>
            <span className="hover:text-[#888] cursor-default transition-colors">Squarespace</span>
            <span className="hover:text-[#888] cursor-default transition-colors">Wix</span>
          </div>
        </div>
      </section>

      {/* SECTION 4: PROBLEM / AGITATION */}
      <section id="how-it-works" className="py-24 px-4 max-w-3xl mx-auto">
        <ScrollReveal className="space-y-4">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            The problem
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
            {"Framer charges $10–15/month just for a custom domain."}
          </h2>
          <p className="text-xs md:text-sm leading-relaxed text-[#888]">
            {"If your site gets 50 visitors a month, that's an expensive domain name. Most indie hackers, designers, and founders are paying for Framer's hosting — not Framer's editor. hostfa.st separates the two."}
          </p>

          {/* Comparison Table */}
          <div className="pt-6">
            <div className="border border-[#222] rounded-lg overflow-hidden bg-[#0A0A0A] select-none text-xs md:text-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#111] border-b border-[#222] text-[10px] md:text-xs text-[#555] uppercase tracking-wider font-semibold">
                    <th className="px-4 py-3">Feature</th>
                    <th className="px-4 py-3">Framer Basic</th>
                    <th className="px-4 py-3 text-[#22C55E]">hostfa.st</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#1A1A1A] h-11">
                    <td className="px-4 py-2 text-[#888]">Custom domain</td>
                    <td className="px-4 py-2 text-[#555]">$10-15/mo</td>
                    <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-semibold">$3/mo ✓</td>
                  </tr>
                  <tr className="border-b border-[#1A1A1A] h-11">
                    <td className="px-4 py-2 text-[#888]">Auto-sync</td>
                    <td className="px-4 py-2 text-[#888]">✓</td>
                    <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">✓</td>
                  </tr>
                  <tr className="border-b border-[#1A1A1A] h-11">
                    <td className="px-4 py-2 text-[#888]">Design editor</td>
                    <td className="px-4 py-2 text-[#888]">✓</td>
                    <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">✓ (use Framer free)</td>
                  </tr>
                  <tr className="border-b border-[#1A1A1A] h-11">
                    <td className="px-4 py-2 text-[#888]">Framer branding</td>
                    <td className="px-4 py-2 text-[#888]">Removed</td>
                    <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">Removed</td>
                  </tr>
                  <tr className="h-11">
                    <td className="px-4 py-2 text-[#888]">Your own hosting</td>
                    <td className="px-4 py-2 text-[#555]">✗</td>
                    <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-semibold">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section className="py-24 border-t border-[#222] bg-[#0B0B0B] px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal className="space-y-4 mb-12">
            <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
              How it works
            </span>
            <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
              Three steps. Then forget about it.
            </h2>
          </ScrollReveal>

          {/* Steps Grid */}
          <div className="relative pl-6 md:pl-8 border-l border-dashed border-[#222] space-y-12 py-2">
            {/* Step 1 */}
            <ScrollReveal className="relative">
              <span className="absolute -left-[35px] md:-left-[43px] top-0.5 w-6 h-6 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[10px] font-mono text-[#555] select-none">
                01
              </span>
              <h3 className="text-sm md:text-base font-semibold text-[#EDEDED]">
                Connect your Framer site
              </h3>
              <p className="text-xs md:text-sm text-[#888] mt-1.5 leading-relaxed">
                Paste your <span className="font-mono text-[#EDEDED] bg-[#111] px-1 py-0.5 rounded border border-[#222]">.framer.website</span> URL. Takes 30 seconds.
              </p>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal className="relative">
              <span className="absolute -left-[35px] md:-left-[43px] top-0.5 w-6 h-6 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[10px] font-mono text-[#555] select-none">
                02
              </span>
              <h3 className="text-sm md:text-base font-semibold text-[#EDEDED]">
                Add your custom domain
              </h3>
              <p className="text-xs md:text-sm text-[#888] mt-1.5 leading-relaxed">
                Point your domain to hostfa.st with one CNAME record details we generate.
              </p>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal className="relative">
              <span className="absolute -left-[35px] md:-left-[43px] top-0.5 w-6 h-6 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[10px] font-mono text-[#555] select-none">
                03
              </span>
              <h3 className="text-sm md:text-base font-semibold text-[#EDEDED]">
                Publish in Framer as usual
              </h3>
              <p className="text-xs md:text-sm text-[#888] mt-1.5 leading-relaxed">
                Every time you hit publish, we auto-detect and redeploy. Your visitors always see the latest version instantly.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 6: PRICING */}
      <section id="pricing" className="py-24 px-4 max-w-4xl mx-auto border-t border-[#222]">
        <ScrollReveal className="text-center space-y-4 mb-12">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            Pricing
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#EDEDED] tracking-tight">
            Simple, honest pricing.
          </h2>
          <p className="text-xs md:text-sm text-[#888] mt-1 max-w-xs mx-auto">
            {"5x cheaper than Framer's hosting. Cancel anytime."}
          </p>

          {/* Pricing Toggle */}
          <div className="flex justify-center pt-2">
            <div className="inline-flex bg-[#111] border border-[#222] rounded-full p-1 select-none">
              <button
                onClick={() => setIsAnnual(false)}
                className={`text-[10px] md:text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 ${!isAnnual ? "bg-[#EDEDED] text-[#0A0A0A]" : "text-[#888] hover:text-[#EDEDED]"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`text-[10px] md:text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${isAnnual ? "bg-[#EDEDED] text-[#0A0A0A]" : "text-[#888] hover:text-[#EDEDED]"
                  }`}
              >
                <span>Annual</span>
                <span className="bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                  -2 Months
                </span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Starter */}
          <ScrollReveal className="bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col justify-between hover:border-[#333] transition-colors duration-200">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider">Starter</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl md:text-3xl font-bold text-[#EDEDED]">
                    {isAnnual ? "$2.50" : "$3.00"}
                  </span>
                  <span className="text-xs text-[#555]">/mo</span>
                </div>
                {isAnnual && <span className="text-[9px] text-[#555] block font-mono mt-0.5">Billed $30/year</span>}
              </div>
              <div className="border-b border-[#222] my-4" />
              <ul className="text-xs text-[#888] space-y-2.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>1 Site</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Custom domain</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Free SSL included</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Auto-sync (10 min interval)</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register?plan=starter"
              className="mt-8 text-center text-xs font-medium border border-[#333] hover:border-[#444] bg-[#0A0A0A] hover:bg-[#111] text-[#EDEDED] py-2 rounded-sm transition-colors"
              aria-label="Subscribe to hostfa.st Starter Plan"
            >
              Get Started
            </Link>
          </ScrollReveal>

          {/* Card 2: Pro */}
          <ScrollReveal className="bg-[#111] border border-[#EDEDED] rounded-xl p-6 flex flex-col justify-between relative hover:border-[#F5F5F5] transition-colors duration-200">
            <span className="absolute top-3 right-3 text-[8px] md:text-[9px] font-bold bg-[#EDEDED] text-[#0A0A0A] px-2.5 py-0.5 rounded-full select-none uppercase tracking-wide">
              Most Popular
            </span>
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider">Pro</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl md:text-3xl font-bold text-[#EDEDED]">
                    {isAnnual ? "$6.50" : "$8.00"}
                  </span>
                  <span className="text-xs text-[#555]">/mo</span>
                </div>
                {isAnnual && <span className="text-[9px] text-[#555] block font-mono mt-0.5">Billed $78/year</span>}
              </div>
              <div className="border-b border-[#222] my-4" />
              <ul className="text-xs text-[#888] space-y-2.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>3 Sites</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Custom domains</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>SSL & Analytics tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Fast auto-sync (5 min interval)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Email notification alerts</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register?plan=pro"
              className="mt-8 text-center text-xs font-medium bg-[#EDEDED] text-[#0A0A0A] hover:bg-[#DCDCDC] py-2 rounded-sm transition-colors"
              aria-label="Subscribe to hostfa.st Pro Plan"
            >
              Get Started
            </Link>
          </ScrollReveal>

          {/* Card 3: Scale */}
          <ScrollReveal className="bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col justify-between hover:border-[#333] transition-colors duration-200">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider">Scale</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl md:text-3xl font-bold text-[#EDEDED]">
                    {isAnnual ? "$13.33" : "$19.00"}
                  </span>
                  <span className="text-xs text-[#555]">/mo</span>
                </div>
                {isAnnual && <span className="text-[9px] text-[#555] block font-mono mt-0.5">Billed $190/year</span>}
              </div>
              <div className="border-b border-[#222] my-4" />
              <ul className="text-xs text-[#888] space-y-2.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>10 Sites</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Webflow / Framer support</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Real-time sync (1 min interval)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>White-label dashboard view</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>24/7 priority developer support</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register?plan=scale"
              className="mt-8 text-center text-xs font-medium border border-[#333] hover:border-[#444] bg-[#0A0A0A] hover:bg-[#111] text-[#EDEDED] py-2 rounded-sm transition-colors"
              aria-label="Subscribe to hostfa.st Scale Plan"
            >
              Get Started
            </Link>
          </ScrollReveal>
        </div>

        {/* Footer Subtext */}
        <div className="text-[10px] text-center text-[#555] mt-8 select-none">
          All plans include free SSL, global CDN via Cloudflare, and auto-sync. No setup fees. Cancel anytime.
        </div>
      </section>

      {/* SECTION 7: COMPETITOR COMPARISON */}
      <section className="py-24 px-4 max-w-3xl mx-auto border-t border-[#222]">
        <ScrollReveal className="space-y-4 mb-10">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            vs the alternatives
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
            {"Why pay more for hosting you don't need?"}
          </h2>
        </ScrollReveal>

        {/* Competitors Table */}
        <ScrollReveal>
          <div className="border border-[#222] rounded-lg overflow-hidden bg-[#0A0A0A] select-none text-xs md:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111] border-b border-[#222] text-[10px] md:text-xs text-[#555] uppercase tracking-wider font-semibold">
                  <th className="px-4 py-3">Platform</th>
                  <th className="px-4 py-3">1 site</th>
                  <th className="px-4 py-3">3 sites</th>
                  <th className="px-4 py-3">10 sites</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 font-medium text-[#888]">Framer</td>
                  <td className="px-4 py-2 text-[#888]">$15/mo</td>
                  <td className="px-4 py-2 text-[#888]">$45/mo</td>
                  <td className="px-4 py-2 text-[#888]">$150/mo</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 font-medium text-[#888]">Webflow</td>
                  <td className="px-4 py-2 text-[#888]">$25/mo</td>
                  <td className="px-4 py-2 text-[#888]">$75/mo</td>
                  <td className="px-4 py-2 text-[#888]">$250/mo</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 font-medium text-[#888]">rehost.it</td>
                  <td className="px-4 py-2 text-[#888]">$11.99/mo</td>
                  <td className="px-4 py-2 text-[#888]">$18.99/mo</td>
                  <td className="px-4 py-2 text-[#888]">$27.99/mo</td>
                </tr>
                <tr className="bg-[#0F1A0F]/80 text-[#22C55E] h-10 font-medium border-[#22C55E]/10">
                  <td className="px-4 py-2 font-bold">hostfa.st</td>
                  <td className="px-4 py-2 font-bold">$3/mo</td>
                  <td className="px-4 py-2 font-bold">$7/mo</td>
                  <td className="px-4 py-2 font-bold">$15/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-[10px] text-center text-[#555] mt-3 select-none">
            * Competitor prices reflect per-site hosting costs.
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 8: FAQ ACCORDION */}
      <section className="py-24 px-4 max-w-2xl mx-auto border-t border-[#222]">
        <ScrollReveal className="space-y-4 mb-10">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            FAQ
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
            Common questions.
          </h2>
        </ScrollReveal>

        <ScrollReveal className="space-y-1">
          <FAQItem
            question="Do I still need a Framer account?"
            answer="Yes — you design and publish in Framer's free plan. We handle the hosting on your custom domain. You never need to pay Framer for hosting again."
          />
          <FAQItem
            question="What happens when I publish in Framer?"
            answer="We detect the change within minutes (based on your plan) and automatically re-crawl and redeploy your site. Your visitors always see the latest version."
          />
          <FAQItem
            question="Will my Framer animations and interactions work?"
            answer="Yes. We use a full headless browser to render your site, so all Framer animations, scroll effects, and interactions are preserved exactly as designed."
          />
          <FAQItem
            question="Can I use my own custom domain?"
            answer="Yes — that's the whole point. You add one CNAME record to your domain registrar (like GoDaddy, Namecheap), and your site goes live on your own domain within minutes."
          />
          <FAQItem
            question="What if I want to cancel?"
            answer="Cancel anytime from your billing dashboard. No questions asked. Your Framer site on framer.website still works — we just stop syncing to your custom domain."
          />
          <FAQItem
            question="Is this against Framer's terms of service?"
            answer={`You're crawling your own public website — the same site anyone can visit in their browser. This is no different from downloading your own content.

There are no restrictions against hosting your public web layouts on alternative servers.`}
          />
        </ScrollReveal>
      </section>

      {/* SECTION 9: FINAL CTA */}
      <section className="py-24 text-center border-t border-[#222] bg-[#090909] px-4">
        <ScrollReveal className="max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#EDEDED] leading-tight">
            Ship your Framer site. <br className="hidden md:block" />
            <span className="text-[#888]">Stop paying $15/month for hosting.</span>
          </h2>
          <p className="text-xs md:text-sm text-[#888] max-w-sm mx-auto leading-relaxed">
            Join indie hackers, designers, and developers who switched to hostfa.st.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-block text-sm font-semibold bg-[#EDEDED] text-[#0A0A0A] hover:bg-[#DCDCDC] px-8 py-3 rounded-sm transition-colors"
              aria-label="Get started free on hostfa.st final CTA"
            >
              Get Started Free
            </Link>
            <span className="block text-[10px] text-[#555] mt-3 select-none">
              No credit card required to start
            </span>
          </div>
        </ScrollReveal>
      </section>

      {/* UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
