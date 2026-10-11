import { Loader2 } from "lucide-react";
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
