import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export function PageHeader({ title, description, badge, actions }: { title: string; description?: string; badge?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="flex flex-wrap items-center gap-3 text-2xl font-extrabold tracking-tight text-ink sm:text-[31px]">
          {title}
          {badge}
        </h1>
        {description ? <p className="mt-1.5 max-w-xl text-sm text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
}

export const PageBadge = ({ children, tone = "purple" }: { children: ReactNode; tone?: "purple" | "blue" | "green" | "amber" }) => (
  <Badge tone={tone} className="tracking-normal">{children}</Badge>
);

export const LiveBadge = ({ children }: { children: ReactNode }) => (
  <Badge tone="green" dot className="tracking-normal">{children}</Badge>
);
