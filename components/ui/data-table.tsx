"use client";

import { useState, type ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export interface Column<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  rowClassName?: (row: T) => string | undefined;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowId: (row: T) => string;
  pageSize?: number;
  selectable?: boolean;
  emptyMessage?: string;
  footerLabel?: (info: { from: number; to: number; total: number; page: number; pages: number }) => ReactNode;
  rowClassName?: (row: T) => string | undefined;
  className?: string;
}

export function DataTable<T>({ columns, rows, rowId, pageSize = 7, selectable = true, emptyMessage = "Nothing to show.", footerLabel, rowClassName, className }: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pages);
  const visible = rows.slice((current - 1) * pageSize, current * pageSize);
  const ids = visible.map(rowId);
  const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));

  const toggle = (list: string[], on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      list.forEach((id) => (on ? next.add(id) : next.delete(id)));
      return next;
    });

  return (
    <div className={cn("rows-in overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_-6px_rgba(15,17,41,0.12)]", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              {selectable ? (
                <th className="w-14 py-4 pr-2 pl-5">
                  <Checkbox aria-label="Select all on this page" checked={allSelected} onCheckedChange={(c) => toggle(ids, c === true)} />
                </th>
              ) : null}
              {columns.map((c) => (
                <th key={c.id} className={cn("px-3 py-4 font-semibold", c.className)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-5 py-14 text-center text-sm text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visible.map((row) => {
                const id = rowId(row);
                return (
                  <tr key={id} data-selected={selected.has(id) || undefined} className={cn("transition-colors duration-150 hover:bg-slate-50 data-[selected]:bg-brand-soft/30", rowClassName?.(row))}>
                    {selectable ? (
                      <td className="py-4 pr-2 pl-5">
                        <Checkbox aria-label="Select row" checked={selected.has(id)} onCheckedChange={(c) => toggle([id], c === true)} />
                      </td>
                    ) : null}
                    {columns.map((c) => (
                      <td key={c.id} className={cn("px-3 py-3.5", c.className)}>
                        {c.cell(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:flex-row">
        <p>
          {footerLabel ? (
            footerLabel({ from: rows.length ? (current - 1) * pageSize + 1 : 0, to: Math.min(current * pageSize, rows.length), total: rows.length, page: current, pages })
          ) : (
            <>
              Page <b className="text-ink">{current}</b> of <b className="text-ink">{pages.toLocaleString("en-US")}</b>
            </>
          )}
        </p>
        <Pagination page={current} pages={pages} onChange={setPage} />
      </div>
    </div>
  );
}
