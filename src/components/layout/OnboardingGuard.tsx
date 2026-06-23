"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: user, isLoading } = useQuery<any>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
  });

  useEffect(() => {
    if (user && !user.onboarding_complete && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [user, pathname, router]);

  if (isLoading && pathname !== "/onboarding") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20 gap-3 select-none">
        <svg className="animate-spin h-6 w-6 text-[#888]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm text-[#888]">Loading dashboard...</span>
      </div>
    );
  }

  return <>{children}</>;
}

export default OnboardingGuard;
