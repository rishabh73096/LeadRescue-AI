"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, KeyRound, Lock, Mail, Smartphone } from "lucide-react";
import * as authService from "@/services/auth";
import { codeSchema, forgotPasswordSchema, newPasswordSchema } from "@/lib/schemas";
import { notify } from "@/lib/toast";
import { useForm } from "@/hooks/use-form";
import { OTP_EXPIRY_SECONDS, OTP_LENGTH } from "@/config/auth";
import { Button } from "@/components/ui/button";
import { AuthCard, AuthHeading } from "@/components/auth/auth-card";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { AuthField, AuthInput, AuthPasswordInput } from "@/components/auth/auth-field";
import { AuthDivider, AuthLinkButton, AuthOutlineButton, AuthSubmit } from "@/components/auth/auth-submit";
import { AuthBackLink, AuthIconBadge, AuthInfoLine, AuthSpamNotice, AuthSwitchLine } from "@/components/auth/auth-extras";
import { ExpiryTimer } from "@/components/auth/expiry-timer";
import { OtpInput } from "@/components/auth/otp-input";
import { PasswordStrength } from "@/components/auth/password-strength";

type Step = "email" | "sent" | "code" | "password";

export function ForgotPasswordFlow() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  if (step === "email") {
    return (
      <EmailStep
        initialEmail={email}
        onSent={(sentEmail, otpToken) => {
          setEmail(sentEmail);
          setToken(otpToken);
          setStep("sent");
        }}
      />
    );
  }
  if (step === "sent") return <SentStep email={email} onEnterCode={() => setStep("code")} onBack={() => setStep("email")} />;
  if (step === "code") {
    return (
      <CodeStep
        email={email}
        token={token}
        onBack={() => setStep("sent")}
        onResent={setToken}
        onVerified={(nextToken) => {
          setToken(nextToken);
          setStep("password");
        }}
      />
    );
  }
  return <PasswordStep email={email} onBack={() => setStep("code")} />;
}

function EmailStep({ initialEmail, onSent }: { initialEmail: string; onSent: (email: string, token: string) => void }) {
  const form = useForm(forgotPasswordSchema, { email: initialEmail });

  const submit = form.handleSubmit(async ({ email }) => {
    const clean = email.trim();
    const token = await authService.sendOtp(clean);
    notify.success(`We emailed a ${OTP_LENGTH}-digit code to ${clean}`);
    onSent(clean, token);
  });

  return (
    <AuthCard>
      <AuthBackLink />
      <AuthIconBadge icon={KeyRound} />
      <AuthHeading
        title="Forgot your password?"
        description="No worries! Enter the email address associated with your account, and we'll send you recovery instructions."
      />

      <AuthTabs
        className="mb-6"
        tabs={[
          { label: "Email Address", active: true, icon: <Mail className="size-3.5" /> },
          { label: "SMS / Phone", disabled: true, icon: <Smartphone className="size-3.5" /> },
        ]}
      />

      <form onSubmit={submit} noValidate className="space-y-4">
        <AuthField label="Registered email address" htmlFor="email" error={form.errors.email}>
          <AuthInput {...form.field("email", { filter: "email" })} type="email" icon={Mail} autoComplete="email" placeholder="alex.morgan@example.com" disabled={form.submitting} />
        </AuthField>
        <AuthInfoLine icon={Clock}>We&apos;ll send a secure {OTP_LENGTH}-digit code valid for {OTP_EXPIRY_SECONDS / 60} minutes.</AuthInfoLine>
        <AuthSubmit loading={form.submitting}>{form.submitting ? "Sending…" : "Send Reset Code"}</AuthSubmit>
      </form>

      <div className="mt-5 space-y-4">
        <AuthDivider label="Or recover with" />
        <AuthOutlineButton disabled>
          <Smartphone className="size-3.5" />
          Send {OTP_LENGTH}-Digit Code via SMS (coming soon)
        </AuthOutlineButton>
      </div>

      <AuthSpamNotice />
      <AuthSwitchLine prompt="Remember your password?" linkLabel="Sign in" href="/login" />
    </AuthCard>
  );
}

