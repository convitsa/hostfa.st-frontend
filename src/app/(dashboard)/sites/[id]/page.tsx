"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  RotateCw,
  Trash2,
  Check,
  Copy,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Loader2,
  Globe,
  Info,
  ChevronLeft,
  ChevronRight,
  Split
} from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/providers/ToastProvider";
import { formatRelativeTime, parseDate } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";
import { SiteDetailSkeleton } from "@/components/ui/Skeletons";
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

interface Deployment {
  id: string;
  site_id: string;
  trigger: "manual" | "auto" | "webhook";
  status: "live" | "deploying" | "error" | "pending" | "completed";
  pages_crawled: number;
  assets_count: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

function formatDuration(startedAt?: string | null, completedAt?: string | null) {
  if (!startedAt || !completedAt) return "--";
  const start = new Date(startedAt);
  const end = new Date(completedAt);
  const diffMs = end.getTime() - start.getTime();
  if (isNaN(diffMs) || diffMs < 0) return "0s";
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  const remSec = diffSec % 60;
  return `${diffMin}m ${remSec}s`;
}

export default function SiteDetailPage() {
  const { id: siteId } = useParams() as { id: string };
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedDomain, setIsCopiedDomain] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [faviconFailed, setFaviconFailed] = useState(false);
  const [timeTick, setTimeTick] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter tab states: "all" | "live" | "failed"
  const [filterTab, setFilterTab] = useState<"all" | "live" | "failed">("all");

  // Time ticker to update relative timestamps every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick((tick) => tick + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // 1. Fetch current site details
  const { data: site, isLoading: siteLoading, isError: siteError } = useQuery<Site>({
    queryKey: ["site", siteId],
    queryFn: async () => {
      const res = await api.get(`/sites/${siteId}`);
      return res.data;
    },
    refetchInterval: (query) => {
      const siteData = query.state.data as Site | undefined;
      return siteData?.status === "deploying" || siteData?.status === "pending" ? 10000 : false;
    },
  });

  // 2. Fetch deployments for this site
  const { data: deployments, isLoading: deplsLoading } = useQuery<Deployment[]>({
    queryKey: ["deployments", siteId],
    queryFn: async () => {
      const res = await api.get(`/sites/${siteId}/deployments`);
      return res.data;
    },
    refetchInterval: (query) => {
      const depls = query.state.data as Deployment[] | undefined;
      const hasActive = depls?.some(
        (d) => d.status === "deploying" || d.status === "pending"
      );
      return hasActive ? 10000 : false;
    },
  });

  const siteDeployments = deployments || [];

