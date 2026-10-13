import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden className={cn("size-4 animate-spin", className)} />;
}

export function PageLoader({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn("flex min-h-[50svh] flex-col items-center justify-center gap-3 text-slate-500", className)}>
      <Spinner className="text-brand size-8" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

// Round badge for a task state: spinning ring while it runs, a green tick when it is done.
// Size comes from the --check-size CSS variable (default 16px).
export function StatusBadge({ state, className }: { state: "loading" | "done"; className?: string }) {
  return state === "loading" ? (
    <Loader2 aria-hidden className={cn("animate-spin text-slate-400", className)} style={{ width: "var(--check-size, 16px)", height: "var(--check-size, 16px)" }} />
  ) : (
    <span aria-hidden className={cn("flex items-center justify-center rounded-full bg-[var(--success)] text-white", className)} style={{ width: "var(--check-size, 16px)", height: "var(--check-size, 16px)" }}>
      <Check className="size-[70%]" strokeWidth={3} />
    </span>
  );
}
