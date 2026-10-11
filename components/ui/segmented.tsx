"use client";

import { cn } from "@/lib/utils";

export function Segmented<T extends string>({ options, value, onChange, label }: { options: { value: T; label: string; icon?: React.ReactNode }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-xl bg-[#ebf8f3] p-1">
      {options.map((o) => (
        <button key={o.value} type="button" role="tab" aria-selected={o.value === value} onClick={() => onChange(o.value)} className={cn("inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors", o.value === value ? "bg-white font-semibold text-ink shadow-sm" : "text-slate-500 hover:text-ink")}>
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}
