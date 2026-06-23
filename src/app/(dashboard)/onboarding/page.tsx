/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Globe,
  Check,
  Copy,
  Loader2,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  X
} from "lucide-react";


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

function CopyableCell({ value, label, showToast }: { value: string; label: string; showToast: any }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    showToast(`${label} copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <td
      onClick={handleCopy}
      className="px-3 py-2 text-[#EDEDED] relative group cursor-pointer hover:bg-[#151515] transition-colors"
      title={`Click to copy ${label}`}
    >
      <div className="flex items-center justify-between gap-1">
        <span>{value}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-[#555] hover:text-[#EDEDED] shrink-0">
          {copied ? <Check size={10} className="text-[#22C55E]" /> : <Copy size={10} />}
        </span>
      </div>
    </td>
  );
}

function OnboardingForm() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const checkoutParam = searchParams.get("checkout");

  // Step state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [framerUrl, setFramerUrl] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "scale">("starter");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  // Step 2 Redesign States
  const [isDomainVerified, setIsDomainVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const continueBtnRef = useRef<HTMLButtonElement>(null);


  const [isCheckoutRedirecting, setIsCheckoutRedirecting] = useState(false);
  const [createdSiteId, setCreatedSiteId] = useState<string | null>(null);
  const [confettiPieces, setConfettiPieces] = useState<{ id: number; left: number; delay: number; color: string }[]>([]);

  // Fetch current user and sites count to enforce onboarding restrictions
  const { data: user } = useQuery<any>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
  });

  const { data: sites } = useQuery<any[]>({
    queryKey: ["sites"],
    queryFn: async () => {
      const res = await api.get("/sites/");
      return res.data;
    },
  });

  // Redirect logic if onboarding already completed or user has sites
  useEffect(() => {
    if (user && sites) {
      if (user.onboarding_complete || sites.length > 0) {
        if (!checkoutParam) {
          router.replace("/dashboard");
        }
      }
    }
  }, [user, sites, checkoutParam, router]);

  // Check for checkout parameter
  useEffect(() => {
    if (checkoutParam === "success") {
      setStep(4);
      // Retrieve stored url & domain to trigger site creation
      const pendingUrl = sessionStorage.getItem("pending_framer_url");
      const pendingDomain = sessionStorage.getItem("pending_custom_domain");
      if (pendingUrl && pendingDomain) {
        createSiteMutation.mutate({
          framer_url: pendingUrl,
          custom_domain: pendingDomain,
        });
      }
    } else if (checkoutParam === "cancelled") {
      showToast("Checkout cancelled. Please pick a plan.", "error");
      setStep(3);
      router.replace("/onboarding");
    }
  }, [checkoutParam]);

  // Mutation to create site after returning from checkout
  const createSiteMutation = useMutation({
    mutationFn: async (data: { framer_url: string; custom_domain: string }) => {
      const res = await api.post("/sites/", data);
      return res.data;
    },
    onSuccess: (data) => {
      setCreatedSiteId(data.id);
      showToast("Payment confirmed! Creating your site...");
      sessionStorage.removeItem("pending_framer_url");
      sessionStorage.removeItem("pending_custom_domain");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to create site document.", "error");
    },
  });

  // Mutation to complete onboarding flag on backend
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      const res = await api.patch("/auth/me/onboarding");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  // Stripe Checkout redirection
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      setIsCheckoutRedirecting(true);
      // Save details to sessionStorage
      sessionStorage.setItem("pending_framer_url", framerUrl.startsWith("http") ? framerUrl : `https://${framerUrl}`);
      sessionStorage.setItem("pending_custom_domain", customDomain);

      const res = await api.post("/billing/checkout", {
        plan: selectedPlan,
        interval: billingCycle,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        // Sandbox fallback
        showToast("Mock Stripe Checkout successfully completed!");
        setIsCheckoutRedirecting(false);
        setStep(4);
        createSiteMutation.mutate({
          framer_url: framerUrl.startsWith("http") ? framerUrl : `https://${framerUrl}`,
          custom_domain: customDomain,
        });
      }
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to initialize checkout session", "error");
      setIsCheckoutRedirecting(false);
    },
  });

  // Query to poll site deployment status in step 4
  const { data: polledSites } = useQuery<any[]>({
    queryKey: ["polledSites"],
    queryFn: async () => {
      const res = await api.get("/sites/");
      return res.data;
    },
    refetchInterval: (query) => {
      const siteList = query.state.data as any[] | undefined;
      const targetSite = siteList?.find((s) => s.id === createdSiteId || s.custom_domain === customDomain);
      if (targetSite && targetSite.status === "live") {
        return false;
      }
      return step === 4 ? 5000 : false;
    },
    enabled: step === 4,
  });

  const activeSite = polledSites?.find((s) => s.id === createdSiteId || s.custom_domain === customDomain);
  const deploymentStatus = activeSite?.status || "pending"; // pending, deploying, live, error

  // Complete onboarding once site is live
  useEffect(() => {
    if (deploymentStatus === "live" && user && !user.onboarding_complete) {
      completeOnboardingMutation.mutate();
      generateConfetti();
    }
  }, [deploymentStatus, user]);

  const generateConfetti = () => {
    const colors = ["#22C55E", "#3B82F6", "#EAB308", "#A855F7", "#EC4899"];
    const pieces = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfettiPieces(pieces);
  };

  const handleCopyAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = "Type: CNAME\nName: @\nValue: hostfa.st\nTTL: Auto";
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    showToast("All DNS details copied to clipboard");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleVerifyDNS = async () => {
    if (!customDomain || !isValidDomain(customDomain)) return;
    setIsVerifying(true);
    setVerificationError(null);
    try {
      const response = await api.post("/sites/verify-dns", { domain: customDomain });
      if (response.data?.verified) {
        setIsDomainVerified(true);
        setShowConfetti(true);
        setFailedAttempts(0);
        showToast("DNS record verified successfully!");
        setTimeout(() => setShowConfetti(false), 2000);
      } else {
        const reason = response.data?.reason || "CNAME record not found";
        setVerificationError(reason);
        setFailedAttempts((prev) => prev + 1);
      }
    } catch (err: any) {
      const message = err.message || "Failed to contact verification server";
      setVerificationError(message);
      setFailedAttempts((prev) => prev + 1);
    } finally {
      setIsVerifying(false);
    }
  };

  const confettiDots = [
    { tx: "-45px", ty: "-75px", color: "#22C55E" },
    { tx: "-15px", ty: "-95px", color: "#3B82F6" },
    { tx: "15px", ty: "-95px", color: "#EAB308" },
    { tx: "45px", ty: "-75px", color: "#EC4899" },
    { tx: "-30px", ty: "-60px", color: "#A855F7" },
    { tx: "30px", ty: "-60px", color: "#F97316" },
  ];

  useEffect(() => {
    if (step === 2 && isDomainVerified) {
      const timer = setTimeout(() => {
        continueBtnRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [step, isDomainVerified]);

  const stepLabels = [
    "Add your Framer site",
    "Connect your domain",
    "Choose your plan",
    "You're all set!",
  ];


  const getStepTitle = () => {
    if (step === 2) {
      if (isVerifying) {
        return <span className="text-[#EAB308]">Verifying...</span>;
      }
      if (isDomainVerified) {
        return <span className="text-[#22C55E]">Domain connected ✓</span>;
      }
      return "Connect domain";
    }
    return stepLabels[step - 1];
  };

  if (isCheckoutRedirecting) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20 gap-4 select-none">
        <Loader2 className="animate-spin text-[#EDEDED]" size={32} />
        <h1 className="text-sm font-medium text-[#EDEDED]">Redirecting to Stripe Checkout...</h1>
        <p className="text-xs text-[#888]">Secure checkout page loading.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full py-8 md:py-12 select-none">
      {/* Confetti Overlay */}
      {deploymentStatus === "live" && (
        <>
          {confettiPieces.map((p) => (
            <div
              key={p.id}
              className="confetti-piece"
              style={{
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                backgroundColor: p.color,
              }}
            />
          ))}
        </>
      )}

      {/* Steps indicators */}
      <div className="w-full flex justify-between items-center mb-3">
        <span className="text-xs font-mono text-[#888] flex items-center gap-1">
          <Globe size={13} />
          <span>hostfa.st / onboarding</span>
        </span>
        <span className="text-xs font-medium text-[#555] flex items-center gap-1">
          <span>Step {step} of 4:</span>
          {getStepTitle()}
        </span>
      </div>


      {/* Progress Bar */}
      <div className="w-full h-0.5 bg-[#222] rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-[#EDEDED] transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <Card hoverable={false} className="w-full bg-[#111] border-[#222] p-6 animate-fade-mount">
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-[#EDEDED]">Where is your Framer site hosted?</h2>
              <p className="text-xs text-[#888]">Paste your Framer URL below. It looks like mysite.framer.website</p>
            </div>

            <div className="space-y-1.5">
              <div
                className={`flex rounded-md bg-[#111] border items-center h-8.5 transition-all overflow-hidden ${framerUrl === ""
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
                  className="w-full bg-transparent text-[#EDEDED] placeholder-[#555] px-3 outline-none border-none text-sm h-full"
                  value={framerUrl}
                  onChange={(e) => setFramerUrl(e.target.value)}
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

              {/* URL Preview Card */}
              {isValidFramerUrl(framerUrl) && (
                <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-3 flex gap-2.5 items-start mt-4 animate-fade-mount select-none">
                  <Globe size={15} className="text-[#888] mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono text-[#22C55E] block truncate">
                      {framerUrl.startsWith("http") ? framerUrl : `https://${framerUrl}`}
                    </span>
                    <span className="text-[10px] text-[#555] block">
                      We&apos;ll automatically deploy this to your domain.
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full flex items-center justify-center gap-1.5 h-9.5 cursor-pointer disabled:opacity-40"
              disabled={!isValidFramerUrl(framerUrl)}
              onClick={() => setStep(2)}
            >
              <span>Continue</span>
              <ChevronRight size={14} />
            </Button>
          </div>
        )}

        {step === 2 && isDomainVerified && (
          <div className="space-y-5">
            <div className="bg-[#0F2318] border border-[#22C55E]/30 rounded-lg p-5 relative overflow-hidden flex flex-col items-center text-center">
              {/* Confetti dot burst */}
              {showConfetti && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {confettiDots.map((dot, idx) => (
                    <span
                      key={idx}
                      className="confetti-dot"
                      style={{
                        backgroundColor: dot.color,
                        ["--tx" as any]: dot.tx,
                        ["--ty" as any]: dot.ty,
                      }}
                    />
                  ))}
                </div>
              )}

              <CheckCircle2 className="text-[#22C55E] mb-3 shrink-0 animate-fade-mount" size={32} />

              <span className="text-base font-medium text-[#EDEDED] block truncate max-w-full font-mono">
                {customDomain}
              </span>
              <span className="text-sm font-medium text-[#22C55E] mt-1">
                DNS verified successfully
              </span>
              <span className="text-xs text-[#555] mt-1">
                Your domain is connected and ready.
              </span>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setIsDomainVerified(false);
                  setCustomDomain("");
                  setFailedAttempts(0);
                  setVerificationError(null);
                  setShowConfetti(false);
                }}
                className="text-xs text-[#555] hover:text-[#EDEDED] underline mx-auto block cursor-pointer transition-colors"
              >
                Change domain
              </button>

              <button
                ref={continueBtnRef}
                className="w-full inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 active:scale-[0.98] outline-none select-none bg-[#EDEDED] text-[#0A0A0A] hover:bg-white flex items-center justify-center gap-1.5 h-9.5 cursor-pointer text-sm"
                onClick={() => setStep(3)}
              >
                <span>Continue to plan selection →</span>
              </button>

            </div>
          </div>
        )}

        {step === 2 && !isDomainVerified && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-[#EDEDED]">Connect your custom domain</h2>
              <p className="text-xs text-[#888]">Add this DNS record to your domain registrar, then click Verify to continue.</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="e.g. mydomain.com"
                className={`w-full bg-[#111] border text-[#EDEDED] placeholder-[#555] focus:outline-none focus:ring-0 h-9 px-3 text-sm rounded-md transition-all ${customDomain !== "" && !isValidDomain(customDomain)
                  ? "border-[#EF4444]/50 focus:border-[#EF4444]"
                  : "border-[#222] focus:border-[#444]"
                  }`}
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
              />
              {customDomain !== "" && !isValidDomain(customDomain) && (
                <span className="text-xs text-[#EF4444] block">Please enter a valid domain.</span>
              )}

              {/* Sub-state 1: DNS instructions & verify/error logic */}
              {customDomain.trim() !== "" && (
                <div className="space-y-4 animate-fade-mount">
                  <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-5 space-y-4 select-none relative">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#555] uppercase tracking-wider">
                        Add this record to your DNS provider
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyAll}
                        className="text-[10px] text-[#555] hover:text-[#EDEDED] flex items-center gap-1 border border-[#222] bg-[#111] hover:bg-[#1A1A1A] px-2 py-1 rounded transition-colors cursor-pointer"
                      >
                        {copiedAll ? <Check size={10} className="text-[#22C55E]" /> : <Copy size={10} />}
                        <span>{copiedAll ? "Copied!" : "Copy all"}</span>
                      </button>
                    </div>

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
                            <CopyableCell value="CNAME" label="Type" showToast={showToast} />
                            <CopyableCell value="@" label="Name" showToast={showToast} />
                            <CopyableCell value="hostfa.st" label="Value" showToast={showToast} />
                            <CopyableCell value="Auto" label="TTL" showToast={showToast} />
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <p className="text-xs text-[#555] mt-1">
                      Works with Cloudflare, GoDaddy, Namecheap, Google Domains, and all major DNS providers.
                    </p>
                  </div>

                  {/* Verify DNS primary button */}
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-1.5 h-9.5 cursor-pointer mt-2 animate-slide-in btn-active-scale"
                    onClick={handleVerifyDNS}
                    disabled={isVerifying || !isValidDomain(customDomain)}
                    loading={isVerifying}
                  >
                    {isVerifying ? "Checking DNS..." : "Verify DNS"}
                  </Button>

                  {isVerifying && (
                    <p className="text-xs text-[#555] text-center mt-2 leading-normal">
                      This usually takes a few seconds. If you just added the record, wait 1-2 minutes and try again.
                    </p>
                  )}

                  {/* Error state card if verification failed */}
                  {verificationError && !isVerifying && (
                    <div className="space-y-4">
                      <div className="border border-[#EF4444]/30 bg-[#1F0D0D] rounded-lg p-5 select-none animate-fade-mount">
                        <div className="flex items-center gap-2">
                          <X className="text-[#EF4444]" size={20} />
                          <span className="text-sm font-medium text-[#EF4444]">
                            DNS record not found for {customDomain}
                          </span>
                        </div>
                        
                        <div className="text-[11px] text-[#888] mt-2 block font-mono">
                          Reason: {verificationError}
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-[#EF4444]/10">
                          <span className="text-xs font-semibold text-[#888] block mb-2">Troubleshooting tips:</span>
                          <ul className="text-xs text-[#555] space-y-1">
                            <li>• Make sure you added a CNAME record, not an A record</li>
                            <li>• The Name field should be @ or your root domain</li>
                            <li>• The Value field should be exactly: hostfa.st</li>
                            <li>• DNS changes can take up to 10 minutes to propagate</li>
                          </ul>
                        </div>
                      </div>

                      {failedAttempts >= 5 ? (
                        <div className="text-xs text-[#555] text-center mt-3">
                          Still having trouble? Contact us at{" "}
                          <a href="mailto:hello@hostfa.st" className="underline text-[#EDEDED] hover:text-white">
                            hello@hostfa.st
                          </a>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 mt-3">
                          <Button
                            variant="secondary"
                            className="w-full h-9.5 cursor-pointer btn-active-scale"
                            onClick={handleVerifyDNS}
                            disabled={isVerifying || !isValidDomain(customDomain)}
                          >
                            Try again
                          </Button>
                          <span className="text-xs text-[#555]">
                            Attempt {failedAttempts + 1} of 5
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1 h-9.5 cursor-pointer" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
          </div>
        )}


        {step === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-medium text-[#EDEDED] mb-0.5">Pick a plan to get started</h2>
                <p className="text-xs text-[#888]">Choose a pricing plan to active custom hosting.</p>
              </div>

              {/* Monthly Annual toggle switcher */}
              <div className="flex items-center bg-[#0A0A0A] border border-[#222] rounded-full p-0.5 shrink-0">
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

            {/* Plan selection grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: "starter",
                  name: "Starter",
                  price: billingCycle === "annual" ? "$2.50" : "$3.00",
                  popular: false,
                  features: ["1 site cap", "Custom Domain", "SSL Certification", "Auto-sync (10 min)"],
                },
                {
                  id: "pro",
                  name: "Pro",
                  price: billingCycle === "annual" ? "$6.50" : "$8.00",
                  popular: true,
                  features: ["3 sites cap", "Full Analytics", "Email alerts", "Auto-sync (5 min)"],
                },
                {
                  id: "scale",
                  name: "Scale",
                  price: billingCycle === "annual" ? "$13.33" : "$19.00",
                  popular: false,
                  features: ["10 sites cap", "Auto-sync (1 min)", "Webflow support", "White-labeling"],
                },
              ].map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id as any)}
                    className={`relative border rounded-lg p-4 cursor-pointer flex flex-col justify-between transition bg-[#0A0A0A] ${isSelected ? "border-[#EDEDED]" : "border-[#222] hover:border-[#333]"
                      }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 right-3 text-[8px] font-bold bg-[#EDEDED] text-[#0A0A0A] px-2 py-0.5 rounded-full select-none">
                        POPULAR
                      </span>
                    )}
                    <div>
                      <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wide">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-0.5 mt-1">
                        <span className="text-xl font-semibold text-[#EDEDED]">{plan.price}</span>
                        <span className="text-[10px] text-[#555]">/mo</span>
                      </div>
                      <span className="text-[8px] text-[#555] block -mt-0.5">
                        {billingCycle === "annual" ? "billed annually" : "billed monthly"}
                      </span>
                    </div>
                    <ul className="text-[9px] text-[#888] space-y-1 mt-4 border-t border-[#1C1C1C] pt-3">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="w-0.5 h-0.5 rounded-full bg-[#EDEDED]" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1 h-9.5 cursor-pointer" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                variant="primary"
                className="flex-1 h-9.5 cursor-pointer"
                onClick={() => checkoutMutation.mutate()}
                loading={checkoutMutation.isPending}
              >
                Continue to payment
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center py-4 select-none">
            <div className="space-y-1.5">
              <h2 className="text-lg font-medium text-[#EDEDED]">Welcome to hostfa.st 🎉</h2>
              <p className="text-xs text-[#888]">Your site is being deployed now.</p>
            </div>

            {/* Live-updating status card */}
            <Card hoverable={false} className="max-w-sm mx-auto p-4 bg-[#0A0A0A] border-[#222]">
              <div className="flex flex-col items-center gap-3">
                {deploymentStatus === "live" ? (
                  <CheckCircle2 size={36} className="text-[#22C55E]" />
                ) : deploymentStatus === "error" ? (
                  <div className="w-9 h-9 rounded-full bg-[#1F0D0D] border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444] text-xs font-semibold">✗</div>
                ) : (
                  <Loader2 className="animate-spin text-[#EAB308]" size={32} />
                )}

                <div className="space-y-1">
                  <span className="text-xs text-[#888] font-medium uppercase tracking-wider block">
                    Deployment Status
                  </span>
                  <span className={`text-sm font-semibold capitalize ${deploymentStatus === "live" ? "text-[#22C55E]" : deploymentStatus === "error" ? "text-[#EF4444]" : "text-[#EAB308]"
                    }`}>
                    {deploymentStatus === "pending" ? "Queued" : deploymentStatus === "deploying" ? "Crawling & Deploying" : deploymentStatus}
                  </span>
                </div>

                {/* Progress bar animating */}
                {deploymentStatus !== "live" && deploymentStatus !== "error" && (
                  <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-[#EAB308] h-full rounded-full animate-pulse w-2/3 transition-all duration-1000" />
                  </div>
                )}
              </div>
            </Card>

            {deploymentStatus === "live" && (
              <div className="space-y-4 pt-2 animate-fade-mount">
                <span className="text-xs text-[#22C55E] block font-medium">
                  Your site is live at <strong className="font-mono text-[#EDEDED]">{customDomain}</strong>
                </span>
                <div className="flex gap-3 max-w-sm mx-auto">
                  <a
                    href={`https://${customDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-1 text-xs h-9.5 cursor-pointer">
                      <span>Visit site</span>
                      <ExternalLink size={13} />
                    </Button>
                  </a>
                  <Button
                    variant="primary"
                    className="flex-1 text-xs h-9.5 cursor-pointer"
                    onClick={() => router.push("/dashboard")}
                  >
                    Go to dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex justify-center items-center">
          <Loader2 className="animate-spin h-6 w-6 text-[#888]" />
        </div>
      }
    >
      <OnboardingForm />
    </React.Suspense>
  );
}
