import { cn } from "@/lib/utils";

const TONES = { green: "bg-[#2fb36d]", amber: "bg-[#e8a43a]", indigo: "bg-[#4338ca]", red: "bg-[#e5484d]" };

export function ProgressBar({ value, tone = "green", className, label }: { value: number; tone?: keyof typeof TONES; className?: string; label?: string }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} className={cn("h-1.5 overflow-hidden rounded-full bg-slate-200/80", className)}>
      <div className={cn("h-full rounded-full transition-all duration-500", TONES[tone])} style={{ width: `${v}%` }} />
    </div>
  );
}
