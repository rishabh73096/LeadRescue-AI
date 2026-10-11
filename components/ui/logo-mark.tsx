import { BRAND } from "@/config/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  const Icon = BRAND.icon;
  return (
    <span
      aria-hidden
      className={cn("bg-brand-gradient flex size-10 shrink-0 items-center justify-center rounded-[26%] text-white shadow-[0_6px_16px_-4px_color-mix(in_srgb,var(--brand)_55%,transparent)] transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105", className)}
    >
      <Icon className="size-[54%]" strokeWidth={2.4} />
    </span>
  );
}
