import type { BadgeTone } from "@/components/ui/badge";
import { DAY_MS } from "@/lib/date";
import type { Lead, LeadSource, LeadStatus } from "@/types/lead";

export const STATUSES: { value: LeadStatus; label: string; tone: BadgeTone }[] = [
  { value: "new", label: "New", tone: "blue" },
  { value: "contacted", label: "Contacted", tone: "amber" },
  { value: "quote_sent", label: "Quote sent", tone: "indigo" },
  { value: "won", label: "Won", tone: "green" },
  { value: "lost", label: "Lost", tone: "slate" },
];

export const SOURCES: { value: LeadSource; label: string }[] = [
  { value: "website", label: "Website form" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Phone call" },
  { value: "email", label: "Email" },
  { value: "referral", label: "Referral" },
  { value: "other", label: "Other" },
];

export const statusMeta = (s: LeadStatus) => STATUSES.find((x) => x.value === s)!;
export const sourceLabel = (s: LeadSource) => SOURCES.find((x) => x.value === s)?.label ?? s;
export const isOpen = (l: Lead) => l.status !== "won" && l.status !== "lost";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const formatInr = (v: number) => inr.format(v);

// Why a lead needs attention right now; null when it doesn't.
export function leadReason(l: Lead, now = Date.now()): string | null {
  if (!isOpen(l)) return null;
  if (l.nextFollowUpAt && new Date(l.nextFollowUpAt).getTime() < now) {
    const days = Math.max(1, Math.floor((now - new Date(l.nextFollowUpAt).getTime()) / DAY_MS));
    return `Follow-up overdue by ${days} day${days > 1 ? "s" : ""}`;
  }
  const idle = now - new Date(l.updatedAt).getTime();
  if (l.status === "new" && idle > DAY_MS) return "No reply in 24h";
  if (l.status === "quote_sent" && idle > 2 * DAY_MS) return "Quote sent 48h ago, no answer";
  return null;
}
