import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, CircleHelp, ShieldCheck, TriangleAlert, type LucideIcon } from "lucide-react";
import { SUPPORT_HREF } from "@/config/auth";

export function AuthBackLink({ href = "/login", label = "Back to Sign In", onClick }: { href?: string; label?: string; onClick?: () => void }) {
  const classes = "hover:text-brand mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors";
  const content = (
    <>
      <ArrowLeft className="size-3.5" />
      {label}
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

export function AuthIconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="bg-brand-soft text-brand mb-5 flex size-12 items-center justify-center rounded-xl">
      <Icon className="size-5" />
    </span>
  );
}

export function AuthError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium">
      <TriangleAlert className="size-4 shrink-0" />
      {message}
    </p>
  );
}

export function DevCode({ code, label = "verification code" }: { code?: string; label?: string }) {
  if (!code) return null;
  return (
    <p className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">
      Dev mode — {label}: <span className="font-mono font-semibold">{code}</span>
    </p>
  );
}

export function AuthSupportFooter({ prompt, linkLabel, href }: { prompt: string; linkLabel: string; href: string }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-500">
      <Link href={SUPPORT_HREF} className="hover:text-brand inline-flex items-center gap-1.5">
        <CircleHelp className="size-4" />
        Help &amp; Support
      </Link>
      <span aria-hidden className="h-4 w-px bg-slate-200" />
      <span>
        {prompt}{" "}
        <Link href={href} className="text-brand font-semibold hover:underline">
          {linkLabel}
        </Link>
      </span>
    </div>
  );
}

export function AuthSwitchLine({ prompt, linkLabel, href }: { prompt: string; linkLabel: string; href: string }) {
  return (
    <p className="mt-5 text-center text-xs text-slate-500">
      {prompt}{" "}
      <Link href={href} className="text-brand font-semibold hover:underline">
        {linkLabel}
      </Link>
    </p>
  );
}

export function AuthSpamNotice() {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-[10px] leading-relaxed text-slate-500">
      <ShieldCheck className="text-brand mt-0.5 size-3.5 shrink-0" />
      <p>
        Didn&apos;t receive an email? Check your spam folder or{" "}
        <Link href={SUPPORT_HREF} className="text-brand font-medium underline">
          contact 24/7 Concierge Support
        </Link>{" "}
        for Amy&apos;s instant help.
      </p>
    </div>
  );
}

export function AuthInfoLine({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <p className="text-brand/90 flex items-center gap-2 text-xs">
      <Icon className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}
