"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import data from "@/data/financial-performance.json";
import { compactUsdMillions, usd } from "@/lib/format";
import {
  axisProps,
  chartColors,
  gridProps,
  legendStyle,
  tooltipStyle,
} from "./theme";

type Fin = {
  fiscal_year: number;
  revenue: number;
  gross_profit: number;
  sg_and_a: number;
  operating_income: number;
  net_income: number;
  demand_creation_expense: number;
  operating_overhead: number;
  eps_diluted: number;
};

type Ratio = {
  fiscal_year: number;
  gross_margin_pct: number;
  operating_margin_pct: number;
  net_margin_pct: number;
  demand_creation_pct_of_revenue: number;
  overhead_pct_of_revenue: number;
};

const fin = data.financials as Fin[];
const ratios = data.ratios as Ratio[];
const fy = (year: number) => "FY" + String(year).slice(2);

/** Revenue with operating margin on a second axis. Margin fell further than revenue. */
export function RevenueMarginChart() {
  const rows = fin.map((f, i) => ({
    label: fy(f.fiscal_year),
    revenue: f.revenue,
    operating_margin: ratios[i].operating_margin_pct,
  }));

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis
            yAxisId="left"
            {...axisProps}
            tickFormatter={(v: number) => compactUsdMillions(v)}
            width={58}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            {...axisProps}
            domain={[0, 20]}
            tickFormatter={(v: number) => v + "%"}
            width={42}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number, name: string) =>
              name === "Operating margin"
                ? [value.toFixed(1) + "%", name]
                : [usd(value) + "m", name]
            }
          />
          <Legend {...legendStyle} />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="Revenue"
            radius={[2, 2, 0, 0]}
            maxBarSize={52}
            fill={chartColors.accent}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="operating_margin"
            name="Operating margin"
            stroke={chartColors.clay}
            strokeWidth={2.2}
            dot={{ r: 3, fill: chartColors.clay, strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/** The three margins together. The widening gap is the cost story. */
export function MarginsChart() {
  const rows = ratios.map((r) => ({
    label: fy(r.fiscal_year),
    gross: r.gross_margin_pct,
    operating: r.operating_margin_pct,
    net: r.net_margin_pct,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis
            {...axisProps}
            domain={[0, 50]}
            tickFormatter={(v: number) => v + "%"}
            width={42}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number, name: string) => [value.toFixed(1) + "%", name]}
          />
          <Legend {...legendStyle} />
          <Line
            type="monotone"
            dataKey="gross"
            name="Gross margin"
            stroke={chartColors.accent}
            strokeWidth={2.2}
            dot={{ r: 2.5, strokeWidth: 0, fill: chartColors.accent }}
          />
          <Line
            type="monotone"
            dataKey="operating"
            name="Operating margin"
            stroke={chartColors.clay}
            strokeWidth={2.2}
            dot={{ r: 2.5, strokeWidth: 0, fill: chartColors.clay }}
          />
          <Line
            type="monotone"
            dataKey="net"
            name="Net margin"
            stroke={chartColors.accentSoft}
            strokeWidth={2.2}
            dot={{ r: 2.5, strokeWidth: 0, fill: chartColors.accentSoft }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** SG&A split as a share of revenue: marketing rose while overhead was cut. */
export function SgaSplitChart() {
  const rows = ratios.map((r) => ({
    label: fy(r.fiscal_year),
    marketing: r.demand_creation_pct_of_revenue,
    overhead: r.overhead_pct_of_revenue,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis
            {...axisProps}
            tickFormatter={(v: number) => v + "%"}
            width={42}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number, name: string) => [value.toFixed(1) + "%", name]}
          />
          <Legend {...legendStyle} />
          <Bar
            dataKey="overhead"
            stackId="sga"
            name="Operating overhead"
            fill={chartColors.accent}
            maxBarSize={52}
          />
          <Bar
            dataKey="marketing"
            stackId="sga"
            name="Marketing (demand creation)"
            fill={chartColors.clay}
            radius={[2, 2, 0, 0]}
            maxBarSize={52}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Waterfall of the fall in operating income.
 * Built from stacked bars: an invisible "base" bar lifts each step to where it
 * belongs, and the visible bar on top is the size of the effect.
 */
export function MarginBridgeChart() {
  const bridge = data.margin_bridge as { item: string; usd_millions: number }[];
  const start = bridge[0].usd_millions;
  const end = bridge[bridge.length - 1].usd_millions;
  const steps = bridge.slice(1, -1);

  const rows: {
    label: string;
    base: number;
    value: number;
    display: number;
    kind: "total" | "down" | "up";
  }[] = [{ label: "FY2024", base: 0, value: start, display: start, kind: "total" }];

  let running = start;
  for (const step of steps) {
    const amount = step.usd_millions;
    const base = amount < 0 ? running + amount : running;
    rows.push({
      label: step.item === "Change in SG&A" ? "SG&A savings" : step.item,
      base,
      value: Math.abs(amount),
      display: amount,
      kind: amount < 0 ? "down" : "up",
    });
    running += amount;
  }
  rows.push({ label: "FY2026", base: 0, value: end, display: end, kind: "total" });

  return (
    <div className="h-[330px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="label"
            {...axisProps}
            interval={0}
            angle={-18}
            textAnchor="end"
            height={64}
          />
          <YAxis
            {...axisProps}
            tickFormatter={(v: number) => compactUsdMillions(v)}
            width={58}
          />
          <Tooltip
            {...tooltipStyle}
            cursor={{ fill: "rgba(143,166,196,0.12)" }}
            formatter={(_value: number, _name: string, item) => {
              const row = item.payload as { display: number; kind: string };
              return [
                (row.display > 0 && row.kind !== "total" ? "+" : "") +
                  usd(row.display) +
                  "m",
                row.kind === "total" ? "Operating income" : "Effect",
              ];
            }}
          />
          <ReferenceLine y={0} stroke={chartColors.line} />
          <Bar dataKey="base" stackId="w" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="value" stackId="w" radius={[2, 2, 0, 0]} maxBarSize={64}>
            {rows.map((r, i) => (
              <Cell
                key={i}
                fill={
                  r.kind === "total"
                    ? chartColors.ink
                    : r.kind === "down"
                      ? chartColors.clay
                      : chartColors.accentSoft
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

type ForecastRow = {
  scenario: string;
  fiscal_year: number;
  revenue: number;
  operating_margin_pct: number;
  net_income: number;
  eps_diluted: number;
};

const METRICS = {
  operating_margin_pct: { label: "Operating margin", suffix: "%", decimals: 1 },
  eps_diluted: { label: "Diluted EPS", prefix: "$", decimals: 2 },
  net_income: { label: "Net income", prefix: "$", suffix: "m", decimals: 0 },
  revenue: { label: "Revenue", prefix: "$", suffix: "m", decimals: 0 },
} as const;

type MetricKey = keyof typeof METRICS;

/**
 * The forecast, with a metric switch. The actual FY2026 figure is included as
 * the starting point so the scenarios can be read against something real.
 */
export function ForecastChart() {
  const [metric, setMetric] = useState<MetricKey>("operating_margin_pct");
  const forecast = data.forecast as ForecastRow[];
  const last = fin[fin.length - 1];
  const lastRatio = ratios[ratios.length - 1];

  const actual: Record<MetricKey, number> = {
    operating_margin_pct: lastRatio.operating_margin_pct,
    eps_diluted: last.eps_diluted,
    net_income: last.net_income,
    revenue: last.revenue,
  };

  const years = [2026, 2027, 2028];
  const rows = years.map((year) => {
    const row: Record<string, number | string> = { label: "FY" + String(year).slice(2) };
    for (const scenario of ["Low", "Base", "High"]) {
      if (year === 2026) {
        row[scenario] = actual[metric];
      } else {
        const match = forecast.find(
          (f) => f.scenario === scenario && f.fiscal_year === year
        );
        if (match) row[scenario] = match[metric] as number;
      }
    }
    return row;
  });

  const spec = METRICS[metric];
  const fmt = (v: number) =>
    ("prefix" in spec ? spec.prefix : "") +
    v.toLocaleString("en-US", {
      minimumFractionDigits: spec.decimals,
      maximumFractionDigits: spec.decimals,
    }) +
    ("suffix" in spec ? spec.suffix : "");

  return (
    <div>
      <div
        role="group"
        aria-label="Choose a measure"
        className="mb-4 flex flex-wrap gap-1.5"
      >
        {(Object.keys(METRICS) as MetricKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setMetric(key)}
            aria-pressed={metric === key}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              metric === key
                ? "border-ink bg-ink text-white"
                : "border-line bg-surface text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {METRICS[key].label}
          </button>
        ))}
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis
              {...axisProps}
              tickFormatter={(v: number) => fmt(v)}
              width={64}
              domain={["auto", "auto"]}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(value: number, name: string) => [fmt(value), name + " case"]}
            />
            <Legend {...legendStyle} />
            <Line
              type="monotone"
              dataKey="High"
              stroke={chartColors.accent}
              strokeWidth={2.2}
              dot={{ r: 3, strokeWidth: 0, fill: chartColors.accent }}
            />
            <Line
              type="monotone"
              dataKey="Base"
              stroke={chartColors.ink}
              strokeWidth={2.2}
              dot={{ r: 3, strokeWidth: 0, fill: chartColors.ink }}
            />
            <Line
              type="monotone"
              dataKey="Low"
              stroke={chartColors.clay}
              strokeWidth={2.2}
              dot={{ r: 3, strokeWidth: 0, fill: chartColors.clay }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        FY2026 is the reported figure, so all three lines start from the same point.
        FY2027 and FY2028 follow from the assumptions listed below — they are a
        sensitivity exercise, not a prediction.
      </p>
    </div>
  );
}
