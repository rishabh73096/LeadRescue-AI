import { cn } from "@/lib/utils";

function pageList(current: number, pages: number): (number | "gap")[] {
  const keep = [...new Set([1, 2, 3, pages, current - 1, current, current + 1].filter((n) => n >= 1 && n <= pages))].sort((a, b) => a - b);
  return keep.flatMap((n, i) => (i > 0 && n - keep[i - 1] > 1 ? ["gap" as const, n] : [n]));
}

export function Pagination({ page, pages, onChange, className }: { page: number; pages: number; onChange: (page: number) => void; className?: string }) {
  const base = "flex h-9 items-center justify-center rounded-lg border text-sm transition-colors";
  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1.5", className)}>
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} className={cn(base, "border-slate-200 bg-white px-3 text-slate-600 hover:border-brand disabled:text-slate-300 disabled:hover:border-slate-200")}>
        Previous
      </button>
      {pageList(page, pages).map((n, i) =>
        n === "gap" ? (
          <span key={`gap-${i}`} className="px-0.5 text-slate-400">
            …
          </span>
        ) : (
          <button key={n} type="button" aria-current={n === page ? "page" : undefined} onClick={() => onChange(n)} className={cn(base, "w-9", n === page ? "border-transparent bg-[#6d3fe0] font-semibold text-white" : "border-slate-200 bg-white text-slate-600 hover:border-brand")}>
            {n}
          </button>
        ),
      )}
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= pages} className={cn(base, "border-slate-200 bg-white px-3 text-slate-600 hover:border-brand disabled:text-slate-300 disabled:hover:border-slate-200")}>
        Next
      </button>
    </nav>
  );
}
