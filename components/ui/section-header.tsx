import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: { label: string; href: string };
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({ title, description, eyebrow, action, align = "left", className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-6", align === "center" && "flex-col items-center text-center", className)}>
      <div>
        {eyebrow ? (
          <p className="text-brand mb-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] uppercase">
            <span className="bg-brand h-0.5 w-4 rounded-full" />
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h2>
        {description ? <p className="mt-1.5 text-sm text-slate-500">{description}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="text-brand hidden shrink-0 items-center gap-1.5 pb-1 text-sm font-bold hover:underline sm:inline-flex">
          {action.label}
          <ArrowRight className="size-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
