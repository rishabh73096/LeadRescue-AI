"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { COUNTRIES, type Country } from "@/lib/countries";
import { cn } from "@/lib/utils";

export function CountrySelect({ value, onChange, disabled, className }: { value: Country; onChange: (code: Country["code"]) => void; disabled?: boolean; className?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    search.current?.focus();
    const onPointer = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q || c.dial.startsWith(q));
  }, [query]);

  return (
    <div ref={root} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country: ${value.name}, +${value.dial}`}
        className="flex h-full items-center gap-1.5 border-r border-slate-200 pr-2.5 pl-3.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
      >
        <span className="text-lg leading-none">{value.flag}</span>
        <span className="font-medium tabular-nums">+{value.dial}</span>
        <ChevronDown className={cn("size-3.5 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute top-full left-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3">
            <Search className="size-4 text-slate-400" />
            <input
              ref={search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code"
              aria-label="Search countries"
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
            {results.length === 0 ? <li className="px-4 py-3 text-sm text-slate-400">No countries found</li> : null}
            {results.map((c) => (
              <li key={c.code} role="option" aria-selected={c.code === value.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn("flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-slate-50", c.code === value.code && "bg-brand-soft/60")}
                >
                  <span className="text-lg leading-none">{c.flag}</span>
                  <span className="flex-1 truncate text-slate-800">{c.name}</span>
                  <span className="text-slate-400 tabular-nums">+{c.dial}</span>
                  {c.code === value.code ? <Check className="text-brand size-3.5" /> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
