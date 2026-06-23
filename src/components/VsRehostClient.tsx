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

export default function VsRehostClient() {
  const [activeSiteTab, setActiveSiteTab] = useState<1 | 3>(3);

  // Cost comparison: hostfa.st vs rehost.it
  const timelineData = activeSiteTab === 1 
    ? [
        { label: "1 Month", rehost: 11.99, hostfast: 3 },
        { label: "6 Months", rehost: 71.94, hostfast: 18 },
        { label: "1 Year", rehost: 143.88, hostfast: 36 },
        { label: "2 Years", rehost: 287.76, hostfast: 72 },
      ]
    : [
        { label: "1 Month", rehost: 18.99, hostfast: 8 },
        { label: "6 Months", rehost: 113.94, hostfast: 48 },
        { label: "1 Year", rehost: 227.88, hostfast: 96 },
        { label: "2 Years", rehost: 455.76, hostfast: 192 },
      ];

  const maxCost = activeSiteTab === 1 ? 288 : 456;

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
            className="text-xs bg-[#EDEDED] text-[#0A0A0A] hover:bg-white px-3 py-1.5 rounded-sm transition-colors font-medium"
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
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#EDEDED] max-w-2xl leading-tight">
            hostfa.st vs rehost.it
          </h1>
          <p className="text-sm md:text-base text-[#888] max-w-md mx-auto leading-relaxed">
            Both connect your custom domain to Framer free sites. But hostfa.st gives you better features, global Cloudflare CDN, and is 2x cheaper.
          </p>
        </ScrollReveal>

        {/* Side by side boxes */}
        <ScrollReveal className="w-full max-w-xl mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 select-none relative">
          {/* rehost.it box */}
          <div className="w-full bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col items-center gap-2">
            <span className="text-xs font-mono text-[#555] uppercase tracking-wider">rehost.it (2 Sites)</span>
            <span className="text-2xl font-bold text-[#EDEDED] font-mono">$11.99</span>
            <span className="text-[10px] text-[#555]">/ month</span>
          </div>

          {/* VS Divider */}
          <span className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-[#222] flex items-center justify-center text-[10px] font-mono text-[#555] shrink-0">
            VS
          </span>

          {/* hostfa.st box */}
          <div className="w-full bg-[#111] border border-[#EDEDED] rounded-xl p-6 flex flex-col items-center gap-2">
            <span className="text-xs font-mono text-[#888] uppercase tracking-wider">hostfa.st Starter</span>
            <span className="text-2xl font-bold text-[#EDEDED] font-mono">$3.00</span>
            <span className="text-[10px] text-[#888]">/ site / month</span>
          </div>
        </ScrollReveal>

        <span className="block text-xs text-[#555] font-mono mt-6 select-none">
          Same custom domain. Half the price.
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
                  <th className="px-4 py-3.5">rehost.it</th>
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
                  <td className="px-4 py-2 text-[#EDEDED]">$11.99/mo</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-bold">$3/mo</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Monthly cost (3 sites)</td>
                  <td className="px-4 py-2 text-[#EDEDED]">$18.99/mo</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-bold">$8/mo</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Monthly cost (10 sites)</td>
                  <td className="px-4 py-2 text-[#EDEDED]">$27.99/mo</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-bold">$19/mo</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Annual savings (3 sites)</td>
                  <td className="px-4 py-2 text-[#555]">$0</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-bold">Save $131-155/yr</td>
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
                  <td className="px-4 py-2 text-[#EF4444] bg-[#1A0F0F]/70 font-semibold">✗ (Manual export required)</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-semibold">✓ (Auto-syncs instantly)</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Global Edge CDN</td>
                  <td className="px-4 py-2 text-[#888]">✓</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70">{"✓ (Cloudflare 300+ locations)"}</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] h-10">
                  <td className="px-4 py-2 text-[#888]">Webflow static site support</td>
                  <td className="px-4 py-2 text-[#555]">✗</td>
                  <td className="px-4 py-2 text-[#22C55E] bg-[#0F1A0F]/70 font-semibold">Coming soon</td>
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
            Hosting cost accumulation over time
          </h2>
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
              const rehostPct = (item.rehost / maxCost) * 100;
              const hostfastPct = (item.hostfast / maxCost) * 100;

              return (
                <div key={item.label} className="space-y-2 select-none">
                  <div className="flex justify-between items-center text-xs font-semibold text-[#888]">
                    <span>{item.label}</span>
                    <span className="font-mono text-[#555]">
                      (Save ${item.rehost - item.hostfast})
                    </span>
                  </div>
                  {/* Bars Row */}
                  <div className="space-y-1.5">
                    {/* rehost Bar */}
                    <div className="flex items-center gap-3">
                      <div className="w-14 text-[10px] text-[#888] shrink-0 font-medium">rehost.it:</div>
                      <div className="flex-1 h-3 bg-[#0A0A0A] rounded overflow-hidden border border-[#222]">
                        <div
                          style={{ width: `${rehostPct}%` }}
                          className="h-full bg-[#333] transition-all duration-500 ease-out"
                        />
                      </div>
                      <div className="w-12 text-right text-xs font-bold text-[#888] font-mono">${item.rehost}</div>
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

          <div className="border-t border-[#222] pt-5 text-center text-xs md:text-sm text-[#888] select-none leading-relaxed font-mono">
            {activeSiteTab === 3 ? (
              <span>
                {"Over 2 years with 3 sites: "}
                <span className="text-[#EF4444] font-bold">{"rehost.it: $456"}</span>
                {" | "}
                <span className="text-[#EDEDED] font-bold">{"hostfa.st: $144–192"}</span>
                {" | "}
                <span className="text-[#22C55E] font-bold">{"You save: $264–312"}</span>
              </span>
            ) : (
              <span>
                {"Over 2 years with 1 site: "}
                <span className="text-[#EF4444] font-bold">{"rehost.it: $288"}</span>
                {" | "}
                <span className="text-[#EDEDED] font-bold">{"hostfa.st: $60–72"}</span>
                {" | "}
                <span className="text-[#22C55E] font-bold">{"You save: $216–228"}</span>
              </span>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 text-center border-t border-[#222] bg-[#090909] px-4">
        <ScrollReveal className="max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#EDEDED] leading-tight">
            Ready to host 2x cheaper?
          </h2>
          <p className="text-xs md:text-sm text-[#888] max-w-sm mx-auto leading-relaxed">
            Stop overpaying. Join creators who connect custom domains to Framer sites for half the cost.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-block text-sm font-semibold bg-[#EDEDED] text-[#0A0A0A] hover:bg-[#DCDCDC] px-8 py-3 rounded-sm transition-colors"
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
