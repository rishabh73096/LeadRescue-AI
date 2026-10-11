"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarClock, ContactRound, IndianRupee, Trophy, type LucideIcon } from "lucide-react";
import { ActivityTimeline } from "@/components/leads/activity-timeline";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { useAuth } from "@/context/AuthContext";
import { useMounted } from "@/hooks/use-mounted";
import { useNow } from "@/hooks/use-now";
import { addDays, startOfDay } from "@/lib/date";
import { formatInr, isOpen, leadReason, STATUSES } from "@/lib/leads";
import { cn } from "@/lib/utils";
import { useActivities, useLeads } from "@/services/leads";

export function Overview() {
  const mounted = useMounted();
  const now = useNow();
  const user = useAuth();
  const { leads } = useLeads();
  const activities = useActivities();

  if (!mounted) return null;

  const today = startOfDay(now).getTime();
  const tomorrow = addDays(today, 1).getTime();
  const open = leads.filter(isOpen);
  const due = (l: (typeof leads)[number]) => (l.nextFollowUpAt ? new Date(l.nextFollowUpAt).getTime() : null);
  const attention = open
    .map((l) => ({ lead: l, reason: leadReason(l, now) }))
    .filter((x): x is { lead: (typeof leads)[number]; reason: string } => x.reason !== null);
  const dueToday = open.filter((l) => { const d = due(l); return d !== null && d >= today && d < tomorrow; });
  const openValue = open.reduce((s, l) => s + l.value, 0);
  const wonValue = leads.filter((l) => l.status === "won").reduce((s, l) => s + l.value, 0);
  const max = Math.max(1, ...STATUSES.map((s) => leads.filter((l) => l.status === s.value).length));
  const nameOf = (id: string) => leads.find((l) => l.id === id)?.name ?? "Deleted lead";
  const first = user?.fullName?.split(" ")[0];

  return (
    <div className="space-y-6">
      <PageHeader title={first ? `Hi ${first}, here's today` : "Today"} description="Leads that need a reply, and how the pipeline looks." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={ContactRound} label="Open leads" value={String(open.length)} href="/leads" />
        <Stat icon={AlertTriangle} label="Need attention" value={String(attention.length)} tone={attention.length ? "red" : undefined} href="/follow-ups" />
        <Stat icon={CalendarClock} label="Due today" value={String(dueToday.length)} href="/follow-ups" />
        <Stat icon={IndianRupee} label="Open pipeline value" value={formatInr(openValue)} sub={`${formatInr(wonValue)} won`} href="/pipeline" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Panel className="p-5 sm:p-6">
          <PanelHeader title="Needs a reply" description="Sorted by what slipped first." icon={AlertTriangle} aside={<Link href="/follow-ups" className="text-brand inline-flex items-center gap-1 text-sm font-semibold hover:underline">All follow-ups<ArrowRight className="size-3.5" /></Link>} />
          {attention.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">You&apos;re all caught up.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {attention.slice(0, 6).map(({ lead, reason }) => (
                <li key={lead.id}>
                  <Link href={`/leads/${lead.id}`} className="flex items-center justify-between gap-3 py-3 hover:opacity-80">
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

        <Panel className="p-5 sm:p-6">
          <PanelHeader title="Pipeline" icon={Trophy} />
          <ul className="mt-5 space-y-3">
            {STATUSES.map((s) => {
              const n = leads.filter((l) => l.status === s.value).length;
              return (
                <li key={s.value} className="flex items-center gap-3 text-sm">
                  <span className="w-24 shrink-0 text-slate-600">{s.label}</span>
                  <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <span className="bg-brand block h-full rounded-full" style={{ width: `${(n / max) * 100}%` }} />
                  </span>
                  <span className="w-6 text-right font-semibold text-ink">{n}</span>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <Panel className="p-5 sm:p-6">
        <PanelHeader title="Recent activity" />
        {activities.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">Activity appears here as you work your leads.</p>
        ) : (
          <ActivityTimeline
            className="mt-5"
            createdAt=""
            activities={activities.slice(0, 8).map((a) => ({ ...a, body: `${nameOf(a.leadId)}: ${a.body}` }))}
          />
        )}
      </Panel>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, href, tone }: { icon: LucideIcon; label: string; value: string; sub?: string; href: string; tone?: "red" }) {
  return (
    <Link href={href} className="block">
      <Panel className="p-5 transition-shadow hover:shadow-md">
        <span className={cn("flex size-10 items-center justify-center rounded-lg", tone === "red" ? "bg-[#fde0e0] text-[#c2262e]" : "bg-[#e8e6fb] text-[#3b2fd0]")}><Icon className="size-[18px]" /></span>
        <p className="font-inter mt-4 text-3xl font-extrabold tracking-[-0.03em] text-ink">{value}</p>
        <p className="mt-1 text-sm text-slate-500">{label}</p>
        {sub ? <p className="mt-0.5 text-xs text-slate-400">{sub}</p> : null}
      </Panel>
    </Link>
  );
}
