"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe, PlusCircle, CreditCard, Settings, LogOut } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "../providers/ToastProvider";
import NotificationsBell from "./NotificationsBell";
import CommandPalette from "./CommandPalette";

interface UserInfo {
  email: string;
  plan: string;
  is_active: boolean;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: user } = useQuery<UserInfo>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      showToast("Logged out successfully");
      router.push("/login");
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to log out", "error");
    },
  });

  const navigation = [
    { name: "Sites", href: "/dashboard", icon: Globe },
    { name: "Add Site", href: "/sites/new", icon: PlusCircle },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <CommandPalette />
      <aside className="hidden md:flex flex-col w-[240px] border-r border-[#222] bg-[#0A0A0A] h-screen fixed left-0 top-0 text-sm">
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#222]">
          <Link href="/dashboard" className="font-mono text-sm font-medium text-[#EDEDED] flex items-center gap-2">
            <Globe size={16} />
            <span>hostfa.st</span>
          </Link>
          <NotificationsBell />
        </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`h-8 px-3 rounded-md flex items-center gap-2.5 font-medium transition-colors duration-150 ${
                isActive
                  ? "text-[#EDEDED] bg-[#1A1A1A]"
                  : "text-[#888] hover:text-[#EDEDED] hover:bg-[#1A1A1A]"
              }`}
            >
              <Icon size={16} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[#222] flex items-center justify-between gap-2 bg-[#0A0A0A]">
        <div className="flex flex-col min-w-0">
          <span className="text-xs text-[#555] font-mono truncate" title={user?.email || "loading..."}>
            {user?.email || "loading..."}
          </span>
          <span className="text-[10px] text-[#888] uppercase tracking-wider font-semibold">
            {user?.plan || "starter"} Plan
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/settings"
            className="text-[#888] hover:text-[#EDEDED] p-1.5 rounded-md hover:bg-[#1A1A1A] transition-colors"
            title="Settings"
          >
            <Settings size={14} />
          </Link>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="text-[#888] hover:text-[#EF4444] p-1.5 rounded-md hover:bg-[#1F0D0D] transition-colors"
            title="Log Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
export default Sidebar;
