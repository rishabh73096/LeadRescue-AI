"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CopyX, Download, FileSpreadsheet, ListChecks, Rows3, UploadCloud, UserX } from "lucide-react";
import { ChartCard, Grid } from "@/components/charts/chart-card";
import { BarsH } from "@/components/charts/charts";
import { StatCard } from "@/components/charts/stat-card";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { SAMPLE_CSV, parseCsv } from "@/lib/csv";
import { inDays } from "@/services/leads";
import { SOURCES } from "@/lib/leads";
import { notify } from "@/lib/toast";
import { addLeads, useLeads } from "@/services/leads";
import type { LeadInput, LeadSource } from "@/types/lead";

const FIELDS = [
  { key: "name", label: "Name", required: true, hints: ["name", "customer", "full name", "client"] },
  { key: "phone", label: "Phone", hints: ["phone", "mobile", "contact", "whatsapp", "number"] },
  { key: "email", label: "Email", hints: ["email", "mail"] },
  { key: "service", label: "Service", hints: ["service", "requirement", "interest"] },
  { key: "message", label: "Message", hints: ["message", "enquiry", "notes", "details", "comment"] },
  { key: "source", label: "Source", hints: ["source", "channel"] },
] as const;
type FieldKey = (typeof FIELDS)[number]["key"];

const MAX_ROWS = 2000;
const MAX_BYTES = 2 * 1024 * 1024;
const digits = (v: string) => v.replace(/\D/g, "");
// India only: accepts 98765 43210, 098765 43210, 91 98765 43210 or +91...; anything else counts as "no phone".
const indianMobile = (v: string) => {
  const d = digits(v);
  const ten = d.length === 12 && d.startsWith("91") ? d.slice(2) : d.length === 11 && d.startsWith("0") ? d.slice(1) : d;
  return /^[6-9]\d{9}$/.test(ten) ? `+91${ten}` : "";
};

