"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/ui/page-header";
import { useMounted } from "@/hooks/use-mounted";
import { useNow } from "@/hooks/use-now";
import { formatInr, leadReason, STATUSES, statusMeta } from "@/lib/leads";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/toast";
import { setLeadStatus, useLeads } from "@/services/leads";
import type { Lead, LeadStatus } from "@/types/lead";

export function PipelineBoard() {
  const mounted = useMounted();
  const now = useNow();
  const { leads } = useLeads();
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<LeadStatus | null>(null);

  if (!mounted) return null;

  const move = (id: string, status: LeadStatus) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.status === status) return;
    setLeadStatus(id, status);
    notify.success(`${lead.name} moved to ${statusMeta(status).label}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Pipeline" description="Drag a card to a new stage, or use the dropdown on the card." />
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:px-0">
        {STATUSES.map((s) => {
          const items = leads.filter((l) => l.status === s.value);
          const total = items.reduce((sum, l) => sum + l.value, 0);
          return (
            <section
              key={s.value}
              aria-label={s.label}
              onDragOver={(e) => { e.preventDefault(); setOver(s.value); }}
              onDragLeave={() => setOver((o) => (o === s.value ? null : o))}
              onDrop={(e) => { e.preventDefault(); if (dragId) move(dragId, s.value); setDragId(null); setOver(null); }}
              className={cn("flex w-[260px] shrink-0 flex-col rounded-2xl bg-slate-50 p-3 ring-2 transition-colors lg:w-auto", over === s.value ? "ring-brand bg-brand-soft/30" : "ring-transparent")}
            >
              <header className="flex items-center justify-between px-1 pb-3">
                <div className="flex items-center gap-2">
                  <Badge tone={s.tone}>{s.label}</Badge>
                  <span className="text-xs font-semibold text-slate-400">{items.length}</span>
                </div>
                <span className="text-xs text-slate-500">{total ? formatInr(total) : ""}</span>
              </header>
              <div className="flex min-h-24 flex-col gap-2.5">
                {items.length === 0 ? <p className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">Drop leads here</p> : null}
                {items.map((l) => <Card key={l.id} lead={l} reason={leadReason(l, now)} dragging={dragId === l.id} onDragStart={() => setDragId(l.id)} onDragEnd={() => { setDragId(null); setOver(null); }} onMove={(st) => move(l.id, st)} />)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Card({ lead, reason, dragging, onDragStart, onDragEnd, onMove }: { lead: Lead; reason: string | null; dragging: boolean; onDragStart: () => void; onDragEnd: () => void; onMove: (s: LeadStatus) => void }) {
  return (
    <article draggable onDragStart={onDragStart} onDragEnd={onDragEnd} className={cn("cursor-grab rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm active:cursor-grabbing", dragging && "opacity-40")}>
      <Link href={`/leads/${lead.id}`} className="block text-sm font-semibold text-ink hover:text-brand">{lead.name}</Link>
      <p className="mt-0.5 truncate text-xs text-slate-500">{lead.service || "No service"}</p>
      {lead.value ? <p className="mt-2 text-xs font-semibold text-ink">{formatInr(lead.value)}</p> : null}
      {reason ? <Badge tone="red" size="sm" className="mt-2"><AlertTriangle className="size-3" />{reason}</Badge> : null}
      <NativeSelect aria-label={`Move ${lead.name}`} value={lead.status} onChange={(e) => onMove(e.target.value as LeadStatus)} className="mt-3 h-8 rounded-md bg-slate-100 text-xs">
        {STATUSES.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
      </NativeSelect>
    </article>
  );
}
