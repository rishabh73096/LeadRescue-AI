"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, useInView } from "motion/react";
import * as m from "motion/react-m";
import { ArrowUp, Check, Pin } from "lucide-react";
import { LogoMark } from "@/components/ui/logo-mark";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { LANDING } from "@/config/landing";

type Row = { id: string; name: string; text: string; source: number; replied?: boolean; fresh?: boolean };

// Incoming enquiries, one list per source (cycled so the demo keeps going).
const INCOMING: { name: string; text: string }[][] = [
  [{ name: "Kavita Rao", text: "Asked for a 2BHK deep clean quote" }, { name: "Imran Sheikh", text: "Wants a price for sofa cleaning" }],
  [{ name: "Anil Gupta", text: "Needs monthly office cleaning" }, { name: "Divya Menon", text: "Please send your rates" }],
  [{ name: "Pooja Nair", text: "Can you come tomorrow morning?" }, { name: "Rohit Das", text: "Kitchen deep clean, how much?" }],
  [{ name: "Dev Patel", text: "Imported: old quote, no reply" }, { name: "Sana Khan", text: "Imported: asked last month" }],
];

const MAX_ROWS = 5;
const TRAVEL_SECONDS = 1.5;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const EASE = [0.4, 0, 0.2, 1] as const;

