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
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function VsFramerClient() {
  const [activeSiteTab, setActiveSiteTab] = useState<1 | 3>(3);

  // Math for 1 vs 3 sites cost projection
  const timelineData = activeSiteTab === 1 
    ? [
        { label: "1 Month", framer: 15, hostfast: 3 },
        { label: "6 Months", framer: 90, hostfast: 18 },
        { label: "1 Year", framer: 180, hostfast: 36 },
        { label: "2 Years", framer: 360, hostfast: 72 },
      ]
    : [
        { label: "1 Month", framer: 45, hostfast: 8 },
        { label: "6 Months", framer: 270, hostfast: 48 },
        { label: "1 Year", framer: 540, hostfast: 96 },
        { label: "2 Years", framer: 1080, hostfast: 144 }, // Using annual rate projection
      ];

  const maxCost = activeSiteTab === 1 ? 360 : 1080;

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

      {/* HERO SECTION */}
      <header className="relative pt-28 pb-12 px-4 max-w-4xl mx-auto text-center flex flex-col items-center">
        <ScrollReveal className="space-y-4 flex flex-col items-center">
          <span className="inline-flex border border-[#222] rounded-full px-3 py-0.5 text-[10px] md:text-xs text-[#888] font-mono tracking-wider bg-[#111] select-none uppercase font-semibold">
            Comparison
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#EDEDED] max-w-2xl">
            hostfa.st vs Framer Hosting
          </h1>
          <p className="text-sm md:text-base text-[#888] max-w-md mx-auto leading-relaxed">
            {"Framer is the best design tool. Their hosting? Not so much. hostfa.st gives you the same result for 5x less."}
          </p>
        </ScrollReveal>

        {/* Side by side boxes */}
        <ScrollReveal className="w-full max-w-xl mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 select-none relative">
          
          {/* Framer box */}
          <div className="w-full bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col items-center gap-2">
            <span className="text-xs font-mono text-[#555] uppercase tracking-wider">Framer Basic</span>
            <span className="text-2xl font-bold text-[#EDEDED] font-mono">$10-15</span>
            <span className="text-[10px] text-[#555]">/ site / month</span>
          </div>

          {/* VS Divider */}
          <span className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-[#222] flex items-center justify-center text-[10px] font-mono text-[#555] shrink-0">
            VS
          </span>

          {/* hostfa.st box */}
          <div className="w-full bg-[#111] border border-[#EDEDED] rounded-xl p-6 flex flex-col items-center gap-2">
            <span className="text-xs font-mono text-[#888] uppercase tracking-wider">hostfa.st</span>
            <span className="text-2xl font-bold text-[#EDEDED] font-mono">$3.00</span>
            <span className="text-[10px] text-[#888]">/ site / month</span>
          </div>

        </ScrollReveal>

        <span className="block text-xs text-[#555] font-mono mt-6 select-none">
          Same result. Different price.
        </span>
      </header>

      {/* DETAILED COMPARISON TABLE */}
      <section className="py-20 px-4 max-w-3xl mx-auto border-t border-[#222]">
        <ScrollReveal className="space-y-4 mb-10">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            Specs Matrix
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
            Detailed Comparison Table
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <div className="border border-[#222] rounded-lg overflow-hidden bg-[#0A0A0A] text-xs md:text-sm select-none">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111] border-b border-[#222] text-[10px] md:text-xs text-[#555] uppercase tracking-wider font-semibold">
                  <th className="px-4 py-3.5">Feature</th>
                  <th className="px-4 py-3.5">Framer Hosting</th>
                  <th className="px-4 py-3.5 text-[#22C55E]">hostfa.st</th>
                </tr>
              </thead>
              <tbody>
                {/* PRICING */}
                <tr className="bg-[#0D0D0D] border-b border-[#222] font-semibold text-[#555]">
                  <td colSpan={3} className="px-4 py-2.5 uppercase tracking-wide text-[9px] md:text-[10px]">Pricing & Savings</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Monthly cost (1 site)</td>
                  <td className="px-4 py-2 text-[#EDEDED]">$10-15/mo</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-bold">$3/mo</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Annual cost (1 site)</td>
                  <td className="px-4 py-2 text-[#EDEDED]">$120-180/yr</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-bold">$30/yr</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Monthly cost (3 sites)</td>
                  <td className="px-4 py-2 text-[#EDEDED]">$30-45/mo</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-bold">$7/mo</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Annual savings</td>
                  <td className="px-4 py-2 text-[#555]">$0</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-bold">Save $90-144/yr</td>
                </tr>

                {/* FEATURES */}
                <tr className="bg-[#0D0D0D] border-b border-[#222] font-semibold text-[#555]">
                  <td colSpan={3} className="px-4 py-2.5 uppercase tracking-wide text-[9px] md:text-[10px]">Features Comparison</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Custom domain</td>
                  <td className="px-4 py-2 text-[#EDEDED]">✓</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">✓</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Free SSL certificates</td>
                  <td className="px-4 py-2 text-[#EDEDED]">✓</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">✓</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Auto-sync on publish</td>
                  <td className="px-4 py-2 text-[#EDEDED]">✓</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">✓</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Global Edge CDN</td>
                  <td className="px-4 py-2 text-[#888]">✓</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">{"✓ (Cloudflare)"}</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Framer editor access</td>
                  <td className="px-4 py-2 text-[#EDEDED]">✓</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">{"✓ (free plan)"}</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Analytics tools</td>
                  <td className="px-4 py-2 text-[#888]">Pro plan only</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">{"✓ (Pro+)"}</td>
                </tr>

                {/* HOSTING */}
                <tr className="bg-[#0D0D0D] border-b border-[#222] font-semibold text-[#555]">
                  <td colSpan={3} className="px-4 py-2.5 uppercase tracking-wide text-[9px] md:text-[10px]">Infrastructure & Lock-In</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Infrastructure</td>
                  <td className="px-4 py-2 text-[#888]">Framer Servers</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-semibold">Cloudflare Pages</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Own hosting infrastructure</td>
                  <td className="px-4 py-2 text-[#555]">✗</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">✓</td>
                </tr>
                <tr className="h-10">
                  <td className="px-4 py-2 text-[#888]">Vendor lock-in</td>
                  <td className="px-4 py-2 text-[#EF4444]">High</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-semibold">Low</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* REAL COST BREAKDOWN */}
      <section className="py-20 px-4 max-w-3xl mx-auto border-t border-[#222]">
        <ScrollReveal className="space-y-4 text-center mb-10">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            Accumulated Expense
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
            The real cost of Framer hosting
          </h2>
          <p className="text-xs md:text-sm text-[#888] max-w-md mx-auto">
            Compare cumulative cost projections over time. See how fast hosting plans drain your capital.
          </p>

          {/* Calculator Tab selector */}
          <div className="flex justify-center pt-2 select-none">
            <div className="inline-flex bg-[#111] border border-[#222] rounded p-1">
              <button
                onClick={() => setActiveSiteTab(1)}
                className={`text-[10px] md:text-xs font-semibold px-4 py-1.5 rounded transition-all duration-200 ${
                  activeSiteTab === 1 ? "bg-[#EDEDED] text-[#0A0A0A]" : "text-[#888] hover:text-[#EDEDED]"
                }`}
              >
                1 Site
              </button>
              <button
                onClick={() => setActiveSiteTab(3)}
                className={`text-[10px] md:text-xs font-semibold px-4 py-1.5 rounded transition-all duration-200 ${
                  activeSiteTab === 3 ? "bg-[#EDEDED] text-[#0A0A0A]" : "text-[#888] hover:text-[#EDEDED]"
                }`}
              >
                3 Sites
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Visual Bar Comparison charts */}
        <ScrollReveal className="bg-[#111] border border-[#222] rounded-xl p-6 md:p-8 space-y-6">
          <div className="space-y-5">
            {timelineData.map((item) => {
              const framerPct = (item.framer / maxCost) * 100;
              const hostfastPct = (item.hostfast / maxCost) * 100;

              return (
                <div key={item.label} className="space-y-2 select-none">
                  <div className="flex justify-between items-center text-xs font-semibold text-[#888]">
                    <span>{item.label}</span>
                    <span className="font-mono text-[#555]">
                      (Save ${item.framer - item.hostfast})
                    </span>
                  </div>
                  {/* Bars Row */}
                  <div className="space-y-1.5">
                    {/* Framer Bar */}
                    <div className="flex items-center gap-3">
                      <div className="w-14 text-[10px] text-[#888] shrink-0 font-medium">Framer:</div>
                      <div className="flex-1 h-3 bg-[#0A0A0A] rounded overflow-hidden border border-[#222]">
                        <div
                          style={{ width: `${framerPct}%` }}
                          className="h-full bg-[#333] transition-all duration-500 ease-out"
                        />
                      </div>
                      <div className="w-12 text-right text-xs font-bold text-[#888] font-mono">${item.framer}</div>
                    </div>
                    {/* hostfa.st Bar */}
                    <div className="flex items-center gap-3">
                      <div className="w-14 text-[10px] text-[#22C55E] shrink-0 font-bold">hostfa.st:</div>
                      <div className="flex-1 h-3 bg-[#0A0A0A] rounded overflow-hidden border border-[#222]">
                        <div
                          style={{ width: `${hostfastPct}%` }}
                          className="h-full bg-[#22C55E] transition-all duration-500 ease-out"
                        />
                      </div>
                      <div className="w-12 text-right text-xs font-bold text-[#22C55E] font-mono">${item.hostfast}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#222] pt-5 text-center text-xs md:text-sm text-[#888] select-none leading-relaxed">
            {activeSiteTab === 3 ? (
              <span className="font-mono">
                {"Over 2 years with 3 Framer sites: "}
                <span className="text-[#EF4444] font-bold">{"Framer: $720–1,080"}</span>
                {" | "}
                <span className="text-[#EDEDED] font-bold">{"hostfa.st: $144–192"}</span>
                {" | "}
                <span className="text-[#22C55E] font-bold">{"You save: $576–888"}</span>
              </span>
            ) : (
              <span className="font-mono">
                {"Over 2 years with 1 Framer site: "}
                <span className="text-[#EF4444] font-bold">{"Framer: $240–360"}</span>
                {" | "}
                <span className="text-[#EDEDED] font-bold">{"hostfa.st: $60–72"}</span>
                {" | "}
                <span className="text-[#22C55E] font-bold">{"You save: $180–288"}</span>
              </span>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* WHEN TO CHOOSE FRAMER HOSTING */}
      <section className="py-20 px-4 max-w-3xl mx-auto border-t border-[#222]">
        <ScrollReveal className="space-y-4 mb-10">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            Unbiased Opinion
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
            When Framer hosting makes sense
          </h2>
          <p className="text-xs md:text-sm text-[#888] leading-relaxed">
            {"We believe in transparent comparisons to build long-term trust. You should keep using Framer's native hosting if:"}
          </p>
        </ScrollReveal>

        <ScrollReveal className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#111] border border-[#222] rounded-lg p-5 space-y-2 hover:border-[#333] transition-colors select-none">
            <span className="text-[10px] font-mono text-[#555] uppercase tracking-wider">Scenario A</span>
            <h3 className="text-xs md:text-sm font-semibold text-[#EDEDED]">CMS & Dynamic Data</h3>
            <p className="text-[11px] md:text-xs text-[#888] leading-relaxed">
              {"You heavily depend on Framer's CMS with client-facing inputs or frequently updated dynamic content databases."}
            </p>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-lg p-5 space-y-2 hover:border-[#333] transition-colors select-none">
            <span className="text-[10px] font-mono text-[#555] uppercase tracking-wider">Scenario B</span>
            <h3 className="text-xs md:text-sm font-semibold text-[#EDEDED]">Staging Environments</h3>
            <p className="text-[11px] md:text-xs text-[#888] leading-relaxed">
              {"You run custom enterprise workflows that require native Framer Pro staging/staging branches and pipeline triggers."}
            </p>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-lg p-5 space-y-2 hover:border-[#333] transition-colors select-none">
            <span className="text-[10px] font-mono text-[#555] uppercase tracking-wider">Scenario C</span>
            <h3 className="text-xs md:text-sm font-semibold text-[#EDEDED]">Team Collaboration</h3>
            <p className="text-[11px] md:text-xs text-[#888] leading-relaxed">
              {"You manage a large-scale agency requiring live collaboration permissions and custom permission roles in team accounts."}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="text-center text-xs md:text-sm text-[#888] mt-8 select-none font-mono">
          For everyone else — hostfa.st saves you money.
        </ScrollReveal>
      </section>

      {/* MIGRATION GUIDE */}
      <section className="py-20 px-4 max-w-3xl mx-auto border-t border-[#222]">
        <ScrollReveal className="space-y-4 mb-10">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            Migration Guide
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
            Switch in 5 minutes
          </h2>
        </ScrollReveal>

        <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#111] border border-[#222] rounded-lg p-5 space-y-2 hover:border-[#333] transition-colors select-none">
            <span className="text-lg font-mono font-bold text-[#555]">01</span>
            <h3 className="text-xs md:text-sm font-semibold text-[#EDEDED]">Sign Up</h3>
            <p className="text-[11px] text-[#888] leading-relaxed">
              Create a free account on hostfa.st in 10 seconds.
            </p>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-lg p-5 space-y-2 hover:border-[#333] transition-colors select-none">
            <span className="text-lg font-mono font-bold text-[#555]">02</span>
            <h3 className="text-xs md:text-sm font-semibold text-[#EDEDED]">Add URL</h3>
            <p className="text-[11px] text-[#888] leading-relaxed">
              Paste your public Framer site link (.framer.website).
            </p>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-lg p-5 space-y-2 hover:border-[#333] transition-colors select-none">
            <span className="text-lg font-mono font-bold text-[#555]">03</span>
            <h3 className="text-xs md:text-sm font-semibold text-[#EDEDED]">Configure DNS</h3>
            <p className="text-[11px] text-[#888] leading-relaxed">
              Point your domain to us with one CNAME record.
            </p>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-lg p-5 space-y-2 hover:border-[#333] transition-colors select-none">
            <span className="text-lg font-mono font-bold text-[#555]">04</span>
            <h3 className="text-xs md:text-sm font-semibold text-[#EDEDED]">Cancel Paid Plan</h3>
            <p className="text-[11px] text-[#888] leading-relaxed">
              {"Downgrade Framer plan to free. That's it."}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="text-center text-xs text-[#22C55E] mt-8 select-none font-semibold">
          {"That's it. Your site keeps working."}
        </ScrollReveal>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 text-center border-t border-[#222] bg-[#090909] px-4">
        <ScrollReveal className="max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#EDEDED] leading-tight">
            Switch to hostfa.st — Save $100+/year
          </h2>
          <p className="text-xs md:text-sm text-[#888] max-w-sm mx-auto leading-relaxed">
            Stop overpaying. Join dozens of smart creators saving thousands on their hosting bills.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-block text-sm font-semibold bg-[#EDEDED] text-[#0A0A0A] hover:bg-[#DCDCDC] px-8 py-3 rounded-sm transition-colors"
              aria-label="Switch to hostfa.st final CTA"
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
