"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, animate, useInView } from "motion/react";
import * as m from "motion/react-m";
import { Bell, Check, FileSpreadsheet, Globe, Mail, MessageCircle, ShieldCheck, Upload, UserPlus, type LucideIcon } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

// Small looping demos that live inside the landing page's bento cards.
// Icons are imported here (not passed as props) because functions can't cross the server/client boundary.

const SPRING = { type: "spring", stiffness: 380, damping: 26 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;

// Runs only while the card is on screen, and not at all with "reduce motion".
function useLive<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "-6% 0px -6% 0px" });
  const reduced = useReducedMotion();
  return { ref, live: inView && !reduced, reduced };
}

function useTicker(ms: number, enabled: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setT((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [ms, enabled]);
  return t;
}

const SOURCES: { label: string; icon: LucideIcon; color: string }[] = [
  { label: "Website form", icon: Globe, color: "#0f9d75" },
  { label: "Email", icon: Mail, color: "#e8590c" },
  { label: "WhatsApp", icon: MessageCircle, color: "#16a34a" },
  { label: "CSV import", icon: FileSpreadsheet, color: "#0e1116" },
];

/* 1 — "Every enquiry in one place": four sources fly into one list. */
export function HeroConverge({ stat }: { stat: { value: string; label: string } }) {
  const { ref, live, reduced } = useLive<HTMLDivElement>();
  const t = useTicker(900, live);
  const step = reduced ? 4 : t % 7; // 0..3 rows arrive, 4..5 hold, 6 clears
  const shown = step >= 6 ? 0 : Math.min(step + 1, 4);
  const chipIcons: LucideIcon[] = [Mail, Globe, MessageCircle, Upload];
  const activeChip = step < 4 ? step : -1;

  return (
    <div ref={ref} className="mt-auto">
      <div className="relative mx-auto h-[238px] w-full max-w-[380px] overflow-hidden rounded-2xl bg-white/70 p-3 ring-1 ring-black/5">
        <p className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span>One list</span>
          <m.span key={shown} initial={{ scale: 1.4, color: "#0f9d75" }} animate={{ scale: 1, color: "#94a3b8" }}>{shown} enquiries</m.span>
        </p>
        <ul className="space-y-1.5">
          <AnimatePresence initial={false}>
            {SOURCES.slice(0, shown).map((s, i) => (
              <m.li
                key={s.label}
                initial={{ opacity: 0, x: i % 2 ? 90 : -90, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex items-center gap-2.5 rounded-xl bg-white px-2.5 py-1.5 shadow-sm"
              >
                <span className="flex size-7 items-center justify-center rounded-lg text-white" style={{ background: s.color }}><s.icon className="size-3.5" /></span>
                <span className="text-xs font-semibold text-ink">{s.label}</span>
                <Check className="ml-auto size-3.5 text-brand" />
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {chipIcons.map((Ic, i) => (
          <m.span
            key={i}
            animate={activeChip === i ? { scale: 1.18, y: -4 } : { scale: 1, y: 0 }}
            whileHover={{ scale: 1.12, rotate: -4 }}
            whileTap={{ scale: 0.9 }}
            transition={SPRING}
            className={cn("flex size-11 cursor-pointer items-center justify-center rounded-xl", i === 0 ? "bg-brand text-white" : i === 1 ? "bg-ink text-white" : "bg-white text-ink shadow-sm")}
          >
            <Ic className="size-5" />
          </m.span>
        ))}
      </div>
      <div className="mt-5 flex items-end gap-3">
        <span className="font-inter text-7xl leading-none font-extrabold tracking-[-0.05em] text-ink">{stat.value}</span>
        <span className="pb-1.5 text-xs text-slate-500">{stat.label}</span>
      </div>
    </div>
  );
}

/* 2 — "New to Won": a lead walks through the four stages. */
export function StageTracker({ blocks }: { blocks: { label: string; grow: number }[] }) {
  const { ref, live, reduced } = useLive<HTMLDivElement>();
  const t = useTicker(1300, live);
  const total = blocks.reduce((s, b) => s + b.grow, 0);
  const centers = blocks.map((_, i) => ((blocks.slice(0, i).reduce((s, b) => s + b.grow, 0) + blocks[i].grow / 2) / total) * 100);
  const stage = reduced ? 3 : t % (blocks.length + 1);
  const resting = stage >= blocks.length;
  const idx = Math.min(stage, blocks.length - 1);
  const won = idx === blocks.length - 1 && !resting;

  return (
    <div ref={ref} className="relative">
      <div className="flex gap-2">
        {blocks.map((b, i) => {
          const on = i === idx && !resting;
          return (
            <m.div
              key={b.label}
              style={{ flexGrow: b.grow }}
              animate={{ backgroundColor: on ? (won ? "#d9f5e5" : "#ffffff") : "#f1f1f2" }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3 }}
              className={cn("relative h-24 basis-0 overflow-hidden rounded-xl", !on && "bg-[repeating-linear-gradient(135deg,#ececee_0_8px,#f6f6f7_8px_16px)]", on && "shadow-md")}
            >
              <span className={cn("absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm", on ? "bg-ink text-white" : "bg-white text-slate-700")}>{b.label}</span>
            </m.div>
          );
        })}
      </div>
      <m.span
        aria-hidden
        animate={{ left: `${centers[idx]}%`, opacity: resting ? 0 : 1, scale: won ? 1.15 : 1, backgroundColor: won ? "#1f7a4a" : "#0f9d75" }}
        transition={{ type: "spring", stiffness: 160, damping: 20, opacity: { duration: 0.25 } }}
        className="absolute top-3 flex size-8 -translate-x-1/2 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-lg ring-2 ring-white"
      >
        {won ? <Check className="size-4" /> : "PS"}
      </m.span>
    </div>
  );
}

/* 3 + 4 — "24h" / "48h": number counts up; the dark one also runs a timer bar. */
export function CountStat({ value, dark }: { value: string; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : 0;
  const suffix = match?.[2] ?? "";
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || reduced || !match) return;
    const c = animate(0, target, { duration: 1.3, ease: EASE, onUpdate: (v) => setN(Math.round(v)), onComplete: () => setN(null) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when the card scrolls into view
  }, [inView, reduced]);

  const replay = () => {
    if (reduced || !match) return;
    animate(0, target, { duration: 0.9, ease: EASE, onUpdate: (v) => setN(Math.round(v)), onComplete: () => setN(null) });
  };

  return (
    <div ref={ref} onMouseEnter={replay} className="relative cursor-default">
      <span className={cn("font-inter text-6xl leading-none font-extrabold tracking-[-0.05em] tabular-nums", dark ? "text-white" : "text-ink")}>{n === null ? value : `${n}${suffix}`}</span>
      {dark ? (
        <span aria-hidden className="mt-4 block h-1.5 overflow-hidden rounded-full bg-white/10">
          <m.span className="bg-brand-bright block h-full rounded-full" initial={{ width: "0%" }} animate={reduced ? { width: "100%" } : { width: ["0%", "100%", "100%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", times: [0, 0.85, 1] }} />
        </span>
      ) : (
        <m.span aria-hidden className="absolute top-0 right-0 flex size-9 items-center justify-center rounded-full bg-white text-brand shadow-sm" animate={reduced ? undefined : { rotate: [0, -18, 16, -12, 8, 0] }} transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 3.2, ease: "easeInOut" }} style={{ transformOrigin: "50% 15%" }}>
          <Bell className="size-4" />
        </m.span>
      )}
    </div>
  );
}

/* 5 — "Works with how you work": different ways of adding a lead take turns. */
const METHODS: { label: string; text: string; icon: LucideIcon }[] = [
  { label: "Add by hand", text: "Priya Sharma added", icon: UserPlus },
  { label: "CSV import", text: "40 leads imported", icon: FileSpreadsheet },
  { label: "Email", text: "New enquiry from Email", icon: Mail },
  { label: "WhatsApp log", text: "Chat logged from WhatsApp", icon: MessageCircle },
];

export function MethodFeed({ labels }: { labels: string[] }) {
  const { ref, live, reduced } = useLive<HTMLDivElement>();
  const t = useTicker(1800, live);
  const [picked, setPicked] = useState<{ i: number; at: number } | null>(null);
  const auto = reduced ? 0 : t % METHODS.length;
  const active = picked && picked.at === t ? picked.i : auto; // a click holds until the next tick
  const cur = METHODS[active];

  return (
    <div ref={ref} className="mt-auto space-y-4">
      <div className="flex h-16 items-center">
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={active} initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }} className="flex w-full max-w-[340px] items-center gap-3 rounded-xl bg-white px-3.5 py-3 shadow-sm">
            <span className="bg-brand/10 text-brand flex size-9 items-center justify-center rounded-lg"><cur.icon className="size-4" /></span>
            <span className="text-sm font-semibold text-ink">{cur.text}</span>
            <m.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25, ...SPRING }} className="bg-brand ml-auto flex size-5 items-center justify-center rounded-full text-white"><Check className="size-3" /></m.span>
          </m.div>
        </AnimatePresence>
      </div>
      <div className="flex flex-wrap gap-2">
        {labels.map((label, i) => {
          const M = METHODS[i] ?? METHODS[0];
          const on = i === active;
          return (
            <m.button
              key={label}
              type="button"
              onClick={() => setPicked({ i, at: t })}
              animate={on ? { scale: 1.06, y: -2 } : { scale: 1, y: 0 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.94 }}
              transition={SPRING}
              className={cn("inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold shadow-sm transition-colors", on ? "bg-ink text-white" : "bg-white text-ink")}
            >
              <M.icon className={cn("size-3.5", on ? "text-brand-bright" : "text-brand")} />{label}
            </m.button>
          );
        })}
      </div>
    </div>
  );
}