  // 3. Trigger site deployment mutation
  const triggerDeployMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/sites/${siteId}/deploy`);
      return res.data;
    },
    onSuccess: () => {
      showToast("Redeployment triggered successfully");
      queryClient.invalidateQueries({ queryKey: ["site", siteId] });
      queryClient.invalidateQueries({ queryKey: ["deployments", siteId] });
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to trigger redeployment", "error");
    },
  });

  // 4. Delete site mutation
  const deleteSiteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/sites/${siteId}`);
    },
    onSuccess: () => {
      showToast("Site deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      router.push("/dashboard");
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to delete site", "error");
    },
  });

  const handleCopyCNAME = () => {
    navigator.clipboard.writeText("cname.hostfa.st");
    setIsCopied(true);
    showToast("CNAME value copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyDomain = (domain: string) => {
    navigator.clipboard.writeText(domain);
    setIsCopiedDomain(true);
    showToast("Domain copied to clipboard");
    setTimeout(() => setIsCopiedDomain(false), 2000);
  };

  const verifyDnsMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/sites/${siteId}/verify-dns`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.verified) {
        showToast("DNS verified successfully! Site is now live.");
        queryClient.invalidateQueries({ queryKey: ["site", siteId] });
      } else {
        showToast("CNAME record not resolved yet. Please wait a few minutes.", "error");
      }
    },
    onError: (err: Error) => {
      showToast(err.message || "DNS verification failed", "error");
    },
  });

  if (siteLoading) {
    return <SiteDetailSkeleton />;
  }

  if (siteError || !site) {
    return (
      <ErrorCard 
        message="Site configuration details could not be found." 
        onRetry={() => queryClient.invalidateQueries({ queryKey: ["site", siteId] })}
      />
    );
  }

  const displayName = site.custom_domain || site.framer_url.replace(/^https?:\/\//, "");

  // Generate 14 day history timeline count details
  const getTimelineData = () => {
    const days = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];

      const dayDepls = siteDeployments.filter((d) => {
        if (!d.started_at) return false;
        return parseDate(d.started_at).toISOString().split("T")[0] === dateStr;
      });

      const hasFailed = dayDepls.some((d) => d.status === "error");
      const hasSuccessful = dayDepls.some((d) => d.status === "completed" || d.status === "live");
      const count = dayDepls.length;

      days.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count,
        status: count === 0 ? "none" : hasFailed ? "failed" : "success",
      });
    }
    return days;
  };

  const timelineDays = getTimelineData();

  // Filter deployments
  const filteredDeployments = siteDeployments.filter((depl) => {
    if (filterTab === "live") return depl.status === "completed" || depl.status === "live";
    if (filterTab === "failed") return depl.status === "error";
    return true;
  });

  // Paginate deployments
  const totalPages = Math.max(1, Math.ceil(filteredDeployments.length / itemsPerPage));
  const paginatedDeployments = filteredDeployments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Back navigation & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 text-[#888] hover:text-[#EDEDED] rounded-md hover:bg-[#1A1A1A] transition-colors focus:outline-none"
            title="Return to Dashboard"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Favicon render next to domain */}
            {!faviconFailed && site.custom_domain ? (
              <img
                src={`https://www.google.com/s2/favicons?domain=${site.custom_domain}&sz=16`}
                alt="Favicon"
                className="w-4.5 h-4.5 rounded-sm shrink-0"
                onError={() => setFaviconFailed(true)}
              />
            ) : (
              <Globe size={18} className="text-[#888] shrink-0" />
            )}
            <h1 className="text-xl font-semibold text-[#EDEDED] truncate max-w-xs md:max-w-md">
              {displayName}
            </h1>
            <Badge status={site.status} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Action buttons */}
          <Tooltip content="Open live website in a new tab">
            <a
              href={site.custom_domain ? `https://${site.custom_domain}` : site.framer_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm" className="flex items-center gap-1.5 h-9 cursor-pointer">
                <span>Visit Site</span>
                <ArrowUpRight size={13} />
              </Button>
            </a>
          </Tooltip>

          <Tooltip content="Copy site domain to clipboard">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center justify-center p-2.5 h-9 cursor-pointer"
              onClick={() => handleCopyDomain(site.custom_domain || site.framer_url)}
            >
              {isCopiedDomain ? <Check size={14} className="text-[#22C55E]" /> : <Copy size={14} />}
            </Button>
          </Tooltip>

          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-1.5 h-9 cursor-pointer"
            onClick={() => triggerDeployMutation.mutate()}
            loading={triggerDeployMutation.isPending}
          >
            <RotateCw size={13} />
            <span>Redeploy</span>
          </Button>
        </div>
      </div>

      <div className="border-b border-[#222]" />

      {/* 14-day history timeline visualization */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-4 select-none">
        <h3 className="text-xs uppercase tracking-wider text-[#555] font-semibold mb-3.5">
          14-Day Deployment Activity
        </h3>
        <div className="flex justify-between items-end h-16 px-2.5 gap-1.5 max-w-lg">
          {timelineDays.map((day, i) => {
            let barHeight = "h-3";
            if (day.count === 1) barHeight = "h-6";
            else if (day.count === 2) barHeight = "h-9";
            else if (day.count >= 3) barHeight = "h-12";

            let barColor = "bg-[#222]";
            if (day.status === "success") barColor = "bg-[#22C55E]";
            else if (day.status === "failed") barColor = "bg-[#EF4444]";

            return (
              <Tooltip key={i} content={`${day.count} deployment${day.count !== 1 ? "s" : ""} on ${day.date}`}>
                <div className="flex-1 flex flex-col items-center gap-1 group cursor-default">
                  <div className={`w-full rounded-sm transition-all duration-300 ${barHeight} ${barColor} hover:brightness-125`} />
                  <span className="text-[8px] text-[#555] tracking-tight">{day.date.split(" ")[1]}</span>
                </div>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Main Column (60% width) - Deployment History */}
        <section className="md:col-span-3 space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 select-none">
              <h2 className="text-xs uppercase tracking-wider text-[#555] font-semibold">
                Deployment History
              </h2>

              {/* Filter tabs */}
              <div className="flex bg-[#0A0A0A] border border-[#222] rounded-full p-0.5 text-[10px]">
                <button
                  onClick={() => { setFilterTab("all"); setCurrentPage(1); }}
                  className={`px-3 py-0.5 rounded-full transition-colors cursor-pointer ${
                    filterTab === "all" ? "bg-[#1A1A1A] text-[#EDEDED]" : "text-[#555] hover:text-[#888]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => { setFilterTab("live"); setCurrentPage(1); }}
                  className={`px-3 py-0.5 rounded-full transition-colors cursor-pointer ${
                    filterTab === "live" ? "bg-[#1A1A1A] text-[#EDEDED]" : "text-[#555] hover:text-[#888]"
                  }`}
                >
                  Live
                </button>
                <button
                  onClick={() => { setFilterTab("failed"); setCurrentPage(1); }}
                  className={`px-3 py-0.5 rounded-full transition-colors cursor-pointer ${
                    filterTab === "failed" ? "bg-[#1A1A1A] text-[#EDEDED]" : "text-[#555] hover:text-[#888]"
                  }`}
                >
                  Failed
                </button>
              </div>
            </div>

            {deplsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-[#555]" size={20} />
              </div>
            ) : filteredDeployments.length === 0 ? (
              <div className="border border-[#222] rounded-lg p-8 text-center bg-[#0A0A0A] select-none">
                <span className="text-xs text-[#555] block mb-2">No deployments matching filters</span>
                <Button variant="secondary" size="sm" className="cursor-pointer text-xs" onClick={() => triggerDeployMutation.mutate()}>
                  Trigger initial deploy
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border border-[#222] rounded-lg overflow-hidden bg-[#0A0A0A]">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-[#111] border-b border-[#222] text-[10px] text-[#555] uppercase tracking-wider font-semibold select-none">
                        <th className="px-4 py-2">Trigger</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Pages</th>
                        <th className="px-4 py-2">Files</th>
                        <th className="px-4 py-2">Started</th>
                        <th className="px-4 py-2 text-right">Duration</th>
                        <th className="px-4 py-2 text-center">Changes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedDeployments.map((depl) => (
                        <tr
                          key={depl.id}
                          className={`h-10 border-b border-[#222] last:border-0 hover:bg-[#1A1A1A]/40 transition-colors duration-150 text-xs ${
                            depl.status === "error" ? "bg-[#1F0D0D]/20" : ""
                          }`}
                        >
                          <td className="px-4 py-2 font-medium capitalize text-[#EDEDED]">
                            {depl.trigger}
                          </td>
                          <td className="px-4 py-2">
                            <Badge status={depl.status === "completed" ? "live" : depl.status} />
                          </td>
                          <td className="px-4 py-2 text-[#888]">{depl.pages_crawled}</td>
                          <td className="px-4 py-2 text-[#888]">{depl.assets_count}</td>
                          <td className="px-4 py-2 text-[#555]">
                            {formatRelativeTime(depl.started_at)}
                          </td>
                          <td className="px-4 py-2 text-right text-[#888]">
                            {formatDuration(depl.started_at, depl.completed_at)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {/* Disabled view diff check tooltip */}
                            <Tooltip content="Coming soon — will show what changed between deploys">
                              <button
                                disabled
                                className="inline-flex items-center gap-1 text-[10px] text-[#555] hover:text-[#555] cursor-not-allowed select-none bg-transparent border-0 outline-none"
                              >
                                <Split size={12} />
                                <span>Diff</span>
                              </button>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between text-xs text-[#888] select-none px-1">
                    <span>Page {currentPage} of {totalPages}</span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="px-2 cursor-pointer h-7"
                      >
                        <ChevronLeft size={14} />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="px-2 cursor-pointer h-7"
                      >
                        <ChevronRight size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Sidebar Column (40% width) - Site Info */}
        <aside className="md:col-span-2 space-y-6">
          {/* DNS Status Card */}
          {site.custom_domain && (
            <Card hoverable={false} className="p-4 bg-[#111] border-[#222] select-none">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    site.status === "live" ? "bg-[#22C55E]" : "bg-[#EAB308] animate-pulse"
                  }`}
                />
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[#888]">
                  DNS Resolution
                </h3>
              </div>

              {site.status === "live" ? (
                <div className="text-sm text-[#22C55E] flex items-center gap-1.5 font-medium">
                  <Check size={16} />
                  <span>Domain fully verified</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Step-by-step registrar instructions */}
                  <div className="text-[11px] text-[#888] space-y-2 leading-relaxed">
                    <p className="text-xs text-[#EAB308] font-medium flex items-center gap-1">
                      <AlertTriangle size={13} className="shrink-0" />
                      Pending resolution instructions:
                    </p>
                    <div className="space-y-1">
                      <div>1. Log into your registrar (GoDaddy, Namecheap, etc.)</div>
                      <div>2. Open Active DNS details settings portal.</div>
                      <div>
                        3. Add a CNAME pointing your target host to:
                      </div>
                    </div>
                  </div>

                  <div className="relative bg-[#0A0A0A] border border-[#222] rounded p-2.5 flex justify-between items-center select-all">
                    <div className="font-mono text-xs text-[#22C55E]">
                      cname.hostfa.st
                    </div>
                    <button
                      onClick={handleCopyCNAME}
                      className="p-1 text-[#555] hover:text-[#EDEDED] rounded hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                      title="Copy CNAME value"
                    >
                      {isCopied ? <Check size={12} className="text-[#22C55E]" /> : <Copy size={12} />}
                    </button>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs cursor-pointer h-8"
                    onClick={() => verifyDnsMutation.mutate()}
                    loading={verifyDnsMutation.isPending}
                  >
                    Verify DNS
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Details Card */}
          <Card hoverable={false} className="p-4 bg-[#111] border-[#222] select-none">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#888] mb-4">
              Site Configuration
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-2 text-xs">
                <span className="text-[#555]">Framer URL</span>
                <a
                  href={site.framer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#888] hover:text-[#EDEDED] font-mono flex items-center gap-1 max-w-[150px] truncate"
                >
                  <span className="truncate">{site.framer_url}</span>
                  <ArrowUpRight size={10} />
                </a>
              </div>
              <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-2 text-xs">
                <span className="text-[#555]">Custom Domain</span>
                <span className="text-[#EDEDED] font-mono truncate max-w-[150px]">
                  {site.custom_domain}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-2 text-xs">
                <span className="text-[#555]">Created</span>
                <span className="text-[#EDEDED]">
                  {parseDate(site.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#555]">Last Deployed</span>
                <span className="text-[#EDEDED]">
                  {site.last_deployed_at
                    ? parseDate(site.last_deployed_at).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card hoverable={false} className="p-4 border-[#EF4444]/20 bg-[#111] select-none">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#EF4444] mb-2">
              Danger Zone
            </h3>
            <p className="text-xs text-[#888] mb-4 leading-relaxed">
              Once deleted, your site, cache data, and hosting config will be permanently removed.
            </p>

            {confirmDelete ? (
              <div className="space-y-3">
                <div className="text-xs text-[#EF4444] font-medium flex items-center gap-1.5 bg-[#1F0D0D] border border-[#EF4444]/20 p-2.5 rounded">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>To confirm, please type delete site below:</span>
                </div>
                <input
                  type="text"
                  placeholder="Type CONFIRM"
                  className="w-full bg-[#0A0A0A] border border-[#EF4444]/30 text-[#EDEDED] placeholder-[#555] focus:outline-none focus:ring-0 h-8 px-3 text-xs rounded-md"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-[#888] cursor-pointer"
                    onClick={() => {
                      setConfirmDelete(false);
                      setDeleteConfirmText("");
                    }}
                    disabled={deleteSiteMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="flex-1 bg-[#EF4444]/10 border-[#EF4444]/30 hover:bg-[#EF4444]/20 hover:text-white cursor-pointer h-9"
                    onClick={() => deleteSiteMutation.mutate()}
                    loading={deleteSiteMutation.isPending}
                    disabled={deleteConfirmText !== "CONFIRM"}
                  >
                    Confirm Delete
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="danger"
                size="sm"
                className="w-full flex items-center justify-center gap-1.5 text-xs text-[#EF4444] hover:bg-[#1F0D0D] cursor-pointer h-8"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={13} />
                <span>Delete Site</span>
              </Button>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
