"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInView } from "motion/react";

// The "how it works" demo is the heaviest part of the landing page, so its code only downloads
// when you scroll near it. The placeholder keeps the page height, so nothing jumps.
const FlowDemo = dynamic(() => import("./flow-demo").then((m) => m.FlowDemo), { ssr: false, loading: () => <Placeholder /> });

function Placeholder() {
  return <div aria-hidden className="min-h-[640px] animate-pulse rounded-[2.5rem] bg-[#f4f4f5] md:min-h-[624px]" />;
}

export function LazyFlowDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: "600px 0px 600px 0px" });
  return <div ref={ref}>{near ? <FlowDemo /> : <Placeholder />}</div>;
}
