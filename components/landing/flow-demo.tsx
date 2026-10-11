import { ArrowUp, Pin } from "lucide-react";
import { LogoMark } from "@/components/ui/logo-mark";
import type { LandingContent } from "@/types/landing";

export function FlowDemo({ flow }: { flow: LandingContent["flow"] }) {
  const { sources, panel } = flow;
  const n = sources.length;
  return (
    <div className="rounded-[2.5rem] bg-[#f4f4f5] p-4 sm:p-8">
      <div className="grid gap-6 md:h-[560px] md:grid-cols-[minmax(0,260px)_minmax(60px,1fr)_minmax(0,440px)] md:gap-0">
        <div className="grid gap-3 md:h-full" style={{ gridTemplateRows: `repeat(${n}, minmax(0, 1fr))` }}>
          {sources.map((s, i) => (
            <div key={s.name} className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ${i === 0 ? "shadow-[0_12px_30px_-12px_rgba(0,0,0,0.25)]" : ""}`}>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: s.color }}>
                <s.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{s.name}</p>
                <p className="truncate text-xs text-slate-500">{s.meta}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative hidden md:block" aria-hidden>
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {sources.map((s, i) => {
              const y1 = ((i + 0.5) / n) * 100;
              const y2 = 34 + i * (28 / Math.max(n - 1, 1));
              return <path key={s.name} d={`M0,${y1} C55,${y1} 45,${y2} 100,${y2}`} fill="none" stroke={s.color} strokeWidth="1.5" strokeDasharray="3 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.75" />;
            })}
          </svg>
        </div>

        <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <LogoMark className="size-8" />
            <p className="text-sm font-bold text-ink">{panel.title}</p>
            <span className="text-xs text-slate-400">{panel.scope}</span>
            <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-[#e5484d]"><span className="size-1.5 rounded-full bg-[#e5484d]" />{panel.badge}</span>
          </div>
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-600">
            <Pin className="size-3.5 text-slate-400" /> <span className="truncate"><b className="text-ink">Pinned</b> · {panel.pinned}</span>
          </div>
          <ul className="flex flex-1 flex-col justify-around gap-2 px-4 py-4">
            {panel.rows.map((r) => {
              const src = sources[r.source];
              return (
                <li key={r.name} className="flex items-center gap-3 rounded-xl px-2 py-2">
                  <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                    {r.name.slice(0, 2).toUpperCase()}
                    <span className="absolute -right-1 -bottom-1 flex size-4.5 items-center justify-center rounded-full ring-2 ring-white" style={{ background: src.color }}>
                      <src.icon className="size-2.5 text-white" />
                    </span>
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink">{r.name}</p>
                    <p className="truncate text-sm text-slate-600">{r.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-2 border-t border-slate-100 p-3">
            <div className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-400">{panel.placeholder}</div>
            <span className="flex size-11 items-center justify-center rounded-xl bg-ink text-white"><ArrowUp className="size-4" /></span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">Sample data for illustration.</p>
    </div>
  );
}
