"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import * as m from "motion/react-m";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

const previousActive = new Map<string, string>();

export function AuthTabs({ tabs, className }: { tabs: Tab[]; className?: string }) {
  const key = tabs.map((t) => t.label).join("|");
  const activeIndex = Math.max(tabs.findIndex((t) => t.active), 0);
  const fromLabel = previousActive.get(key);
  const fromIndex = fromLabel ? tabs.findIndex((t) => t.label === fromLabel) : -1;
  previousActive.set(key, tabs[activeIndex]?.label ?? "");

  return (
    <div className={cn("mb-8 grid gap-1 rounded-xl border border-slate-100 bg-slate-50 p-1", tabs.length === 2 && "grid-cols-2", className)}>
      {tabs.map((tab, index) => {
        const classes = cn(
          "relative flex h-10 items-center justify-center gap-2 rounded-lg text-sm transition-colors",
          tab.active ? "text-brand font-semibold" : "text-slate-500",
          tab.disabled ? "cursor-not-allowed opacity-60" : !tab.active && "hover:text-slate-800",
        );
        const inner = (
          <>
            {tab.active ? (
              <m.span
                aria-hidden
                className="absolute inset-0 rounded-lg bg-white shadow-sm"
                initial={fromIndex >= 0 && fromIndex !== index ? { x: `${(fromIndex - index) * 104}%` } : false}
                animate={{ x: "0%" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            ) : null}
            <span className="relative z-10 inline-flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </>
        );
        return tab.href && !tab.disabled && !tab.active ? (
          <Link key={tab.label} href={tab.href} className={classes}>
            {inner}
          </Link>
        ) : (
          <span key={tab.label} aria-current={tab.active ? "page" : undefined} aria-disabled={tab.disabled} className={classes}>
            {inner}
          </span>
        );
      })}
    </div>
  );
}
