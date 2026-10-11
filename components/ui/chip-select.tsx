"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChipSelect({ options, value, onChange, disabled, label }: { options: readonly string[]; value: string[]; onChange: (next: string[]) => void; disabled?: boolean; label: string }) {
  const all = [...options, ...value.filter((v) => !options.includes(v))];
  const toggle = (o: string) => onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o]);
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {all.map((o) => {
        const on = value.includes(o);
        return (
          <button key={o} type="button" aria-pressed={on} disabled={disabled} onClick={() => toggle(o)} className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors disabled:opacity-60", on ? "border-[#0f9d75]/40 bg-[#eceaff] text-[#3b34c4]" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300")}>
            {on ? <Check className="size-3" strokeWidth={3} /> : null}
            {o}
          </button>
        );
      })}
    </div>
  );
}
