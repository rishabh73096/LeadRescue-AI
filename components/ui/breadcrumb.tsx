import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LinkItem } from "@/types/content";
import { cn } from "@/lib/utils";

export function Breadcrumb({ items, className }: { items: LinkItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        {items.map((item, i) => {
          const current = i === items.length - 1 || !item.href;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {current ? (
                <span aria-current="page" className="font-semibold text-slate-900">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={cn("transition-colors hover:text-brand")}>
                  {item.label}
                </Link>
              )}
              {i < items.length - 1 ? <ChevronRight className="size-3 text-slate-400" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
