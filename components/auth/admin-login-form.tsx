"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import * as authService from "@/services/auth";
import { isPlatformAdmin } from "@/services/admin";
import { loginSchema } from "@/lib/schemas";
import { notify } from "@/lib/toast";
import { useAuthState } from "@/context/AuthContext";
import { useForm } from "@/hooks/use-form";
import { BRAND } from "@/config/site";
import { AuthCard, AuthHeading } from "@/components/auth/auth-card";
import { AuthField, AuthInput, AuthPasswordInput } from "@/components/auth/auth-field";
import { AuthSubmit } from "@/components/auth/auth-submit";

export function AdminLoginForm({ next = "/admin" }: { next?: string }) {
  const router = useRouter();
  const { signIn } = useAuthState();
  const form = useForm(loginSchema, { email: "", password: "" });

  const submit = form.handleSubmit(async ({ email, password }) => {
    const user = await authService.login({ email: email.trim(), password });
    if (!(await isPlatformAdmin(user._id))) {
      await authService.logout();
      throw new Error("This account is not an admin. Customers sign in at /login.");
    }
    await signIn(user);
    notify.success("Welcome back, admin");
    router.replace(next);
  });

  return (
    <AuthCard>
      <span className="bg-brand/10 text-brand mb-5 flex size-12 items-center justify-center rounded-2xl"><ShieldCheck className="size-6" /></span>
      <AuthHeading title="Admin console" description={`Sign in to manage ${BRAND.name}: payments, customers and subscriptions.`} />

      <form onSubmit={submit} noValidate className="space-y-5">
        <AuthField label="Admin email" htmlFor="email" error={form.errors.email}>
          <AuthInput {...form.field("email", { filter: "email" })} type="email" icon={Mail} autoComplete="email" placeholder="admin@yourcompany.com" disabled={form.submitting} />
        </AuthField>
        <AuthField
          label="Password"
          htmlFor="password"
          error={form.errors.password}
          aside={<Link href="/forgot-password" className="text-brand text-xs font-medium hover:underline">Forgot password?</Link>}
        >
          <AuthPasswordInput {...form.field("password")} icon={Lock} autoComplete="current-password" placeholder="••••••••••••" disabled={form.submitting} />
        </AuthField>
        <AuthSubmit loading={form.submitting}>{form.submitting ? "Checking…" : "Sign in to admin"}</AuthSubmit>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Not an admin? <Link href="/login" className="text-brand font-semibold hover:underline">Customer sign in</Link>
      </p>
    </AuthCard>
  );
}
