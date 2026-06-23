"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import { Search } from "lucide-react";

interface Site {
  id: string;
  framer_url: string;
  custom_domain: string;
}

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch sites for dynamic commands
  const { data: sites } = useQuery<Site[]>({
    queryKey: ["sites"],
    queryFn: async () => {
      const res = await api.get("/sites/");
      return res.data;
    },
    enabled: isOpen,
  });

  const triggerDeployMutation = useMutation({
    mutationFn: async (siteId: string) => {
      await api.post(`/sites/${siteId}/deploy`);
    },
    onSuccess: () => {
      showToast("Redeployment triggered successfully");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to trigger redeployment", "error");
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const defaultCommands: CommandItem[] = [
    {
      id: "go-dashboard",
      label: "Go to Dashboard",
      action: () => router.push("/dashboard"),
    },
    {
      id: "add-site",
      label: "Add new site",
      action: () => router.push("/sites/new"),
    },
    {
      id: "go-billing",
      label: "Go to Billing",
      action: () => router.push("/billing"),
    },
    {
      id: "go-settings",
      label: "Go to Settings",
      action: () => router.push("/settings"),
    },
  ];

  const dynamicCommands: CommandItem[] = [];
  if (sites) {
    sites.forEach((site) => {
      const displayName = site.custom_domain || site.framer_url.replace(/^https?:\/\//, "");
      dynamicCommands.push({
        id: `redeploy-${site.id}`,
        label: `Redeploy ${displayName}`,
        action: () => triggerDeployMutation.mutate(site.id),
      });
      dynamicCommands.push({
        id: `open-${site.id}`,
        label: `Open ${displayName}`,
        action: () => window.open(site.custom_domain ? `https://${site.custom_domain}` : site.framer_url, "_blank"),
      });
    });
  }

  const allCommands = [...defaultCommands, ...dynamicCommands];
  const filteredCommands = allCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-24 px-4 select-none" onClick={() => setIsOpen(false)}>
      <div 
        className="bg-[#111] border border-[#333] rounded-xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-fade-mount"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3.5 border-b border-[#222]">
          <Search size={16} className="text-[#555]" />
          <input
            ref={inputRef}
            type="text"
            className="w-full h-11 bg-transparent text-[#EDEDED] placeholder-[#555] text-sm focus:outline-none focus:ring-0"
            placeholder="Type a command..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <span className="text-[10px] bg-[#1A1A1A] border border-[#222] text-[#888] px-1.5 py-0.5 rounded uppercase font-medium">ESC</span>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-1.5 scrollbar-thin">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#555]">No commands found.</div>
          ) : (
            filteredCommands.map((cmd, i) => {
              const isSelected = i === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  className={`h-9 px-3 rounded-md flex items-center justify-between text-xs cursor-pointer transition-colors ${
                    isSelected ? "bg-[#1A1A1A] text-[#EDEDED]" : "text-[#888] hover:bg-[#1A1A1A]/50 hover:text-[#EDEDED]"
                  }`}
                  onClick={() => {
                    cmd.action();
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <span className="font-medium">{cmd.label}</span>
                  {isSelected && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#555] font-mono select-none">
                      <span>↵ to select</span>
                      <span>↑↓ to navigate</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
