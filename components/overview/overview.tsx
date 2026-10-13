"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarClock, ContactRound, IndianRupee, Percent } from "lucide-react";
import { AreaTrend, BarsH, Columns, STAGE_COLORS } from "@/components/charts/charts";
import { ChartCard, Grid } from "@/components/charts/chart-card";
import { StatCard } from "@/components/charts/stat-card";
import { ActivityTimeline } from "@/components/leads/activity-timeline";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { useAuth } from "@/context/AuthContext";
import { useMounted } from "@/hooks/use-mounted";
import { useNow } from "@/hooks/use-now";
import { addDays, startOfDay } from "@/lib/date";
import { formatInr, isOpen, leadReason } from "@/lib/leads";
import { dueNextDays, perDay, sourceCounts, stageCounts, stageValues, sum, winRate } from "@/lib/stats";
import { usePlan } from "@/lib/plan-store";
import { UpgradeCard } from "@/components/billing/feature-gate";
import { useActivities, useLeads } from "@/services/leads";
import type { Lead } from "@/types/lead";

const compactInr = (n: number) => (n >= 100000 ? `₹${+(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${+(n / 1000).toFixed(1)}K` : `₹${n}`);

export function Overview() {
  const mounted = useMounted();
  const now = useNow();
  const user = useAuth();
  const { can } = usePlan();
  const { leads } = useLeads();
  const activities = useActivities();

  if (!mounted) return null;

  const today = startOfDay(now).getTime();
  const tomorrow = addDays(today, 1).getTime();
  const open = leads.filter(isOpen);
  const due = (l: Lead) => (l.nextFollowUpAt ? new Date(l.nextFollowUpAt).getTime() : null);
  const attention = open.map((l) => ({ lead: l, reason: leadReason(l, now, can("reminders")) })).filter((x): x is { lead: Lead; reason: string } => x.reason !== null);
  const dueToday = open.filter((l) => { const d = due(l); return d !== null && d >= today && d < tomorrow; });
  const openValue = sum(open.map((l) => l.value));
  const wonValue = sum(leads.filter((l) => l.status === "won").map((l) => l.value));
  const rate = winRate(leads);
  const first = user?.fullName?.split(" ")[0];

  const trend = perDay(leads, (l) => l.createdAt, 14, now);
  const stages = stageCounts(leads).map((s) => ({ label: s.label, value: s.value, color: STAGE_COLORS[s.key] }));
  const values = stageValues(leads).map((s) => ({ label: s.label, value: s.value, color: STAGE_COLORS[s.key] }));
  const sources = sourceCounts(leads);
  const load = dueNextDays(leads, 7, now);
  const nameOf = (id: string) => leads.find((l) => l.id === id)?.name ?? "Deleted lead";

  return (
    <div className="space-y-6">
      <PageHeader title={first ? `Hi ${first}, here’s today` : "Today"} description="Leads that need a reply, and how the pipeline looks." />

      <Grid cols={4}>
        <StatCard icon={ContactRound} label="Open leads" value={String(open.length)} sub={`${leads.length} in total`} spark={trend.map((p) => p.value)} href="/leads" />
        <StatCard icon={AlertTriangle} label="Need attention" value={String(attention.length)} sub={`${dueToday.length} due today`} tone={attention.length ? "red" : undefined} href="/follow-ups" />
        <StatCard icon={IndianRupee} label="Open pipeline value" value={formatInr(openValue)} sub={`${formatInr(wonValue)} won`} href="/pipeline" />
        <StatCard icon={Percent} label="Win rate" value={rate === null ? "—" : `${rate}%`} sub="Won of closed leads" href="/pipeline" />
      </Grid>

      <Grid cols={2}>
        <ChartCard title="New leads" description="Last 14 days" table={{ head: ["Day", "Leads"], rows: trend.map((p) => [p.label, p.value]) }}>
          <AreaTrend data={trend} name="New leads" />
        </ChartCard>
        <ChartCard title="Pipeline by stage" description="Number of leads in each stage" table={{ head: ["Stage", "Leads"], rows: stages.map((s) => [s.label, s.value]) }}>
          <BarsH data={stages} name="Leads" height={220} />
        </ChartCard>
      </Grid>

      <Grid cols={3}>
        <ChartCard title="Where leads come from" description="By source" table={{ head: ["Source", "Leads"], rows: sources.map((s) => [s.label, s.value]) }}>
          {sources.length ? <BarsH data={sources} name="Leads" /> : <Empty />}
        </ChartCard>
        <ChartCard title="Value by stage" description="Estimated ₹ in each stage" table={{ head: ["Stage", "Value"], rows: values.map((s) => [s.label, formatInr(s.value)]) }}>
          <Columns data={values} series={[{ key: "value", name: "Value", color: "var(--viz-1)" }]} format={compactInr} />
        </ChartCard>
        <ChartCard title="Follow-ups coming up" description="Due in the next 7 days" table={{ head: ["Day", "Follow-ups"], rows: load.map((p) => [p.label, p.value]) }}>
          <Columns data={load} series={[{ key: "value", name: "Follow-ups", color: "var(--viz-3)" }]} />
        </ChartCard>
      </Grid>

      <Grid cols={2}>
        {can("overdueDashboard") ? (
          <Panel className="p-5 sm:p-6">
          <PanelHeader title="Needs a reply" description="Sorted by what slipped first." icon={AlertTriangle} aside={<Link href="/follow-ups" className="text-brand inline-flex items-center gap-1 text-sm font-semibold hover:underline">All follow-ups<ArrowRight className="size-3.5" /></Link>} />
          {attention.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">You&apos;re all caught up.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {attention.slice(0, 6).map(({ lead, reason }) => (
                <li key={lead.id}>
                  <Link href={`/leads/${lead.id}`} className="group flex items-center justify-between gap-3 py-3 transition-transform duration-200 hover:translate-x-1">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{lead.name}</p>
                      <p className="truncate text-xs text-slate-500">{lead.service || "No service"}</p>
                    </div>
                    <Badge tone="red" size="sm">{reason}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        ) : (
          <UpgradeCard feature="overdueDashboard" compact />
        )}

        <Panel className="p-5 sm:p-6">
          <PanelHeader title="Recent activity" icon={CalendarClock} />
          {activities.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">Activity appears here as you work your leads.</p>
          ) : (
            <ActivityTimeline className="mt-5" createdAt="" activities={activities.slice(0, 6).map((a) => ({ ...a, body: `${nameOf(a.leadId)}: ${a.body}` }))} />
          )}
        </Panel>
      </Grid>
    </div>
  );
}

const Empty = () => <p className="py-10 text-center text-sm text-slate-400">No data yet.</p>;
