"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function DashboardTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-fade-mount flex-1 flex flex-col">
      {children}
    </div>
  );
}

export default DashboardTransition;
