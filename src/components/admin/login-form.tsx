"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faEnvelope,
  faSpinner,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Logo } from "@/components/logo";
import { api } from "@/lib/admin/api";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type Values = z.infer<typeof schema>;

export function LoginForm({
  logoLight,
  logoDark,
}: {
  logoLight?: string | null;
  logoDark?: string | null;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin";
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setLoading(true);
    try {
      await api.post("/auth/login", values);
      toast.success("Welcome back!");
      router.push(from);
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-xl border border-border/60 bg-surface-2/60 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-brand-500/60";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-bg mask-fade-b"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 size-[500px] -translate-x-1/2 rounded-full bg-brand-500/15 blur-[130px]"
      />

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Logo href="/" logoLight={logoLight} logoDark={logoDark} />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to manage your content
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-3xl border border-border/60 bg-card/60 p-8 backdrop-blur-xl"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                {...register("email")}
                className={field}
                placeholder="admin@setupsworks.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                {...register("password")}
                type="password"
                className={field}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white transition-all hover:bg-brand-600 disabled:opacity-60"
          >
            <FontAwesomeIcon
              icon={loading ? faSpinner : faArrowRight}
              className={cn("size-4", loading && "animate-spin")}
            />
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected area · Setups Works CMS
        </p>
      </div>
    </main>
  );
}
