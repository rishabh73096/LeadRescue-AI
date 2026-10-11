"use client";

import { cn } from "@/lib/utils";

export interface CountTab<T extends string> {
  value: T;
  label: string;
  count?: number;
  tone?: "neutral" | "red" | "amber" | "blue";
}

const TONES = { neutral: "bg-slate-200/80 text-slate-600", red: "bg-[#fde0e0] text-[#c2262e]", amber: "bg-[#fdecc8] text-[#a76b00]", blue: "bg-[#dbe7ff] text-[#2850c8]" };

export function CountTabs<T extends string>({ tabs, value, onChange, label, className }: { tabs: CountTab<T>[]; value: T; onChange: (v: T) => void; label: string; className?: string }) {
  return (
    <div role="tablist" aria-label={label} className={cn("flex gap-2 overflow-x-auto pb-1", className)}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button key={t.value} type="button" role="tab" aria-selected={active} onClick={() => onChange(t.value)} className={cn("inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors", active ? "bg-[#4338ca] text-white shadow-sm" : "bg-[#ebf8f3] text-slate-600 hover:bg-[#e8e6fb]")}>
            {t.label}
            {t.count !== undefined ? <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", active ? "bg-white/25 text-white" : TONES[t.tone ?? "neutral"])}>{t.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
