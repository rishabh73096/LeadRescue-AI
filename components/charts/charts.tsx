"use client";

import dynamic from "next/dynamic";

// The chart library is loaded on demand, so pages open fast on slow networks and the
// skeleton shows while the chart code downloads.
function ChartSkeleton() {
  return <div aria-hidden className="h-[200px] w-full animate-pulse rounded-xl bg-slate-100" />;
}

export const AreaTrend = dynamic(() => import("./charts-impl").then((m) => m.AreaTrend), { ssr: false, loading: ChartSkeleton });
export const BarsH = dynamic(() => import("./charts-impl").then((m) => m.BarsH), { ssr: false, loading: ChartSkeleton });
export const Columns = dynamic(() => import("./charts-impl").then((m) => m.Columns), { ssr: false, loading: ChartSkeleton });

export { STAGE_COLORS } from "./stage-colors";
export type { Point, SeriesDef } from "./charts-impl";
