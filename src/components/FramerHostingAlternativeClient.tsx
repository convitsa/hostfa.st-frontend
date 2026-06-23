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

export default function FramerHostingAlternativeClient() {
  const [isAnnual, setIsAnnual] = useState(false);

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

      {/* HERO SECTION */}
      <header className="relative min-h-[90vh] flex flex-col justify-center items-center pt-28 pb-16 px-4 max-w-4xl mx-auto text-center">

        {/* Category Label */}
        <div className="mb-4">
          <span className="inline-flex border border-[#222] rounded-full px-3.5 py-0.5 text-[10px] md:text-xs text-[#888] font-mono tracking-wider bg-[#111] select-none uppercase font-semibold">
            Product Alternative
          </span>
        </div>

        {/* H1 Headline */}
        <h1 className="text-[#EDEDED] leading-[1.1] font-bold tracking-tight mb-6 max-w-3xl" style={{ fontSize: "clamp(36px, 5.5vw, 64px)" }}>
          The Best Framer Hosting Alternative in 2026
        </h1>

        {/* Subtext */}
        <p className="text-sm md:text-base text-[#888] max-w-xl mx-auto leading-relaxed mt-2">
          {"Framer charges $10–15/month just for a custom domain. hostfa.st hosts your Framer site for $3/month — with auto-sync on every publish. Keep using Framer's free plan."}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full max-w-xs sm:max-w-md">
          <Link
            href="/register"
            className="w-full sm:w-auto text-center text-sm font-semibold bg-[#EDEDED] text-[#0A0A0A] hover:bg-[#DCDCDC] px-8 py-2.5 rounded-sm transition-colors"
            aria-label="Start hosting for $3/month"
          >
            Start Hosting for $3/month
          </Link>
          <a
            href="#comparison"
            onClick={(e) => handleSmoothScroll(e, "comparison")}
            className="w-full sm:w-auto text-center text-sm font-medium border border-[#222] bg-[#111] hover:bg-[#1A1A1A] text-[#888] hover:text-[#EDEDED] px-8 py-2.5 rounded-sm transition-colors"
            aria-label="See hostfa.st comparison details"
          >
            Compare Side-by-Side
          </a>
        </div>
        <span className="block text-[10px] text-[#555] mt-3 select-none font-mono">
          No credit card required
        </span>
      </header>

      {/* COMPARISON TABLE */}
      <section id="comparison" className="py-24 px-4 max-w-3xl mx-auto border-t border-[#222]">
        <ScrollReveal className="space-y-4 mb-10">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            Direct Comparison
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
            hostfa.st vs Framer Hosting — Side by Side
          </h2>
        </ScrollReveal>

        <ScrollReveal>
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
                  <td className="px-4 py-2 text-[#888]">Monthly price</td>
                  <td className="px-4 py-2 text-[#555]">$10–15/mo</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-semibold">$3/mo</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-11">
                  <td className="px-4 py-2 text-[#888]">Custom domain</td>
                  <td className="px-4 py-2 text-[#888]">Yes</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">Yes</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-11">
                  <td className="px-4 py-2 text-[#888]">Auto-sync on publish</td>
                  <td className="px-4 py-2 text-[#888]">Yes</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">Yes</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-11">
                  <td className="px-4 py-2 text-[#888]">Keep using Framer editor</td>
                  <td className="px-4 py-2 text-[#888]">Yes</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-semibold">{"Yes (free plan)"}</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-11">
                  <td className="px-4 py-2 text-[#888]">Your own hosting infra</td>
                  <td className="px-4 py-2 text-[#555]">No</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">{"Yes (Cloudflare)"}</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-11">
                  <td className="px-4 py-2 text-[#888]">Cancel anytime</td>
                  <td className="px-4 py-2 text-[#888]">Yes</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">Yes</td>
                </tr>
                <tr className="h-11">
                  <td className="px-4 py-2 text-[#888] font-medium">Annual savings</td>
                  <td className="px-4 py-2 text-[#555]">—</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-bold">Save $90–144/yr</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* HOW IT WORKS */}
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

      {/* PRICING */}
      <section className="py-24 px-4 max-w-4xl mx-auto border-t border-[#222]">
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

        <div className="text-[10px] text-center text-[#555] mt-8 select-none">
          All plans include free SSL, global CDN via Cloudflare, and auto-sync. No setup fees. Cancel anytime.
        </div>
      </section>

      {/* FAQ ACCORDION (Framer Alternative Specific) */}
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
            question="Is hostfa.st a Framer replacement?"
            answer="No — you still design in Framer. We only replace Framer's hosting."
          />
          <FAQItem
            question="Do I lose any Framer features?"
            answer="You keep all design features. You only lose Framer's hosting badge."
          />
          <FAQItem
            question="How long does migration take?"
            answer="Less than 5 minutes. Paste URL, add CNAME, done."
          />
          <FAQItem
            question="What if Framer updates their pricing?"
            answer="hostfa.st pricing is locked. We are not affected by Framer's decisions."
          />
          <FAQItem
            question="Can I switch back to Framer hosting?"
            answer="Yes, anytime. Just upgrade your Framer plan again."
          />
        </ScrollReveal>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 text-center border-t border-[#222] bg-[#090909] px-4">
        <ScrollReveal className="max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#EDEDED] leading-tight">
            Switch from Framer Hosting Today <br className="hidden md:block" />
            <span className="text-[#888]">Join hundreds of designers saving $100+/year</span>
          </h2>
          <div className="pt-4">
            <Link
              href="/register"
              className="inline-block text-sm font-semibold bg-[#EDEDED] text-[#0A0A0A] hover:bg-[#DCDCDC] px-8 py-3 rounded-sm transition-colors"
              aria-label="Get Started Free final alternative CTA"
            >
              Get Started Free
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
