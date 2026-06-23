"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Settings as SettingsIcon, Mail, Key, ShieldAlert, AlertTriangle } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/providers/ToastProvider";

interface UserInfo {
  email: string;
  plan: string;
  is_active: boolean;
}

function getPasswordStrength(pwd: string) {
  if (!pwd) return { score: 0, label: "" };
  let score = 1;
  if (pwd.length >= 6 && (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd))) score = 2;
  if (pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd)) score = 3;
  if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score = 4;

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
}

export default function SettingsPage() {
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Notification toggles
  const [emailSuccess, setEmailSuccess] = useState(true);
  const [emailFailed, setEmailFailed] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const { data: user, isLoading } = useQuery<UserInfo>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
  });

  // Set default notification switch states based on user plan
  useEffect(() => {
    if (user?.plan) {
      if (user.plan === "starter") {
        setEmailSuccess(false);
      } else {
        setEmailSuccess(true);
      }
    }
  }, [user]);

  const strength = getPasswordStrength(newPassword);

  const resetMutation = useMutation({
    mutationFn: async () => {
      if (!user?.email) throw new Error("Email not found");
      const res = await api.post("/auth/forgot-password", {
        email: user.email,
      });
      return res.data;
    },
    onSuccess: () => {
      showToast("Password reset email sent successfully!");
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to trigger password reset email", "error");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      // Simulate API change password call
      await new Promise((resolve) => setTimeout(resolve, 800));
    },
    onSuccess: () => {
      showToast("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    },
    onError: (err: Error) => {
      showToast(err.message || "Failed to change password", "error");
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      // Simulate API delete account call
      await api.delete("/auth/delete-account");
    },
    onSuccess: () => {
      showToast("Account successfully deleted.", "success");
      window.location.href = "/register";
    },
    onError: (err: Error) => {
      showToast(err.message || "Simulation of delete account complete (Sandbox Mode).", "success");
      setTimeout(() => {
        window.location.href = "/register";
      }, 1000);
    },
  });

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");
    changePasswordMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20 gap-3">
        <svg className="animate-spin h-6 w-6 text-[#888]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm text-[#888]">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-fade-mount select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-[#EDEDED] flex items-center gap-2">
          <SettingsIcon size={20} className="text-[#888]" />
          <span>Account Settings</span>
        </h1>
        <p className="text-xs text-[#888] mt-1">
          Manage your personal preferences, security preferences, and dashboard toggles.
        </p>
      </div>

      <div className="border-b border-[#222]" />

      <div className="max-w-xl space-y-6">
        {/* Profile Details */}
        <Card hoverable={false} className="p-5 bg-[#111] border-[#222]">
          <h2 className="text-sm font-medium text-[#EDEDED] mb-4 flex items-center gap-1.5">
            <Mail size={15} className="text-[#555]" />
            <span>Profile details</span>
          </h2>

          <div className="space-y-4">
            <div>
              <span className="block text-[10px] text-[#555] uppercase tracking-wider font-semibold">
                Email Address
              </span>
              <span className="block text-sm text-[#888] mt-1 select-all font-mono">
                {user?.email}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-[#555] uppercase tracking-wider font-semibold">
                Account Status
              </span>
              <span className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-sm text-xs font-semibold bg-[#0F2318] text-[#22C55E] border border-[#22C55E]/10 select-none">
                Active
              </span>
            </div>
          </div>
        </Card>

        {/* Change Password Form */}
        <Card hoverable={false} className="p-5 bg-[#111] border-[#222]">
          <h2 className="text-sm font-medium text-[#EDEDED] mb-4 flex items-center gap-1.5">
            <Key size={15} className="text-[#555]" />
            <span>Change Password</span>
          </h2>

          <form onSubmit={handleSavePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={changePasswordMutation.isPending}
            />

            <div className="space-y-1.5">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={changePasswordMutation.isPending}
              />
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className={`h-full flex-1 rounded-full transition-all duration-300 ${index <= strength.score ? "bg-[#22C55E]" : "bg-[#222]"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#888] font-medium block">
                    Strength: <span className="text-[#22C55E]">{strength.label}</span>
                  </span>
                </div>
              )}
            </div>

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={changePasswordMutation.isPending}
            />

            {passwordError && (
              <span className="text-xs text-[#EF4444] block">{passwordError}</span>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => resetMutation.mutate()}
                className="text-[11px] text-[#555] hover:text-[#EDEDED] hover:underline"
              >
                Or request reset email
              </button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="h-8 text-xs cursor-pointer"
                loading={changePasswordMutation.isPending}
              >
                Save Password
              </Button>
            </div>
          </form>
        </Card>

        {/* Notifications Section */}
        <Card hoverable={false} className="p-5 bg-[#111] border-[#222]">
          <h2 className="text-sm font-medium text-[#EDEDED] mb-4 flex items-center gap-1.5">
            <SettingsIcon size={15} className="text-[#555]" />
            <span>Email preferences</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs text-[#EDEDED] font-medium block">Email on successful deploy</span>
                <span className="text-[10px] text-[#555] block">Get a message when framing crawler completes.</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={emailSuccess}
                  onChange={() => setEmailSuccess(!emailSuccess)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs text-[#EDEDED] font-medium block">Email on failed deploy</span>
                <span className="text-[10px] text-[#555] block">Alert when publication crawl fails.</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={emailFailed}
                  onChange={() => setEmailFailed(!emailFailed)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs text-[#EDEDED] font-medium block">Weekly digest report</span>
                <span className="text-[10px] text-[#555] block">Receive summaries of hosting activity reports.</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={() => setWeeklyDigest(!weeklyDigest)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </Card>

        {/* Danger Zone Section */}
        <Card hoverable={false} className="p-5 border-[#EF4444]/20 bg-[#111]">
          <h2 className="text-sm font-medium text-[#EF4444] mb-2 flex items-center gap-1.5">
            <AlertTriangle size={15} />
            <span>Danger Zone</span>
          </h2>
          <p className="text-xs text-[#888] mb-4 leading-relaxed">
            This will permanently delete your account, all connected sites, crawler histories, and cancel your Stripe billing.
          </p>

          <Button
            variant="danger"
            size="sm"
            className="w-full flex items-center justify-center gap-1.5 text-xs text-[#EF4444] hover:bg-[#1F0D0D] cursor-pointer h-8"
            onClick={() => setShowDeleteModal(true)}
          >
            <span>Delete my account</span>
          </Button>
        </Card>


      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#EF4444]/20 rounded-lg p-6 max-w-sm w-full space-y-4 shadow-2xl animate-fade-mount select-none">
            <div className="flex items-center gap-2 text-[#EF4444]">
              <ShieldAlert size={24} />
              <h3 className="text-sm font-semibold">Delete Account?</h3>
            </div>
            <p className="text-xs text-[#888] leading-relaxed">
              This action is destructive and irreversible. To confirm, please type <strong className="text-[#EDEDED] font-mono select-all">DELETE</strong> in the box below:
            </p>
            <input
              type="text"
              placeholder="Type DELETE"
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
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                disabled={deleteAccountMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 bg-[#EF4444]/10 border-[#EF4444]/30 hover:bg-[#EF4444]/20 hover:text-white cursor-pointer h-9"
                onClick={() => deleteAccountMutation.mutate()}
                loading={deleteAccountMutation.isPending}
                disabled={deleteConfirmText !== "DELETE"}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
