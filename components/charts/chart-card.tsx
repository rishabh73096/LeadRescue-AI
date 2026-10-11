"use client";

import { useState, type ReactNode } from "react";
import { Table2 } from "lucide-react";
import * as m from "motion/react-m";
import { cardIn, gridStagger } from "@/components/ui/motion";
import { PANEL_SURFACE } from "@/components/ui/panel";
import { cn } from "@/lib/utils";

export interface LegendItem {
  label: string;
  color: string;
}

export interface TableView {
  head: string[];
  rows: (string | number)[][];
}

// Panel with a title, optional legend (always for 2+ series) and a table view for accessibility.
export function ChartCard({ title, description, legend, table, children, className }: { title: string; description?: string; legend?: LegendItem[]; table?: TableView; children: ReactNode; className?: string }) {
  const [asTable, setAsTable] = useState(false);
  return (
    <m.div variants={cardIn} className={cn(PANEL_SURFACE, "viz flex min-w-0 flex-col p-5 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-ink">{title}</h2>
          {description ? <p className="mt-0.5 text-sm text-slate-500">{description}</p> : null}
        </div>
        {table ? (
          <button type="button" aria-pressed={asTable} aria-label="Toggle table view" onClick={() => setAsTable((v) => !v)} className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100", asTable && "bg-slate-100 text-ink")}>
            <Table2 className="size-4" />
          </button>
        ) : null}
      </div>
      {legend && legend.length > 1 && !asTable ? (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: l.color }} />
              {l.label}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4 min-h-0 flex-1">
        {asTable && table ? (
          <div className="max-h-[260px] overflow-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{table.head.map((h) => <th key={h} className="pb-2 pr-4">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="py-1.5 pr-4 text-slate-700">{c}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
        ) : children}
      </div>
    </m.div>
  );
}

export function Grid({ cols = 4, children, className }: { cols?: 2 | 3 | 4; children: ReactNode; className?: string }) {
  const map = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 xl:grid-cols-3", 4: "sm:grid-cols-2 xl:grid-cols-4" } as const;
  return (
    <m.div variants={gridStagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -8% 0px" }} className={cn("grid gap-4", map[cols], className)}>
      {children}
    </m.div>
  );
}