/* 6 — "Sounds like you": the sparkle icon twinkles. */
export function Twinkle({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <m.span className="inline-flex" animate={reduced ? undefined : { rotate: [0, 18, -12, 0], scale: [1, 1.25, 1] }} transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }} whileHover={{ scale: 1.3, rotate: 20 }}>
      {children}
    </m.span>
  );
}

/* 7 — "You press send": a draft that only goes out when you tap Send. */
export function SendDemo() {
  const reduced = useReducedMotion();
  const [sent, setSent] = useState(false);
  useEffect(() => {
    if (!sent) return;
    const id = setTimeout(() => setSent(false), 2200);
    return () => clearTimeout(id);
  }, [sent]);

  return (
    <div className="flex flex-col gap-3">
      <span className="flex size-10 items-center justify-center rounded-xl bg-white text-ink shadow-sm"><ShieldCheck className="size-4" /></span>
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <p className="text-[11px] font-semibold text-slate-400">Draft</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">Hi Meera, here is your quote…</p>
        <m.button
          type="button"
          onClick={() => setSent(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.92 }}
          animate={sent ? { backgroundColor: "#1f7a4a" } : { backgroundColor: "#0f1129" }}
          className="relative mt-3 flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-white"
        >
          {!sent && !reduced ? <m.span aria-hidden className="absolute inset-0 rounded-lg ring-2 ring-brand" animate={{ opacity: [0.8, 0], scale: [1, 1.12] }} transition={{ duration: 1.6, repeat: Infinity }} /> : null}
          <AnimatePresence mode="wait" initial={false}>
            <m.span key={sent ? "sent" : "send"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="flex items-center gap-1.5">
              {sent ? <><Check className="size-3.5" />Sent by you</> : "You press send"}
            </m.span>
          </AnimatePresence>
        </m.button>
      </div>
    </div>
  );
}

/* 8 — "English or Hindi": the reply switches language. */
const REPLIES = [
  { code: "EN", text: "Hi Meera, thanks for reaching out. Here is your quote." },
  { code: "हिन्दी", text: "नमस्ते मीरा जी, संपर्क करने के लिए धन्यवाद। आपका कोटेशन यह है।" },
];

function Typed({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setN((x) => (x >= text.length ? x : x + 1)), 28);
    return () => clearInterval(id);
  }, [text, reduced]);
  return <>{reduced ? text : text.slice(0, n)}</>;
}

