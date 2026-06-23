"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Globe, ShieldAlert } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/providers/ToastProvider";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetFields = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFields>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const resetMutation = useMutation({
    mutationFn: async (data: ResetFields) => {
      if (!token) throw new Error("Invalid or missing password reset token");
      await api.post("/auth/reset-password", {
        token,
        new_password: data.newPassword,
      });
    },
    onSuccess: () => {
      showToast("Password reset successfully! Please sign in.");
      router.push("/login");
    },
    onError: (error: Error) => {
      showToast(error.message || "Failed to reset password. Token may have expired.", "error");
    },
  });

  const onSubmit = (data: ResetFields) => {
    resetMutation.mutate(data);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 py-12">
        <Card hoverable={false} className="w-full max-w-[400px] bg-[#111] border-[#222] text-center p-6 space-y-4">
          <div className="flex justify-center text-[#EF4444]">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-base font-semibold text-[#EDEDED]">Missing Reset Token</h1>
          <p className="text-xs text-[#888] leading-relaxed">
            The password reset link you clicked is invalid or incomplete. Please request a new link from the account page.
          </p>
          <Link href="/login" className="block w-full">
            <Button variant="secondary" size="sm" className="w-full">
              Back to Login
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 py-12">
      {/* Header Logo */}
      <div className="mb-6 flex flex-col items-center gap-2 select-none">
        <div className="font-mono text-lg font-medium text-[#EDEDED] flex items-center gap-2">
          <Globe size={20} />
          <span>hostfa.st</span>
        </div>
        <p className="text-xs text-[#888] font-medium">Framer hosting made fast and simple</p>
      </div>

      <Card hoverable={false} className="w-full max-w-[400px] bg-[#111] border-[#222]">
        <h1 className="text-lg font-medium text-[#EDEDED] mb-4 text-center">
          Reset Account Password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="new-password"
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.newPassword?.message}
            disabled={resetMutation.isPending}
            {...register("newPassword")}
          />

          <Input
            id="confirm-password"
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            disabled={resetMutation.isPending}
            {...register("confirmPassword")}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            loading={resetMutation.isPending}
          >
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex justify-center items-center">
          <svg className="animate-spin h-6 w-6 text-[#888]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      }
    >
      <ResetPasswordForm />
    </React.Suspense>
  );
}
