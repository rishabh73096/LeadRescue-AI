import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function FormSection({ icon: Icon, title, description, children, className, aside }: { icon: LucideIcon; title: string; description: string; children: ReactNode; className?: string; aside?: ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_12px_-6px_rgba(15,17,41,0.12)] sm:p-7", className)}>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e8e6fb] text-[#3b2fd0]">
            <Icon className="size-[18px]" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink">{title}</h2>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>
        {aside}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export const FieldNote = ({ children }: { children: ReactNode }) => <span className="text-xs font-normal tracking-normal text-slate-400 normal-case">{children}</span>;

export const FIELD_LABEL = "text-[12px] font-semibold tracking-normal text-ink normal-case";
