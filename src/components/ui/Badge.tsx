import React from "react";

type BadgeStatus = "live" | "deploying" | "error" | "neutral" | "pending" | "paused";

interface BadgeProps {
  status: BadgeStatus;
  children?: React.ReactNode;
}

export function Badge({ status, children }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-medium border select-none w-fit";

  const statusMap: Record<BadgeStatus, string> = {
    live: "bg-[#0F2318] text-[#22C55E] border-[#22C55E]/20",
    deploying: "bg-[#1C1A08] text-[#EAB308] border-[#EAB308]/20",
    pending: "bg-[#1C1A08] text-[#EAB308] border-[#EAB308]/20",
    error: "bg-[#1F0D0D] text-[#EF4444] border-[#EF4444]/20",
    neutral: "bg-[#1A1A1A] text-[#888888] border-[#333]",
    paused: "bg-[#1A1A1A] text-[#888888] border-[#333]",
  };

  const labelMap: Record<BadgeStatus, string> = {
    live: "Live",
    deploying: "Deploying",
    pending: "Pending",
    error: "Error",
    neutral: "Neutral",
    paused: "Paused",
  };

  const isDeploying = status === "deploying" || status === "pending";

  return (
    <span className={`${baseStyles} ${statusMap[status]}`}>
      {isDeploying && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308] animate-pulse" />
      )}
      {children || labelMap[status]}
    </span>
  );
}