function SentStep({ email, onEnterCode, onBack }: { email: string; onEnterCode: () => void; onBack: () => void }) {
  return (
    <AuthCard>
      <AuthBackLink onClick={onBack} label="Back" />
      <AuthIconBadge icon={Mail} />
      <AuthHeading
        title="Check your email"
        description={
          <>
            We sent a secure password reset code to <span className="font-semibold text-slate-800">{email}</span>. Enter the code to set up a new password.
          </>
        }
      />

      <div className="space-y-4">
        <p className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          <Clock className="text-brand size-3.5" />
          This secure code is valid for <span className="font-semibold text-slate-800">{OTP_EXPIRY_SECONDS / 60} minutes.</span>
        </p>
        <AuthLinkButton href="mailto:">Open Email Inbox</AuthLinkButton>
        <AuthDivider label="Or continue with" />
        <Button type="button" variant="outline" onClick={onEnterCode} className="h-11 w-full rounded-xl border-slate-200 bg-white text-xs text-slate-700 hover:border-brand hover:bg-white hover:text-brand">
          Enter {OTP_LENGTH}-Digit Code
        </Button>
      </div>

      <AuthSpamNotice />
      <p className="mt-5 text-center text-xs text-slate-500">
        Wrong email?{" "}
        <button type="button" onClick={onBack} className="text-brand font-semibold hover:underline">
          Change it
        </button>
      </p>
    </AuthCard>
  );
}

function CodeStep({ email, token, onBack, onVerified, onResent }: { email: string; token: string; onBack: () => void; onVerified: (token: string) => void; onResent: (token: string) => void }) {
  const form = useForm(codeSchema, { otp: "" });
  const [resending, setResending] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const submit = form.handleSubmit(async ({ otp }) => {
    const next = await authService.verifyOtp({ otp, token });
    notify.success("Code verified");
    onVerified(next);
  });

  async function resend() {
    setResending(true);
    try {
      onResent(await authService.sendOtp(email));
      setTimerKey((k) => k + 1);
      form.reset();
      notify.success("We sent you a new code");
    } catch (error) {
      notify.error(error);
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthCard>
      <AuthBackLink onClick={onBack} label="Back" />
      <AuthIconBadge icon={KeyRound} />
      <AuthHeading
        title="Enter verification code"
        description={
          <>
            Enter the {OTP_LENGTH}-digit verification code sent to <span className="font-medium text-slate-700">{email}</span>.
          </>
        }
      />

      <form onSubmit={submit} noValidate className="space-y-5">
        <AuthField label={`${OTP_LENGTH}-digit security token`} htmlFor="otp-0" error={form.errors.otp}>
          <OtpInput key={timerKey} length={OTP_LENGTH} onChange={(code) => form.setValue("otp", code)} />
        </AuthField>

        <div className="flex items-center justify-between">
          <ExpiryTimer key={timerKey} seconds={OTP_EXPIRY_SECONDS} />
          <button type="button" onClick={resend} disabled={resending || form.submitting} className="text-brand text-xs font-semibold hover:underline disabled:opacity-50">
            {resending ? "Sending…" : "Resend code"}
          </button>
        </div>

        <AuthSubmit loading={form.submitting}>{form.submitting ? "Verifying…" : "Verify Code & Continue"}</AuthSubmit>
      </form>

      <AuthSpamNotice />
      <AuthSwitchLine prompt="Remember your password?" linkLabel="Sign in" href="/login" />
    </AuthCard>
  );
}

function PasswordStep({ email, onBack }: { email: string; onBack: () => void }) {
  const router = useRouter();
  const form = useForm(newPasswordSchema, { password: "", confirmPassword: "" });
  const matches = form.values.confirmPassword.length > 0 && form.values.confirmPassword === form.values.password;

  const submit = form.handleSubmit(async ({ password }) => {
    await authService.changePassword({ password });
    notify.success("Password updated. Please sign in with your new password.");
    router.replace("/login");
  });

  return (
    <AuthCard>
      <AuthBackLink onClick={onBack} label="Back" />
      <AuthIconBadge icon={KeyRound} />
      <AuthHeading
        title="Create new password"
        description={
          <>
            Set a new secure password for <span className="font-semibold text-slate-800">{email}</span>.
          </>
        }
      />

      <form onSubmit={submit} noValidate className="space-y-5">
        <AuthField label="New password" htmlFor="password" error={form.errors.password}>
          <AuthPasswordInput {...form.field("password")} icon={Lock} autoComplete="new-password" placeholder="New password" disabled={form.submitting} />
        </AuthField>
        <PasswordStrength value={form.values.password} checklist />

        <AuthField label="Confirm new password" htmlFor="confirmPassword" error={form.errors.confirmPassword}>
          <div className="relative">
            <AuthPasswordInput {...form.field("confirmPassword")} icon={Lock} autoComplete="new-password" placeholder="Confirm new password" disabled={form.submitting} />
            {matches ? <Check className="pointer-events-none absolute top-1/2 right-10 size-4 -translate-y-1/2 text-emerald-600" /> : null}
          </div>
        </AuthField>

        <AuthSubmit loading={form.submitting}>{form.submitting ? "Updating…" : "Reset Password & Continue"}</AuthSubmit>
      </form>

      <AuthSpamNotice />
      <AuthSwitchLine prompt="Remember your credentials?" linkLabel="Sign in" href="/login" />
    </AuthCard>
  );
}
