"use client";

import { cn } from "@/lib/utils";

export function Switch({ checked, onCheckedChange, disabled, id, "aria-label": label }: { checked: boolean; onCheckedChange: (checked: boolean) => void; disabled?: boolean; id?: string; "aria-label"?: string }) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn("relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-3 focus-visible:ring-brand/30 disabled:opacity-50", checked ? "bg-[#3b2fd0]" : "bg-slate-300")}
    >
      <span className={cn("inline-block size-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-6" : "translate-x-1")} />
    </button>
  );
}
