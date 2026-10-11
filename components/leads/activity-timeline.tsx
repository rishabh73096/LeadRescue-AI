import { CalendarClock, CircleDot, MessageSquareText, Pencil, Plus, StickyNote, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Activity, ActivityType } from "@/types/lead";

const ICONS: Record<ActivityType, LucideIcon> = { created: Plus, status: CircleDot, note: StickyNote, followup: CalendarClock, draft: MessageSquareText, edit: Pencil };

const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export function ActivityTimeline({ activities, createdAt, className }: { activities: Activity[]; createdAt: string; className?: string }) {
  // Demo leads have no stored history, so always end with a synthetic "created" entry.
  const items: Activity[] = activities.some((a) => a.type === "created") ? activities : [...activities, { id: "created", leadId: "", type: "created", body: "Lead added", at: createdAt }];
  return (
    <ol className={cn("space-y-5", className)}>
      {items.map((a) => {
        const Icon = ICONS[a.type];
        return (
          <li key={a.id} className="flex gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e8e6fb] text-[#3b2fd0]"><Icon className="size-4" /></span>
            <div className="min-w-0">
              <p className="text-sm whitespace-pre-wrap text-ink">{a.body}</p>
              <p className="mt-0.5 text-xs text-slate-400">{when(a.at)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
