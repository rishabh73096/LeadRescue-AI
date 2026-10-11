"use client";

import type { ReactNode } from "react";
import * as m from "motion/react-m";

// Re-mounts on every dashboard navigation, so each page eases in.
export default function DashboardTemplate({ children }: { children: ReactNode }) {
  return (
    <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </m.div>
  );
}