// Reads its own content: icon components cannot be passed from a server component as props.
export function FlowDemo() {
  const { sources, panel } = LANDING.flow;
  const n = sources.length;
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "-10% 0px -10% 0px" });
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const dot = useRef<HTMLSpanElement>(null);

  const [rows, setRows] = useState<Row[]>(() => panel.rows.map((r) => ({ id: r.name, ...r })));
  const [active, setActive] = useState<number | null>(null);
  const [wave, setWave] = useState<{ key: number; source: number } | null>(null);
  const [added, setAdded] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const endY = (i: number) => 34 + i * (28 / Math.max(n - 1, 1));

  // Autoplay: a lead leaves a source card, rides its dotted line, then lands in the list with a ripple.
  useEffect(() => {
    if (reduced || !inView) return;
    let cancelled = false;
    let cycle = 0;

    const travel = (src: number) =>
      new Promise<void>((resolve) => {
        const path = paths.current[src];
        const el = dot.current;
        let total = 0;
        try {
          total = path?.getTotalLength() ?? 0;
        } catch {}
        if (!path || !el || total === 0) return resolve(); // hidden on small screens: skip the ride
        el.style.background = sources[src].color;
        el.style.boxShadow = `0 0 0 4px ${sources[src].color}33, 0 0 18px 4px ${sources[src].color}88`;
        el.style.opacity = "1";
        const controls = animate(0, 1, {
          duration: TRAVEL_SECONDS,
          ease: EASE,
          onUpdate: (t) => {
            const pt = path.getPointAtLength(t * total);
            el.style.left = `${pt.x}%`;
            el.style.top = `${pt.y}%`;
          },
          onComplete: () => {
            el.style.opacity = "0";
            resolve();
          },
        });
        if (cancelled) controls.stop();
      });

    (async () => {
      await wait(1000);
      while (!cancelled) {
        const src = cycle % n;
        const pool = INCOMING[src % INCOMING.length];
        const lead = pool[Math.floor(cycle / n) % pool.length];
        setActive(src);
        await travel(src);
        if (cancelled) return;
        const id = `${lead.name}-${cycle}`;
        setRows((prev) => [{ id, name: lead.name, text: lead.text, source: src, fresh: true }, ...prev].slice(0, MAX_ROWS));
        setWave({ key: cycle, source: src });
        setAdded((a) => a + 1);
        setActive(null);
        cycle++;
        await wait(2600);
      }
    })();

    return () => {
      cancelled = true;
      setActive(null);
    };
  }, [inView, reduced, n, sources]);

  // Clicking a lead types a reply into the draft box.
  const typing = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTyping = () => {
    if (typing.current) clearInterval(typing.current);
    typing.current = null;
  };
  useEffect(() => stopTyping, []);

  const pick = (row: Row) => {
    stopTyping();
    if (selected === row.id) {
      setSelected(null);
      setDraft("");
      return;
    }
    setSelected(row.id);
    const full = `Hi ${row.name.split(" ")[0]}, thanks for reaching out. ${row.text.toLowerCase().includes("quote") ? "Here is your quote." : "We can help with that."} When suits you?`;
    if (reduced) return setDraft(full);
    setDraft("");
    let i = 0;
    typing.current = setInterval(() => {
      i++;
      setDraft(full.slice(0, i));
      if (i >= full.length) stopTyping();
    }, 22);
  };

  const send = () => {
    if (!selected || !draft) return;
    stopTyping();
    setRows((prev) => prev.map((r) => (r.id === selected ? { ...r, replied: true, fresh: false } : r)));
    setSelected(null);
    setDraft("");
  };

  return (
    <div ref={root} className="rounded-[2.5rem] bg-[#f4f4f5] p-4 sm:p-8">
      <div className="grid gap-6 md:h-[560px] md:grid-cols-[minmax(0,260px)_minmax(60px,1fr)_minmax(0,440px)] md:gap-0">
        <div className="grid gap-3 md:h-full" style={{ gridTemplateRows: `repeat(${n}, minmax(0, 1fr))` }}>
          {sources.map((s, i) => (
            <m.div
              key={s.name}
              animate={active === i ? { scale: 1.04, x: 6 } : { scale: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
              style={active === i ? { boxShadow: `0 0 0 3px ${s.color}40, 0 16px 34px -14px ${s.color}99` } : undefined}
              className={cn("group relative flex cursor-pointer items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgba(0,0,0,0.3)] active:scale-[0.98]", i === 0 && active !== i && "shadow-[0_12px_30px_-12px_rgba(0,0,0,0.25)]")}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110" style={{ background: s.color }}>
                <s.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{s.name}</p>
                <p className="truncate text-xs text-slate-500">{s.meta}</p>
              </div>
              <AnimatePresence>
                {active === i ? (
                  <m.span key="chip" initial={{ opacity: 0, scale: 0.6, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, x: 10 }} className="absolute -top-2 right-3 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: s.color }}>
                    new lead
                  </m.span>
                ) : null}
              </AnimatePresence>
            </m.div>
          ))}
        </div>

        <div className="relative hidden md:block" aria-hidden>
          <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            {sources.map((s, i) => {
              const y1 = ((i + 0.5) / n) * 100;
              const y2 = endY(i);
              const d = `M0,${y1} C55,${y1} 45,${y2} 100,${y2}`;
              return (
                <g key={s.name}>
                  <path ref={(el) => { paths.current[i] = el; }} d={d} fill="none" stroke={s.color} strokeWidth="1.5" strokeDasharray="3 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity={active === i ? 0.35 : 0.75} className="flow-line" />
                  {active === i ? (
                    <m.path key={`trail-${cycleKey(wave)}`} d={d} fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0, opacity: 0.9 }} animate={{ pathLength: 1 }} transition={{ duration: TRAVEL_SECONDS, ease: EASE }} />
                  ) : null}
                </g>
              );
            })}
          </svg>

          {/* the lead riding the line */}
          <span ref={dot} className="pointer-events-none absolute z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0" style={{ left: "0%", top: "50%" }} />

          {/* ripple where the line meets the panel */}
          <AnimatePresence>
            {wave ? (
              <span key={wave.key} className="pointer-events-none absolute z-10" style={{ left: "100%", top: `${endY(wave.source)}%` }}>
                {[0, 0.15, 0.3].map((delay) => (
                  <m.span
                    key={delay}
                    initial={{ scale: 0.2, opacity: 0.7 }}
                    animate={{ scale: 3.2, opacity: 0 }}
                    transition={{ duration: 1.1, delay, ease: "easeOut" }}
                    className="absolute size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                    style={{ borderColor: sources[wave.source].color }}
                  />
                ))}
              </span>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <LogoMark className="size-8" />
            <p className="text-sm font-bold text-ink">{panel.title}</p>
            <span className="text-xs text-slate-400">{panel.scope}</span>
            <span className="ml-auto flex items-center gap-2 text-xs font-bold text-[#e5484d]">
              <AnimatePresence>
                {added > 0 ? (
                  <m.span key={added} initial={{ opacity: 0, scale: 0.5, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} className="bg-brand/10 text-brand rounded-full px-2 py-0.5 text-[10px]">
                    +{added} new
                  </m.span>
                ) : null}
              </AnimatePresence>
              <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#e5484d]" />{panel.badge}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-600">
            <Pin className="size-3.5 text-slate-400" /> <span className="truncate"><b className="text-ink">Pinned</b> · {panel.pinned}</span>
          </div>
          <ul className="flex flex-1 flex-col gap-1 overflow-hidden px-4 py-3">
            <AnimatePresence initial={false}>
              {rows.map((r) => {
                const src = sources[r.source];
                const isSel = selected === r.id;
                return (
                  <m.li
                    key={r.id}
                    initial={{ opacity: 0, height: 0, x: -28 }}
                    animate={{ opacity: 1, height: "auto", x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <m.button
                      type="button"
                      onClick={() => pick(r)}
                      aria-pressed={isSel}
                      initial={r.fresh ? { backgroundColor: `${src.color}26` } : false}
                      animate={{ backgroundColor: isSel ? "#f1f5f9" : "#ffffff00" }}
                      transition={{ duration: 1.6 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn("group flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-3.5 text-left transition-colors duration-150 hover:bg-slate-50", isSel && "ring-1 ring-slate-200")}
                    >
                      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand transition-transform duration-200 group-hover:scale-110">
                        {r.name.slice(0, 2).toUpperCase()}
                        <span className="absolute -right-1 -bottom-1 flex size-4.5 items-center justify-center rounded-full ring-2 ring-white" style={{ background: src.color }}>
                          <src.icon className="size-2.5 text-white" />
                        </span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-ink">{r.name}</p>
                        <p className="truncate text-sm text-slate-600">{r.text}</p>
                      </div>
                      {r.replied ? (
                        <m.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex shrink-0 items-center gap-1 rounded-full bg-[#d9f5e5] px-2 py-0.5 text-[10px] font-bold text-[#1f7a4a]"><Check className="size-3" />Replied</m.span>
                      ) : null}
                    </m.button>
                  </m.li>
                );
              })}
            </AnimatePresence>
          </ul>
          <div className="flex items-center gap-2 border-t border-slate-100 p-3">
            <div className="min-h-11 flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm leading-snug">
              {draft ? <span className="text-ink">{draft}<span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-slate-400" /></span> : <span className="text-slate-400">{selected ? "" : panel.placeholder}</span>}
            </div>
            <m.button
              type="button"
              onClick={send}
              aria-label="Send"
              whileHover={{ y: -2, scale: 1.06 }}
              whileTap={{ scale: 0.88 }}
              animate={draft ? { backgroundColor: "#0f9d75" } : { backgroundColor: "#0f1129" }}
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-white"
            >
              <ArrowUp className="size-4" />
            </m.button>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">Sample data for illustration. Click a lead to try a reply.</p>
    </div>
  );
}

// Changes every time a lead lands, so the trail line restarts for the next one.
const cycleKey = (wave: { key: number } | null) => (wave ? wave.key + 1 : 0);
