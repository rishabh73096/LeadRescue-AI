import type { LucideIcon } from "lucide-react";

export function PagePlaceholder({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
      <p className="mt-1.5 text-sm text-slate-500">{description}</p>
      <div className="mt-8 flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 text-center">
        <span className="bg-brand/10 text-brand flex size-14 items-center justify-center rounded-2xl">
          <Icon className="size-6" />
        </span>
        <p className="mt-4 text-base font-semibold text-ink">{title} is coming soon</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">This section isn&apos;t built yet.</p>
      </div>
    </div>
  );
}
