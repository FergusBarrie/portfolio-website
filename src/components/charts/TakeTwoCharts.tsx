"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import data from "@/data/take-two.json";
import { axisProps, chartColors, gridProps, legendStyle, tooltipStyle } from "./theme";
import { usd } from "@/lib/format";

type Fin = {
  fiscal_year: number;
  revenue: number;
  gross_margin_pct: number;
  operating_income: number;
  operating_margin_pct: number;
  goodwill_impairment: number;
  operating_income_ex_impairment: number;
  net_income: number;
  goodwill: number;
};

const fin = data.financials as Fin[];
const fy = (y: number) => "FY" + String(y).slice(2);

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-xs leading-relaxed text-muted">{children}</p>;
}

/** Revenue rising while the operating margin collapses and then recovers. */
export function RevenueMarginChart() {
  const rows = fin.map((f) => ({
    label: fy(f.fiscal_year),
    revenue: f.revenue,
    margin: f.operating_margin_pct,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis
            yAxisId="l"
            {...axisProps}
            width={58}
            tickFormatter={(v: number) => "$" + (v / 1000).toFixed(1) + "bn"}
          />
          <YAxis
            yAxisId="r"
            orientation="right"
            {...axisProps}
            width={50}
            domain={[-90, 30]}
            tickFormatter={(v: number) => v + "%"}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(v: number, name: string) =>
              name === "Operating margin" ? [v.toFixed(1) + "%", name] : ["$" + usd(v) + "m", name]
            }
          />
          <Legend {...legendStyle} />
          <ReferenceLine yAxisId="r" y={0} stroke={chartColors.line} />
          <Bar
            yAxisId="l"
            dataKey="revenue"
            name="Revenue"
            fill={chartColors.accent}
            maxBarSize={52}
            radius={[2, 2, 0, 0]}
          />
          <Line
            yAxisId="r"
            type="monotone"
            dataKey="margin"
            name="Operating margin"
            stroke={chartColors.clay}
            strokeWidth={2.4}
            dot={{ r: 3, strokeWidth: 0, fill: chartColors.clay }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/** The central chart: reported operating result against the underlying one. */
export function ReportedVsUnderlyingChart() {
  const rows = fin.map((f) => ({
    label: fy(f.fiscal_year),
    reported: f.operating_income,
    underlying: f.operating_income_ex_impairment,
  }));

  return (
    <>
      <div className="h-[310px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis
              {...axisProps}
              width={62}
              tickFormatter={(v: number) => "$" + (v / 1000).toFixed(1) + "bn"}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(v: number, name: string) => ["$" + usd(v) + "m", name]}
            />
            <Legend {...legendStyle} />
            <ReferenceLine y={0} stroke={chartColors.ink} strokeWidth={1.2} />
            <Bar
              dataKey="reported"
              name="Operating income as reported"
              fill={chartColors.clay}
              maxBarSize={44}
            />
            <Bar
              dataKey="underlying"
              name="Excluding goodwill impairment"
              fill={chartColors.accent}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Caption>
        The gap between the two bars in FY2024 and FY2025 is the goodwill write-down. The blue
        bars still show losses, but much smaller ones that shrink each year.
      </Caption>
    </>
  );
}

/** Goodwill on the balance sheet: acquired, then written off. */
export function GoodwillChart() {
  const rows = fin.map((f) => ({
    label: fy(f.fiscal_year),
    goodwill: f.goodwill,
    impairment: f.goodwill_impairment,
  }));

  return (
    <>
      <div className="h-[270px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis
              {...axisProps}
              width={58}
              tickFormatter={(v: number) => "$" + (v / 1000).toFixed(1) + "bn"}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(v: number, name: string) => ["$" + usd(v) + "m", name]}
            />
            <Legend {...legendStyle} />
            <Bar
              dataKey="goodwill"
              name="Goodwill on the balance sheet"
              fill={chartColors.accentSoft}
              maxBarSize={52}
              radius={[2, 2, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="impairment"
              name="Written off that year"
              stroke={chartColors.clay}
              strokeWidth={2.4}
              dot={{ r: 3, strokeWidth: 0, fill: chartColors.clay }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Caption>
        Goodwill jumped from $675m to $6.8bn when Zynga was acquired in FY2023, then was written
        down to about $1bn over the following two years.
      </Caption>
    </>
  );
}
