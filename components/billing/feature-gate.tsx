"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Check, Lock, Sparkles } from "lucide-react";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { FEATURE_LABELS, PLAN_FEATURES, lowestPlanWith, type Feature } from "@/lib/plans";
import { usePlan } from "@/lib/plan-store";
import { cn } from "@/lib/utils";

const PRICE: Record<string, string> = { Starter: "₹499", Pro: "₹999" };

// Shows the page only when the owner's plan includes the feature; otherwise an upgrade card.
export function FeatureGate({ feature, children }: { feature: Feature; children: ReactNode }) {
  const { can, ready } = usePlan();
  if (!ready) return <PageSkeleton />;
  if (can(feature)) return <>{children}</>;
  return <UpgradeCard feature={feature} />;
}

export function UpgradeCard({ feature, compact, className }: { feature: Feature; compact?: boolean; className?: string }) {
  const need = lowestPlanWith(feature);
  const extras = PLAN_FEATURES[need].filter((f) => !PLAN_FEATURES.Starter.includes(f));
  return (
    <div className={cn("flex flex-col items-center rounded-3xl bg-[#f4f4f5] text-center", compact ? "px-6 py-8" : "mx-auto my-10 max-w-[560px] px-8 py-12", className)}>
      <span className="bg-brand/10 text-brand flex size-14 items-center justify-center rounded-2xl"><Lock className="size-6" /></span>
      <h2 className="font-inter mt-5 text-2xl font-extrabold tracking-[-0.03em] text-ink">{FEATURE_LABELS[feature]} is on the {need} plan</h2>
      <p className="mt-2 max-w-[420px] text-sm leading-6 text-slate-500">Upgrade to {need} ({PRICE[need]}/month) to turn it on. Your leads and settings stay exactly as they are.</p>
      {!compact ? (
        <ul className="mt-6 space-y-2 text-left text-sm text-slate-700">
          {extras.map((f) => (
            <li key={f} className="flex items-center gap-2"><Check className="text-brand size-4" />{FEATURE_LABELS[f]}</li>
          ))}
        </ul>
      ) : null}
      <Link href={`/choose-plan?plan=${need}`} className={cn(buttonVariants({ variant: "brand", size: "xl" }), "mt-7 rounded-full px-7")}>
        <Sparkles />Upgrade to {need}
      </Link>
    </div>
  );
}
