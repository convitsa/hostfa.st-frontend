"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Globe } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/providers/ToastProvider";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  agreeToTerms: z.literal(true, {
    message: "You must agree to the Terms of Service and Privacy Policy",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFields = z.infer<typeof registerSchema>;

function getPasswordStrength(pwd: string) {
  if (!pwd) return { score: 0, label: "" };
  let score = 1;
  if (pwd.length >= 6 && (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd))) score = 2;
  if (pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd)) score = 3;
  if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score = 4;
  
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
}

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      agreeToTerms: false as any,
    }
  });

  const passwordValue = watch("password") || "";
  const { score, label } = getPasswordStrength(passwordValue);

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFields) => {
      await api.post("/auth/register", {
        email: data.email,
        password: data.password,
        plan: "starter",
      });
    },
    onSuccess: () => {
      showToast("Account created successfully!");
      router.push("/onboarding");
    },
    onError: (error: Error) => {
      showToast(error.message || "Registration failed. Try again.", "error");
    },
  });

  const onSubmit = (data: RegisterFields) => {
    registerMutation.mutate(data);
  };

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
        <h1 className="text-lg font-medium text-[#EDEDED] mb-5 text-center">
          Create your free account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="register-email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            disabled={registerMutation.isPending}
            {...register("email")}
          />

          <div className="space-y-1.5">
            <Input
              id="register-password"
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              disabled={registerMutation.isPending}
              {...register("password")}
            />
            {passwordValue && (
              <div className="mt-2 space-y-1 select-none">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        index <= score ? "bg-[#22C55E]" : "bg-[#222]"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-[#888] font-medium">
                  Strength: <span className="text-[#22C55E]">{label}</span>
                </span>
              </div>
            )}
          </div>

          <Input
            id="register-confirm-password"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            disabled={registerMutation.isPending}
            {...register("confirmPassword")}
          />

          <div className="space-y-1.5 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#888] hover:text-[#EDEDED] transition-colors select-none">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-[#333] bg-[#111] text-[#EDEDED] focus:ring-0 focus:ring-offset-0"
                {...register("agreeToTerms")}
              />
              <span className="leading-tight">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-[#EDEDED] underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="text-[#EDEDED] underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <span className="text-xs text-[#EF4444] block">{errors.agreeToTerms.message}</span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2 cursor-pointer"
            loading={registerMutation.isPending}
          >
            Sign Up
          </Button>
        </form>


        <div className="mt-5 text-center text-xs text-[#888]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#EDEDED] hover:underline">
            Sign in instead
          </Link>
        </div>
      </Card>
    </div>
  );
}
