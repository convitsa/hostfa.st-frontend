"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe, Check, Copy, Loader2, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/providers/ToastProvider";

function getCleanHost(val: string) {
  const clean = val.trim().toLowerCase();
  let host = clean;
  if (clean.includes("://")) {
    try {
      const url = new URL(clean);
      host = url.hostname;
    } catch {
      return "";
    }
  } else {
    host = clean.split("/")[0].split("?")[0].split("#")[0];
  }
  return host;
}

function isValidFramerUrl(val: string) {
  const host = getCleanHost(val);
  return (
    host.endsWith(".framer.website") ||
    host.endsWith(".framer.app") ||
    host.endsWith(".framer.media")
  );
}

function isValidDomain(val: string) {
  return /^[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/.test(val);
}

function NewSiteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const checkoutParam = searchParams.get("checkout");

  // Input states
  const [framerUrl, setFramerUrl] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  // UI state
  const [isCopied, setIsCopied] = useState(false);
  const [showDnsInstructions, setShowDnsInstructions] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);

  // 1. Fetch user data (for plan type)
  const { data: user, isLoading: userLoading } = useQuery<any>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
  });

  // 2. Fetch sites count
  const { data: sites, isLoading: sitesLoading } = useQuery<any[]>({
    queryKey: ["sites"],
    queryFn: async () => {
      const res = await api.get("/sites/");
      return res.data;
    },
  });

  // 3. Create site mutation
  const createSiteMutation = useMutation({
    mutationFn: async (data: { framer_url: string; custom_domain: string }) => {
      const res = await api.post("/sites/", data);
      return res.data;
    },
    onSuccess: (newSite) => {
      showToast("Site added and queued for crawling!");
      sessionStorage.removeItem("pending_framer_url");
      sessionStorage.removeItem("pending_custom_domain");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      router.push(`/sites/${newSite.id}`);
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to add site. Plan limit reached.", "error");
    },
  });

  // 4. Upgrade plan mutation
  const checkoutMutation = useMutation({
    mutationFn: async (targetPlan: string) => {
      setUpgradingPlan(targetPlan);
      // Store current form inputs to restore on return
      sessionStorage.setItem("pending_framer_url", framerUrl.startsWith("http") ? framerUrl : `https://${framerUrl}`);
      sessionStorage.setItem("pending_custom_domain", customDomain);

      const res = await api.post("/billing/checkout", {
        plan: targetPlan,
        interval: billingCycle,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        showToast("Mock Stripe Upgrade successfully completed!");
        setUpgradingPlan(null);
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        // Retrieve and create directly if mock
        createSiteMutation.mutate({
          framer_url: framerUrl.startsWith("http") ? framerUrl : `https://${framerUrl}`,
          custom_domain: customDomain,
        });
      }
    },
    onError: (err: Error) => {
      showToast(err.message || "Upgrade checkout failed.", "error");
      setUpgradingPlan(null);
    },
  });

  // Resume site creation on checkout success parameter
  useEffect(() => {
    if (checkoutParam === "success") {
      const pendingUrl = sessionStorage.getItem("pending_framer_url");
      const pendingDomain = sessionStorage.getItem("pending_custom_domain");
      if (pendingUrl && pendingDomain) {
        createSiteMutation.mutate({
          framer_url: pendingUrl,
          custom_domain: pendingDomain,
        });
      }
    }
  }, [checkoutParam]);

  const handleCopyCNAME = () => {
    navigator.clipboard.writeText("cname.hostfa.st");
    setIsCopied(true);
    showToast("CNAME copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidFramerUrl(framerUrl)) {
      showToast("Please enter a valid Framer URL", "error");
      return;
    }
    if (!isValidDomain(customDomain)) {
      showToast("Please enter a valid domain", "error");
      return;
    }

    createSiteMutation.mutate({
      framer_url: framerUrl.startsWith("http") ? framerUrl : `https://${framerUrl}`,
      custom_domain: customDomain,
    });
  };

  if (userLoading || sitesLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20 gap-3 animate-fade-mount select-none">
        <Loader2 className="animate-spin h-6 w-6 text-[#888]" />
        <span className="text-sm text-[#888]">Checking plan limitations...</span>
      </div>
    );
  }

  const currentPlan = user?.plan || "starter";
  const sitesCount = sites?.length || 0;

  const planLimits = {
    starter: 1,
    pro: 3,
    scale: 10,
  };

  const limit = planLimits[currentPlan as keyof typeof planLimits] || 1;
  const isLimitReached = sitesCount >= limit;

  return (
    <div className="flex-1 flex flex-col max-w-lg mx-auto w-full py-8 md:py-12 select-none animate-fade-mount">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard" className="text-xs text-[#555] hover:text-[#888] inline-flex items-center gap-1 mb-2.5 transition-colors">
          <ArrowLeft size={12} />
          Back to Dashboard
        </Link>
        <h1 className="text-xl font-semibold text-[#EDEDED]">Add a new site</h1>
        <p className="text-sm text-[#888] mt-1">Deploy another Framer site to a custom domain.</p>
      </div>

      {/* Upsell Banner for reached limit cases */}
      {isLimitReached && (
        <div className="bg-[#111] border border-[#EAB308]/30 rounded-lg p-5 mb-6 space-y-4">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="text-[#EAB308] mt-0.5 shrink-0" size={16} />
            <div className="space-y-1">
              <span className="text-sm font-medium text-[#EDEDED] block">
                You&apos;ve used all {limit} sites on your {currentPlan} plan.
              </span>
              <p className="text-xs text-[#888]">Upgrade to add more sites.</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#222] pt-4.5">
            <span className="text-xs text-[#EDEDED] font-semibold">Choose subscription cycle</span>
            <div className="flex items-center bg-[#0A0A0A] border border-[#222] rounded-full p-0.5">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`text-[10px] font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer ${billingCycle === "monthly" ? "bg-[#1A1A1A] text-[#EDEDED]" : "text-[#555] hover:text-[#888]"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`relative text-[10px] font-semibold px-3 py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer ${billingCycle === "annual" ? "bg-[#1A1A1A] text-[#EDEDED]" : "text-[#555] hover:text-[#888]"
                  }`}
              >
                <span>Annual</span>
                <span className="bg-[#22C55E] text-[#0A0A0A] text-[8px] px-1 py-0.5 rounded-full font-bold scale-90">
                  Save 2 months
                </span>
              </button>
            </div>
          </div>

          {/* Dynamic Upgrade Cards */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentPlan === "starter" && (
              <>
                <Card hoverable={false} className="p-4 bg-[#0A0A0A] border-[#222] flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-[#EDEDED] uppercase tracking-wider block">Pro plan</span>
                    <span className="text-sm font-bold text-[#22C55E]">
                      {billingCycle === "annual" ? "$6.50" : "$8.00"}/mo
                    </span>
                    <span className="text-[10px] text-[#555] block">Hosting cap: 3 sites</span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs cursor-pointer h-8.5"
                    loading={upgradingPlan === "pro" && checkoutMutation.isPending}
                    onClick={() => checkoutMutation.mutate("pro")}
                  >
                    Upgrade to Pro
                  </Button>
                </Card>

                <Card hoverable={false} className="p-4 bg-[#0A0A0A] border-[#222] flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-[#EDEDED] uppercase tracking-wider block">Scale plan</span>
                    <span className="text-sm font-bold text-[#22C55E]">
                      {billingCycle === "annual" ? "$13.33" : "$19.00"}/mo
                    </span>
                    <span className="text-[10px] text-[#555] block">Hosting cap: 10 sites</span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs cursor-pointer h-8.5"
                    loading={upgradingPlan === "scale" && checkoutMutation.isPending}
                    onClick={() => checkoutMutation.mutate("scale")}
                  >
                    Upgrade to Scale
                  </Button>
                </Card>
              </>
            )}

            {currentPlan === "pro" && (
              <Card hoverable={false} className="p-4 bg-[#0A0A0A] border-[#222] flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-[#EDEDED] uppercase tracking-wider block">Scale plan</span>
                  <span className="text-sm font-bold text-[#22C55E]">
                    {billingCycle === "annual" ? "$13.33" : "$19.00"}/mo
                  </span>
                  <span className="text-[10px] text-[#555] block">Hosting cap: 10 sites</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs cursor-pointer h-8.5"
                  loading={upgradingPlan === "scale" && checkoutMutation.isPending}
                  onClick={() => checkoutMutation.mutate("scale")}
                >
                  Upgrade to Scale
                </Button>
              </Card>
            )}

            {currentPlan === "scale" && (
              <div className="text-center py-2">
                <span className="text-xs text-[#888]">
                  Need enterprise hosting limits?{" "}
                  <a href="mailto:support@hostfa.st" className="text-[#EDEDED] underline">
                    Contact us for enterprise
                  </a>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Single Page Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Framer URL input */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-[#888] font-medium block">
            Framer URL
          </label>
          <div
            className={`flex rounded-md bg-[#111] border items-center h-8.5 transition-all overflow-hidden ${isLimitReached ? "opacity-50 pointer-events-none" : ""
              } ${framerUrl === ""
                ? "border-[#222] focus-within:border-[#444]"
                : isValidFramerUrl(framerUrl)
                  ? "border-[#22C55E]/50 focus-within:border-[#22C55E]"
                  : "border-[#EF4444]/50 focus-within:border-[#EF4444]"
              }`}
          >
            <span className="text-xs text-[#555] px-3 h-full flex items-center bg-[#0C0C0C]">
              https://
            </span>
            <input
              type="text"
              placeholder="mysite.framer.website"
              className="w-full bg-transparent text-[#EDEDED] placeholder-[#555] px-3 focus:outline-none text-sm h-full"
              value={framerUrl}
              onChange={(e) => setFramerUrl(e.target.value)}
              disabled={isLimitReached}
            />
            {isValidFramerUrl(framerUrl) && (
              <Check size={14} className="text-[#22C55E] mr-3 shrink-0" />
            )}
          </div>
          {framerUrl !== "" && !isValidFramerUrl(framerUrl) && (
            <span className="text-xs text-[#EF4444] block">
              URL must end with .framer.website, .framer.app, or .framer.media
            </span>
          )}
        </div>

        {/* Custom Domain input */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-[#888] font-medium block">
            Custom Domain
          </label>
          <input
            type="text"
            placeholder="e.g. mydomain.com"
            className={`w-full bg-[#111] border text-[#EDEDED] placeholder-[#555] focus:outline-none focus:ring-0 h-9 px-3 text-sm rounded-md transition-all ${isLimitReached ? "opacity-50 pointer-events-none" : ""
              } ${customDomain !== "" && !isValidDomain(customDomain)
                ? "border-[#EF4444]/50 focus:border-[#EF4444]"
                : "border-[#222] focus:border-[#444]"
              }`}
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            disabled={isLimitReached}
          />
          {customDomain !== "" && !isValidDomain(customDomain) && (
            <span className="text-xs text-[#EF4444] block">Please enter a valid domain.</span>
          )}
        </div>

        {/* Collapsible DNS record instructions */}
        <div className="space-y-2 select-none">
          <button
            type="button"
            onClick={() => setShowDnsInstructions(!showDnsInstructions)}
            className="text-xs text-[#888] hover:text-[#EDEDED] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{showDnsInstructions ? "Hide" : "Show"} CNAME setup instructions</span>
          </button>

          {showDnsInstructions && (
            <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-4 space-y-3 animate-fade-mount select-none">
              <span className="text-xs font-medium text-[#888] block">
                You&apos;ll add this CNAME record at your registrar:
              </span>
              <div className="border border-[#222] rounded overflow-hidden">
                <table className="w-full text-left text-[11px] border-collapse font-mono text-[#888]">
                  <thead>
                    <tr className="bg-[#111] border-b border-[#222]">
                      <th className="px-3 py-1.5 font-semibold text-[#555]">Type</th>
                      <th className="px-3 py-1.5 font-semibold text-[#555]">Name</th>
                      <th className="px-3 py-1.5 font-semibold text-[#555]">Value</th>
                      <th className="px-3 py-1.5 font-semibold text-[#555]">TTL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="h-8">
                      <td className="px-3 py-1 text-[#EDEDED]">CNAME</td>
                      <td className="px-3 py-1 text-[#EDEDED]">@</td>
                      <td className="px-3 py-1 text-[#22C55E] flex items-center justify-between gap-1 select-all">
                        <span>hostfa.st</span>
                        <button
                          type="button"
                          onClick={handleCopyCNAME}
                          className="p-0.5 text-[#555] hover:text-[#EDEDED] transition-colors cursor-pointer"
                        >
                          {isCopied ? <Check size={10} className="text-[#22C55E]" /> : <Copy size={10} />}
                        </button>
                      </td>
                      <td className="px-3 py-1">Auto</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Submit action slots */}
        {isLimitReached ? (
          <div className="space-y-2">
            <Button
              type="button"
              variant="secondary"
              className="w-full h-9.5 opacity-50 cursor-not-allowed text-xs"
              disabled
            >
              Submit
            </Button>
            <p className="text-center text-[10px] text-[#555] select-none leading-none">
              You can add this site after upgrading.
            </p>
          </div>
        ) : (
          <Button
            type="submit"
            variant="primary"
            className="w-full h-9.5 cursor-pointer text-xs flex items-center justify-center gap-1.5"
            disabled={!isValidFramerUrl(framerUrl) || !isValidDomain(customDomain) || createSiteMutation.isPending}
            loading={createSiteMutation.isPending}
          >
            <span>Submit</span>
            <ArrowRight size={14} />
          </Button>
        )}
      </form>
    </div>
  );
}

export default function NewSitePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex justify-center items-center">
          <Loader2 className="animate-spin h-6 w-6 text-[#888]" />
        </div>
      }
    >
      <NewSiteForm />
    </React.Suspense>
  );
}
