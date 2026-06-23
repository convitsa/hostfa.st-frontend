"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/marketing/Footer";
import {
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Loader2,
  Zap,
  ShieldCheck,
  Clock,
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";

const CYCLING_MESSAGES = [
  "Connecting to your site...",
  "Measuring First Contentful Paint...",
  "Checking Largest Contentful Paint...",
  "Analyzing Core Web Vitals..."
];

export default function SpeedTestClient() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [messageIndex, setMessageIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Results state
  const [performanceScore, setPerformanceScore] = useState(0);
  const [fcp, setFcp] = useState({ value: 0, display: "0" });
  const [lcp, setLcp] = useState({ value: 0, display: "0" });
  const [tbt, setTbt] = useState({ value: 0, display: "0" });
  const [cls, setCls] = useState({ value: 0, display: "0" });

  // Cycling message loader
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "loading") {
      setMessageIndex(0);
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % CYCLING_MESSAGES.length);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const validateUrl = (inputUrl: string) => {
    const clean = inputUrl.trim().toLowerCase();
    return clean.startsWith("http://") || clean.startsWith("https://");
  };

  const handleRunTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validateUrl(url)) {
      setErrorMsg("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(`/api/tools/speed-test?url=${encodeURIComponent(url.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "PageSpeed test failed.");
      }

      setPerformanceScore(data.performance_score);
      setFcp(data.fcp);
      setLcp(data.lcp);
      setTbt(data.tbt);
      setCls(data.cls);
      setStatus("success");
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred while testing the speed.";
      setErrorMsg(errMsg);
      setStatus("error");
    }
  };

  // Helper color functions for thresholds
  const getFcpColor = (val: number) => {
    if (val < 1800) return "text-[#22C55E]"; // good < 1.8s
    if (val < 3000) return "text-[#EAB308]"; // needs improvement < 3s
    return "text-[#EF4444]"; // poor
  };

  const getLcpColor = (val: number) => {
    if (val < 2500) return "text-[#22C55E]"; // good < 2.5s
    if (val < 4000) return "text-[#EAB308]"; // needs improvement < 4s
    return "text-[#EF4444]"; // poor
  };

  const getTbtColor = (val: number) => {
    if (val < 200) return "text-[#22C55E]"; // good < 200ms
    if (val < 600) return "text-[#EAB308]"; // needs improvement < 600ms
    return "text-[#EF4444]"; // poor
  };

  const getClsColor = (val: number) => {
    if (val < 0.1) return "text-[#22C55E]"; // good < 0.1
    if (val < 0.25) return "text-[#EAB308]"; // needs improvement < 0.25
    return "text-[#EF4444]"; // poor
  };

  const getScoreColorClass = (score: number) => {
    if (score < 50) return "text-[#EF4444] border-[#EF4444]";
    if (score < 90) return "text-[#EAB308] border-[#EAB308]";
    return "text-[#22C55E] border-[#22C55E]";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-[#EDEDED] selection:text-[#0A0A0A] overflow-x-hidden">
      {/* Dynamic Keyframes for Indeterminate Progress Bar */}
      <style>{`
        @keyframes progressIndeterminate {
          0% { left: -35%; right: 100%; }
          60% { left: 100%; right: -90%; }
          100% { left: 100%; right: -90%; }
        }
        .animate-progress-indeterminate {
          animation: progressIndeterminate 1.8s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
        }
      `}</style>

      {/* NAV */}
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

      {/* HEADER SECTION */}
      <header className="relative pt-28 pb-12 px-4 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <div className="mb-4">
          <span className="inline-flex border border-[#22C55E]/20 rounded-full px-3 py-0.5 text-xs text-[#22C55E] font-mono tracking-wider bg-[#0F2318] select-none uppercase font-semibold">
            Free Tool
          </span>
        </div>

        {/* H1 */}
        <h1 className="text-[#EDEDED] leading-[1.1] font-bold tracking-tight mb-6 max-w-3xl" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
          Framer Site Speed Test
        </h1>

        {/* Subtext */}
        <p className="text-sm md:text-base text-[#888] max-w-xl mx-auto leading-relaxed">
          Test your Framer site&apos;s performance and Core Web Vitals. Slow hosting costs you conversions and SEO rankings.
        </p>
      </header>

      {/* SPEED TEST TOOL MAIN SECTION */}
      <section className="pb-20 px-4 max-w-xl mx-auto">
        <div className="bg-[#111] border border-[#222] rounded-xl p-6 md:p-8 hover:border-[#333] transition-colors duration-200 shadow-xl">

          {status === "idle" && (
            <form onSubmit={handleRunTest} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider text-[#888] font-mono select-none">
                  Website URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://mysite.framer.website"
                    className="flex-1 bg-[#0A0A0A] border border-[#222] text-[#EDEDED] placeholder-[#555] focus:border-[#444] focus:outline-none h-10 px-3 text-sm rounded-md transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#EDEDED] text-[#0A0A0A] hover:bg-white active:scale-[0.98] transition-all font-semibold text-sm h-10 px-5 rounded-md flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    Run Speed Test <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-[#555] mt-1 select-none">
                  Tests mobile performance via Google PageSpeed Insights
                </p>
              </div>
              {errorMsg && (
                <div className="text-xs text-[#EF4444] flex items-center gap-1.5 bg-[#1F0D0D] border border-[#EF4444]/20 p-2.5 rounded">
                  <X className="h-3.5 w-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>
          )}

          {status === "loading" && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-5">
              <Loader2 className="h-8 w-8 text-[#EDEDED] animate-spin" />

              <div className="space-y-1">
                <p className="text-sm font-medium text-[#EDEDED] font-mono transition-all duration-300">
                  {CYCLING_MESSAGES[messageIndex]}
                </p>
                <p className="text-xs text-[#555]">
                  This takes about 15 seconds
                </p>
              </div>

              {/* Progress bar */}
              <div className="h-1 w-full max-w-[320px] bg-[#222] overflow-hidden rounded-full relative">
                <div className="absolute top-0 bottom-0 bg-[#EDEDED] rounded-full animate-progress-indeterminate" />
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="py-2 flex flex-col items-center space-y-6">

              {/* Score circle */}
              <div className="flex flex-col items-center justify-center py-4">
                <div className={`w-36 h-36 rounded-full border-[6px] flex flex-col items-center justify-center font-mono ${getScoreColorClass(performanceScore)} bg-[#0B0B0B]`}>
                  <span className="text-4xl font-bold">{performanceScore}</span>
                  <span className="text-[10px] uppercase tracking-wider mt-1 opacity-70">Performance</span>
                </div>
              </div>

              {/* 4 Metrics Grid */}
              <div className="w-full grid grid-cols-2 gap-4">
                {/* Metric 1: FCP */}
                <div className="bg-[#111] border border-[#222] rounded-lg p-4 text-left hover:border-[#333] transition-colors">
                  <span className="text-[10px] text-[#555] uppercase tracking-wider font-mono block">FCP</span>
                  <span className="text-[9px] text-[#888] block mt-0.5 leading-none">First Contentful Paint</span>
                  <span className={`text-lg font-semibold font-mono block mt-2 ${getFcpColor(fcp.value)}`}>
                    {fcp.display}
                  </span>
                </div>

                {/* Metric 2: LCP */}
                <div className="bg-[#111] border border-[#222] rounded-lg p-4 text-left hover:border-[#333] transition-colors">
                  <span className="text-[10px] text-[#555] uppercase tracking-wider font-mono block">LCP</span>
                  <span className="text-[9px] text-[#888] block mt-0.5 leading-none">Largest Contentful Paint</span>
                  <span className={`text-lg font-semibold font-mono block mt-2 ${getLcpColor(lcp.value)}`}>
                    {lcp.display}
                  </span>
                </div>

                {/* Metric 3: TBT */}
                <div className="bg-[#111] border border-[#222] rounded-lg p-4 text-left hover:border-[#333] transition-colors">
                  <span className="text-[10px] text-[#555] uppercase tracking-wider font-mono block">TBT</span>
                  <span className="text-[9px] text-[#888] block mt-0.5 leading-none">Total Blocking Time</span>
                  <span className={`text-lg font-semibold font-mono block mt-2 ${getTbtColor(tbt.value)}`}>
                    {tbt.display}
                  </span>
                </div>

                {/* Metric 4: CLS */}
                <div className="bg-[#111] border border-[#222] rounded-lg p-4 text-left hover:border-[#333] transition-colors">
                  <span className="text-[10px] text-[#555] uppercase tracking-wider font-mono block">CLS</span>
                  <span className="text-[9px] text-[#888] block mt-0.5 leading-none">Cumulative Layout Shift</span>
                  <span className={`text-lg font-semibold font-mono block mt-2 ${getClsColor(cls.value)}`}>
                    {cls.display}
                  </span>
                </div>
              </div>

              {/* Conditional Upsell Card */}
              {performanceScore < 90 ? (
                <div className="w-full bg-[#111] border border-[#EAB308]/20 rounded-lg p-5 text-left space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-[#EDEDED] flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-[#EAB308]" /> Your site could be faster
                    </h4>
                    <p className="text-xs text-[#888] leading-relaxed">
                      hostfa.st serves your site through Cloudflare&apos;s global CDN — 300+ locations worldwide. Often improves load times vs Framer&apos;s default hosting.
                    </p>
                  </div>
                  <Link
                    href="/register"
                    className="w-full bg-[#EDEDED] text-[#0A0A0A] hover:bg-white text-xs font-semibold h-8 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    Try hostfa.st Free <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div className="w-full bg-[#111] border border-[#22C55E]/20 rounded-lg p-5 text-left space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-[#EDEDED] flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-[#22C55E]" /> Great performance! But you&apos;re still overpaying.
                    </h4>
                    <p className="text-xs text-[#888] leading-relaxed">
                      Your site is fast. hostfa.st keeps it that way on Cloudflare CDN — for $3/month instead of $15/month.
                    </p>
                  </div>
                  <Link
                    href="/register"
                    className="w-full bg-[#EDEDED] text-[#0A0A0A] hover:bg-white text-xs font-semibold h-8 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    Switch and Save $100+/year <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}

              <button
                onClick={() => setStatus("idle")}
                className="text-xs text-[#555] hover:text-[#888] transition-colors underline font-medium pt-2 cursor-pointer"
              >
                Test another site
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="py-6 flex flex-col items-center text-center space-y-5">
              <div className="h-10 w-10 bg-[#1F0D0D] border border-[#EF4444]/30 text-[#EF4444] rounded-full flex items-center justify-center">
                <X className="h-5 w-5" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-[#EDEDED]">Could not test this site</h3>
                <p className="text-xs text-[#888] bg-[#1F0D0D]/20 border border-[#EF4444]/10 p-3 rounded font-mono text-left max-w-sm whitespace-pre-wrap">
                  {errorMsg || "An error occurred while communicating with the speed metrics servers."}
                </p>
              </div>

              <button
                onClick={() => setStatus("idle")}
                className="w-full border border-[#333] hover:border-[#444] text-[#EDEDED] text-xs font-semibold h-9 rounded flex items-center justify-center transition-colors cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

        </div>
      </section>

      {/* EDUCATIONAL CONTENT */}
      <section className="py-20 border-t border-[#222] bg-[#0B0B0B] px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
              Speed Impact
            </span>
            <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
              Why site speed matters for Framer sites
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111] border border-[#222] rounded-lg p-5 space-y-3">
              <div className="h-8 w-8 bg-[#1A1A1A] rounded-lg border border-[#333] flex items-center justify-center text-[#EDEDED]">
                <Zap className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#EDEDED]">SEO Rankings</h3>
              <p className="text-xs text-[#888] leading-relaxed">
                Google uses Core Web Vitals as a ranking factor. Faster sites rank higher in search results.
              </p>
            </div>
            <div className="bg-[#111] border border-[#222] rounded-lg p-5 space-y-3">
              <div className="h-8 w-8 bg-[#1A1A1A] rounded-lg border border-[#333] flex items-center justify-center text-[#EDEDED]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#EDEDED]">Conversion Rate</h3>
              <p className="text-xs text-[#888] leading-relaxed">
                A 1-second delay reduces conversions by 7%. Every millisecond counts.
              </p>
            </div>
            <div className="bg-[#111] border border-[#222] rounded-lg p-5 space-y-3">
              <div className="h-8 w-8 bg-[#1A1A1A] rounded-lg border border-[#333] flex items-center justify-center text-[#EDEDED]">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#EDEDED]">User Experience</h3>
              <p className="text-xs text-[#888] leading-relaxed">
                53% of mobile users abandon sites that take over 3 seconds to load.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERNAL LINKS SECTION */}
      <section className="py-20 px-4 border-t border-[#222] max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold text-[#EDEDED]">More free tools</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/tools/framer-export"
              className="block bg-[#111] border border-[#222] rounded-xl p-6 hover:border-[#333] transition-all duration-200 group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-[#EDEDED] group-hover:text-white transition-colors">Export Your Framer Site</h3>
                  <p className="text-xs text-[#888] mt-1.5 leading-relaxed">
                    Download your Framer site as a ZIP file including all static HTML and relative assets for free offline use or hosting.
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#555] group-hover:text-[#EDEDED] transition-colors shrink-0 ml-3" />
              </div>
            </Link>

            <Link
              href="/tools/cost-calculator"
              className="block bg-[#111] border border-[#222] rounded-xl p-6 hover:border-[#333] transition-all duration-200 group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-[#EDEDED] group-hover:text-white transition-colors">Calculate Your Savings</h3>
                  <p className="text-xs text-[#888] mt-1.5 leading-relaxed">
                    See exactly how much you spend hosting with Framer custom domains and what you&apos;d save hosting with hostfa.st.
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#555] group-hover:text-[#EDEDED] transition-colors shrink-0 ml-3" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
