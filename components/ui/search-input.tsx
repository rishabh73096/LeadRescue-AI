"use client";

import type { ComponentProps } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<ComponentProps<"input">, "onChange" | "value" | "size"> {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  size?: "md" | "lg";
  clearable?: boolean;
  tone?: "panel" | "white" | "dark";
  shape?: "lg" | "full";
}

const TONE = {
  panel: "bg-[#ebf8f3] placeholder:text-slate-500 focus:ring-2 focus:ring-brand/40",
  white: "border border-slate-200 bg-white placeholder:text-slate-400 focus:border-brand",
  dark: "bg-slate-200/90 placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-brand/60",
};

export function SearchInput({ value, onValueChange, label, size = "md", clearable, tone = "panel", shape = "lg", className, placeholder, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
      <input type="search" value={value} onChange={(e) => onValueChange(e.target.value)} placeholder={placeholder} aria-label={label ?? placeholder} className={cn("w-full pr-10 pl-10 text-sm outline-none [&::-webkit-search-cancel-button]:hidden", shape === "full" ? "rounded-full" : "rounded-lg", size === "lg" ? "h-12" : "h-11", TONE[tone])} {...props} />
      {clearable && value ? (
        <button type="button" aria-label="Clear search" onClick={() => onValueChange("")} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 hover:text-ink">
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
