"use client";

import { EvilAreaChart } from "@/components/evilcharts/charts/recharts-area-chart";
import { EvilBarChart } from "@/components/evilcharts/charts/recharts-bar-chart";
import type { ChartConfig } from "@/components/evilcharts/ui/recharts-chart";

// Thin wrappers over Evil Charts (shadcn + Recharts) so pages keep one simple API.

const AXIS_TICK = { fontSize: 11 } as const;
const short = (v: string) => (v.length > 9 ? v.split(" ")[0] : v);
const compact = (n: number) => (n >= 1000 ? `${+(n / 1000).toFixed(1)}K` : String(n));

const colorOf = (c: string) => ({ light: [c] });

export type Point = { label: string; value: number; color?: string };

export interface SeriesDef {
  key: string;
  name: string;
  color: string;
}

// Single-series area with a soft gradient fill.
export function AreaTrend({ data, name, height = 220, color = "#2a78d6" }: { data: Point[]; name: string; height?: number; format?: (n: number) => string; color?: string }) {
  const config = { value: { label: name, colors: colorOf(color) } } satisfies ChartConfig;
  return (
    <div style={{ height }} className="w-full [&>div]:h-full [&>div]:aspect-auto">
    <EvilAreaChart className="aspect-auto" data={data} config={config} curveType="monotone" chartProps={{ margin: { top: 8, right: 8, bottom: 0, left: 0 } }}>
      <EvilAreaChart.Grid />
      <EvilAreaChart.XAxis dataKey="label" tick={AXIS_TICK} interval="preserveStartEnd" />
      <EvilAreaChart.YAxis tick={AXIS_TICK} allowDecimals={false} tickFormatter={compact} />
      <EvilAreaChart.Tooltip />
      <EvilAreaChart.Area dataKey="value" variant="gradient" strokeVariant="solid" strokeWidth={2} />
    </EvilAreaChart>
    </div>
  );
}

// Horizontal bars, one series.
export function BarsH({ data, name, height, color = "#2a78d6" }: { data: Point[]; name: string; height?: number; format?: (n: number) => string; color?: string }) {
  const config = { value: { label: name, colors: colorOf(color) } } satisfies ChartConfig;
  const h = height ?? Math.max(120, data.length * 38 + 16);
  return (
    <div style={{ height: h }} className="w-full [&>div]:h-full [&>div]:aspect-auto">
      <EvilBarChart className="aspect-auto" data={data} config={config} layout="horizontal" barRadius={6} barCategoryGap={12} chartProps={{ margin: { top: 0, right: 12, bottom: 0, left: 0 } }}>
        <EvilBarChart.XAxis dataKey="value" hide />
        <EvilBarChart.YAxis dataKey="label" tick={{ fontSize: 12 }} width={92} />
        <EvilBarChart.Tooltip />
        <EvilBarChart.Bar dataKey="value" />
      </EvilBarChart>
    </div>
  );
}

// Vertical columns; several series are stacked.
export function Columns({ data, series, height = 220, color }: { data: ({ label: string } & Record<string, number | string | undefined>)[]; series: SeriesDef[]; height?: number; format?: (n: number) => string; color?: string }) {
  const config: ChartConfig = Object.fromEntries(series.map((s) => [s.key, { label: s.name, colors: colorOf(color ?? s.color) }]));
  return (
    <div style={{ height }} className="w-full [&>div]:h-full [&>div]:aspect-auto">
      <EvilBarChart className="aspect-auto" data={data} config={config} stackType={series.length > 1 ? "stacked" : "default"} barRadius={6} barCategoryGap={14} chartProps={{ margin: { top: 8, right: 8, bottom: 0, left: 0 } }}>
        <EvilBarChart.Grid />
        <EvilBarChart.XAxis dataKey="label" tick={AXIS_TICK} tickFormatter={short} interval={0} />
        <EvilBarChart.YAxis tick={AXIS_TICK} allowDecimals={false} tickFormatter={compact} />
        <EvilBarChart.Tooltip />
        {series.map((s) => <EvilBarChart.Bar key={s.key} dataKey={s.key} />)}
      </EvilBarChart>
    </div>
  );
}
