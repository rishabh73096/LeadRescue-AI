import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { PANEL_SURFACE } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import type { AdminData, Profile } from "@/types/admin";

export const DemoBanner = ({ show }: { show: boolean }) =>
  show ? <p className="rounded-xl bg-[#fdecc8] px-4 py-2.5 text-sm text-[#8a5a00]">Showing sample data. Real data appears once Supabase and the admin migration are set up and you are a platform admin.</p> : null;

export const PAYMENT_TONE: Record<string, BadgeTone> = { pending: "amber", verified: "green", rejected: "red", active: "green", expired: "slate" };
export const StatusBadge = ({ status }: { status: string }) => <Badge tone={PAYMENT_TONE[status] ?? "slate"} size="sm" className="capitalize">{status}</Badge>;

export const PLAN_PRICE: Record<string, number> = { Starter: 499, Pro: 999 };

export const profileOf = (data: AdminData, id: string): Profile | undefined => data.profiles.find((p) => p.id === id);
export const whoIs = (p?: Profile) => p?.name || p?.email || "Unknown user";

export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
export const fmtDateTime = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export function Who({ profile }: { profile?: Profile }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-semibold text-ink">{whoIs(profile)}</p>
      <p className="truncate text-xs text-slate-500">{profile?.email ?? ""}</p>
    </div>
  );
}

export function Table({ head, children, empty, className }: { head: string[]; children: ReactNode; empty?: string; className?: string }) {
  const hasRows = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <div className={cn(PANEL_SURFACE, "rows-in overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              {head.map((h) => <th key={h} className="px-4 py-3.5">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 [&_tr]:transition-colors [&_tr]:duration-150 [&_tr:hover]:bg-slate-50/70">
            {hasRows ? children : <tr><td colSpan={head.length} className="px-4 py-12 text-center text-sm text-slate-400">{empty ?? "Nothing here yet."}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
