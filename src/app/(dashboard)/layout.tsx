"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import DashboardTransition from "@/components/layout/DashboardTransition";
import OnboardingGuard from "@/components/layout/OnboardingGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/onboarding";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans">
      <OnboardingGuard>
        {/* Fixed Sidebar on Desktop */}
        {!isOnboarding && <Sidebar />}

        {/* Sticky Navigation on Mobile */}
        {!isOnboarding && <MobileNav />}

        {/* Responsive Content Container */}
        <main className={`${isOnboarding ? "" : "md:pl-[240px] pb-24 md:pb-0"} min-h-screen flex flex-col`}>
          <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8 flex-1 flex flex-col">
            <DashboardTransition>{children}</DashboardTransition>
          </div>
        </main>
      </OnboardingGuard>
    </div>
  );
}

