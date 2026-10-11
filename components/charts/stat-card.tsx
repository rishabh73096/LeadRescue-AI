"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import * as m from "motion/react-m";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import type { LucideIcon } from "lucide-react";
import { cardIn } from "@/components/ui/motion";
import { PANEL_SURFACE } from "@/components/ui/panel";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export function StatCard({ icon: Icon, label, value, sub, spark, tone, href }: { icon: LucideIcon; label: string; value: string; sub?: string; spark?: number[]; tone?: "red"; href?: string }) {
  const body = (
    <m.div variants={cardIn} whileHover={href ? { y: -3 } : undefined} transition={{ type: "spring", stiffness: 400, damping: 30 }} className={cn(PANEL_SURFACE, "viz relative h-full overflow-hidden p-5", href && "transition-shadow hover:shadow-md")}>
      <span className={cn("flex size-10 items-center justify-center rounded-lg", tone === "red" ? "bg-[#fde0e0] text-[#c2262e]" : "bg-[#e8e6fb] text-[#3b2fd0]")}>
        <Icon className="size-[18px]" />
      </span>
      <p className="font-inter mt-4 text-3xl font-extrabold tracking-[-0.03em] text-ink"><AnimatedValue value={value} /></p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
      {sub ? <p className="mt-0.5 text-xs text-slate-400">{sub}</p> : null}
      {spark && spark.some((n) => n > 0) ? (
        <div className="pointer-events-none absolute top-4 right-4 h-10 w-20" aria-hidden>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark.map((v) => ({ v }))} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <Area type="monotone" dataKey="v" stroke={tone === "red" ? "var(--viz-bad)" : "var(--viz-1)"} strokeWidth={2} fill={tone === "red" ? "var(--viz-bad)" : "var(--viz-1)"} fillOpacity={0.1} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </m.div>
  );
  return href ? <Link href={href} className="block h-full">{body}</Link> : body;
}

// Counts up to the number inside strings like "4", "₹36,200" or "50%", then shows the exact original text.
function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const match = /^(\D*)([\d,]+)(\D*)$/.exec(value);
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    if (!inView || reduced || !match) return;
    const target = Number(match[2].replace(/,/g, ""));
    const controls = animate(0, target, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => setText(`${match[1]}${new Intl.NumberFormat("en-IN").format(Math.round(n))}${match[3]}`),
      onComplete: () => setText(null),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the displayed value changes
  }, [inView, reduced, value]);

  return <span ref={ref} className="tabular-nums">{text ?? value}</span>;
}
