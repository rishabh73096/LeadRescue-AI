import type { ComponentProps, ElementType, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const PANEL_SURFACE = "rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_-6px_rgba(15,17,41,0.12)]";

type PanelProps<T extends ElementType> = { as?: T } & Omit<ComponentProps<T>, "as">;

export function Panel<T extends ElementType = "div">({ as, className, ...props }: PanelProps<T>) {
  const Tag: ElementType = as ?? "div";
  return <Tag className={cn(PANEL_SURFACE, className)} {...props} />;
}

export function PanelHeader({ title, description, icon: Icon, aside, className }: { title: ReactNode; description?: ReactNode; icon?: LucideIcon; aside?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e8e6fb] text-[#3b2fd0]">
            <Icon className="size-[18px]" />
          </span>
        ) : null}
        <div>
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          {description ? <p className="text-sm text-slate-500">{description}</p> : null}
        </div>
      </div>
      {aside}
    </div>
  );
}
