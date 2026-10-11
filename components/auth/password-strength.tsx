"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "At least one uppercase & lowercase letter", test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: "At least one number", test: (v: string) => /\d/.test(v) },
  { label: "At least one special symbol (@, $, #, %)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const LEVELS = ["Weak", "Fair", "Good", "Strong"] as const;

export function passwordScore(value: string): number {
  return PASSWORD_RULES.filter((r) => r.test(value)).length;
}

export function PasswordStrength({ value, checklist = false }: { value: string; checklist?: boolean }) {
  const score = passwordScore(value);
  const level = value ? LEVELS[Math.max(score - 1, 0)] : null;
  const color = score >= 4 ? "bg-emerald-500" : score === 3 ? "bg-lime-500" : score === 2 ? "bg-amber-400" : "bg-rose-400";

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn("h-1 flex-1 rounded-full bg-slate-200 transition-colors", i < score && color)} />
        ))}
      </div>
      {level ? <p className="sr-only">Password strength: {level}</p> : null}
      {checklist ? (
        <ul className="space-y-1.5 rounded-xl bg-emerald-50/70 p-3.5">
          {PASSWORD_RULES.map((rule) => {
            const ok = rule.test(value);
            return (
              <li key={rule.label} className={cn("flex items-center gap-2 text-xs", ok ? "text-emerald-700" : "text-slate-500")}>
                <span className={cn("flex size-4 items-center justify-center rounded-full", ok ? "bg-emerald-600 text-white" : "bg-slate-200 text-transparent")}>
                  <Check className="size-2.5" />
                </span>
                {rule.label}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Check className={cn("size-3", score >= 4 ? "text-emerald-600" : "text-slate-300")} />
          8+ chars, uppercase, number &amp; symbol
        </p>
      )}
    </div>
  );
}

export function StrengthLabel({ value }: { value: string }) {
  if (!value) return null;
  const score = passwordScore(value);
  return <span className={cn("text-xs font-semibold", score >= 4 ? "text-emerald-600" : score >= 3 ? "text-lime-600" : "text-amber-600")}>{LEVELS[Math.max(score - 1, 0)]}</span>;
}
