"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Footer from "@/components/marketing/Footer";
import { 
  Check, 
  X, 
  Loader2, 
  Download, 
  ExternalLink, 
  ChevronRight, 
  HelpCircle,
  Layers,
  ArrowRight,
  Shield,
  Server,
  Database,
  ArrowLeftRight,
  AlertTriangle
} from "lucide-react";

const STATUS_MESSAGES = [
  "Connecting to your Framer site...",
  "Rendering pages...",
  "Downloading assets...",
  "Packaging files..."
];

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
        className={`transition-all duration-300 ease-in-out overflow-hidden text-xs md:text-sm text-[#888] ${
          isOpen ? "max-h-[300px] mt-2 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="pb-2 leading-relaxed whitespace-pre-line">{answer}</p>
      </div>
    </div>
  );
}

export default function FramerExportClient() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [messageIndex, setMessageIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [isRateLimited, setIsRateLimited] = useState(false);
  
  // Results
  const [downloadUrl, setDownloadUrl] = useState("");
  const [pagesCount, setPagesCount] = useState(0);
  const [assetsCount, setAssetsCount] = useState(0);
  const [partial, setPartial] = useState(false);
  const [totalSitemapPages, setTotalSitemapPages] = useState<number | null>(null);

  // Cycling message logic (every 3 seconds)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "loading") {
      setMessageIndex(0);
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const validateUrl = (rawUrl: string): boolean => {
    const clean = rawUrl.trim().toLowerCase();
    if (!clean) return false;
    
    // Support either clean domains or full URL protocols
    let host = clean;
    if (clean.includes("://")) {
      try {
        const parsed = new URL(clean);
        host = parsed.hostname;
      } catch {
        return false;
      }
    } else {
      host = clean.split("/")[0].split("?")[0].split("#")[0];
    }
    
    return (
      host.endsWith(".framer.website") ||
      host.endsWith(".framer.app") ||
      host.endsWith(".framer.media")
    );
  };

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsRateLimited(false);
    setPartial(false);

    if (!validateUrl(url)) {
      setErrorMsg("Please enter a valid Framer URL ending with .framer.website, .framer.app, or .framer.media");
      return;
    }

    setStatus("loading");
    setTotalSitemapPages(null);

    try {
      const response = await fetch("/api/tools/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ framer_url: url.trim() }),
      });

      if (response.status === 429) {
        setIsRateLimited(true);
        setErrorMsg("You've already exported a site this hour");
        setStatus("error");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to start export.");
      }

      const jobId = data.job_id;
      pollJobStatus(jobId);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred.");
      setStatus("error");
    }
  };

  const pollJobStatus = (jobId: string) => {
    let attempts = 0;
    const maxAttempts = 150; // ~5 minutes of polling (every 2 seconds)

    const interval = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(interval);
        setErrorMsg("Export timed out. Your Framer site might be too large or offline.");
        setStatus("error");
        return;
      }

      try {
        const response = await fetch(`/api/tools/export/status/${jobId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch status.");
        }

        const data = await response.json();
        
        if (data.status === "done") {
          clearInterval(interval);
          setDownloadUrl(data.download_url);
          setPagesCount(data.pages_crawled || 0);
          setAssetsCount(data.assets_count || 0);
          setPartial(data.partial || false);
          setTotalSitemapPages(data.total_sitemap_pages ?? null);
          setStatus("success");
        } else if (data.status === "failed") {
          clearInterval(interval);
          setErrorMsg(data.error || "Export failed during processing.");
          setStatus("error");
        }
      } catch (err) {
        console.error("Polling error:", err);
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setErrorMsg("Lost connection to export worker.");
          setStatus("error");
        }
      }
    }, 2000);
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
            className="text-xs bg-[#EDEDED] text-[#0A0A0A] hover:bg-[#DCDCDC] px-3 py-1.5 rounded-sm transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-28 pb-12 px-4 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <div className="mb-4">
          <span className="inline-flex border border-[#22C55E]/20 rounded-full px-3 py-0.5 text-[10px] md:text-xs text-[#22C55E] font-mono tracking-wider bg-[#0F2318] select-none uppercase font-semibold">
            Free Tool
          </span>
        </div>

        {/* H1 Headline */}
        <h1 className="text-[#EDEDED] leading-[1.1] font-bold tracking-tight mb-6 max-w-3xl" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
          Export Your Framer Site to HTML
        </h1>

        {/* Subtext */}
        <p className="text-sm md:text-base text-[#888] max-w-xl mx-auto leading-relaxed">
          Download your Framer site as a ZIP file — free, no account needed. Or deploy it automatically to your custom domain with hostfa.st for $3/month.
        </p>
      </header>

      {/* EXPORT TOOL UI SECTION */}
      <section className="pb-20 px-4 max-w-xl mx-auto">
        <div className="bg-[#111] border border-[#222] rounded-xl p-6 md:p-8 hover:border-[#333] transition-colors duration-200 shadow-xl">
          
          {status === "idle" && (
            <form onSubmit={handleExport} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider text-[#888] font-mono select-none">
                  Framer Site URL
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
                    className="bg-[#EDEDED] text-[#0A0A0A] hover:bg-white active:scale-[0.98] transition-all font-semibold text-sm h-10 px-5 rounded-md flex items-center justify-center gap-1.5 shrink-0"
                  >
                    Export Now <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-[#555] mt-1 select-none">
                  Free export includes up to 5 pages.{" "}
                  <Link href="/register" className="underline hover:text-[#888] transition-colors">
                    Need more?
                  </Link>
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
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-5">
              <Loader2 className="h-8 w-8 text-[#EDEDED] animate-spin" />
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#EDEDED] font-mono transition-all duration-300">
                  {STATUS_MESSAGES[messageIndex]}
                </p>
                <p className="text-xs text-[#555]">
                  This usually takes 30-60 seconds
                </p>
              </div>

              {/* Indeterminate Progress Bar */}
              <div className="h-1 w-full max-w-[320px] bg-[#222] overflow-hidden rounded-full relative">
                <div className="absolute top-0 bottom-0 bg-[#EDEDED] rounded-full animate-progress-indeterminate" />
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="py-2 flex flex-col items-center text-center space-y-6">
              <div className="h-10 w-10 bg-[#0F2318] border border-[#22C55E]/30 text-[#22C55E] rounded-full flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>

              <div className="space-y-1.5 w-full">
                <h3 className="text-base font-semibold text-[#EDEDED]">Export complete!</h3>
                <p className="text-xs text-[#888] font-mono">
                  Crawled <span className="text-[#EDEDED] font-semibold">{pagesCount} pages</span> and downloaded <span className="text-[#EDEDED] font-semibold">{assetsCount} assets</span>
                </p>
                {partial && (
                  <div className="mt-4 text-xs text-[#EAB308] bg-[#1C1A08] border border-[#EAB308]/20 p-3 rounded-lg leading-relaxed text-left flex gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-[#EAB308] mt-0.5" />
                    <span>Some pages or assets may be missing. The crawler hit the 60-second limit and exported what was collected so far.</span>
                  </div>
                )}
              </div>

              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#EDEDED] text-[#0A0A0A] hover:bg-white font-semibold text-sm h-10 px-5 rounded-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Download className="h-4 w-4" /> Download ZIP File
              </a>

              <div className="w-full flex items-center gap-3 py-1">
                <div className="h-[1px] flex-1 bg-[#222]" />
                <span className="text-[10px] text-[#555] uppercase tracking-wider font-mono select-none">or</span>
                <div className="h-[1px] flex-1 bg-[#222]" />
              </div>

              {/* Upsell Card */}
              {totalSitemapPages !== null && totalSitemapPages > 5 ? (
                <div className="w-full bg-[#111] border border-[#EDEDED] rounded-lg p-5 mt-4 text-left space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-[#EDEDED]">
                      {totalSitemapPages} pages found on your site.
                    </h4>
                    <p className="text-sm text-[#888] mt-1 leading-relaxed">
                      We exported the first 5. hostfa.st auto-deploys all{" "}
                      {totalSitemapPages} pages to your custom domain — synced automatically on every publish.
                    </p>
                  </div>
                  
                  <Link
                    href="/register"
                    className="w-full bg-[#EDEDED] text-[#0A0A0A] hover:bg-white text-xs font-semibold h-8 rounded flex items-center justify-center gap-1.5 transition-colors mt-3"
                  >
                    Deploy All {totalSitemapPages} Pages — $3/month
                  </Link>
                </div>
              ) : (
                <div className="w-full bg-[#0A0A0A] border border-[#222] hover:border-[#333] rounded-lg p-5 text-left transition-colors space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#EDEDED] uppercase tracking-wide">
                      Want this to happen automatically?
                    </h4>
                    <p className="text-xs text-[#888] leading-relaxed">
                      hostfa.st auto-syncs your Framer site to your custom domain every time you publish — for $3/month.
                    </p>
                  </div>
                  
                  <Link
                    href="/register"
                    className="w-full bg-[#EDEDED] text-[#0A0A0A] hover:bg-white text-xs font-semibold h-8 rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Deploy to My Domain <ArrowRight className="h-3 w-3" />
                  </Link>
                  
                  <p className="text-xs text-[#555] text-center font-mono">
                    Includes free SSL + global CDN
                  </p>
                </div>
              )}

              <button
                onClick={() => setStatus("idle")}
                className="text-xs text-[#555] hover:text-[#888] transition-colors underline font-medium"
              >
                Export another site
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="py-4 flex flex-col items-center text-center space-y-5">
              {isRateLimited ? (
                <>
                  <div className="h-10 w-10 bg-[#1C1A08] border border-[#EAB308]/30 text-[#EAB308] rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-[#EDEDED]">Limit reached</h3>
                    <p className="text-xs text-[#888]">
                      You've already exported a site this hour.
                    </p>
                  </div>

                  <Link
                    href="/register"
                    className="w-full bg-[#EDEDED] text-[#0A0A0A] hover:bg-white font-semibold text-sm h-10 px-5 rounded-md flex items-center justify-center transition-colors font-medium active:scale-[0.98]"
                  >
                    Sign up for unlimited exports
                  </Link>

                  <button
                    onClick={() => { setStatus("idle"); setIsRateLimited(false); }}
                    className="text-xs text-[#555] hover:text-[#888] underline transition-colors"
                  >
                    Back
                  </button>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 bg-[#1F0D0D] border border-[#EF4444]/30 text-[#EF4444] rounded-full flex items-center justify-center">
                    <X className="h-5 w-5" />
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <h3 className="text-base font-semibold text-[#EDEDED]">Export failed</h3>
                    <p className="text-xs text-[#888] leading-relaxed bg-[#1F0D0D]/30 border border-[#EF4444]/10 p-3 rounded text-left font-mono whitespace-pre-wrap">
                      {errorMsg || "Could not access or export this Framer site."}
                    </p>
                  </div>

                  <button
                    onClick={() => setStatus("idle")}
                    className="w-full border border-[#333] hover:border-[#444] text-[#EDEDED] font-semibold text-sm h-10 px-5 rounded-md flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          )}

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 border-t border-[#222] bg-[#0B0B0B] px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal className="space-y-4 mb-12">
            <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
              Process
            </span>
            <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
              Export in three simple steps.
            </h2>
          </ScrollReveal>

          <div className="relative pl-6 md:pl-8 border-l border-dashed border-[#222] space-y-12 py-2">
            {/* Step 1 */}
            <ScrollReveal className="relative">
              <span className="absolute -left-[35px] md:-left-[43px] top-0.5 w-6 h-6 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[10px] font-mono text-[#555] select-none">
                01
              </span>
              <h3 className="text-sm md:text-base font-semibold text-[#EDEDED]">
                Paste your Framer URL
              </h3>
              <p className="text-xs md:text-sm text-[#888] mt-1.5 leading-relaxed">
                Provide your active <span className="font-mono text-[#EDEDED] bg-[#111] px-1 py-0.5 rounded border border-[#222] select-all">.framer.website</span>, <span className="font-mono text-[#EDEDED] bg-[#111] px-1 py-0.5 rounded border border-[#222] select-all">.framer.app</span>, or <span className="font-mono text-[#EDEDED] bg-[#111] px-1 py-0.5 rounded border border-[#222] select-all">.framer.media</span> domain.
              </p>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal className="relative">
              <span className="absolute -left-[35px] md:-left-[43px] top-0.5 w-6 h-6 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[10px] font-mono text-[#555] select-none">
                02
              </span>
              <h3 className="text-sm md:text-base font-semibold text-[#EDEDED]">
                We crawl & package the files
              </h3>
              <p className="text-xs md:text-sm text-[#888] mt-1.5 leading-relaxed">
                Our server spins up a headless browser to render every page of your site, download all assets (images, CSS styles, JS scripts), and package them into a structured directory.
              </p>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal className="relative">
              <span className="absolute -left-[35px] md:-left-[43px] top-0.5 w-6 h-6 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[10px] font-mono text-[#555] select-none">
                03
              </span>
              <h3 className="text-sm md:text-base font-semibold text-[#EDEDED]">
                Download your ZIP archive
              </h3>
              <p className="text-xs md:text-sm text-[#888] mt-1.5 leading-relaxed">
                Download the complete site bundle instantly. You get clean static HTML files, fully structured assets, ready to be uploaded or hosted anywhere.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="py-24 px-4 max-w-4xl mx-auto border-t border-[#222]">
        <ScrollReveal className="text-center space-y-4 mb-16">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            Possibilities
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#EDEDED] tracking-tight">
            What can you do with your exported Framer site?
          </h2>
          <p className="text-xs md:text-sm text-[#888] max-w-sm mx-auto">
            Once you download the static ZIP, you have absolute ownership over your files.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <ScrollReveal className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-4 hover:border-[#333] transition-colors">
            <div className="h-8 w-8 bg-[#1A1A1A] rounded-lg border border-[#333] flex items-center justify-center text-[#EDEDED]">
              <Server className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm md:text-base font-semibold text-[#EDEDED]">Host on Vercel or Netlify</h3>
              <p className="text-xs md:text-sm text-[#888] leading-relaxed">
                Manually drag-and-drop the exported ZIP folder into Vercel, Netlify, or GitHub Pages. Host your static landing page completely for free.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 2 */}
          <ScrollReveal className="bg-[#111] border border-[#22C55E]/20 rounded-xl p-6 space-y-4 hover:border-[#22C55E]/40 transition-colors bg-[#0E1A12]/30 relative overflow-hidden">
            <div className="h-8 w-8 bg-[#0F2318] rounded-lg border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
              <ArrowLeftRight className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm md:text-base font-semibold text-[#EDEDED]">Host on hostfa.st (Automated)</h3>
                <span className="text-[8px] bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] font-bold px-1.5 py-0.5 rounded font-mono select-none uppercase">Recommended</span>
              </div>
              <p className="text-xs md:text-sm text-[#888] leading-relaxed">
                Skip the manual downloads entirely. Hook up your Framer domain to hostfa.st for $3/month and let us auto-deploy updates every time you publish inside Framer.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 3 */}
          <ScrollReveal className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-4 hover:border-[#333] transition-colors">
            <div className="h-8 w-8 bg-[#1A1A1A] rounded-lg border border-[#333] flex items-center justify-center text-[#EDEDED]">
              <Database className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm md:text-base font-semibold text-[#EDEDED]">Backup your sites</h3>
              <p className="text-xs md:text-sm text-[#888] leading-relaxed">
                Maintain safe offline backups of your work. Store the source HTML and assets files on your local hard disk or cloud drive for complete safety.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 4 */}
          <ScrollReveal className="bg-[#111] border border-[#222] rounded-xl p-6 space-y-4 hover:border-[#333] transition-colors">
            <div className="h-8 w-8 bg-[#1A1A1A] rounded-lg border border-[#333] flex items-center justify-center text-[#EDEDED]">
              <Layers className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm md:text-base font-semibold text-[#EDEDED]">Move to another platform</h3>
              <p className="text-xs md:text-sm text-[#888] leading-relaxed">
                Migrate your content to self-hosted servers or integrate Framer designs directly into backend systems (Node, Django, Rails) as static layout templates.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SEO CONTENT SECTION */}
      <section className="py-20 border-t border-[#222] bg-[#0A0A0A] px-4 max-w-3xl mx-auto">
        <ScrollReveal className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
            Why export your Framer site to static HTML?
          </h2>
          
          <p className="text-xs md:text-sm text-[#888] leading-relaxed">
            Framer is a fantastic design editor, but its pricing model can be restrictive for freelance designers, portfolio pages, and simple client websites. When you choose a <span className="text-[#EDEDED]">framer site export</span> approach, you bypass the monthly premium subscription costs required to run a custom domain on Framer. Instead, you can download your layout and host it on highly optimized static platforms.
          </p>

          <p className="text-xs md:text-sm text-[#888] leading-relaxed">
            Using a <span className="text-[#EDEDED]">framer static site generator</span> workflow gives you complete control over your code. Our crawler downloads the exact rendered HTML, minifies CSS, resolves relative assets, and places everything in a clean directory. This allows your pages to load faster than they would when hosted on dynamic server environments, improving SEO rankings and ensuring your site runs perfectly even under high traffic conditions.
          </p>

          <p className="text-xs md:text-sm text-[#888] leading-relaxed">
            If you need to <span className="text-[#EDEDED]">download framer website html</span> for backups or migrations, this tool offers a friction-free solution. No coding or developer setup is needed. Simply paste your link and save. For an even more integrated experience, hostfa.st allows you to bridge the gap: you can design inside the Framer editor for free, and host it on your custom domain with automatic sync for only $3/month.
          </p>

          <div className="pt-4 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#888]">
            <Link href="/" className="text-[#EDEDED] hover:underline flex items-center gap-1">
              Learn more about hostfa.st hosting <ExternalLink className="h-3 w-3" />
            </Link>
            <Link href="/vs/framer" className="text-[#EDEDED] hover:underline flex items-center gap-1">
              Compare Framer hosting costs <ExternalLink className="h-3 w-3" />
            </Link>
            <Link href="/pricing" className="text-[#EDEDED] hover:underline flex items-center gap-1">
              See pricing <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-20 px-4 max-w-2xl mx-auto border-t border-[#222]">
        <ScrollReveal className="space-y-4 mb-10">
          <span className="text-[10px] text-[#555] uppercase tracking-wider font-semibold font-mono">
            FAQ
          </span>
          <h2 className="text-xl md:text-2xl font-semibold text-[#EDEDED] tracking-tight">
            Frequently Asked Questions
          </h2>
        </ScrollReveal>

        <ScrollReveal className="space-y-1">
          <FAQItem
            question="Is this really free?"
            answer="Yes. Our Framer Site Exporter is completely free to use. No account or credit card required. To prevent service abuse, exports are limited to 1 request per IP address per hour."
          />
          <FAQItem
            question="Does it export all pages?"
            answer="Yes. Our crawler is configured to discover internal links and download up to 200 pages per site automatically, including subpages, images, stylesheets, and scripts."
          />
          <FAQItem
            question="Will Framer animations work in the exported file?"
            answer="Yes. Most animations, hover effects, and CSS transitions will function identically because we render the page in a real browser and package the generated frontend assets. Note that dynamic database forms or Framer-native search fields may require platform-specific integrations."
          />
          <FAQItem
            question="Can I host the ZIP anywhere?"
            answer="Absolutely. The exported files are standard HTML, CSS, and JS. You can upload them to Vercel, Netlify, GitHub Pages, Cloudflare Pages, your own cPanel, or hostfa.st."
          />
          <FAQItem
            question="How is this different from hostfa.st paid plans?"
            answer="This tool is a manual, one-time export. If you make changes in Framer, you must download a new ZIP manually. hostfa.st paid plans ($3/month) automate this process: they check for changes in Framer and auto-sync with your custom domain instantly on every publish, with zero manual work."
          />
        </ScrollReveal>
      </section>

      {/* UNIFIED FOOTER */}
      <Footer />
    </div>
  );
}
