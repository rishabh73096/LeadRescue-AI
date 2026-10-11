"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";
import { useSlowNetwork } from "@/lib/network";

export function MotionProvider({ children }: { children: ReactNode }) {
  const slow = useSlowNetwork();
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={slow ? "always" : "user"}>{children}</MotionConfig>
    </LazyMotion>
  );
}
