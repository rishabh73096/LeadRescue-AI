"use client";

import Link from "next/link";
import { ArrowRight, CircleDollarSign, Clock, Repeat, Users, type LucideIcon } from "lucide-react";
import { DemoBanner, PLAN_PRICE, Table, Who, fmtDateTime, profileOf } from "@/components/admin/admin-ui";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
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

  return (
    <div className="space-y-6">
      <PageHeader title="Admin" description="Payments to verify, customers and subscription health." />
      <DemoBanner show={data.demo} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Users} label="Customers" value={String(data.profiles.length)} href="/admin/customers" />
        <Stat icon={Repeat} label="Active subscriptions" value={String(active.length)} href="/admin/subscriptions" />
        <Stat icon={Clock} label="Payments to verify" value={String(pending.length)} href="/admin/payments" />
        <Stat icon={CircleDollarSign} label="MRR" value={formatInr(mrr)} sub={`${formatInr(collected)} collected, last 30 days`} href="/admin/payments" />
      </div>

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

function Stat({ icon: Icon, label, value, sub, href }: { icon: LucideIcon; label: string; value: string; sub?: string; href: string }) {
  return (
    <Link href={href} className="block">
      <Panel className="p-5 transition-shadow hover:shadow-md">
        <span className="flex size-10 items-center justify-center rounded-lg bg-[#e8e6fb] text-[#3b2fd0]"><Icon className="size-[18px]" /></span>
        <p className="font-inter mt-4 text-3xl font-extrabold tracking-[-0.03em] text-ink">{value}</p>
        <p className="mt-1 text-sm text-slate-500">{label}</p>
        {sub ? <p className="mt-0.5 text-xs text-slate-400">{sub}</p> : null}
      </Panel>
    </Link>
  );
}
