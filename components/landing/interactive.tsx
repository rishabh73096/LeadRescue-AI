"use client";

import Link from "next/link";
import { useRef, type ComponentProps, type ReactNode } from "react";
import { useInView } from "motion/react";
import * as m from "motion/react-m";

const SPRING = { type: "spring", stiffness: 420, damping: 26 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;

const MotionLink = m.create(Link);

// A link with hover grow and a tap squash. Pass the same classes you would give a Link.
export function PressLink({ children, hover = 1.04, ...props }: { children: ReactNode; hover?: number } & ComponentProps<typeof Link>) {
  return (
    <MotionLink whileHover={{ scale: hover }} whileTap={{ scale: 0.95 }} transition={SPRING} {...(props as object)}>
      {children}
    </MotionLink>
  );
}

// Card that rises in on scroll, lifts on hover and presses in on click.
export function HoverLift({ children, className, delay = 0, lift = 5 }: { children: ReactNode; className?: string; delay?: number; lift?: number }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      whileHover={{ y: -lift, transition: SPRING }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.45, delay, ease: EASE }}
      className={className}
    >
      {children}
    </m.div>
  );
}

// Headline tile: floats on its own, straightens and pops on hover, spins on click.
export function HeroTile({ children, tilt, phase = 0, className, style }: { children: ReactNode; tilt: number; phase?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <span aria-hidden className="tile-float inline-flex align-[-0.12em]" style={{ animationDuration: `${3.6 + phase * 0.5}s`, animationDelay: `${phase * 0.4}s` }}>
      <m.span
        className={className}
        style={style}
        initial={{ rotate: tilt, scale: 0.6, opacity: 0 }}
        animate={{ rotate: tilt, scale: 1, opacity: 1 }}
        whileHover={{ rotate: 0, scale: 1.18 }}
        whileTap={{ rotate: tilt * -3, scale: 0.9 }}
        transition={{ ...SPRING, opacity: { duration: 0.3 } }}
      >
        {children}
      </m.span>
    </span>
  );
}

// Small wrapper for icons/chips that should pop on hover and tap.
export function PopIcon({ children, className, scale = 1.12 }: { children: ReactNode; className?: string; scale?: number }) {
  return (
    <m.span whileHover={{ scale, rotate: -4 }} whileTap={{ scale: 0.9 }} transition={SPRING} className={className}>
      {children}
    </m.span>
  );
}

// Equaliser bars. Motion is CSS (see .wave-bar in globals.css), speeds up on hover and pauses when off screen.
export function WaveBars({ heights, className }: { heights: number[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} className={className} style={{ ["--play" as string]: inView ? "running" : "paused" }} aria-hidden>
      {heights.map((h, i) => (
        <span key={i} className="wave-bar w-[5px] rounded-full bg-ink" style={{ height: `${h}%`, ["--i" as string]: i }} />
      ))}
    </div>
  );
}
