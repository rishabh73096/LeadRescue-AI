import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  title: string;
  caption: string;
  done?: boolean;
}

export function Stepper({ steps, current, onSelect }: { steps: Step[]; current: string; onSelect?: (id: string) => void }) {
  return (
    <ol className="grid gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_12px_-6px_rgba(15,17,41,0.12)] sm:grid-cols-2 xl:grid-cols-4">
      {steps.map((s, i) => {
        const active = s.id === current;
        return (
          <li key={s.id}>
            <button type="button" onClick={() => onSelect?.(s.id)} aria-current={active ? "step" : undefined} className="flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-[#f6f5ff]">
              <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors", s.done ? "bg-[#1f8a52] text-white" : active ? "bg-[#4338ca] text-white" : "bg-[#eceaff] text-slate-500")}>{s.done ? <Check className="size-4" strokeWidth={3} /> : i + 1}</span>
              <span className="min-w-0">
                <span className={cn("block truncate text-sm font-bold", active || s.done ? "text-ink" : "text-slate-600")}>{s.title}</span>
                <span className="block truncate text-xs text-slate-500">{s.caption}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
