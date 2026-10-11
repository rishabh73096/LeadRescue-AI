"use client";

import { Check } from "lucide-react";
import { BarsH } from "@/components/charts/charts";
import { ChartCard, Grid } from "@/components/charts/chart-card";
import { useAdminData } from "@/services/admin";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { LANDING } from "@/config/landing";
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
