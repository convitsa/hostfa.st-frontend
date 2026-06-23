"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ArrowRight,
  Loader2,
  CreditCard,
  Download,
  FileText,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/providers/ToastProvider";
import { BillingSkeleton } from "@/components/ui/Skeletons";

// ── Types ──────────────────────────────────────────────────────────────────
interface UserInfo {
  email: string;
  plan: "starter" | "pro" | "scale";
  is_active: boolean;
}

interface Site {
  id: string;
}

interface SubscriptionDetails {
  plan: string;
  status: string; // "active" | "past_due" | "canceled" | "inactive" | ...
  current_period_end: number | null; // Unix timestamp
  interval: string | null; // "month" | "year"
  cancel_at_period_end: boolean;
}

interface PaymentMethodInfo {
  has_payment_method: boolean;
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
}

interface StripeInvoice {
  id: string;
  date: number; // Unix timestamp
  amount: number; // cents
  currency: string;
  status: string; // "paid" | "open" | "void" | "uncollectible"
  pdf_url: string | null;
  hosted_url: string | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function formatUnixDate(ts: number, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...opts,
  });
}

function cardBrandLabel(brand: string): string {
  const map: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "American Express",
    discover: "Discover",
    jcb: "JCB",
    unionpay: "UnionPay",
    diners: "Diners Club",
  };
  return map[brand?.toLowerCase()] ?? brand ?? "Card";
}

const PLAN_LIMITS: Record<string, number> = { starter: 1, pro: 3, scale: 10 };

// Static pricing matrix (matches Stripe products)
const PLAN_PRICES = {
  starter: { monthly: "$3.00", annual: "$2.50" },
  pro: { monthly: "$8.00", annual: "$6.50" },
  scale: { monthly: "$19.00", annual: "$13.33" },
};

