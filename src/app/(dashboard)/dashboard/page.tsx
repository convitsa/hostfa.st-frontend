"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Globe, 
  ExternalLink, 
  RotateCw, 
  Settings, 
  Plus, 
  MoreVertical, 
  Copy, 
  Trash2, 
  Check, 
  X, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/providers/ToastProvider";
import { formatRelativeTime, parseDate } from "@/lib/utils";
import { SitesTableSkeleton } from "@/components/ui/Skeletons";
import { ErrorCard } from "@/components/ui/ErrorCard";

interface Site {
  id: string;
  user_id: string;
  framer_url: string;
  custom_domain: string;
  status: "live" | "deploying" | "error" | "pending" | "paused";
  last_polled_at: string | null;
  last_deployed_at: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [welcomeDismissed, setWelcomeDismissed] = useState(true);
  const [deleteSiteId, setDeleteSiteId] = useState<string | null>(null);
  const [deleteSiteDomain, setDeleteSiteDomain] = useState<string>("");
  const [timeTick, setTimeTick] = useState(0);

  // Time ticker to update relative timestamps every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick((tick) => tick + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Check if onboarding welcome checklist is dismissed
  useEffect(() => {
    setWelcomeDismissed(localStorage.getItem("hostfast_dismiss_welcome") === "true");
  }, []);

  // Close active dropdowns on click outside
  useEffect(() => {
    const closeAll = () => setActiveMenu(null);
    window.addEventListener("click", closeAll);
    return () => window.removeEventListener("click", closeAll);
  }, []);

  // Fetch sites with auto-refresh if deploying/pending
  const { data: sites, isLoading, isError } = useQuery<Site[]>({
    queryKey: ["sites"],
    queryFn: async () => {
      const res = await api.get("/sites/");
      return res.data;
    },
    refetchInterval: (query) => {
      const siteList = query.state.data as Site[] | undefined;
      const hasDeploying = siteList?.some(
        (site) => site.status === "deploying" || site.status === "pending"
      );
      return hasDeploying ? 10000 : false;
    },
  });

