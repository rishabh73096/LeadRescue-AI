"use client";

import { BarsH } from "@/components/charts/charts";
import { ChartCard, Grid } from "@/components/charts/chart-card";
import { useAdminData } from "@/services/admin";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { Check, Minus } from "lucide-react";
import { LANDING } from "@/config/landing";
import { ALL_FEATURES, FEATURE_LABELS, planHas } from "@/lib/plans";
import { UPI_PAYEE, UPI_VPA } from "@/lib/upi";

export function PlansView() {
  const { data } = useAdminData();
  const mix = LANDING.pricing.plans.map((p) => ({ label: p.name, value: data?.subscriptions.filter((s) => s.status === "active" && s.plan === p.name).length ?? 0 }));
  return (
    <div className="space-y-6">
      <PageHeader title="Plans and payment setup" description="Read-only. Prices live in config/landing.ts and must match the payments table check in the SQL migration." />
      <Grid cols={2}>
        {LANDING.pricing.plans.map((p) => (
          <Panel key={p.name} className="p-6">
            <p className="text-sm font-bold text-ink">{p.name}</p>
            <p className="font-inter mt-2 text-3xl font-extrabold tracking-[-0.03em] text-ink">{p.price}<span className="ml-1 text-xs font-normal text-slate-500">a month</span></p>
            <ul className="mt-4 space-y-2 text-[13px] text-slate-700">
              {p.features.map((f) => <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-brand" />{f}</li>)}
            </ul>
          </Panel>
        ))}
      </Grid>
      <Panel className="overflow-hidden">
        <div className="p-5 sm:p-6"><p className="text-base font-bold text-ink">What each plan includes</p><p className="mt-0.5 text-sm text-slate-500">Enforced in the app and in the database. Change in lib/plans.ts and supabase/migrations/0006.</p></div>
        <table className="w-full text-left text-sm">
          <thead><tr className="border-y border-slate-100 bg-slate-50/60 text-[10px] font-semibold tracking-wider text-slate-400 uppercase"><th className="px-5 py-3">Feature</th><th className="px-5 py-3">Starter</th><th className="px-5 py-3">Pro</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {ALL_FEATURES.map((f) => (
              <tr key={f}>
                <td className="px-5 py-3 text-slate-700">{FEATURE_LABELS[f]}</td>
                {(["Starter", "Pro"] as const).map((p) => <td key={p} className="px-5 py-3">{planHas(p, f) ? <Check className="text-brand size-4" /> : <Minus className="size-4 text-slate-300" />}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <ChartCard title="Customers per plan" description="Active subscriptions" table={{ head: ["Plan", "Customers"], rows: mix.map((m) => [m.label, m.value]) }}>
        <BarsH data={mix} name="Customers" height={120} />
      </ChartCard>
      <Panel className="p-6">
        <p className="text-sm font-bold text-ink">UPI receiver</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-slate-500">UPI ID</dt><dd className="font-semibold text-ink">{UPI_VPA || <span className="text-[#c2262e]">Not set (NEXT_PUBLIC_UPI_VPA)</span>}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Payee name</dt><dd className="font-semibold text-ink">{UPI_PAYEE}</dd></div>
        </dl>
      </Panel>
    </div>
  );
}
