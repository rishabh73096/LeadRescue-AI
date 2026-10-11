"use client";

import Link from "next/link";
import { AlertTriangle, CalendarCheck, CalendarClock, CalendarDays, Check, ChevronRight, CircleOff } from "lucide-react";
import { ChartCard, Grid } from "@/components/charts/chart-card";
import { Columns } from "@/components/charts/charts";
import { StatCard } from "@/components/charts/stat-card";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { useMounted } from "@/hooks/use-mounted";
import { useNow } from "@/hooks/use-now";
import { addDays, relativeDay, startOfDay } from "@/lib/date";
import { isOpen, leadReason, statusMeta } from "@/lib/leads";
import { dueNextDays } from "@/lib/stats";
import { notify } from "@/lib/toast";
import { completeFollowUp, useLeads } from "@/services/leads";
import type { Lead } from "@/types/lead";

export function FollowUpsView() {
  const mounted = useMounted();
  const now = useNow();
  const { leads } = useLeads();

  if (!mounted) return null;

  const today = startOfDay(now).getTime();
  const tomorrow = addDays(today, 1).getTime();
  const open = leads.filter(isOpen);
  const due = (l: Lead) => (l.nextFollowUpAt ? new Date(l.nextFollowUpAt).getTime() : null);
  const byDue = (a: Lead, b: Lead) => (due(a) ?? 0) - (due(b) ?? 0);

  const groups: { title: string; tone: BadgeTone; empty: string; items: Lead[] }[] = [
    { title: "Overdue", tone: "red", empty: "Nothing overdue. Nice.", items: open.filter((l) => (due(l) ?? Infinity) < today).sort(byDue) },
    { title: "Due today", tone: "amber", empty: "No follow-ups due today.", items: open.filter((l) => { const d = due(l); return d !== null && d >= today && d < tomorrow; }).sort(byDue) },
    { title: "Upcoming", tone: "blue", empty: "No upcoming follow-ups.", items: open.filter((l) => (due(l) ?? -1) >= tomorrow).sort(byDue) },
    { title: "No date set", tone: "slate", empty: "Every open lead has a follow-up date.", items: open.filter((l) => due(l) === null) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Follow-ups" description="Who to contact next. Mark one done and pick when to follow up again." />
      <Grid cols={4}>
        <StatCard icon={AlertTriangle} label="Overdue" value={String(groups[0].items.length)} tone={groups[0].items.length ? "red" : undefined} />
        <StatCard icon={CalendarClock} label="Due today" value={String(groups[1].items.length)} />
        <StatCard icon={CalendarDays} label="Upcoming" value={String(groups[2].items.length)} />
        <StatCard icon={CircleOff} label="No date set" value={String(groups[3].items.length)} />
      </Grid>
      <ChartCard title="Workload this week" description="Follow-ups due each day, next 7 days" table={{ head: ["Day", "Follow-ups"], rows: dueNextDays(leads, 7, now).map((p) => [p.label, p.value]) }}>
        <Columns data={dueNextDays(leads, 7, now)} series={[{ key: "value", name: "Follow-ups", color: "var(--viz-1)" }]} height={200} />
      </ChartCard>
      {groups.map((g) => (
        <section key={g.title} aria-label={g.title}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
            {g.title} <Badge tone={g.tone} size="sm">{g.items.length}</Badge>
          </h2>
          {g.items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">{g.empty}</p>
          ) : (
            <Panel className="divide-y divide-slate-100">
              {g.items.map((l) => <Row key={l.id} lead={l} now={now} />)}
            </Panel>
          )}
        </section>
      ))}
    </div>
  );
}

function Row({ lead, now }: { lead: Lead; now: number }) {
  const reason = leadReason(lead, now);
  const done = (days: number) => {
    completeFollowUp(lead.id, days);
    notify.success(`${lead.name}: next follow-up in ${days} day${days > 1 ? "s" : ""}`);
  };
  return (
    <div className="animate-in fade-in slide-in-from-left-2 flex flex-wrap items-center gap-x-4 gap-y-3 p-4 transition-colors duration-150 hover:bg-slate-50/70">
      <div className="min-w-0 flex-1 basis-56">
        <Link href={`/leads/${lead.id}`} className="inline-flex items-center gap-1 font-semibold text-ink hover:text-brand">
          {lead.name}<ChevronRight className="size-3.5 text-slate-400" />
        </Link>
        <p className="mt-0.5 truncate text-xs text-slate-500">{lead.service || "No service"} · {statusMeta(lead.status).label}</p>
        <p className="mt-1 text-xs text-slate-500">{lead.nextFollowUpAt ? relativeDay(new Date(lead.nextFollowUpAt), now) : "No date"}{reason ? <span className="ml-2 font-medium text-[#c2262e]">{reason}</span> : null}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-medium text-slate-500"><CalendarCheck className="size-3.5" />Done, next in</span>
        {[1, 3, 7].map((d) => (
          <Button key={d} type="button" variant="soft" size="lg" className="h-8 rounded-full px-3 text-xs" onClick={() => done(d)}>
            <Check className="size-3" />{d}d
          </Button>
        ))}
      </div>
    </div>
  );
}
