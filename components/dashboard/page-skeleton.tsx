// Shown instantly while a dashboard page streams in. Server component, no JS.
const block = "animate-pulse rounded-2xl bg-slate-100";

export function PageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading page">
      <div>
        <div className={`${block} h-8 w-48`} />
        <div className={`${block} mt-3 h-4 w-80 max-w-full`} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className={`${block} h-[172px]`} />)}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, i) => <div key={i} className={`${block} h-[330px]`} />)}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
