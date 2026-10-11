"use client";

import * as m from "motion/react-m";
import type { ComponentProps, ElementType, ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -8% 0px" } as const;

type Tag = "div" | "section" | "li" | "ul" | "ol" | "p" | "h1" | "h2" | "span";

export function Reveal({ children, delay = 0, y = 16, as = "div", className, ...props }: { children: ReactNode; delay?: number; y?: number; as?: Tag; className?: string } & Omit<ComponentProps<typeof m.div>, "children" | "className">) {
  const Component = m[as] as ElementType;
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.4, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

// Shared by cards: a parent with `initial="hidden" whileInView="show"` staggers every descendant using `variants={cardIn}`.
export const cardIn = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } };
export const gridStagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } } };

export function Stagger({ children, as = "ul", className }: { children: ReactNode; as?: Tag; className?: string }) {
  const Component = m[as] as ElementType;
  return (
    <Component variants={container} initial="hidden" whileInView="show" viewport={VIEWPORT} className={className}>
      {children}
    </Component>
  );
}

export function StaggerItem({ children, as = "li", className }: { children: ReactNode; as?: Tag; className?: string }) {
  const Component = m[as] as ElementType;
  return (
    <Component variants={item} className={className}>
      {children}
    </Component>
  );
}

export function Pop({ children, delay = 0, from = "bottom", as = "div", className }: { children: ReactNode; delay?: number; from?: "bottom" | "left" | "right"; as?: Tag; className?: string }) {
  const Component = m[as] as ElementType;
  const offset = from === "left" ? { x: -12, y: 0 } : from === "right" ? { x: 12, y: 0 } : { x: 0, y: 10 };
  return (
    <Component initial={{ opacity: 0, scale: 0.97, ...offset }} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }} transition={{ duration: 0.3, delay, ease: EASE }} className={className}>
      {children}
    </Component>
  );
}

export function Float({ children, distance = 6, duration = 4.5, className }: { children: ReactNode; distance?: number; duration?: number; className?: string }) {
  return (
    <m.div animate={{ y: [0, -distance, 0] }} transition={{ duration, repeat: Infinity, ease: "easeInOut" }} className={className}>
      {children}
    </m.div>
  );
}

export function WordReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <m.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: delay + i * 0.05, ease: EASE }}
          >
            {word}
            {" "}
          </m.span>
        </span>
      ))}
    </span>
  );
}

export function Tap({ children, className, ...props }: { children: ReactNode; className?: string } & Omit<ComponentProps<typeof m.div>, "children" | "className">) {
  return (
    <m.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className={className} {...props}>
      {children}
    </m.div>
  );
}
