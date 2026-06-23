"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { api } from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";

interface Site {
  id: string;
  framer_url: string;
  custom_domain: string;
  status: "live" | "deploying" | "error" | "pending" | "paused";
  last_deployed_at: string | null;
}

interface NotificationItem {
  id: string;
  type: "success" | "failed" | "dns";
  message: string;
  timestamp: string;
  read: boolean;
}

export function NotificationsBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const prevStatusesRef = useRef<Record<string, string>>({});
  const isInitialRef = useRef(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hostfast_notifications");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save to localStorage
  const saveNotifications = (newItems: NotificationItem[]) => {
    setNotifications(newItems);
    localStorage.setItem("hostfast_notifications", JSON.stringify(newItems));
  };

  // Poll sites status every 10 seconds to generate notifications
  const { data: sites } = useQuery<Site[]>({
    queryKey: ["sites"],
    queryFn: async () => {
      const res = await api.get("/sites/");
      return res.data;
    },
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (!sites) return;

    const newNotifications: NotificationItem[] = [];
    const currentStatuses: Record<string, string> = {};

    sites.forEach((site) => {
      const displayName = site.custom_domain || site.framer_url.replace(/^https?:\/\//, "");
      const prevStatus = prevStatusesRef.current[site.id];
      currentStatuses[site.id] = site.status;

      if (!isInitialRef.current && prevStatus && prevStatus !== site.status) {
        // Transition: deploying -> live
        if ((prevStatus === "deploying" || prevStatus === "pending") && site.status === "live") {
          newNotifications.push({
            id: Math.random().toString(36).substring(2, 9),
            type: "success",
            message: `${displayName} deployed successfully`,
            timestamp: new Date().toISOString(),
            read: false,
          });
        }
        // Transition: deploying -> error
        else if ((prevStatus === "deploying" || prevStatus === "pending") && site.status === "error") {
          newNotifications.push({
            id: Math.random().toString(36).substring(2, 9),
            type: "failed",
            message: `${displayName} deployment failed`,
            timestamp: new Date().toISOString(),
            read: false,
          });
        }
        // Transition: pending -> live (for custom domain verified)
        if (prevStatus === "pending" && site.status === "live" && site.custom_domain) {
          newNotifications.push({
            id: Math.random().toString(36).substring(2, 9),
            type: "dns",
            message: `${displayName} domain verified`,
            timestamp: new Date().toISOString(),
            read: false,
          });
        }
      }
    });

    prevStatusesRef.current = currentStatuses;
    isInitialRef.current = false;

    if (newNotifications.length > 0) {
      saveNotifications([...newNotifications, ...notifications]);
    }
  }, [sites, notifications]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const getTypeDotColor = (type: NotificationItem["type"]) => {
    if (type === "success") return "bg-[#22C55E]";
    if (type === "failed") return "bg-[#EF4444]";
    return "bg-[#3B82F6]"; // blue for DNS verified
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 text-[#888] hover:text-[#EDEDED] rounded-md hover:bg-[#1A1A1A] transition-colors focus:outline-none cursor-pointer"
        title="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-[#0A0A0A]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-[-180px] mt-2 w-80 bg-[#111] border border-[#222] rounded-lg shadow-xl z-50 text-xs text-[#EDEDED] animate-fade-mount overflow-hidden select-none">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#222] bg-[#0A0A0A]">
            <span className="font-medium text-[#EDEDED]">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[10px] text-[#888] hover:text-[#EDEDED] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-[#222] scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-[#555]">No notifications yet.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={`p-3 flex items-start gap-2.5 cursor-pointer transition-colors ${
                    !n.read ? "bg-[#1A1A1A]/30 hover:bg-[#1A1A1A]/60" : "hover:bg-[#1A1A1A]/20"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${getTypeDotColor(n.type)}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`leading-tight ${!n.read ? "text-[#EDEDED]" : "text-[#888]"}`}>
                      {n.message}
                    </p>
                    <span className="text-[10px] text-[#555] block mt-1">
                      {formatRelativeTime(n.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsBell;
