import { DAY_MS, addDays, startOfDay } from "@/lib/date";
import { SOURCES, STATUSES, isOpen } from "@/lib/leads";
import type { Draft, Lead } from "@/types/lead";

const dayLabel = (d: number) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export type DayPoint = { label: string; value: number };

// Counts per day for the last `days` days (oldest first), using `at` to pick each item's timestamp.
export function perDay<T>(items: T[], at: (i: T) => string | null, days: number, now: number): DayPoint[] {
  const start = startOfDay(addDays(now, -(days - 1))).getTime();
  const out: DayPoint[] = Array.from({ length: days }, (_, i) => ({ label: dayLabel(start + i * DAY_MS), value: 0 }));
  for (const it of items) {
    const t = at(it);
    if (!t) continue;
    const idx = Math.floor((startOfDay(new Date(t)).getTime() - start) / DAY_MS);
    if (idx >= 0 && idx < days) out[idx].value++;
  }
  return out;
}

// Counts per day for the next `days` days starting today (overdue not included).
export function dueNextDays(leads: Lead[], days: number, now: number): DayPoint[] {
  const start = startOfDay(now).getTime();
  const out: DayPoint[] = Array.from({ length: days }, (_, i) => ({ label: i === 0 ? "Today" : new Date(start + i * DAY_MS).toLocaleDateString("en-IN", { weekday: "short" }), value: 0 }));
  for (const l of leads.filter(isOpen)) {
    if (!l.nextFollowUpAt) continue;
    const idx = Math.floor((startOfDay(new Date(l.nextFollowUpAt)).getTime() - start) / DAY_MS);
    if (idx >= 0 && idx < days) out[idx].value++;
  }
  return out;
}

export const stageCounts = (leads: Lead[]) => STATUSES.map((s) => ({ key: s.value, label: s.label, value: leads.filter((l) => l.status === s.value).length }));

export const stageValues = (leads: Lead[]) => STATUSES.map((s) => ({ key: s.value, label: s.label, value: leads.filter((l) => l.status === s.value).reduce((n, l) => n + l.value, 0) }));

export const sourceCounts = (leads: Lead[]) =>
  SOURCES.map((s) => ({ label: s.label, value: leads.filter((l) => l.source === s.value).length }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);

// won / (won + lost); null when nothing has closed yet
export function winRate(leads: Lead[]): number | null {
  const won = leads.filter((l) => l.status === "won").length;
  const lost = leads.filter((l) => l.status === "lost").length;
  return won + lost === 0 ? null : Math.round((won / (won + lost)) * 100);
}

export const draftsByLanguage = (drafts: Draft[], days: number, now: number) => {
  const en = perDay(drafts.filter((d) => d.language === "en"), (d) => d.createdAt, days, now);
  const hi = perDay(drafts.filter((d) => d.language === "hi"), (d) => d.createdAt, days, now);
  return en.map((p, i) => ({ label: p.label, en: p.value, hi: hi[i].value }));
};

export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