export function ImportView() {
  const router = useRouter();
  const { leads } = useLeads();
  const [file, setFile] = useState("");
  const [over, setOver] = useState(false);
  const [rows, setRows] = useState<string[][]>([]);
  const [map, setMap] = useState<Record<FieldKey, number>>({ name: -1, phone: -1, email: -1, service: -1, message: -1, source: -1 });

  const header = rows[0] ?? [];
  const body = useMemo(() => rows.slice(1), [rows]);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (!/\.csv$/i.test(f.name)) return notify.error("Please choose a .csv file.");
    if (f.size > MAX_BYTES) return notify.error("File is too large (max 2 MB).");
    const parsed = parseCsv(await f.text());
    if (parsed.length < 2) return notify.error("That file has no data rows.");
    if (parsed.length - 1 > MAX_ROWS) return notify.error(`Too many rows (max ${MAX_ROWS}). Split the file.`);
    const next = { name: -1, phone: -1, email: -1, service: -1, message: -1, source: -1 } as Record<FieldKey, number>;
    FIELDS.forEach((fld) => {
      next[fld.key] = parsed[0].findIndex((h) => fld.hints.some((hint) => h.trim().toLowerCase().includes(hint)));
    });
    setFile(f.name);
    setRows(parsed);
    setMap(next);
  };

  const result = useMemo(() => {
    const existing = new Set(leads.map((l) => l.phone).filter(Boolean));
    const seen = new Set<string>();
    const valid: LeadInput[] = [];
    let missing = 0;
    let duplicates = 0;
    const get = (r: string[], k: FieldKey) => (map[k] >= 0 ? (r[map[k]] ?? "").trim() : "");
    for (const r of body) {
      const name = get(r, "name");
      const phone = indianMobile(get(r, "phone"));
      const email = get(r, "email");
      if (!name || (!phone && !email)) { missing++; continue; }
      if (phone && (existing.has(phone) || seen.has(phone))) { duplicates++; continue; }
      if (phone) seen.add(phone);
      const src = get(r, "source").toLowerCase();
      valid.push({
        name: name.slice(0, 80),
        phone,
        email,
        service: get(r, "service").slice(0, 120),
        message: get(r, "message").slice(0, 1000),
        source: (SOURCES.find((s) => s.value === src || s.label.toLowerCase() === src)?.value ?? "other") as LeadSource,
        value: 0,
        nextFollowUpAt: inDays(1),
      });
    }
    return { valid, missing, duplicates };
  }, [body, map, leads]);

  const importNow = () => {
    const n = addLeads(result.valid);
    notify.success(`${n} lead${n === 1 ? "" : "s"} imported`);
    router.push("/leads");
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([SAMPLE_CSV], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Import Leads" description="Upload a CSV, match the columns, and bring in your old enquiries. Duplicate phone numbers are skipped." actions={<Button type="button" variant="panel" size="xl" className="rounded-full px-5" onClick={download}><Download />Sample CSV</Button>} />

      <Panel className="p-5 sm:p-6">
        <label
          htmlFor="csv"
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); onFile(e.dataTransfer.files?.[0]); }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200 hover:border-brand hover:bg-brand/5 active:scale-[0.99] ${over ? "border-brand bg-brand/10 scale-[1.01]" : "border-slate-200"}`}
        >
          <span className={`bg-brand/10 text-brand flex size-12 items-center justify-center rounded-2xl transition-transform duration-300 ${over ? "-translate-y-2 scale-110" : ""}`}><UploadCloud className="size-6" /></span>
          <span className="text-sm font-semibold text-ink">{over ? "Drop it here" : file || "Choose a CSV file or drag it here"}</span>
          <span className="text-xs text-slate-500">First row must be column headers. Up to {MAX_ROWS} rows, 2 MB.</span>
          <input id="csv" type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
      </Panel>

      {rows.length > 1 ? (
        <>
          <Grid cols={4}>
            <StatCard icon={Rows3} label="Rows in file" value={String(body.length)} />
            <StatCard icon={ListChecks} label="Ready to import" value={String(result.valid.length)} />
            <StatCard icon={UserX} label="Missing name or contact" value={String(result.missing)} tone={result.missing ? "red" : undefined} />
            <StatCard icon={CopyX} label="Duplicates skipped" value={String(result.duplicates)} />
          </Grid>
          <ChartCard title="What will happen to your rows" table={{ head: ["Outcome", "Rows"], rows: [["Imported", result.valid.length], ["Missing name or contact", result.missing], ["Duplicate phone", result.duplicates]] }}>
            <BarsH name="Rows" height={150} data={[{ label: "Imported", value: result.valid.length, color: "var(--viz-3)" }, { label: "Missing info", value: result.missing, color: "var(--viz-bad)" }, { label: "Duplicates", value: result.duplicates, color: "var(--viz-muted)" }]} />
          </ChartCard>
          <Panel className="p-5 sm:p-6">
            <PanelHeader title="Match columns" description="We guessed from your headers. Fix anything that looks off." icon={FileSpreadsheet} />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FIELDS.map((f) => (
                <div key={f.key}>
                  <label htmlFor={`map-${f.key}`} className="mb-2 block text-[13px] font-semibold text-ink">{f.label}{"required" in f ? " *" : ""}</label>
                  <NativeSelect id={`map-${f.key}`} value={map[f.key]} onChange={(e) => setMap((m) => ({ ...m, [f.key]: Number(e.target.value) }))}>
                    <option value={-1}>Don&apos;t import</option>
                    {header.map((h, i) => <option key={i} value={i}>{h || `Column ${i + 1}`}</option>)}
                  </NativeSelect>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="p-5 sm:p-6"><PanelHeader title="Preview" description={`First ${Math.min(5, body.length)} of ${body.length} rows`} /></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead><tr className="border-y border-slate-100 bg-slate-50/60 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{FIELDS.map((f) => <th key={f.key} className="px-4 py-3">{f.label}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {body.slice(0, 5).map((r, i) => (
                    <tr key={i}>{FIELDS.map((f) => <td key={f.key} className="max-w-[200px] truncate px-4 py-3 text-slate-700">{map[f.key] >= 0 ? r[map[f.key]] : "—"}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className="flex flex-wrap items-center gap-4">
            <Button type="button" variant="brand" size="xl" className="rounded-full px-8" disabled={result.valid.length === 0 || map.name < 0} onClick={importNow}>Import {result.valid.length} lead{result.valid.length === 1 ? "" : "s"}</Button>
            <p className="text-sm text-slate-500">{result.missing} missing name/contact · {result.duplicates} duplicate phone{result.duplicates === 1 ? "" : "s"} skipped</p>
          </div>
        </>
      ) : null}
    </div>
  );
}