  // Fetch current user details for active plan display
  const { data: user } = useQuery<any>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
  });

  const triggerDeployMutation = useMutation({
    mutationFn: async (siteId: string) => {
      const res = await api.post(`/sites/${siteId}/deploy`);
      return res.data;
    },
    onSuccess: () => {
      showToast("Redeployment triggered successfully");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to trigger redeployment", "error");
    },
  });

  const deleteSiteMutation = useMutation({
    mutationFn: async (siteId: string) => {
      await api.delete(`/sites/${siteId}`);
    },
    onSuccess: () => {
      showToast("Site deleted successfully");
      setDeleteSiteId(null);
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to delete site", "error");
    },
  });

  if (isLoading) {
    return <SitesTableSkeleton />;
  }

  if (isError) {
    return (
      <ErrorCard 
        message="Failed to load sites database connection." 
        onRetry={() => queryClient.invalidateQueries({ queryKey: ["sites"] })} 
      />
    );
  }

  const hasSites = sites && sites.length > 0;
  const planName = user?.plan || "starter";
  const sitesCount = sites?.length || 0;

  // Last deploy calculator
  const lastDeployTime = hasSites
    ? sites
        .map((s) => s.last_deployed_at)
        .filter(Boolean)
        .sort((a, b) => parseDate(b!).getTime() - parseDate(a!).getTime())[0]
    : null;
  const lastDeployStr = lastDeployTime ? formatRelativeTime(lastDeployTime) : "Never";

  const handleDismissWelcome = () => {
    localStorage.setItem("hostfast_dismiss_welcome", "true");
    setWelcomeDismissed(true);
  };

  const handleCopyDomain = (domain: string) => {
    navigator.clipboard.writeText(domain);
    showToast("Domain copied to clipboard");
  };

  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Welcome Onboarding Checklist */}
      {!hasSites && !welcomeDismissed && (
        <div className="bg-[#111] border border-[#222] rounded-lg p-6 relative animate-fade-mount select-none">
          <button 
            onClick={handleDismissWelcome}
            className="absolute top-4 right-4 text-[#555] hover:text-[#EDEDED] transition-colors p-1 rounded-md"
            title="Dismiss Welcome Checklist"
          >
            <X size={16} />
          </button>

          <h2 className="text-base font-semibold text-[#EDEDED] mb-1">Welcome to hostfa.st!</h2>
          <p className="text-xs text-[#888] mb-6">Complete these quick steps to get your first Framer site online.</p>

          <div className="space-y-3.5 max-w-md">
            <Link 
              href="/sites/new" 
              className="flex items-center justify-between p-3 bg-[#0A0A0A] border border-[#222] rounded-md hover:border-[#444] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border border-[#333] flex items-center justify-center text-xs text-[#555]">1</div>
                <span className="text-xs font-medium text-[#EDEDED]">Add your first site</span>
              </div>
              <ArrowRight size={14} className="text-[#555] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#222]/50 rounded-md opacity-60">
              <div className="w-5 h-5 rounded-full border border-[#222] flex items-center justify-center text-xs text-[#555]">2</div>
              <span className="text-xs font-medium text-[#888]">Connect your custom domain</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#222]/50 rounded-md opacity-60">
              <div className="w-5 h-5 rounded-full border border-[#222] flex items-center justify-center text-xs text-[#555]">3</div>
              <span className="text-xs font-medium text-[#888]">Verify DNS</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#222]/50 rounded-md opacity-60">
              <div className="w-5 h-5 rounded-full border border-[#222] flex items-center justify-center text-xs text-[#555]">4</div>
              <span className="text-xs font-medium text-[#888]">Your site is live!</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111] border border-[#222] rounded-lg p-4 flex flex-col justify-between select-none">
          <span className="text-xs text-[#555] font-medium uppercase tracking-wider">Total Sites</span>
          <div className="mt-2.5 flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-[#EDEDED]">{sitesCount}</span>
            <span className="text-xs text-[#555]">sites hosted</span>
          </div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-lg p-4 flex flex-col justify-between select-none">
          <span className="text-xs text-[#555] font-medium uppercase tracking-wider">Last Deploy</span>
          <div className="mt-2.5 flex items-baseline gap-1">
            <span className="text-xl font-semibold text-[#EDEDED] truncate max-w-full" title={lastDeployStr}>
              {lastDeployStr}
            </span>
          </div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-lg p-4 flex flex-col justify-between select-none">
          <span className="text-xs text-[#555] font-medium uppercase tracking-wider">Plan</span>
          <div className="mt-2.5 flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-[#EDEDED] capitalize flex items-center gap-1.5">
              <span>{planName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            </span>
            {planName === "starter" && (
              <Link href="/billing" className="text-[10px] text-[#22C55E] hover:underline font-medium mt-1">
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#EDEDED]">Sites</h1>
        {hasSites && (
          <Link href="/sites/new">
            <Button variant="primary" size="sm" className="flex items-center gap-1.5 h-9 cursor-pointer">
              <Plus size={14} />
              <span>Add Site</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Sites Listing */}
      {!hasSites ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-[#222] rounded-lg py-20 px-4 text-center animate-border-pulse">
          <div className="w-12 h-12 rounded-full bg-[#111] border border-[#222] flex items-center justify-center mb-4 text-[#555]">
            <Globe size={20} />
          </div>
          <h2 className="text-sm font-medium text-[#EDEDED] mb-1">No sites added yet</h2>
          <p className="text-xs text-[#555] mb-5 max-w-sm leading-relaxed">
            Add your Framer site URL and we&apos;ll deploy it to your custom domain in minutes.
          </p>
          <Link href="/sites/new">
            <Button variant="secondary" size="sm" className="flex items-center gap-1.5 cursor-pointer">
              <Plus size={14} />
              <span>Add your first site</span>
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block border border-[#222] rounded-lg overflow-visible bg-[#0A0A0A]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111] border-b border-[#222] text-[11px] text-[#555] uppercase tracking-wider font-semibold select-none">
                  <th className="px-5 py-3 rounded-tl-lg">Domain</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Sync Status</th>
                  <th className="px-5 py-3">Last Deploy</th>
                  <th className="px-5 py-3 text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => {
                  const displayName = site.custom_domain || site.framer_url.replace(/^https?:\/\//, "");

                  return (
                    <tr
                      key={site.id}
                      className="h-12 border-b border-[#222] last:border-0 hover:bg-[#111]/40 transition-colors duration-150 text-sm select-none"
                      onMouseEnter={() => router.prefetch(`/sites/${site.id}`)}
                    >
                      <td className="px-5 py-2 font-medium text-[#EDEDED]">
                        <Link href={`/sites/${site.id}`} className="hover:underline">
                          {displayName}
                        </Link>
                        {site.custom_domain && (
                          <div className="text-[10px] text-[#555] font-mono mt-0.5">
                            {site.framer_url}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-2">
                        <Badge status={site.status} />
                      </td>
                      <td className="px-5 py-2 text-xs">
                        {site.last_polled_at ? (
                          <span className="text-[#888]">
                            Synced {formatRelativeTime(site.last_polled_at)}
                          </span>
                        ) : (
                          <span className="text-[#EAB308] font-medium">
                            Pending first sync
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-2 text-[#888]">
                        {formatRelativeTime(site.last_deployed_at)}
                      </td>
                      <td className="px-5 py-2 text-right">
                        <div className="inline-flex gap-1 justify-end">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenu(activeMenu === site.id ? null : site.id);
                              }}
                              className="p-1.5 text-[#888] hover:text-[#EDEDED] rounded hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                              title="Actions Menu"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {activeMenu === site.id && (
                              <div className="absolute right-0 mt-1 w-44 bg-[#111] border border-[#222] rounded-md shadow-lg z-50 text-xs py-1 text-left select-none">
                                <a
                                  href={site.custom_domain ? `https://${site.custom_domain}` : site.framer_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-2 hover:bg-[#1A1A1A] text-[#EDEDED] flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                  <ExternalLink size={13} />
                                  <span>Open in new tab</span>
                                </a>
                                <button
                                  onClick={() => handleCopyDomain(site.custom_domain || site.framer_url)}
                                  className="w-full px-3 py-2 hover:bg-[#1A1A1A] text-[#EDEDED] flex items-center gap-2 text-left cursor-pointer transition-colors"
                                >
                                  <Copy size={13} />
                                  <span>Copy domain</span>
                                </button>
                                <button
                                  onClick={() => triggerDeployMutation.mutate(site.id)}
                                  className="w-full px-3 py-2 hover:bg-[#1A1A1A] text-[#EDEDED] flex items-center gap-2 text-left cursor-pointer transition-colors"
                                >
                                  <RotateCw size={13} className={triggerDeployMutation.isPending ? "animate-spin" : ""} />
                                  <span>Redeploy</span>
                                </button>
                                <Link
                                  href={`/sites/${site.id}`}
                                  className="px-3 py-2 hover:bg-[#1A1A1A] text-[#EDEDED] flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                  <Settings size={13} />
                                  <span>Settings</span>
                                </Link>
                                <div className="border-t border-[#222] my-1" />
                                <button
                                  onClick={() => {
                                    setDeleteSiteId(site.id);
                                    setDeleteSiteDomain(displayName);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-[#1F0D0D] text-[#EF4444] flex items-center gap-2 text-left cursor-pointer transition-colors"
                                >
                                  <Trash2 size={13} />
                                  <span>Delete site</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card-Based View */}
          <div className="md:hidden space-y-3.5 select-none">
            {sites.map((site) => {
              const displayName = site.custom_domain || site.framer_url.replace(/^https?:\/\//, "");

              return (
                <div
                  key={site.id}
                  onClick={() => router.push(`/sites/${site.id}`)}
                  className="bg-[#111] border border-[#222] rounded-lg p-4 flex flex-col gap-3 active:bg-[#1A1A1A] transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <span className="font-semibold text-[#EDEDED] block truncate text-base">
                        {displayName}
                      </span>
                      {site.custom_domain && (
                        <span className="text-[10px] text-[#555] font-mono block truncate mt-0.5">
                          {site.framer_url}
                        </span>
                      )}
                    </div>
                    <Badge status={site.status} />
                  </div>

                  <div className="flex justify-between items-center text-xs text-[#888] pt-2 border-t border-[#222]/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#555] uppercase tracking-wider">Sync Interval</span>
                      <span className="font-medium mt-0.5">
                        {site.last_polled_at ? `Synced ${formatRelativeTime(site.last_polled_at)}` : "Pending first sync"}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-[#555] uppercase tracking-wider">Last Deploy</span>
                      <span className="font-medium mt-0.5">
                        {formatRelativeTime(site.last_deployed_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteSiteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#EF4444]/20 rounded-lg p-6 max-w-sm w-full space-y-4 shadow-2xl animate-fade-mount select-none">
            <div className="flex items-center gap-2 text-[#EF4444]">
              <ShieldAlert size={24} />
              <h3 className="text-sm font-semibold">Delete Framer Site?</h3>
            </div>
            <p className="text-xs text-[#888] leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#EDEDED] font-mono">{deleteSiteDomain}</strong>? This will remove all crawlers, caches, and custom hosting configurations.
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-[#888] cursor-pointer"
                onClick={() => setDeleteSiteId(null)}
                disabled={deleteSiteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 bg-[#EF4444]/10 border-[#EF4444]/30 hover:bg-[#EF4444]/20 hover:text-white cursor-pointer h-9"
                onClick={() => deleteSiteMutation.mutate(deleteSiteId)}
                loading={deleteSiteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
