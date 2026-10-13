"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ContactRound, IndianRupee, Pencil, Percent, Phone, Plus, Sparkles, Trash2 } from "lucide-react";
import { ChartCard, Grid } from "@/components/charts/chart-card";
import { Columns, STAGE_COLORS } from "@/components/charts/charts";
import { StatCard } from "@/components/charts/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CountTabs } from "@/components/ui/count-tabs";
import { DataTable, type Column } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { LeadFormModal } from "@/components/leads/lead-form";
import { useMounted } from "@/hooks/use-mounted";
import { usePlan } from "@/lib/plan-store";
import { useNow } from "@/hooks/use-now";
import { relativeDay } from "@/lib/date";
import { formatInr, isOpen, leadReason, sourceLabel, statusMeta, STATUSES } from "@/lib/leads";
import { perDay, stageCounts, sum, winRate } from "@/lib/stats";
import { notify } from "@/lib/toast";
import { useFlashing } from "@/lib/flash";
import { deleteLead, restoreLead, setLeadStatus, useLeads } from "@/services/leads";
import type { Lead, LeadStatus } from "@/types/lead";

type Filter = "all" | LeadStatus;

export function LeadsView() {
  const mounted = useMounted();
  const now = useNow();
  const flashing = useFlashing();
  const { can } = usePlan();
  const { leads, loaded } = useLeads();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Lead | undefined>();
  const [open, setOpen] = useState(false);

  const tabs = useMemo(
    () => [{ value: "all" as Filter, label: "All", count: leads.length }, ...STATUSES.map((s) => ({ value: s.value as Filter, label: s.label, count: leads.filter((l) => l.status === s.value).length }))],
    [leads],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => (filter === "all" || l.status === filter) && (!q || `${l.name} ${l.phone} ${l.email} ${l.service}`.toLowerCase().includes(q)));
  }, [leads, filter, query]);

  const openForm = (lead?: Lead) => {
    setEditing(lead);
    setOpen(true);
  };

  const columns: Column<Lead>[] = [
    {
      id: "lead",
      header: "Lead",
      cell: (l) => (
        <div className="min-w-0">
          <Link href={`/leads/${l.id}`} className="font-semibold text-ink hover:text-brand hover:underline">{l.name}</Link>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500"><Phone className="size-3" />{l.phone || l.email}</p>
        </div>
      ),
    },
    { id: "service", header: "Enquiry", cell: (l) => <div className="max-w-[240px]"><p className="truncate text-sm text-ink">{l.service || "—"}</p><p className="truncate text-xs text-slate-500">{sourceLabel(l.source)}</p></div> },
    {
      id: "status",
      header: "Status",
      cell: (l) => (
        <select aria-label={`Status for ${l.name}`} value={l.status} onChange={(e) => { setLeadStatus(l.id, e.target.value as LeadStatus); notify.success(`Marked ${statusMeta(e.target.value as LeadStatus).label}`, l.name); }} className="h-8 rounded-full bg-slate-100 px-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand/40">
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      ),
    },
    { id: "value", header: "Value", cell: (l) => <span className="text-sm text-ink">{l.value ? formatInr(l.value) : "—"}</span> },
    {
      id: "next",
      header: "Next step",
      cell: (l) => {
        const reason = leadReason(l, now, can("reminders"));
        return (
          <div className="space-y-1">
            {reason ? <Badge tone="red" size="sm"><AlertTriangle className="size-3" />{reason}</Badge> : null}
            <p className="text-xs text-slate-500">{l.nextFollowUpAt ? `Follow up ${relativeDay(new Date(l.nextFollowUpAt), now)}` : statusMeta(l.status).label}</p>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (l) => (
        <div className="flex justify-end gap-1">
          <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${l.name}`} onClick={() => openForm(l)}><Pencil /></Button>
          <Button type="button" variant="ghost" size="icon" aria-label={`Delete ${l.name}`} onClick={() => { deleteLead(l.id); notify.action("Lead deleted", { label: "Undo", run: () => { restoreLead(l); notify.success("Lead restored"); } }, l.name); }}><Trash2 /></Button>
        </div>
      ),
    },
  ];

  if (!mounted) return null;

  const week = perDay(leads, (l) => l.createdAt, 7, now);
  const rate = winRate(leads);
  const stages = stageCounts(leads).map((s) => ({ label: s.label, value: s.value, color: STAGE_COLORS[s.key] }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Every enquiry in one place. Update the status as you reply."
        actions={<Button type="button" variant="brand" size="xl" className="rounded-full px-6" onClick={() => openForm()}><Plus />Add lead</Button>}
      />
      <Grid cols={4}>
        <StatCard icon={ContactRound} label="Total leads" value={String(leads.length)} sub={`${leads.filter(isOpen).length} open`} spark={perDay(leads, (l) => l.createdAt, 14, now).map((p) => p.value)} />
        <StatCard icon={Sparkles} label="New this week" value={String(sum(week.map((p) => p.value)))} sub="Last 7 days" />
        <StatCard icon={IndianRupee} label="Open value" value={formatInr(sum(leads.filter(isOpen).map((l) => l.value)))} sub="Estimated" />
        <StatCard icon={Percent} label="Win rate" value={rate === null ? "—" : `${rate}%`} sub="Won of closed" />
      </Grid>
      <Grid cols={2}>
        <ChartCard title="Leads by stage" table={{ head: ["Stage", "Leads"], rows: stages.map((s) => [s.label, s.value]) }}>
          <Columns data={stages} series={[{ key: "value", name: "Leads", color: "var(--viz-1)" }]} height={180} />
        </ChartCard>
        <ChartCard title="Added per day" description="Last 7 days" table={{ head: ["Day", "Leads"], rows: week.map((p) => [p.label, p.value]) }}>
          <Columns data={week} series={[{ key: "value", name: "Leads", color: "var(--viz-3)" }]} height={180} />
        </ChartCard>
      </Grid>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <CountTabs label="Filter by status" tabs={tabs} value={filter} onChange={setFilter} />
        <SearchInput value={query} onValueChange={setQuery} placeholder="Search name, phone, service" clearable tone="white" className="w-full lg:w-72" />
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        rowId={(l) => l.id}
        selectable={false}
        pageSize={8}
        rowClassName={(l) => (flashing.has(l.id) ? "row-flash" : undefined)}
        emptyMessage={!loaded ? "Loading leads…" : leads.length ? "No leads match these filters." : "No leads yet. Add your first enquiry."}
        footerLabel={({ from, to, total }) => <>Showing <b className="text-ink">{from}–{to}</b> of <b className="text-ink">{total}</b> leads</>}
      />
      <LeadFormModal open={open} lead={editing} onClose={() => setOpen(false)} />
    </div>
  );
}
