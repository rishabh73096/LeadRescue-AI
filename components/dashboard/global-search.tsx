"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, type LucideIcon } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { visibleNav } from "@/config/navigation";
import { useAuthState } from "@/context/AuthContext";
import { usePlatformAdmin } from "@/services/admin";
import { useRole } from "@/hooks/use-role";
import { ROLE_LABELS } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { Role } from "@/config/auth";

interface Result {
  id: string;
  group: string;
  title: string;
  subtitle?: string;
  href: string;
  icon: LucideIcon;
  haystack: string;
}

const PER_GROUP = 4;

function useSearchIndex(role: Role, isAdmin: boolean): Result[] {
  return useMemo(
    () =>
      visibleNav(role, isAdmin).map((n) => ({ id: `page-${n.href}`, group: "Pages", title: n.label, subtitle: n.href === "/" ? "Overview" : n.href, href: n.href, icon: n.icon, haystack: [n.label, ...(n.keywords ?? [])].join(" ").toLowerCase() })),
    [role, isAdmin],
  );
}

function rank(r: Result, terms: string[]) {
  if (!terms.every((t) => r.haystack.includes(t))) return -1;
  const title = r.title.toLowerCase();
  return terms.reduce((n, t) => n + (title.startsWith(t) ? 3 : title.includes(t) ? 2 : 1), 0);
}

export function GlobalSearch({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const router = useRouter();
  const { role } = useRole();
  const { user } = useAuthState();
  const index = useSearchIndex(role, usePlatformAdmin(user?._id) === true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return index.filter((r) => r.group === "Pages").slice(0, 7);
    const groups = new Map<string, Result[]>();
    index.map((r) => ({ r, s: rank(r, terms) })).filter((x) => x.s >= 0).sort((a, b) => b.s - a.s).forEach(({ r }) => {
      const g = groups.get(r.group) ?? [];
      if (g.length < PER_GROUP) groups.set(r.group, [...g, r]);
    });
    return [...groups.values()].flat();
  }, [index, query]);

  useEffect(() => {
    const click = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", click);
      document.removeEventListener("keydown", key);
    };
  }, []);

  const go = (r: Result) => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
    (document.activeElement as HTMLElement | null)?.blur?.();
    router.push(r.href);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((i) => (results.length ? (i + 1) % results.length : 0)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (results.length ? (i + results.length - 1) % results.length : 0)); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active]); }
    else if (e.key === "Escape") { setOpen(false); (e.target as HTMLElement).blur(); }
  };

  const placeholder = "Search pages…";
  let lastGroup = "";

  return (
    <div ref={box} className={cn("relative", className)}>
      <SearchInput id="global-search" value={query} onValueChange={(v) => { setQuery(v); setActive(0); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={onKeyDown} placeholder={placeholder} label="Search" tone="dark" shape="full" role="combobox" aria-expanded={open} aria-controls="global-search-results" aria-autocomplete="list" autoComplete="off" clearable />
      {open ? (
        <div id="global-search-results" role="listbox" className="absolute top-full right-0 left-0 z-50 mt-2 max-h-[70svh] overflow-y-auto rounded-2xl bg-white p-2 text-ink shadow-2xl ring-1 ring-slate-100">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">No results for “{query}” in {ROLE_LABELS[role]} access.</p>
          ) : (
            results.map((r, i) => {
              const header = r.group !== lastGroup ? (lastGroup = r.group) : null;
              const Icon = r.icon;
              return (
                <div key={r.id}>
                  {header ? <p className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{query.trim() || header !== "Pages" ? header : "Quick links"}</p> : null}
                  <button type="button" role="option" aria-selected={i === active} onMouseEnter={() => setActive(i)} onClick={() => go(r)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left", i === active ? "bg-[#ebf8f3]" : "hover:bg-slate-50")}>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eceaff] text-[#4338ca]"><Icon className="size-4" /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{r.title}</span>{r.subtitle ? <span className="block truncate text-xs text-slate-500">{r.subtitle}</span> : null}</span>
                    {i === active ? <CornerDownLeft className="size-3.5 text-slate-400" /> : null}
                  </button>
                </div>
              );
            })
          )}
          <p className="mt-1 flex items-center justify-between border-t border-slate-100 px-3 pt-2 pb-1 text-[10px] text-slate-400"><span>↑↓ navigate · Enter open · Esc close</span><span>Searching as {ROLE_LABELS[role]}</span></p>
        </div>
      ) : null}
    </div>
  );
}
