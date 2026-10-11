import { cn } from "@/lib/utils";
import { Photo } from "@/components/ui/photo";

export function Avatar({ name, src, className }: { name: string; src?: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span className={cn("relative inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white", className)}>
      <span className="bg-brand-gradient absolute inset-0 flex items-center justify-center">{initials}</span>
      {src ? <Photo src={src} fallback="transparent" sizes="96px" aria-label={name} className="absolute inset-0" /> : null}
    </span>
  );
}
