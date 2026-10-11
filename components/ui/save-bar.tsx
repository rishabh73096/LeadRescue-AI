import type { ReactNode } from "react";
import { Check, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function SaveBar({ note, icon = "saved", cancelLabel = "Cancel", saveLabel = "Save Changes", onCancel, saving, className }: { note: ReactNode; icon?: "saved" | "history"; cancelLabel?: string; saveLabel?: string; onCancel: () => void; saving?: boolean; className?: string }) {
  const Icon = icon === "saved" ? Check : History;
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-[0_2px_12px_-6px_rgba(15,17,41,0.12)]", className)}>
      <p className="flex items-center gap-2 text-xs text-slate-500">
        <Icon className={cn("size-4", icon === "saved" ? "text-[#1f8a52]" : "text-slate-500")} />
        {note}
      </p>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-lg px-4 text-sm font-semibold text-ink hover:bg-slate-100 data-[soft]:bg-[#ebf8f3]" data-soft={cancelLabel !== "Cancel" || undefined}>
          {cancelLabel}
        </button>
        <Button type="submit" disabled={saving} variant="brand" size="md">
          {saving ? <Spinner /> : <Check className="size-4" />} {saveLabel}
        </Button>
      </div>
    </div>
  );
}

export function formatSavedAt(iso?: string): string {
  if (!iso) return "never";
  const d = new Date(iso);
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return d.toDateString() === new Date().toDateString() ? `Today at ${time}` : `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${time}`;
}
