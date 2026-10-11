"use client";

import Link from "next/link";
import { ArrowRight, CircleDollarSign, Clock, Repeat, Users } from "lucide-react";
import { DemoBanner, PLAN_PRICE, Table, Who, fmtDateTime, profileOf } from "@/components/admin/admin-ui";
import { BarsH, Columns } from "@/components/charts/charts";
import { ChartCard, Grid } from "@/components/charts/chart-card";
import { StatCard } from "@/components/charts/stat-card";
import { PageHeader } from "@/components/ui/page-header";
import { useNow } from "@/hooks/use-now";
import { formatInr } from "@/lib/leads";
import { useAdminData } from "@/services/admin";

export function AdminOverview() {
  const { data } = useAdminData();
  const now = useNow();
  if (!data) return null;

  const active = data.subscriptions.filter((s) => s.status === "active" && new Date(s.current_period_end).getTime() > now);
  const mrr = active.reduce((sum, s) => sum + (PLAN_PRICE[s.plan] ?? 0), 0);
  const pending = data.payments.filter((p) => p.status === "pending");
  const monthAgo = now - 30 * 86_400_000;
  const collected = data.payments.filter((p) => p.status === "verified" && new Date(p.created_at).getTime() > monthAgo).reduce((s, p) => s + p.amount_inr, 0);

  const monthStart = (back: number) => new Date(new Date(now).getFullYear(), new Date(now).getMonth() - back, 1);
  const months = Array.from({ length: 6 }, (_, i) => {
    const from = monthStart(5 - i).getTime();
    const to = monthStart(4 - i).getTime();
    return { label: monthStart(5 - i).toLocaleDateString("en-IN", { month: "short" }), value: data.payments.filter((p) => p.status === "verified" && new Date(p.created_at).getTime() >= from && new Date(p.created_at).getTime() < to).reduce((n, p) => n + p.amount_inr, 0) };
  });
  const planMix = Object.keys(PLAN_PRICE).map((name) => ({ label: name, value: active.filter((s) => s.plan === name).length }));

  return (
    <div className="space-y-6">
      <PageHeader title="Admin" description="Payments to verify, customers and subscription health." />
      <DemoBanner show={data.demo} />
      <Grid cols={4}>
        <StatCard icon={Users} label="Customers" value={String(data.profiles.length)} href="/admin/customers" />
        <StatCard icon={Repeat} label="Active subscriptions" value={String(active.length)} href="/admin/subscriptions" />
        <StatCard icon={Clock} label="Payments to verify" value={String(pending.length)} tone={pending.length ? "red" : undefined} href="/admin/payments" />
        <StatCard icon={CircleDollarSign} label="MRR" value={formatInr(mrr)} sub={`${formatInr(collected)} collected, last 30 days`} href="/admin/payments" />
      </Grid>
      <Grid cols={3}>
        <ChartCard title="Revenue per month" description="Verified payments, last 6 months" className="md:col-span-2" table={{ head: ["Month", "Revenue"], rows: months.map((m) => [m.label, formatInr(m.value)]) }}>
          <Columns data={months} series={[{ key: "value", name: "Revenue", color: "var(--viz-1)" }]} format={(n) => formatInr(n)} />
        </ChartCard>
        <ChartCard title="Active plans" description="Customers on each plan" table={{ head: ["Plan", "Customers"], rows: planMix.map((p) => [p.label, p.value]) }}>
          <BarsH data={planMix} name="Customers" height={140} />
        </ChartCard>
      </Grid>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink">Waiting for verification</h2>
          <Link href="/admin/payments" className="text-brand inline-flex items-center gap-1 text-sm font-semibold hover:underline">Open queue<ArrowRight className="size-3.5" /></Link>
        </div>
        <Table head={["Customer", "Plan", "Amount", "UTR", "Submitted"]} empty="No payments waiting.">
          {pending.slice(0, 5).map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3.5"><Who profile={profileOf(data, p.user_id)} /></td>
              <td className="px-4 py-3.5">{p.plan}</td>
              <td className="px-4 py-3.5">{formatInr(p.amount_inr)}</td>
              <td className="px-4 py-3.5 font-mono text-xs">{p.upi_ref}</td>
              <td className="px-4 py-3.5 text-slate-500">{fmtDateTime(p.created_at)}</td>
            </tr>
          ))}
        </Table>
      </section>
    </div>
  );
}
