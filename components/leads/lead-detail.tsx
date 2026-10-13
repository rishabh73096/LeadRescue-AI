"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarClock, Clock, Activity as ActivityIcon, IndianRupee, Mail, MessageSquareText, Pencil, Phone, StickyNote, Trash2 } from "lucide-react";
import { Grid } from "@/components/charts/chart-card";
import { StatCard } from "@/components/charts/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { TextAreaField } from "@/components/ui/form-field";
import { LeadFormModal } from "@/components/leads/lead-form";
import { ActivityTimeline } from "@/components/leads/activity-timeline";
import { useMounted } from "@/hooks/use-mounted";
import { usePlan } from "@/lib/plan-store";
import { useNow } from "@/hooks/use-now";
import { cn } from "@/lib/utils";
import { relativeDay } from "@/lib/date";
import { formatInr, leadReason, sourceLabel, STATUSES } from "@/lib/leads";
import { notify } from "@/lib/toast";
import { addNote, deleteLead, restoreLead, inDays, setFollowUp, setLeadStatus, useActivities, useLead } from "@/services/leads";
import type { LeadStatus } from "@/types/lead";

const SNOOZE = [{ label: "Tomorrow", days: 1 }, { label: "In 3 days", days: 3 }, { label: "In a week", days: 7 }];

export function LeadDetail({ id }: { id: string }) {
  const router = useRouter();
  const mounted = useMounted();
  const now = useNow();
  const { can } = usePlan();
  const { lead, loaded } = useLead(id);
  const activities = useActivities(id);
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);

  if (!mounted || !loaded) return null;
  if (!lead) {
    return (
      <div className="space-y-4">
        <BackLink />
        <p className="text-sm text-slate-500">This lead no longer exists.</p>
      </div>
    );
  }

  const reason = leadReason(lead, now, can("reminders"));
  const digits = lead.phone.replace(/\D/g, "");

  const saveNote = () => {
    const text = note.trim();
    if (!text) return;
    addNote(lead.id, text);
    setNote("");
    notify.success("Note added");
  };

  return (
    <div className="space-y-6">
      <BackLink />
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[31px]">{lead.name}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{lead.service || "No service entered"} · {sourceLabel(lead.source)}</p>
          {reason ? <Badge tone="red" className="mt-3">{reason}</Badge> : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <NativeSelect aria-label="Status" value={lead.status} onChange={(e) => setLeadStatus(lead.id, e.target.value as LeadStatus)} className="w-40">
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </NativeSelect>
          <Button type="button" variant="panel" size="xl" className="rounded-full px-5" onClick={() => setEditing(true)}><Pencil />Edit</Button>
          <Link href={`/replies?lead=${lead.id}`} className={cn(buttonVariants({ variant: "brand", size: "xl" }), "rounded-full px-5")}><MessageSquareText />Draft reply</Link>
        </div>
      </header>

      <Grid cols={3}>
        <StatCard icon={IndianRupee} label="Estimated value" value={lead.value ? formatInr(lead.value) : "—"} />
        <StatCard icon={Clock} label="Days since enquiry" value={String(Math.max(0, Math.floor((now - new Date(lead.createdAt).getTime()) / 86_400_000)))} sub={sourceLabel(lead.source)} />
        <StatCard icon={ActivityIcon} label="Activity logged" value={String(activities.length)} />
      </Grid>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Panel className="p-5 sm:p-6">
            <PanelHeader title="Customer message" icon={MessageSquareText} />
            <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{lead.message || "No message saved."}</p>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader title="Activity" description="Everything that happened with this lead." icon={StickyNote} />
            <div className="mt-5">
              <TextAreaField value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note, e.g. called, will decide Friday" className="min-h-20" />
              <div className="mt-3 flex justify-end">
                <Button type="button" variant="brand" size="lg" className="h-10 rounded-full px-5" disabled={!note.trim()} onClick={saveNote}>Add note</Button>
              </div>
            </div>
            <ActivityTimeline activities={activities} createdAt={lead.createdAt} className="mt-6" />
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="p-5 sm:p-6">
            <PanelHeader title="Contact" />
            <dl className="mt-4 space-y-3 text-sm">
              <Row icon={Phone} label="Phone">{lead.phone ? <a href={`tel:${lead.phone}`} className="text-brand font-medium hover:underline">{lead.phone}</a> : "—"}</Row>
              <Row icon={Mail} label="Email">{lead.email ? <a href={`mailto:${lead.email}`} className="text-brand font-medium hover:underline">{lead.email}</a> : "—"}</Row>
            </dl>
            {digits ? (
              <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "neutral", size: "lg" }), "mt-4 h-10 w-full rounded-full")}>Open WhatsApp chat</a>
            ) : null}
            <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">Estimated value <span className="ml-1 font-semibold text-ink">{lead.value ? formatInr(lead.value) : "—"}</span></p>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader title="Next follow-up" icon={CalendarClock} />
            <p className="mt-4 text-sm text-ink">{lead.nextFollowUpAt ? relativeDay(new Date(lead.nextFollowUpAt), now) : "Not scheduled"}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SNOOZE.map((o) => (
                <Button key={o.days} type="button" variant="soft" size="lg" className="h-9 rounded-full px-4" onClick={() => { setFollowUp(lead.id, inDays(o.days)); notify.success(`Follow-up ${o.label.toLowerCase()}`); }}>{o.label}</Button>
              ))}
              {lead.nextFollowUpAt ? <Button type="button" variant="ghost" size="lg" className="h-9 rounded-full px-4" onClick={() => setFollowUp(lead.id, null)}>Clear</Button> : null}
            </div>
          </Panel>

          <Button type="button" variant="destructive" size="lg" className="h-10 w-full rounded-full" onClick={() => { const gone = lead; deleteLead(lead.id); notify.action("Lead deleted", { label: "Undo", run: () => { restoreLead(gone); notify.success("Lead restored"); router.replace(`/leads/${gone.id}`); } }, gone.name); router.replace("/leads"); }}><Trash2 />Delete lead</Button>
        </div>
      </div>

      <LeadFormModal open={editing} lead={lead} onClose={() => setEditing(false)} />
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/leads" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-ink">
      <ArrowLeft className="size-4" /> All leads
    </Link>
  );
}

function Row({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 text-slate-400" />
      <dt className="sr-only">{label}</dt>
      <dd className="min-w-0 truncate">{children}</dd>
    </div>
  );
}
