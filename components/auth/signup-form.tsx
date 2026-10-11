"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import * as authService from "@/services/auth";
import { signupSchema } from "@/lib/schemas";
import { notify } from "@/lib/toast";
import { useAuthState } from "@/context/AuthContext";
import { useForm } from "@/hooks/use-form";
import { DEFAULT_SIGNUP_ROLE } from "@/config/auth";
import { BRAND } from "@/config/site";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthCard, AuthHeading } from "@/components/auth/auth-card";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { AuthField, AuthInput, AuthPasswordInput } from "@/components/auth/auth-field";
import { AuthSubmit } from "@/components/auth/auth-submit";
import { AuthSupportFooter } from "@/components/auth/auth-extras";
import { PasswordStrength, StrengthLabel } from "@/components/auth/password-strength";
import { useGuestRedirect } from "@/components/auth/use-guest-redirect";

type SignupValues = { firstName: string; lastName: string; email: string; phone: string; role: string; password: string; terms: boolean };

export function SignupForm({ next = "/dashboard" }: { next?: string }) {
  const router = useRouter();
  const { signIn } = useAuthState();
  const form = useForm<SignupValues>(signupSchema, {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: DEFAULT_SIGNUP_ROLE,
    password: "",
    terms: false,
  });
  useGuestRedirect(next);
  const suffix = next === "/dashboard" ? "" : `?next=${encodeURIComponent(next)}`;

  const submit = form.handleSubmit(async (v) => {
    const email = v.email.trim();
    const { hasSession } = await authService.register({ name: `${v.firstName.trim()} ${v.lastName.trim()}`, email, password: v.password, phone: v.phone, role: v.role });

    if (hasSession) {
      await signIn();
      notify.success(`Account created. Welcome to ${BRAND.name}!`);
      router.replace(next === "/dashboard" ? "/choose-plan" : next);
    } else {
      notify.success("Account created. Check your email to confirm, then sign in.");
      router.replace(`/login${suffix}`);
    }
  });

  return (
    <AuthCard className="max-w-[640px]">
      <AuthTabs tabs={[{ label: "Sign In", href: `/login${suffix}` }, { label: "Sign up", active: true }]} />
      <AuthHeading title="Create your account" description={BRAND.signupTagline} />

      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <AuthField label="First name" htmlFor="firstName" error={form.errors.firstName}>
            <AuthInput {...form.field("firstName", { filter: "name" })} autoComplete="given-name" placeholder="Alex" disabled={form.submitting} />
          </AuthField>
          <AuthField label="Last name" htmlFor="lastName" error={form.errors.lastName}>
            <AuthInput {...form.field("lastName", { filter: "name" })} autoComplete="family-name" placeholder="Morgan" disabled={form.submitting} />
          </AuthField>
        </div>

        <AuthField label="Email address" htmlFor="email" error={form.errors.email}>
          <AuthInput {...form.field("email", { filter: "email" })} type="email" icon={Mail} autoComplete="email" placeholder="alex.morgan@example.com" disabled={form.submitting} />
        </AuthField>

        <AuthField
          label="Phone number"
          htmlFor="phone"
          error={form.errors.phone}
          aside={<span className="text-[10px] text-slate-400">Used for account alerts</span>}
          hint="We only use it to reach you about your account"
        >
          <PhoneInput id="phone" name="phone" value={form.values.phone} onChange={(v) => form.setValue("phone", v)} onBlur={() => form.blur("phone")} invalid={Boolean(form.errors.phone)} disabled={form.submitting} />
        </AuthField>

        <AuthField label="Create password" htmlFor="password" error={form.errors.password} aside={<StrengthLabel value={form.values.password} />}>
          <AuthPasswordInput {...form.field("password")} icon={Lock} autoComplete="new-password" placeholder="••••••••••••" disabled={form.submitting} />
          <PasswordStrength value={form.values.password} />
        </AuthField>

        <div className="space-y-1.5">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
            <Checkbox
              id="terms"
              checked={form.values.terms}
              onCheckedChange={(checked) => form.setValue("terms", checked === true)}
              onBlur={() => form.blur("terms")}
              disabled={form.submitting}
              className="data-[state=checked]:bg-brand data-[state=checked]:border-brand border-slate-300 text-white"
            />
            <span>
              I agree to the{" "}
              <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-brand underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {form.errors.terms ? <p className="text-destructive text-xs">{form.errors.terms}</p> : null}
        </div>

        <AuthSubmit loading={form.submitting}>{form.submitting ? "Creating account…" : "Create account and choose a plan"}</AuthSubmit>
      </form>

      <AuthSupportFooter prompt="Already have an account?" linkLabel="Sign in" href={`/login${suffix}`} />
    </AuthCard>
  );
}
