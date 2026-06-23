"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/providers/ToastProvider";
import { Tooltip } from "@/components/ui/Tooltip";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFields = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFields) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
    onSuccess: async () => {
      showToast("Welcome back to hostfa.st!");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      try {
        const userRes = await api.get("/auth/me");
        const sitesRes = await api.get("/sites/");
        const user = userRes.data;
        const sites = sitesRes.data;
        if (user.onboarding_complete === false && sites.length === 0) {
          router.push("/onboarding");
        } else {
          router.push(callbackUrl);
        }
      } catch (e) {
        router.push(callbackUrl);
      }
      router.refresh();
    },
    onError: (error: Error) => {
      showToast(error.message || "Invalid email or password", "error");
    },
  });

  const onSubmit = (data: LoginFields) => {
    loginMutation.mutate(data);
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
          Sign in to your account
        </h1>

        {/* Google OAuth Button */}
        <div className="w-full space-y-4 mb-4 select-none">
          <Tooltip content="Google OAuth coming soon">
            <button
              type="button"
              className="w-full bg-[#1A1A1A] border border-[#222] hover:bg-[#222] transition-colors rounded-md h-9 px-4 flex items-center justify-center gap-2 text-sm text-[#888] cursor-pointer"
            >
              <svg className="w-4 h-4 text-current" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </Tooltip>
          <div className="flex items-center gap-2 text-[10px] text-[#555] select-none">
            <div className="h-[1px] bg-[#222] flex-1" />
            <span>— or —</span>
            <div className="h-[1px] bg-[#222] flex-1" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="email-input"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            disabled={loginMutation.isPending}
            {...register("email")}
          />

          <div className="space-y-1.5">
            <Input
              id="password-input"
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              disabled={loginMutation.isPending}
              {...register("password")}
            />
            <div className="flex items-center justify-between text-xs select-none pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer text-[#888] hover:text-[#EDEDED] transition-colors">
                <input
                  type="checkbox"
                  className="rounded border-[#333] bg-[#111] text-[#EDEDED] focus:ring-0 focus:ring-offset-0"
                />
                <span>Remember me</span>
              </label>
              <Link href="/reset-password" className="text-[#888] hover:text-[#EDEDED] hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2 cursor-pointer"
            loading={loginMutation.isPending}
          >
            Sign In
          </Button>
        </form>


        <div className="mt-5 text-center text-xs text-[#888]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#EDEDED] hover:underline">
            Sign up for free
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
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
      <LoginForm />
    </React.Suspense>
  );
}