export function LanguageSwap() {
  const { ref, live } = useLive<HTMLDivElement>();
  const t = useTicker(4200, live);
  const [picked, setPicked] = useState<{ i: number; at: number } | null>(null);
  const active = picked && picked.at === t ? picked.i : t % 2;

  return (
    <div ref={ref} className="flex gap-2">
      {REPLIES.map((r, i) => {
        const on = i === active;
        return (
          <m.button
            key={r.code}
            type="button"
            onClick={() => setPicked({ i, at: t })}
            animate={{ flexGrow: on ? 2.2 : 1, backgroundColor: on ? "#ffffff" : "#f1f1f2" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            className={cn("relative h-28 basis-0 cursor-pointer overflow-hidden rounded-xl p-3 text-left", on ? "shadow-md" : "bg-[repeating-linear-gradient(135deg,#ececee_0_8px,#f6f6f7_8px_16px)]")}
          >
            {on ? <span key={r.code} className="block text-[12px] leading-5 text-ink"><Typed text={r.text} /></span> : null}
            <span className={cn("absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm", on ? "bg-brand text-white" : "bg-white text-slate-700")}>{r.code}</span>
          </m.button>
        );
      })}
    </div>
  );
}

/* 9 — "Know what needs you": status pills take turns being the one that needs you. */
const COUNTS = [3, 5, 8, 12];
const SUMMARY = ["3 leads overdue. Reply today.", "5 follow-ups are due today.", "8 are waiting on the customer.", "12 deals won this quarter."];

export function StatusCycle({ pills }: { pills: { label: string; color: string }[] }) {
  const { ref, live, reduced } = useLive<HTMLDivElement>();
  const t = useTicker(2000, live);
  const [picked, setPicked] = useState<{ i: number; at: number } | null>(null);
  const auto = reduced ? 0 : t % pills.length;
  const active = picked && picked.at === t ? picked.i : auto;

  return (
    <div ref={ref} className="mt-auto space-y-4">
      <div className="h-6 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <m.p key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="text-sm font-semibold text-ink">{SUMMARY[active] ?? ""}</m.p>
        </AnimatePresence>
      </div>
      <div className="flex flex-wrap gap-2">
        {pills.map((p, i) => {
          const on = i === active;
          return (
            <m.button
              key={p.label}
              type="button"
              onClick={() => setPicked({ i, at: t })}
              animate={on ? { scale: 1.07, y: -2 } : { scale: 1, y: 0 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.92 }}
              transition={SPRING}
              className={cn("inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold", on ? "bg-ink text-white shadow-md" : "bg-white text-slate-700 shadow-sm")}
            >
              <span className={cn("size-1.5 rounded-full", on && "animate-pulse")} style={{ background: p.color }} />
              {p.label}
              <AnimatePresence initial={false}>
                {on ? <m.span key="n" initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden rounded-full bg-white/20 px-1.5 text-[10px]">{COUNTS[i]}</m.span> : null}
              </AnimatePresence>
            </m.button>
          );
        })}
      </div>
    </div>
  );
}

/* 10 — "Made for small teams": teammates pop in and fan out on hover. */
const TEAM = [
  { n: "AS", c: "#0f9d75" },
  { n: "RK", c: "#e8590c" },
  { n: "MP", c: "#2a78d6" },
  { n: "+2", c: "#0e1116" },
];

export function TeamAvatars({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <m.div
      className={cn("flex items-center", className)}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      onTap={() => setOpen((o) => !o)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
    >
      {TEAM.map((p, i) => (
        <m.span
          key={p.n}
          variants={{ hidden: { opacity: 0, scale: 0.4, y: 10 }, show: { opacity: 1, scale: 1, y: 0 } }}
          animate={{ marginLeft: i === 0 ? 0 : open ? 6 : -12 }}
          whileHover={{ y: -4, scale: 1.12 }}
          transition={SPRING}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-[#f4f4f5]"
          style={{ background: p.c }}
        >
          {p.n}
        </m.span>
      ))}
    </m.div>
  );
}
