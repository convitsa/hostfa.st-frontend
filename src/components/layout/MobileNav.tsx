"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Globe, PlusCircle, CreditCard, Settings } from "lucide-react";
import { api } from "@/lib/api";

export function MobileNav() {
  const pathname = usePathname();

  const { data: sites } = useQuery<any[]>({
    queryKey: ["sites"],
    queryFn: async () => {
      const res = await api.get("/sites/");
      return res.data;
    },
  });
  const sitesCount = sites?.length || 0;

  const navigation = [
    { name: "Sites", href: "/dashboard", icon: Globe },
    { name: "Add Site", href: "/sites/new", icon: PlusCircle },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-[#222] bg-[#0A0A0A] z-40 flex items-center justify-around px-2 pb-safe select-none">
      {navigation.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`relative flex flex-col items-center justify-center gap-0.5 w-16 h-12 rounded-md transition-all duration-150 active:scale-95 ${
              isActive ? "text-[#EDEDED]" : "text-[#555] hover:text-[#888]"
            }`}
          >
            <Icon size={18} />
            <span className="text-[9px] font-medium tracking-wide leading-none mt-0.5">{item.name}</span>
            {isActive && (
              <span className="absolute bottom-0 w-1 h-1 rounded-full bg-[#EDEDED]" />
            )}
            {item.name === "Sites" && sitesCount > 0 && (
              <span className="absolute top-1 right-2.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-[#EDEDED] text-[#0A0A0A] scale-90">
                {sitesCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
export default MobileNav;

