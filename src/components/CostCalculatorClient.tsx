"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight, Check } from "lucide-react";
import Footer from "@/components/marketing/Footer";

export default function CostCalculatorClient() {
  const [numSites, setNumSites] = useState<number>(1);
  const [framerPlan, setFramerPlan] = useState<"basic" | "pro">("basic");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  // Pricing calculations
  // Framer Basic = $15/mo (Monthly), $10/mo (Annual)
  // Framer Pro = $45/mo (Monthly), $30/mo (Annual)
  const framerPricePerSite = billingCycle === "annual" 
    ? (framerPlan === "basic" ? 10 : 30) 
    : (framerPlan === "basic" ? 15 : 45);

  // hostfa.st tier-based monthly spend
  let hostfastMonthlySpend = 3;
  if (billingCycle === "annual") {
    if (numSites === 1) {
      hostfastMonthlySpend = 2.50;
    } else if (numSites <= 3) {
      hostfastMonthlySpend = 6.00;
    } else {
      hostfastMonthlySpend = 13.33;
    }
  } else {
    if (numSites === 1) {
      hostfastMonthlySpend = 3.00;
    } else if (numSites <= 3) {
      hostfastMonthlySpend = 8.00;
    } else {
      hostfastMonthlySpend = 19.00;
    }
  }

  const currentFramerMonthlySpend = numSites * framerPricePerSite;
  const currentFramerYearlySpend = currentFramerMonthlySpend * 12;

  const hostfastYearlySpend = hostfastMonthlySpend * 12;

  const monthlySavings = currentFramerMonthlySpend - hostfastMonthlySpend;
  const yearlySavings = currentFramerYearlySpend - hostfastYearlySpend;

  const savingsPercentage = currentFramerMonthlySpend > 0 
    ? Math.round((monthlySavings / currentFramerMonthlySpend) * 100) 
    : 0;

  const formatCurrency = (amount: number) => {
    return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
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
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="text-xs bg-[#EDEDED] text-[#0A0A0A] hover:bg-white px-3 py-1.5 rounded-sm transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO / HEADER SECTION */}
      <header className="relative pt-28 pb-12 px-4 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <div className="mb-4">
          <span className="inline-flex border border-[#22C55E]/20 rounded-full px-3 py-0.5 text-xs text-[#22C55E] font-mono tracking-wider bg-[#0F2318] select-none uppercase font-semibold">
            Free Tool
          </span>
        </div>

        {/* H1 Headline */}
        <h1 className="text-[#EDEDED] leading-[1.1] font-bold tracking-tight mb-6 max-w-3xl" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
          Framer Hosting Cost Calculator
        </h1>

        {/* Subtext */}
        <p className="text-sm md:text-base text-[#888] max-w-xl mx-auto leading-relaxed">
          See exactly how much you're spending on Framer hosting and how much you'd save with hostfa.st.
        </p>
      </header>

      {/* CALCULATOR SECTION */}
      <section className="pb-24 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column - Inputs */}
          <div className="lg:col-span-7 space-y-8 bg-[#111]/30 border border-[#222]/60 rounded-xl p-6 md:p-8">
            
            {/* Input 1: Number of sites */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-[#888] font-mono select-none block">
                How many Framer sites do you have?
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNumSites(num)}
                    className={`h-10 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      numSites === num
                        ? "bg-[#EDEDED] text-[#0A0A0A] scale-[1.05] shadow-md shadow-white/5"
                        : "bg-[#111] border border-[#222] text-[#888] hover:border-[#444] hover:text-[#EDEDED]"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Plan Type */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-[#888] font-mono select-none block">
                Which Framer plan are you on?
              </label>
              <div className="bg-[#111] p-1 rounded-lg border border-[#222] flex">
                <button
                  onClick={() => setFramerPlan("basic")}
                  className={`flex-1 py-2.5 text-center text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                    framerPlan === "basic"
                      ? "bg-[#EDEDED] text-[#0A0A0A]"
                      : "text-[#888] hover:text-[#EDEDED]"
                  }`}
                >
                  Basic ({billingCycle === "annual" ? "$10/mo" : "$15/mo"})
                </button>
                <button
                  onClick={() => setFramerPlan("pro")}
                  className={`flex-1 py-2.5 text-center text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                    framerPlan === "pro"
                      ? "bg-[#EDEDED] text-[#0A0A0A]"
                      : "text-[#888] hover:text-[#EDEDED]"
                  }`}
                >
                  Pro ({billingCycle === "annual" ? "$30/mo" : "$45/mo"})
                </button>
              </div>
            </div>

            {/* Input 3: Billing Cycle */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-[#888] font-mono select-none block">
                Billing cycle
              </label>
              <div className="bg-[#111] p-1 rounded-lg border border-[#222] flex">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`flex-1 py-2.5 text-center text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-[#EDEDED] text-[#0A0A0A]"
                      : "text-[#888] hover:text-[#EDEDED]"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`flex-1 py-2.5 text-center text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                    billingCycle === "annual"
                      ? "bg-[#EDEDED] text-[#0A0A0A]"
                      : "text-[#888] hover:text-[#EDEDED]"
                  }`}
                >
                  Annual (Save 20%)
                </button>
              </div>
            </div>

          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-5">
            <div className="bg-[#111] border border-[#222] rounded-lg p-6 hover:border-[#333] transition-colors duration-300 shadow-xl space-y-5">
              
              {/* Spend 1: Framer */}
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-[#888] font-mono select-none">
                  Your current Framer spend:
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-semibold text-[#EDEDED] font-mono">
                    {formatCurrency(currentFramerMonthlySpend)}<span className="text-sm font-normal text-[#888]">/mo</span>
                  </span>
                  <span className="text-sm text-[#888] font-mono">
                    {formatCurrency(currentFramerYearlySpend)}/year
                  </span>
                </div>
              </div>

              <div className="h-[1px] bg-[#222]" />

              {/* Spend 2: hostfa.st */}
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-[#888] font-mono select-none">
                  With hostfa.st:
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-semibold text-[#22C55E] font-mono">
                    {formatCurrency(hostfastMonthlySpend)}<span className="text-sm font-normal text-[#22C55E]/80">/mo</span>
                  </span>
                  <span className="text-sm text-[#888] font-mono">
                    {formatCurrency(hostfastYearlySpend)}/year
                  </span>
                </div>
              </div>

              <div className="h-[1px] bg-[#222]" />

              {/* Spend 3: Savings */}
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-[#888] font-mono select-none">
                  You save:
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-semibold text-[#22C55E] font-mono">
                    {formatCurrency(monthlySavings)}<span className="text-xs font-normal text-[#22C55E]/80">/mo</span>
                  </span>
                  <span className="text-sm text-[#888] font-mono">
                    {formatCurrency(yearlySavings)}/year
                  </span>
                </div>

                {/* Savings percentage bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-[#555] font-mono select-none">
                    <span>Savings Ratio</span>
                    <span className="text-[#22C55E] font-bold">{savingsPercentage}% Saved</span>
                  </div>
                  <div className="bg-[#222] h-1.5 rounded-full overflow-hidden relative">
                    <div 
                      className="bg-[#22C55E] h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${savingsPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* CTA button */}
              <Link
                href="/register"
                className="w-full bg-[#EDEDED] text-[#0A0A0A] hover:bg-white transition-all transform hover:scale-[1.01] active:scale-[0.99] font-bold text-sm h-12 rounded-md flex items-center justify-center gap-2 mt-6 shadow-md shadow-white/5 cursor-pointer"
              >
                Start Saving {formatCurrency(monthlySavings)}/month <ArrowRight className="h-4 w-4" />
              </Link>
              
            </div>
          </div>

        </div>
      </section>

      {/* ADDITIONAL BENEFITS SECTION */}
      <section className="py-20 border-t border-[#222] bg-[#0B0B0B] px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
              Why hostfa.st?
            </span>
            <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
              Host on your own domain without paying premium prices.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#222] p-5 rounded-lg space-y-2">
              <Check className="h-4 w-4 text-[#22C55E]" />
              <h4 className="text-sm font-semibold text-[#EDEDED]">100% Free Framer Plan</h4>
              <p className="text-xs text-[#888] leading-relaxed">
                Design everything using Framer's free tier. We handle the hosting and domain mapping so you never pay for their premium plans.
              </p>
            </div>
            <div className="border border-[#222] p-5 rounded-lg space-y-2">
              <Check className="h-4 w-4 text-[#22C55E]" />
              <h4 className="text-sm font-semibold text-[#EDEDED]">Auto-Sync on Publish</h4>
              <p className="text-xs text-[#888] leading-relaxed">
                Every time you hit publish in the Framer editor, hostfa.st detects it instantly and updates your site on your domain automatically.
              </p>
            </div>
            <div className="border border-[#222] p-5 rounded-lg space-y-2">
              <Check className="h-4 w-4 text-[#22C55E]" />
              <h4 className="text-sm font-semibold text-[#EDEDED]">Enterprise-Grade CDN</h4>
              <p className="text-xs text-[#888] leading-relaxed">
                Your static files are distributed globally via lightning-fast edge networks. Free SSL certificates included automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
