"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import * as authService from "@/services/auth";
import { loginSchema } from "@/lib/schemas";
import { notify } from "@/lib/toast";
import { useAuthState } from "@/context/AuthContext";
import { useForm } from "@/hooks/use-form";
import { DEMO_ACCOUNTS } from "@/config/auth";
import { BRAND } from "@/config/site";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthCard, AuthHeading } from "@/components/auth/auth-card";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { AuthField, AuthInput, AuthPasswordInput } from "@/components/auth/auth-field";
import { AuthDivider, AuthSubmit } from "@/components/auth/auth-submit";
import { AuthSupportFooter } from "@/components/auth/auth-extras";
import { useGuestRedirect } from "@/components/auth/use-guest-redirect";

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const router = useRouter();
  const { signIn } = useAuthState();
  const form = useForm(loginSchema, { email: "", password: "" });
  useGuestRedirect(next);
  const suffix = next === "/dashboard" ? "" : `?next=${encodeURIComponent(next)}`;

  const [demo, setDemo] = useState<string | null>(null);

  async function enter(email: string, password: string) {
    const user = await authService.login({ email, password });
    await signIn(user);
    notify.success("Welcome back!");
    router.replace(next);
  }

  const submit = form.handleSubmit(({ email, password }) => enter(email.trim(), password));

  async function demoLogin(account: (typeof DEMO_ACCOUNTS)[number]) {
    if (demo || form.submitting) return;
    setDemo(account.email);
    try {
      await enter(account.email, account.password);
    } catch (error) {
      notify.error(error);
      setDemo(null);
    }
  }

  return (
    <AuthCard>
      <AuthTabs tabs={[{ label: "Sign In", active: true }, { label: "Sign up", href: `/signup${suffix}` }]} />
      <AuthHeading title="Sign in to your account" description={BRAND.loginTagline} />

      <form onSubmit={submit} noValidate className="space-y-5">
        <AuthField label="Email address" htmlFor="email" error={form.errors.email}>
          <AuthInput {...form.field("email", { filter: "email" })} type="email" icon={Mail} autoComplete="email" placeholder="alex.morgan@example.com" disabled={form.submitting} />
        </AuthField>

        <AuthField
          label="Password"
          htmlFor="password"
          error={form.errors.password}
          aside={
            <Link href="/forgot-password" className="text-brand text-xs font-medium hover:underline">
              Forgot password?
            </Link>
          }
        >
          <AuthPasswordInput {...form.field("password")} icon={Lock} autoComplete="current-password" placeholder="••••••••••••" disabled={form.submitting} />
        </AuthField>

        <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
          <Checkbox name="remember" defaultChecked className="data-[state=checked]:bg-brand data-[state=checked]:border-brand border-slate-300 text-white" />
          Remember this device for 30 days
        </label>

        <AuthSubmit loading={form.submitting}>{form.submitting ? "Signing in…" : `Sign In to ${BRAND.name}`}</AuthSubmit>
      </form>

      {DEMO_ACCOUNTS.length > 0 ? (
        <>
        <AuthDivider label="Demo login" />
        <div className="grid grid-cols-2 gap-3">
          {DEMO_ACCOUNTS.map((account) => (
            <Button key={account.email} type="button" variant="outline" loading={demo === account.email} disabled={form.submitting || (demo !== null && demo !== account.email)} onClick={() => demoLogin(account)} className="h-11 rounded-xl border-slate-200 bg-white text-xs text-slate-700 hover:border-brand hover:bg-white hover:text-brand">
              {account.label}
            </Button>
          ))}
        </div>
        </>
      ) : null}

      <AuthSupportFooter prompt={`New to ${BRAND.name}?`} linkLabel="Create account" href={`/signup${suffix}`} />
    </AuthCard>
  );
}