// ── Component ──────────────────────────────────────────────────────────────
export default function BillingPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<string | null>(null);

  const checkoutParam = searchParams.get("checkout");

  // Handle Stripe redirect back
  useEffect(() => {
    if (checkoutParam === "success") {
      showToast("Plan activated! Welcome to hostfa.st 🎉");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["paymentMethod"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      router.replace("/billing");
    } else if (checkoutParam === "cancelled") {
      showToast("Checkout cancelled", "error");
      router.replace("/billing");
    }
  }, [checkoutParam, router, showToast, queryClient]);

  // ── Queries ──────────────────────────────────────────────────────────────

  const { data: user, isLoading: userLoading } = useQuery<UserInfo>({
    queryKey: ["currentUser"],
    queryFn: async () => (await api.get("/auth/me")).data,
  });

  const { data: sites, isLoading: sitesLoading } = useQuery<Site[]>({
    queryKey: ["sites"],
    queryFn: async () => (await api.get("/sites/")).data,
  });

  const { data: subscription, isLoading: subLoading } = useQuery<SubscriptionDetails>({
    queryKey: ["subscription"],
    queryFn: async () => (await api.get("/billing/subscription")).data,
    enabled: !!user,
  });

  const { data: paymentMethod, isLoading: pmLoading } = useQuery<PaymentMethodInfo>({
    queryKey: ["paymentMethod"],
    queryFn: async () => (await api.get("/billing/payment-method")).data,
    enabled: !!user,
  });

  const { data: invoices, isLoading: invoicesLoading } = useQuery<StripeInvoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => (await api.get("/billing/invoices")).data,
    enabled: !!user,
  });

  // ── Mutations ─────────────────────────────────────────────────────────────

  const portalMutation = useMutation({
    mutationFn: async () => (await api.post("/billing/portal", {})).data,
    onSuccess: (data) => {
      if (data.portal_url) {
        showToast("Redirecting to Stripe Billing Portal…");
        window.location.href = data.portal_url;
      }
    },
    onError: (err: Error) => showToast(err.message || "Failed to open billing portal", "error"),
  });

  const checkoutMutation = useMutation({
    mutationFn: async (plan: string) =>
      (await api.post("/billing/checkout", { plan, interval: billingCycle })).data,
    onSuccess: (data) => {
      if (data.checkout_url) {
        showToast("Redirecting to Stripe Checkout…");
        window.location.href = data.checkout_url;
      } else {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        queryClient.invalidateQueries({ queryKey: ["subscription"] });
      }
    },
    onError: (err: Error) => showToast(err.message || "Failed to create checkout session", "error"),
  });

  const handleUpgrade = (plan: string) => {
    setSelectedUpgradePlan(plan);
    checkoutMutation.mutate(plan);
  };

  // ── Derived state ─────────────────────────────────────────────────────────

  const isLoading = userLoading || sitesLoading;
  if (isLoading) return <BillingSkeleton />;

  const currentPlan = (user?.plan ?? "starter") as "starter" | "pro" | "scale";
  const sitesCount = sites?.length ?? 0;
  const limit = PLAN_LIMITS[currentPlan] ?? 1;
  const usagePercentage = Math.min((sitesCount / limit) * 100, 100);
  const isAtLimit = sitesCount >= limit;

  // Subscription card data
  const subStatus = subscription?.status ?? "inactive";
  const isActive = subStatus === "active";
  const subInterval = subscription?.interval; // "month" | "year" | null
  const inferredCycle: "monthly" | "annual" =
    subInterval === "year" ? "annual" : "monthly";
  const planPriceNow =
    PLAN_PRICES[currentPlan]?.[inferredCycle] ??
    PLAN_PRICES[currentPlan]?.monthly ??
    "—";

  let nextBillingStr = "—";
  if (subscription?.cancel_at_period_end) {
    nextBillingStr = subscription.current_period_end
      ? `Cancels ${formatUnixDate(subscription.current_period_end, { month: "short", day: "numeric", year: "numeric" })}`
      : "Cancelling at period end";
  } else if (subscription?.current_period_end) {
    nextBillingStr = formatUnixDate(subscription.current_period_end, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Payment method display
  const hasCard = paymentMethod?.has_payment_method;
  const cardLabel = hasCard
    ? `${cardBrandLabel(paymentMethod?.brand ?? "card")} ···· ${paymentMethod?.last4}`
    : "No payment method";
  const cardExpiry = hasCard
    ? `Exp ${paymentMethod?.exp_month?.toString().padStart(2, "0")}/${paymentMethod?.exp_year}`
    : "";

  // Status badge
  const statusColor: Record<string, string> = {
    active: "text-[#22C55E] bg-[#0F2318] border-[#22C55E]/15",
    past_due: "text-[#EAB308] bg-[#1C1A08] border-[#EAB308]/15",
    canceled: "text-[#888] bg-[#1A1A1A] border-[#333]",
    inactive: "text-[#555] bg-[#111] border-[#222]",
  };
  const statusBadgeClass =
    statusColor[subStatus] ?? "text-[#888] bg-[#1A1A1A] border-[#333]";

  // Pricing for comparison table (uses toggle, not sub interval)
  const tablePrices = {
    starter: billingCycle === "annual" ? "$2.50 / mo" : "$3.00 / mo",
    pro: billingCycle === "annual" ? "$6.50 / mo" : "$8.00 / mo",
    scale: billingCycle === "annual" ? "$13.33 / mo" : "$19.00 / mo",
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-fade-mount select-none">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-semibold text-[#EDEDED]">Billing</h1>
        <p className="text-xs text-[#888] mt-1">
          Manage your subscription, payment method, and invoices.
        </p>
      </div>

      <div className="border-b border-[#222]" />

      {/* ── Top row: subscription + usage ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscription card */}
        <Card hoverable={false} className="p-5 bg-[#111] border-[#222] flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs uppercase tracking-wider text-[#555] font-semibold">
                Subscription
              </h3>
              {subLoading ? (
                <Loader2 size={12} className="animate-spin text-[#555]" />
              ) : (
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusBadgeClass}`}
                >
                  {subStatus}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 mt-2.5">
              <span className="text-2xl font-bold text-[#EDEDED] capitalize">{currentPlan}</span>
              {!subLoading && (
                <span className="text-xs text-[#888] font-mono">
                  ({planPriceNow}/mo · {subInterval === "year" ? "billed annually" : "billed monthly"})
                </span>
              )}
            </div>

            <p className="text-xs text-[#888] mt-3">
              {subLoading ? (
                <span className="inline-block h-3 w-48 bg-[#1A1A1A] rounded animate-pulse" />
              ) : subscription?.cancel_at_period_end ? (
                <span className="text-[#EAB308]">
                  {nextBillingStr}
                </span>
              ) : isActive ? (
                `Next charge: ${planPriceNow} on ${nextBillingStr}`
              ) : (
                "No active subscription"
              )}
            </p>
          </div>

          {/* Payment method row */}
          <div className="flex items-center gap-3 mt-4 border-t border-[#1C1C1C] pt-3.5">
            <CreditCard size={16} className="text-[#555] shrink-0" />
            <div className="flex-1 min-w-0">
              {pmLoading ? (
                <span className="inline-block h-3 w-32 bg-[#1A1A1A] rounded animate-pulse" />
              ) : (
                <>
                  <span className="text-xs text-[#888] block">{cardLabel}</span>
                  {cardExpiry && (
                    <span className="text-[10px] text-[#555] block">{cardExpiry}</span>
                  )}
                </>
              )}
            </div>
            <button
              onClick={() => portalMutation.mutate()}
              disabled={portalMutation.isPending}
              className="text-[10px] text-[#888] hover:text-[#EDEDED] hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
            >
              {portalMutation.isPending ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <ExternalLink size={10} />
              )}
              Manage in Stripe
            </button>
          </div>
        </Card>

        {/* Usage card */}
        <Card hoverable={false} className="p-5 bg-[#111] border-[#222] flex flex-col justify-between min-h-[220px]">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#555] font-semibold mb-1">
              Plan usage
            </h3>
            <div className="flex justify-between items-baseline mt-4">
              <span className="text-2xl font-bold text-[#EDEDED]">
                {sitesCount} / {limit}
              </span>
              <span className="text-xs text-[#888]">sites deployed</span>
            </div>
            <div className="w-full h-1 bg-[#222] rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${isAtLimit ? "bg-[#EAB308]" : "bg-[#22C55E]"}`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>

          <div className="mt-4">
            {isAtLimit ? (
              <div className="flex items-center gap-1.5 text-xs text-[#EAB308] font-medium bg-[#1C1A08] border border-[#EAB308]/20 p-2.5 rounded">
                <AlertTriangle size={14} className="shrink-0" />
                <span>You've reached your plan's site limit. Upgrade to add more.</span>
              </div>
            ) : (
              <p className="text-[11px] text-[#555] leading-normal">
                Subscriptions are managed and billed via Stripe. Changes take effect immediately.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* ── Plan comparison ────────────────────────────────────────────────── */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs uppercase tracking-wider text-[#555] font-semibold">
            Compare plans &amp; pricing
          </h3>
          <div className="flex items-center bg-[#0A0A0A] border border-[#222] rounded-full p-0.5">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`text-[10px] font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                billingCycle === "monthly" ? "bg-[#1A1A1A] text-[#EDEDED]" : "text-[#555] hover:text-[#888]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`text-[10px] font-semibold px-3 py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer ${
                billingCycle === "annual" ? "bg-[#1A1A1A] text-[#EDEDED]" : "text-[#555] hover:text-[#888]"
              }`}
            >
              <span>Annual</span>
              <span className="bg-[#22C55E] text-[#0A0A0A] text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                Save 30%
              </span>
            </button>
          </div>
        </div>

        <div className="border border-[#222] rounded-lg overflow-x-auto bg-[#0A0A0A]">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-[#111] border-b border-[#222] text-[11px] text-[#555] uppercase tracking-wider font-semibold">
                <th className="px-5 py-3">Feature</th>
                <th className="px-5 py-3">Starter</th>
                <th className="px-5 py-3">Pro</th>
                <th className="px-5 py-3">Scale</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-11 border-b border-[#222] text-xs">
                <td className="px-5 py-2 font-medium text-[#EDEDED]">Price</td>
                <td className="px-5 py-2 text-[#888]">{tablePrices.starter}</td>
                <td className="px-5 py-2 text-[#888]">{tablePrices.pro}</td>
                <td className="px-5 py-2 text-[#888]">{tablePrices.scale}</td>
              </tr>
              <tr className="h-11 border-b border-[#222] text-xs">
                <td className="px-5 py-2 font-medium text-[#EDEDED]">Sites</td>
                <td className="px-5 py-2 text-[#888]">1 site</td>
                <td className="px-5 py-2 text-[#888]">3 sites</td>
                <td className="px-5 py-2 text-[#888]">10 sites</td>
              </tr>
              <tr className="h-11 border-b border-[#222] text-xs">
                <td className="px-5 py-2 font-medium text-[#EDEDED]">Analytics</td>
                <td className="px-5 py-2 text-[#888]">Basic</td>
                <td className="px-5 py-2 text-[#888]">Advanced</td>
                <td className="px-5 py-2 text-[#888]">Full Insights</td>
              </tr>
              <tr className="h-11 border-b border-[#222] text-xs">
                <td className="px-5 py-2 font-medium text-[#EDEDED]">Auto-sync</td>
                <td className="px-5 py-2 text-[#888]">10 min</td>
                <td className="px-5 py-2 text-[#888]">5 min</td>
                <td className="px-5 py-2 text-[#888]">1 min</td>
              </tr>
              <tr className="h-11 border-b border-[#222] text-xs">
                <td className="px-5 py-2 font-medium text-[#EDEDED]">Support</td>
                <td className="px-5 py-2 text-[#888]">Community</td>
                <td className="px-5 py-2 text-[#888]">Priority Email</td>
                <td className="px-5 py-2 text-[#888]">24/7 Slack</td>
              </tr>
              <tr className="h-11 border-b border-[#222] text-xs">
                <td className="px-5 py-2 font-medium text-[#EDEDED]">SSL</td>
                <td className="px-5 py-2 text-[#22C55E]"><Check size={14} /></td>
                <td className="px-5 py-2 text-[#22C55E]"><Check size={14} /></td>
                <td className="px-5 py-2 text-[#22C55E]"><Check size={14} /></td>
              </tr>
              <tr className="h-11 text-xs">
                <td className="px-5 py-2 font-medium text-[#EDEDED]">Actions</td>
                {(["starter", "pro", "scale"] as const).map((plan) => (
                  <td key={plan} className="px-5 py-2">
                    {currentPlan === plan ? (
                      <span className="text-[#555] font-medium bg-[#1A1A1A] px-2 py-0.5 rounded text-xs">
                        Active Plan
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(plan)}
                        disabled={checkoutMutation.isPending && selectedUpgradePlan === plan}
                        className="text-[#22C55E] font-medium hover:underline inline-flex items-center gap-0.5 text-xs cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {checkoutMutation.isPending && selectedUpgradePlan === plan ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          <>
                            <span>
                              {plan === "starter" || (plan === "pro" && currentPlan === "scale")
                                ? "Downgrade"
                                : "Upgrade"}
                            </span>
                            <ArrowRight size={10} />
                          </>
                        )}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Invoice history ────────────────────────────────────────────────── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider text-[#555] font-semibold">
            Invoice History
          </h3>
          {invoicesLoading && (
            <Loader2 size={13} className="animate-spin text-[#555]" />
          )}
        </div>

        {invoicesLoading ? (
          <div className="border border-[#222] rounded-lg p-8 text-center bg-[#0A0A0A]">
            <Loader2 size={20} className="animate-spin text-[#333] mx-auto mb-2" />
            <span className="text-xs text-[#555]">Loading invoices…</span>
          </div>
        ) : !invoices || invoices.length === 0 ? (
          <div className="border border-[#222] rounded-lg p-8 text-center bg-[#0A0A0A]">
            <FileText size={24} className="text-[#333] mx-auto mb-2" />
            <span className="text-xs text-[#555]">No invoices yet.</span>
            <p className="text-[10px] text-[#444] mt-1">
              Invoices will appear here after your first billing cycle.
            </p>
          </div>
        ) : (
          <div className="border border-[#222] rounded-lg overflow-x-auto bg-[#0A0A0A]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111] border-b border-[#222] text-[11px] text-[#555] uppercase tracking-wider font-semibold">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="h-11 border-b border-[#222] last:border-0 hover:bg-[#1A1A1A]/30 text-xs"
                  >
                    <td className="px-5 py-2 font-medium text-[#EDEDED]">
                      {formatUnixDate(inv.date, { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-2 text-[#888]">
                      {formatAmount(inv.amount, inv.currency)}
                    </td>
                    <td className="px-5 py-2">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-medium border ${
                          inv.status === "paid"
                            ? "bg-[#0F2318] text-[#22C55E] border-[#22C55E]/10"
                            : inv.status === "open"
                            ? "bg-[#1A1300] text-[#EAB308] border-[#EAB308]/10"
                            : "bg-[#1A1A1A] text-[#888] border-[#333]"
                        }`}
                      >
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-2 text-right">
                      {inv.pdf_url ? (
                        <a
                          href={inv.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#888] hover:text-[#EDEDED] hover:underline"
                        >
                          <Download size={13} />
                          <span>PDF</span>
                        </a>
                      ) : inv.hosted_url ? (
                        <a
                          href={inv.hosted_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#888] hover:text-[#EDEDED] hover:underline"
                        >
                          <ExternalLink size={13} />
                          <span>View</span>
                        </a>
                      ) : (
                        <span className="text-[#444]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
