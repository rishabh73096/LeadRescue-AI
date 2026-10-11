"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dateKey, monthGrid, sameDay } from "@/lib/date";
import { cn } from "@/lib/utils";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function MonthCalendar({ selected, onSelect, marked, today }: { selected: Date; onSelect: (d: Date) => void; marked?: Set<string>; today: number }) {
  const [shown, setShown] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));
  const move = (n: number) => setShown((m) => new Date(m.getFullYear(), m.getMonth() + n, 1));
  const label = shown.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const cells = monthGrid(shown);
  const rows = cells.slice(35).every((d) => d.getMonth() !== shown.getMonth()) ? cells.slice(0, 35) : cells;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_12px_-6px_rgba(15,17,41,0.12)] sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wide text-ink uppercase">{label}</h3>
        <div className="flex gap-1">
          <button type="button" aria-label="Previous month" onClick={() => move(-1)} className="flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"><ChevronLeft className="size-4" /></button>
          <button type="button" aria-label="Next month" onClick={() => move(1)} className="flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"><ChevronRight className="size-4" /></button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-y-1 text-center">
        {DAYS.map((d) => (
          <span key={d} className="pb-2 text-[10px] font-semibold text-slate-400">{d}</span>
        ))}
        {rows.map((d) => {
          const inMonth = d.getMonth() === shown.getMonth();
          const active = sameDay(d, selected);
          const isToday = sameDay(d, today);
          return (
            <button key={d.getTime()} type="button" onClick={() => onSelect(d)} aria-pressed={active} aria-label={d.toDateString()} className={cn("relative mx-auto flex size-9 items-center justify-center rounded-full text-sm transition-colors", active ? "bg-[#0f9d75] font-bold text-white" : inMonth ? "text-ink hover:bg-slate-100" : "text-slate-300 hover:bg-slate-50", !active && isToday && "font-bold text-[#0f9d75] ring-1 ring-[#0f9d75]/40")}>
              {d.getDate()}
              {marked?.has(dateKey(d)) ? <span className={cn("absolute bottom-1 size-1 rounded-full", active ? "bg-white" : "bg-[#0f9d75]")} /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
