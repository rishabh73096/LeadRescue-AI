"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy, Languages, MessageCircle, MessageSquareText, Sparkles, UserX } from "lucide-react";
import { ChartCard, Grid } from "@/components/charts/chart-card";
import { Columns } from "@/components/charts/charts";
import { StatCard } from "@/components/charts/stat-card";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { TextAreaField } from "@/components/ui/form-field";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useNow } from "@/hooks/use-now";
import { draftsByLanguage } from "@/lib/stats";
import { useMounted } from "@/hooks/use-mounted";
import { draftReply } from "@/lib/draft-reply";
import { sourceLabel } from "@/lib/leads";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/toast";
import { draftsThisMonth, saveDraft, useDrafts } from "@/services/drafts";
import { useLeads } from "@/services/leads";
import { useSettings } from "@/services/settings";
import type { Language } from "@/types/lead";

const LANGS: { value: Language; label: string }[] = [{ value: "en", label: "English" }, { value: "hi", label: "हिन्दी" }];
export const MONTHLY_DRAFT_CAP = 100;

export function RepliesView({ initialLead }: { initialLead?: string }) {
  const mounted = useMounted();
  const now = useNow();
  const reduced = useReducedMotion();
  const { leads } = useLeads();
  const settings = useSettings();
  const drafts = useDrafts();
  const [leadId, setLeadId] = useState(initialLead ?? "");
  const [language, setLanguage] = useState<Language | null>(null);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  if (!mounted) return null;

  const lead = leads.find((l) => l.id === leadId);
  const lang = language ?? settings.language;
  const used = draftsThisMonth(drafts);
  const history = drafts.filter((d) => !lead || d.leadId === lead.id).slice(0, 6);

  const generate = (l: Language = lang) => {
    if (!lead) return notify.error("Pick a lead first.");
    if (used >= MONTHLY_DRAFT_CAP) return notify.error(`Monthly draft limit (${MONTHLY_DRAFT_CAP}) reached.`);
    const next = draftReply(lead, l, settings);
    saveDraft(lead.id, l, next);
    if (timer.current) clearInterval(timer.current);
    if (reduced) return setText(next);
    // type the draft out so it feels like it is being written
    setText("");
    setTyping(true);
    let i = 0;
    timer.current = setInterval(() => {
      i += 3;
      setText(next.slice(0, i));
      if (i >= next.length) {
        if (timer.current) clearInterval(timer.current);
        setTyping(false);
      }
    }, 16);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      notify.error("Couldn't copy. Select the text and copy it manually.");
    }
  };

  const digits = lead?.phone.replace(/\D/g, "") ?? "";

  return (
    <div className="space-y-6">
      <PageHeader title="AI Replies" description="Draft a reply from the customer's enquiry, edit it, then send it yourself. Nothing is sent automatically." />
      <Grid cols={3}>
        <StatCard icon={MessageSquareText} label="Drafts this month" value={String(used)} sub={`${MONTHLY_DRAFT_CAP - used} left`} />
        <StatCard icon={Languages} label="Hindi drafts" value={String(drafts.filter((d) => d.language === "hi").length)} sub={`${drafts.filter((d) => d.language === "en").length} English`} />
        <StatCard icon={UserX} label="Leads without a draft" value={String(leads.filter((l) => !drafts.some((d) => d.leadId === l.id)).length)} />
      </Grid>
      <ChartCard title="Drafts per day" description="Last 14 days" legend={[{ label: "English", color: "var(--viz-1)" }, { label: "Hindi", color: "var(--viz-2)" }]} table={{ head: ["Day", "English", "Hindi"], rows: draftsByLanguage(drafts, 14, now).map((r) => [r.label, r.en, r.hi]) }}>
        <Columns data={draftsByLanguage(drafts, 14, now)} series={[{ key: "en", name: "English", color: "var(--viz-1)" }, { key: "hi", name: "Hindi", color: "var(--viz-2)" }]} height={180} />
      </ChartCard>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div>
              <label htmlFor="lead" className="mb-2 block text-[13px] font-semibold text-ink">Lead</label>
              <NativeSelect id="lead" value={leadId} onChange={(e) => { setLeadId(e.target.value); setText(""); }}>
                <option value="">Select a lead…</option>
                {leads.map((l) => <option key={l.id} value={l.id}>{l.name} · {l.service || sourceLabel(l.source)}</option>)}
              </NativeSelect>
            </div>
            <div>
              <span className="mb-2 block text-[13px] font-semibold text-ink">Language</span>
              <div role="group" aria-label="Language" className="flex h-11 rounded-lg bg-[#ebf8f3] p-1">
                {LANGS.map((o) => (
                  <button key={o.value} type="button" aria-pressed={lang === o.value} onClick={() => { setLanguage(o.value); if (text) generate(o.value); }} className={cn("rounded-md px-4 text-sm font-medium", lang === o.value ? "bg-white text-ink shadow-sm" : "text-slate-500")}>{o.label}</button>
                ))}
              </div>
            </div>
          </div>

          {lead ? (
            <div className="rounded-xl bg-slate-50 p-4 text-sm">
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Customer wrote</p>
              <p className="mt-1.5 whitespace-pre-wrap text-slate-700">{lead.message || "No message saved."}</p>
              <Link href={`/leads/${lead.id}`} className="text-brand mt-2 inline-block text-xs font-semibold hover:underline">Open lead</Link>
            </div>
          ) : null}

          <div>
            <label htmlFor="draft" className="mb-2 block text-[13px] font-semibold text-ink">Draft</label>
            <TextAreaField id="draft" value={text} onChange={(e) => setText(e.target.value)} placeholder="Click “Draft reply” to generate, then edit it here." className="min-h-56" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="brand" size="xl" className="rounded-full px-6" onClick={() => generate()} disabled={!lead || typing}><Sparkles className={typing ? "animate-spin" : undefined} />{typing ? "Writing…" : text ? "Redraft" : "Draft reply"}</Button>
            <Button type="button" variant="panel" size="xl" className="rounded-full px-6" onClick={copy} disabled={!text}>{copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy"}</Button>
            {digits && text ? (
              <a href={`https://wa.me/${digits}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" className="text-brand inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"><MessageCircle className="size-4" />Open in WhatsApp</a>
            ) : null}
          </div>
          <p className="text-xs text-slate-400">Drafts use your services and prices from Settings. You review and send every message yourself.</p>
        </Panel>

        <div className="space-y-6">
          <Panel className="p-5">
            <PanelHeader title="This month" />
            <p className="font-inter mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink">{used}<span className="text-base font-medium text-slate-400"> / {MONTHLY_DRAFT_CAP}</span></p>
            <span className="mt-3 block h-2 overflow-hidden rounded-full bg-slate-100"><span className="bg-brand block h-full rounded-full" style={{ width: `${Math.min(100, (used / MONTHLY_DRAFT_CAP) * 100)}%` }} /></span>
          </Panel>
          <Panel className="p-5">
            <PanelHeader title="Recent drafts" />
            {history.length === 0 ? <p className="mt-3 text-sm text-slate-400">No drafts yet.</p> : (
              <ul className="mt-3 space-y-3">
                {history.map((d) => (
                  <li key={d.id}>
                    <button type="button" onClick={() => { setLeadId(d.leadId); setText(d.text); setLanguage(d.language); }} className="w-full rounded-lg bg-slate-50 p-3 text-left text-xs text-slate-600 hover:bg-slate-100">
                      <span className="font-semibold text-ink">{leads.find((l) => l.id === d.leadId)?.name ?? "Deleted lead"}</span> · {d.language === "hi" ? "Hindi" : "English"}
                      <span className="mt-1 line-clamp-2 block">{d.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
