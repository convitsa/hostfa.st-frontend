import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-[#1A1A1A] animate-pulse rounded-md ${className}`} />;
}

export function SitesTableSkeleton() {
  return (
    <div className="border border-[#222] rounded-lg overflow-hidden bg-[#0A0A0A] w-full animate-fade-mount">
      <div className="bg-[#111] border-b border-[#222] h-10 flex items-center px-5">
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="divide-y divide-[#222]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 flex items-center justify-between px-5 py-2">
            <div className="flex flex-col gap-1.5 w-1/3">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-2 w-1/2" />
            </div>
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-3 w-24" />
            <div className="flex gap-2 justify-end w-20">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SiteDetailSkeleton() {
  return (
    <div className="w-full space-y-6 animate-fade-mount">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      <div className="border-b border-[#222]" />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Main section (deployments) */}
        <div className="md:col-span-3 space-y-4">
          <Skeleton className="h-4 w-32" />
          <div className="border border-[#222] rounded-lg overflow-hidden bg-[#0A0A0A]">
            <div className="bg-[#111] border-b border-[#222] h-9 px-4 flex items-center">
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="divide-y divide-[#222] p-2 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 flex items-center justify-between px-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar section */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-[#222] rounded-lg p-4 bg-[#111] h-32 space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="border border-[#222] rounded-lg p-4 bg-[#111] h-40 space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BillingSkeleton() {
  return (
    <div className="space-y-6 w-full animate-fade-mount">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#222] rounded-lg p-6 bg-[#111] h-[220px] flex flex-col justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3.5 w-44" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        </div>
        <div className="border border-[#222] rounded-lg p-6 bg-[#111] h-[220px] flex flex-col justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-2 w-full" />
          </div>
          <Skeleton className="h-3.5 w-5/6" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <div className="border border-[#222] rounded-lg h-48 bg-[#0A0A0A]" />
      </div>
    </div>
  );
}
