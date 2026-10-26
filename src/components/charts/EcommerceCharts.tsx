"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import data from "@/data/ecommerce-sales.json";
import { compactGbp, compactMonthLabel, gbp, monthLabel } from "@/lib/format";
import {
  axisProps,
  chartColors,
  gridProps,
  legendStyle,
  tooltipStyle,
} from "./theme";

type MonthlyRow = {
  invoice_month: string;
  revenue: number;
  orders: number;
  avg_order_value: number;
  month_status: string;
};

/**
 * Monthly revenue with average order value on a second axis.
 * Two things to see: the autumn peak each year, and order value drifting up.
 * The partial month is drawn in a lighter colour rather than removed.
 */
export function MonthlyRevenueChart() {
  const rows = (data.monthly as MonthlyRow[]).map((r) => ({
    ...r,
    label: compactMonthLabel(r.invoice_month),
    partial: r.month_status !== "complete month",
  }));

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} minTickGap={14} />
          <YAxis
            yAxisId="left"
            {...axisProps}
            tickFormatter={(v: number) => compactGbp(v)}
            width={54}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            {...axisProps}
            domain={[0, 700]}
            tickFormatter={(v: number) => "£" + v}
            width={46}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number, name: string) =>
              name === "Average order value"
                ? [gbp(value, 2), name]
                : [gbp(value), name]
            }
            labelFormatter={(_, payload) =>
              payload?.[0]
                ? monthLabel((payload[0].payload as MonthlyRow).invoice_month) +
                  ((payload[0].payload as { partial: boolean }).partial
                    ? " (9 days only)"
                    : "")
                : ""
            }
          />
          <Legend {...legendStyle} />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="Revenue"
            fill={chartColors.accent}
            radius={[2, 2, 0, 0]}
          >
            {rows.map((r) => (
              <Cell
                key={r.invoice_month}
                fill={r.partial ? chartColors.accentSoft : chartColors.accent}
              />
            ))}
          </Bar>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avg_order_value"
            name="Average order value"
            stroke={chartColors.clay}
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Revenue by product category. Horizontal because the labels are long. */
export function CategoryChart() {
  const rows = [...(data.categories as { category: string; revenue: number; share_of_revenue_pct: number }[])]
    .sort((a, b) => a.revenue - b.revenue);

  return (
    <div className="h-[380px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 4, right: 48, bottom: 0, left: 8 }}
        >
          <CartesianGrid {...gridProps} horizontal={false} vertical />
          <XAxis
            type="number"
            {...axisProps}
            tickFormatter={(v: number) => compactGbp(v)}
          />
          <YAxis
            type="category"
            dataKey="category"
            {...axisProps}
            width={148}
            tick={{ fill: chartColors.muted, fontSize: 11 }}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number) => [gbp(value), "Revenue"]}
          />
          <Bar dataKey="revenue" radius={[0, 2, 2, 0]} maxBarSize={18}>
            {rows.map((r) => (
              <Cell
                key={r.category}
                fill={r.category === "Other" ? chartColors.accentSoft : chartColors.accent}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Share of customers against share of revenue, by number of orders placed.
 * The gap between the two bars is the finding.
 */
export function ConcentrationChart() {
  const order = ["1 order", "2-3 orders", "4-9 orders", "10+ orders"];
  const rows = order.map(
    (band) =>
      (data.customer_bands as {
        order_band: string;
        pct_of_customers: number;
        pct_of_revenue: number;
      }[]).find((r) => r.order_band === band)!
  );

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="order_band" {...axisProps} />
          <YAxis
            {...axisProps}
            tickFormatter={(v: number) => v + "%"}
            width={40}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number, name: string) => [value.toFixed(1) + "%", name]}
          />
          <Legend {...legendStyle} />
          <Bar
            dataKey="pct_of_customers"
            name="Share of customers"
            fill={chartColors.accentSoft}
            radius={[2, 2, 0, 0]}
            maxBarSize={46}
          />
          <Bar
            dataKey="pct_of_revenue"
            name="Share of revenue"
            fill={chartColors.accent}
            radius={[2, 2, 0, 0]}
            maxBarSize={46}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Average order value by market — where the wholesale pattern shows up. */
export function CountryAovChart() {
  const rows = (data.countries as {
    country: string;
    revenue: number;
    avg_order_value: number;
  }[])
    .slice(0, 8)
    .map((r) => ({ ...r, country: r.country === "United Kingdom" ? "UK" : r.country }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="country"
            {...axisProps}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={62}
          />
          <YAxis
            {...axisProps}
            tickFormatter={(v: number) => "£" + v.toLocaleString("en-GB")}
            width={56}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number) => [gbp(value, 2), "Average order value"]}
          />
          <Bar dataKey="avg_order_value" radius={[2, 2, 0, 0]} maxBarSize={44}>
            {rows.map((r) => (
              <Cell
                key={r.country}
                fill={r.country === "UK" ? chartColors.clay : chartColors.accent}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
