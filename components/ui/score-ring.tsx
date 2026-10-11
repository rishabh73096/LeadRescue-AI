"use client";

import * as m from "motion/react-m";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  track?: string;
  labelClassName?: string;
  className?: string;
}

export function ScoreRing({ score, size = 48, strokeWidth = 4, color = "#2fa877", track = "#d6f0e4", labelClassName = "text-[10px] font-bold text-slate-800", className }: ScoreRingProps) {
  const radius = 24 - strokeWidth / 2 - 0.5;
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }} role="img" aria-label={`${score}%`}>
      <svg viewBox="0 0 48 48" className="size-full -rotate-90" aria-hidden>
        <circle cx="24" cy="24" r={radius} fill="none" stroke={track} strokeWidth={strokeWidth} />
        <m.circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: score / 100 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <span className={cn("absolute inset-0 flex items-center justify-center", labelClassName)}>{score}%</span>
    </div>
  );
}
