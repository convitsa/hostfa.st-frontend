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

export default function PricingPageClient() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [numSites, setNumSites] = useState<number>(3);

  // Savings Calculator Math
  const framerCost = numSites * 15;
  let hostfastCost = 3;
  let recommendedPlan = "Starter";

  if (numSites > 1 && numSites <= 3) {
    hostfastCost = isAnnual ? 6.5 : 8;
    recommendedPlan = "Pro";
  } else if (numSites > 3) {
    hostfastCost = isAnnual ? 13.33 : 19;
    recommendedPlan = "Scale";
  } else {
    hostfastCost = isAnnual ? 2.5 : 3;
    recommendedPlan = "Starter";
  }

  const savings = framerCost - hostfastCost;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-[#EDEDED] selection:text-[#0A0A0A] overflow-x-hidden">

      {/* NAVIGATION */}
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

      {/* HEADER SECTION */}
      <header className="relative pt-28 pb-12 px-4 max-w-4xl mx-auto text-center">
        <ScrollReveal className="space-y-4">
          <span className="inline-flex border border-[#222] rounded-full px-3 py-0.5 text-[10px] md:text-xs text-[#888] font-mono tracking-wider bg-[#111] select-none uppercase font-semibold">
            Simple Plans
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#EDEDED]">
            Simple, Honest Pricing
          </h1>
          <p className="text-sm md:text-base text-[#888] max-w-md mx-auto leading-relaxed">
            {"5x cheaper than Framer's hosting. No hidden fees. Cancel anytime."}
          </p>

          {/* Billing Interval Switch */}
          <div className="flex justify-center pt-4 select-none">
            <div className="inline-flex bg-[#111] border border-[#222] rounded-full p-1">
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
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </header>

      {/* PLAN CARDS */}
      <section className="py-8 px-4 max-w-5xl mx-auto">
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
                <span className="text-[9px] text-[#555] block font-mono mt-0.5">
                  {isAnnual ? "Billed $30/yr" : "Billed monthly"}
                </span>
              </div>
              <div className="border-b border-[#222] my-4" />
              <ul className="text-xs text-[#888] space-y-2.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>1 Site</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Custom domain support</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Free SSL certificates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Auto-sync (10 min interval)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>10GB Monthly Bandwidth</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register?plan=starter"
              className="mt-8 text-center text-xs font-medium border border-[#333] hover:border-[#444] bg-[#0A0A0A] hover:bg-[#111] text-[#EDEDED] py-2 rounded-sm transition-colors"
              aria-label="Subscribe to Starter Plan"
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
                <span className="text-[9px] text-[#555] block font-mono mt-0.5">
                  {isAnnual ? "Billed $72/yr" : "Billed monthly"}
                </span>
              </div>
              <div className="border-b border-[#222] my-4" />
              <ul className="text-xs text-[#888] space-y-2.5">
                <li className="text-xs text-[#EDEDED] font-medium mb-1 flex items-center gap-1.5">
                  <span>Everything in Starter +</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>3 Sites</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>50GB Monthly Bandwidth</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Site Analytics tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Email notification alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Auto-sync (5 min interval)</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register?plan=pro"
              className="mt-8 text-center text-xs font-medium bg-[#EDEDED] text-[#0A0A0A] hover:bg-[#DCDCDC] py-2 rounded-sm transition-colors"
              aria-label="Subscribe to Pro Plan"
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
                <span className="text-[9px] text-[#555] block font-mono mt-0.5">
                  {isAnnual ? "Billed $160/yr" : "Billed monthly"}
                </span>
              </div>
              <div className="border-b border-[#222] my-4" />
              <ul className="text-xs text-[#888] space-y-2.5">
                <li className="text-xs text-[#EDEDED] font-medium mb-1 flex items-center gap-1.5">
                  <span>Everything in Pro +</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>10 Sites</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Unlimited Bandwidth</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Webflow site imports</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>White-label dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDED]" />
                  <span>Fast auto-sync (1 min interval)</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register?plan=scale"
              className="mt-8 text-center text-xs font-medium border border-[#333] hover:border-[#444] bg-[#0A0A0A] hover:bg-[#111] text-[#EDEDED] py-2 rounded-sm transition-colors"
              aria-label="Subscribe to Scale Plan"
            >
              Get Started
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* INTERACTIVE SAVINGS CALCULATOR */}
      <section className="py-20 px-4 max-w-3xl mx-auto border-t border-[#222]">
        <ScrollReveal className="space-y-4 text-center mb-10">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            Savings Calculator
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
            See How Much You Save
          </h2>
          <p className="text-xs md:text-sm text-[#888] max-w-sm mx-auto">
            Input the number of domains you have to calculate your savings when hosting with us.
          </p>
        </ScrollReveal>

        <ScrollReveal className="bg-[#111] border border-[#222] rounded-xl p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs md:text-sm font-semibold select-none">
              <span className="text-[#888]">Number of Framer Sites:</span>
              <span className="text-[#EDEDED] font-mono bg-[#0A0A0A] border border-[#222] px-3 py-1 rounded">
                {numSites} {numSites === 1 ? "site" : "sites"}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={numSites}
              onChange={(e) => setNumSites(parseInt(e.target.value))}
              className="w-full accent-[#EDEDED] h-1.5 bg-[#0A0A0A] rounded-lg border border-[#222] appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#555] font-mono select-none px-1">
              <span>1 site</span>
              <span>5 sites</span>
              <span>10 sites</span>
            </div>
          </div>

          <div className="border-t border-[#222] pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center select-none">
            <div className="bg-[#0A0A0A] border border-[#222] rounded p-4">
              <span className="text-[10px] text-[#555] uppercase tracking-wider font-bold block">Framer Cost</span>
              <span className="text-xl font-bold text-[#EF4444] font-mono mt-1 block">${framerCost}/mo</span>
            </div>
            <div className="bg-[#0A0A0A] border border-[#222] rounded p-4">
              <span className="text-[10px] text-[#555] uppercase tracking-wider font-bold block">hostfa.st Cost</span>
              <span className="text-xl font-bold text-[#EDEDED] font-mono mt-1 block">${hostfastCost}/mo</span>
              <span className="text-[9px] text-[#555] block mt-0.5">({recommendedPlan} plan)</span>
            </div>
            <div className="bg-[#0F1A0F] border border-[#22C55E]/20 rounded p-4">
              <span className="text-[10px] text-[#22C55E] uppercase tracking-wider font-bold block">You Save</span>
              <span className="text-xl font-bold text-[#22C55E] font-mono mt-1 block">${savings.toFixed(2)}/mo</span>
              <span className="text-[9px] text-[#22C55E]/60 block mt-0.5">(${((savings) * 12).toFixed(0)}/year)</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* FULL FEATURE TABLE */}
      <section className="py-20 px-4 max-w-4xl mx-auto border-t border-[#222]">
        <ScrollReveal className="space-y-4 text-center mb-12">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            Feature Comparison
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
            Compare Plan Features
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <div className="border border-[#222] rounded-lg overflow-x-auto bg-[#0A0A0A] text-xs md:text-sm select-none min-w-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111] border-b border-[#222] text-[10px] md:text-xs text-[#555] uppercase tracking-wider font-semibold">
                  <th className="px-5 py-3.5">Category & Feature</th>
                  <th className="px-5 py-3.5">Starter</th>
                  <th className="px-5 py-3.5">Pro</th>
                  <th className="px-5 py-3.5">Scale</th>
                </tr>
              </thead>
              <tbody>
                {/* Category: Hosting */}
                <tr className="bg-[#0D0D0D] border-b border-[#222] font-semibold text-[#555]">
                  <td colSpan={4} className="px-5 py-2.5 uppercase tracking-wide text-[9px] md:text-[10px]">Hosting Features</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-5 py-2 text-[#888]">Included sites</td>
                  <td className="px-5 py-2 text-[#EDEDED]">1 site</td>
                  <td className="px-5 py-2 text-[#EDEDED]">3 sites</td>
                  <td className="px-5 py-2 text-[#EDEDED]">10 sites</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-5 py-2 text-[#888]">Custom domains</td>
                  <td className="px-5 py-2 text-[#EDEDED]">1</td>
                  <td className="px-5 py-2 text-[#EDEDED]">3</td>
                  <td className="px-5 py-2 text-[#EDEDED]">10</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-5 py-2 text-[#888]">SSL certification</td>
                  <td className="px-5 py-2 text-[#22C55E]">Free SSL</td>
                  <td className="px-5 py-2 text-[#22C55E]">Free SSL</td>
                  <td className="px-5 py-2 text-[#22C55E]">Free SSL</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-5 py-2 text-[#888]">Bandwidth</td>
                  <td className="px-5 py-2 text-[#EDEDED]">10 GB/mo</td>
                  <td className="px-5 py-2 text-[#EDEDED]">50 GB/mo</td>
                  <td className="px-5 py-2 text-[#22C55E]">Unlimited</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-5 py-2 text-[#888]">Global CDN</td>
                  <td className="px-5 py-2 text-[#888]">Cloudflare</td>
                  <td className="px-5 py-2 text-[#888]">Cloudflare</td>
                  <td className="px-5 py-2 text-[#888]">Cloudflare</td>
                </tr>

                {/* Category: Sync */}
                <tr className="bg-[#0D0D0D] border-b border-[#222] font-semibold text-[#555]">
                  <td colSpan={4} className="px-5 py-2.5 uppercase tracking-wide text-[9px] md:text-[10px]">Auto-Sync & Redeploy</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-5 py-2 text-[#888]">Auto-sync check</td>
                  <td className="px-5 py-2 text-[#EDEDED]">10 mins</td>
                  <td className="px-5 py-2 text-[#EDEDED]">5 mins</td>
                  <td className="px-5 py-2 text-[#22C55E]">1 min (real-time)</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-5 py-2 text-[#888]">Manual redeployment</td>
                  <td className="px-5 py-2 text-[#22C55E]">✓</td>
                  <td className="px-5 py-2 text-[#22C55E]">✓</td>
                  <td className="px-5 py-2 text-[#22C55E]">✓</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-5 py-2 text-[#888]">History tracked</td>
                  <td className="px-5 py-2 text-[#EDEDED]">Last 5</td>
                  <td className="px-5 py-2 text-[#EDEDED]">Last 10</td>
                  <td className="px-5 py-2 text-[#22C55E]">Unlimited</td>
                </tr>

                {/* Category: Monitoring */}
                <tr className="bg-[#0D0D0D] border-b border-[#222] font-semibold text-[#555]">
                  <td colSpan={4} className="px-5 py-2.5 uppercase tracking-wide text-[9px] md:text-[10px]">Monitoring & Alerts</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-5 py-2 text-[#888]">Analytics tools</td>
                  <td className="px-5 py-2 text-[#555]">✗</td>
                  <td className="px-5 py-2 text-[#22C55E]">✓</td>
                  <td className="px-5 py-2 text-[#22C55E]">✓</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-5 py-2 text-[#888]">Email alert logs</td>
                  <td className="px-5 py-2 text-[#555]">✗</td>
                  <td className="px-5 py-2 text-[#22C55E]">✓</td>
                  <td className="px-5 py-2 text-[#22C55E]">✓</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-5 py-2 text-[#888]">Status page access</td>
                  <td className="px-5 py-2 text-[#555]">✗</td>
                  <td className="px-5 py-2 text-[#22C55E]">✓</td>
                  <td className="px-5 py-2 text-[#22C55E]">✓</td>
                </tr>

                {/* Category: Advanced */}
                <tr className="bg-[#0D0D0D] border-b border-[#222] font-semibold text-[#555]">
                  <td colSpan={4} className="px-5 py-2.5 uppercase tracking-wide text-[9px] md:text-[10px]">Advanced Features</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-5 py-2 text-[#888]">Webflow custom imports</td>
                  <td className="px-5 py-2 text-[#555]">✗</td>
                  <td className="px-5 py-2 text-[#555]">✗</td>
                  <td className="px-5 py-2 text-[#22C55E]">✓</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-5 py-2 text-[#888]">White-label views</td>
                  <td className="px-5 py-2 text-[#555]">✗</td>
                  <td className="px-5 py-2 text-[#555]">✗</td>
                  <td className="px-5 py-2 text-[#22C55E]">✓</td>
                </tr>
                <tr className="h-10">
                  <td className="px-5 py-2 text-[#888]">Support priority</td>
                  <td className="px-5 py-2 text-[#888]">Email</td>
                  <td className="px-5 py-2 text-[#888]">Priority Email</td>
                  <td className="px-5 py-2 text-[#22C55E] font-semibold">24/7 Dedicated Support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 px-4 max-w-2xl mx-auto border-t border-[#222]">
        <ScrollReveal className="space-y-4 mb-10 text-center">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            Pricing FAQ
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
            Frequently Asked Questions
          </h2>
        </ScrollReveal>

        <ScrollReveal className="space-y-1">
          <FAQItem
            question="Is there a free trial?"
            answer="First 50 beta users get 3 months free. DM us on Twitter/X to get your promo code."
          />
          <FAQItem
            question="Can I change plans?"
            answer="Yes, upgrade or downgrade plans anytime from your billing dashboard. Billing differences will be prorated automatically."
          />
          <FAQItem
            question="What payment methods do you accept?"
            answer="All major credit cards, debit cards, and Apple Pay are accepted securely via Stripe checkout integrations."
          />
          <FAQItem
            question="Do you offer refunds?"
            answer="Yes — we offer a 7-day money back guarantee, no questions asked. Email us to request your refund."
          />
          <FAQItem
            question="What happens if I exceed bandwidth?"
            answer="We'll notify you via email if your site is close to exceeding its monthly limit. Starter and Pro have soft limits and we won't charge you unexpectedly."
          />
        </ScrollReveal>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 text-center border-t border-[#222] bg-[#090909] px-4">
        <ScrollReveal className="max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#EDEDED]">
            Start for $3/month
          </h2>
          <p className="text-xs md:text-sm text-[#888] max-w-sm mx-auto leading-relaxed">
            No setup fees. No long commitments. Cancel anytime from your account settings page.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-block text-sm font-semibold bg-[#EDEDED] text-[#0A0A0A] hover:bg-[#DCDCDC] px-8 py-3 rounded-sm transition-colors"
              aria-label="Start for $3/month final CTA"
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
