"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import data from "@/data/customer-retention.json";
import { num, usd } from "@/lib/format";
import {
  axisProps,
  chartColors,
  gridProps,
  legendStyle,
  tooltipStyle,
} from "./theme";

type RetentionRow = {
  cohort_month: string;
  months_since_first: number;
  cohort_customers: number;
  active_customers: number;
  revenue: number;
  retention_pct: number;
  fully_observed: number;
};

type CumulativeRow = {
  cohort_month: string;
  months_since_first: number;
  cumulative_revenue_per_customer: number;
};

const retention = data.cohort_retention as RetentionRow[];
const cumulative = data.cohort_cumulative_revenue as CumulativeRow[];
const COMPARABLE = (data.headline as { comparable_months: number }).comparable_months;

const cohorts = ["1997-01", "1997-02", "1997-03"];
const cohortLabels: Record<string, string> = {
  "1997-01": "Jan 1997",
  "1997-02": "Feb 1997",
  "1997-03": "Mar 1997",
};
const cohortColours: Record<string, string> = {
  "1997-01": chartColors.accent,
  "1997-02": chartColors.clay,
  "1997-03": chartColors.accentSoft,
};

/**
 * The interactive part of this project: pick which cohorts to show and whether
 * to look at retention or cumulative value. Both views are capped at month 15,
 * which is the longest window all three cohorts actually have.
 */
export function CohortExplorer() {
  const [visible, setVisible] = useState<string[]>([...cohorts]);
  const [view, setView] = useState<"retention" | "value">("retention");

  const toggle = (cohort: string) =>
    setVisible((current) =>
      current.includes(cohort)
        ? current.length > 1
          ? current.filter((c) => c !== cohort)
          : current
        : [...current, cohort]
    );

  const rows = useMemo(() => {
    // Month 0 is 100% by definition, so the retention view starts at month 1.
    const start = view === "retention" ? 1 : 0;
    const source = view === "retention" ? retention : cumulative;
    const months = Array.from(
      { length: COMPARABLE - start + 1 },
      (_, i) => i + start
    );
    return months.map((month) => {
      const row: Record<string, number> = { month };
      for (const cohort of cohorts) {
        const match = source.find(
          (r) => r.cohort_month === cohort && r.months_since_first === month
        );
        if (match) {
          row[cohort] =
            view === "retention"
              ? (match as RetentionRow).retention_pct
              : (match as CumulativeRow).cumulative_revenue_per_customer;
        }
      }
      return row;
    });
  }, [view]);

  const fmt = (v: number) =>
    view === "retention" ? v.toFixed(1) + "%" : usd(v, 2);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Choose a view" className="flex gap-1.5">
          {([
            ["retention", "Retention"],
            ["value", "Cumulative value"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                view === key
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-surface text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div role="group" aria-label="Show cohorts" className="flex flex-wrap gap-1.5">
          {cohorts.map((cohort) => {
            const on = visible.includes(cohort);
            return (
              <button
                key={cohort}
                type="button"
                onClick={() => toggle(cohort)}
                aria-pressed={on}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
                  on
                    ? "border-line bg-surface text-ink"
                    : "border-line-soft bg-transparent text-muted/70"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: on ? cohortColours[cohort] : "transparent",
                    border: on ? "none" : `1px solid ${chartColors.line}`,
                  }}
                />
                {cohortLabels[cohort]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis
              dataKey="month"
              {...axisProps}
              label={{
                value: "Months since first purchase",
                position: "insideBottom",
                offset: -4,
                fill: chartColors.muted,
                fontSize: 11,
              }}
              height={46}
            />
            <YAxis
              {...axisProps}
              width={56}
              tickFormatter={(v: number) =>
                view === "retention" ? v + "%" : "$" + v
              }
              domain={view === "retention" ? [0, 18] : [0, "auto"]}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(value: number, name: string) => [
                fmt(value),
                cohortLabels[name] + " cohort",
              ]}
              labelFormatter={(m) => "Month " + m}
            />
            <Legend {...legendStyle} formatter={(v: string) => cohortLabels[v]} />
            {cohorts
              .filter((c) => visible.includes(c))
              .map((cohort) => (
                <Line
                  key={cohort}
                  type="monotone"
                  dataKey={cohort}
                  stroke={cohortColours[cohort]}
                  strokeWidth={2.2}
                  dot={{ r: 2.5, strokeWidth: 0, fill: cohortColours[cohort] }}
                  activeDot={{ r: 4 }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        {view === "retention"
          ? "Month 0 is 100% by definition and is left off so the rest of the curve is readable. Capped at month 15, the longest window all three cohorts have."
          : "Cumulative revenue per acquired customer. The denominator is the whole cohort, including everyone who never came back."}
      </p>
    </div>
  );
}

/**
 * The cohort grid. Not a Recharts chart — a plain table with a colour scale,
 * which is both more readable and more accessible than a rendered heatmap.
 */
export function CohortHeatmap() {
  const months = Array.from({ length: COMPARABLE + 1 }, (_, i) => i);
  const max = 18; // cap the colour scale so month 0 does not flatten everything else

  const shade = (value: number | undefined) => {
    if (value === undefined) return { background: "transparent", color: chartColors.muted };
    const intensity = Math.min(value, max) / max;
    return {
      background: `rgba(46, 74, 114, ${(0.07 + intensity * 0.85).toFixed(3)})`,
      color: intensity > 0.6 ? "#ffffff" : chartColors.ink,
    };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <caption className="sr-only">
          Share of each acquisition cohort placing an order, by month since their first
          purchase
        </caption>
        <thead>
          <tr>
            <th scope="col" className="px-2 py-1.5 text-left font-medium text-muted">
              Cohort
            </th>
            <th scope="col" className="px-2 py-1.5 text-right font-medium text-muted">
              Size
            </th>
            {months.map((m) => (
              <th
                key={m}
                scope="col"
                className="px-1 py-1.5 text-center font-medium text-muted"
              >
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((cohort) => {
            const size =
              retention.find((r) => r.cohort_month === cohort)?.cohort_customers ?? 0;
            return (
              <tr key={cohort}>
                <th
                  scope="row"
                  className="whitespace-nowrap px-2 py-1 text-left font-medium text-ink"
                >
                  {cohortLabels[cohort]}
                </th>
                <td className="tnum px-2 py-1 text-right text-muted">{num(size)}</td>
                {months.map((m) => {
                  const cell = retention.find(
                    (r) => r.cohort_month === cohort && r.months_since_first === m
                  );
                  const style = shade(cell?.retention_pct);
                  return (
                    <td
                      key={m}
                      className="tnum px-1 py-1 text-center"
                      style={style}
                      title={
                        cell
                          ? `${cohortLabels[cohort]}, month ${m}: ${num(
                              cell.active_customers
                            )} of ${num(cell.cohort_customers)} active (${cell.retention_pct.toFixed(1)}%)`
                          : undefined
                      }
                    >
                      {cell ? Math.round(cell.retention_pct) : "–"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Figures are the percentage of the cohort placing at least one order that month.
        Month 0 is 100% by definition; the colour scale is capped at 18% so the rest of
        the grid stays readable.
      </p>
    </div>
  );
}

/** Share of customers against share of revenue, by number of orders placed. */
export function FrequencyChart() {
  const rows = data.purchase_frequency as {
    order_band: string;
    pct_of_customers: number;
    pct_of_revenue: number;
  }[];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="order_band" {...axisProps} />
          <YAxis {...axisProps} tickFormatter={(v: number) => v + "%"} width={40} />
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
            maxBarSize={42}
          />
          <Bar
            dataKey="pct_of_revenue"
            name="Share of revenue"
            fill={chartColors.accent}
            radius={[2, 2, 0, 0]}
            maxBarSize={42}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Drop-off falls and order value rises as a customer places more orders. */
export function OrderDropoffChart() {
  const rows = (data.value_by_order_number as {
    order_number: number;
    avg_order_value: number;
    drop_off_pct: number | null;
  }[]).filter((r) => r.drop_off_pct !== null);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="order_number"
            {...axisProps}
            label={{
              value: "Order number",
              position: "insideBottom",
              offset: -4,
              fill: chartColors.muted,
              fontSize: 11,
            }}
            height={46}
          />
          <YAxis
            yAxisId="left"
            {...axisProps}
            tickFormatter={(v: number) => v + "%"}
            width={42}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            {...axisProps}
            domain={[0, 50]}
            tickFormatter={(v: number) => "$" + v}
            width={42}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number, name: string) =>
              name === "Average order value"
                ? [usd(value, 2), name]
                : [value.toFixed(1) + "%", name]
            }
            labelFormatter={(n) => "Order " + n}
          />
          <Legend {...legendStyle} />
          <Bar
            yAxisId="left"
            dataKey="drop_off_pct"
            name="Never placed the next order"
            radius={[2, 2, 0, 0]}
            maxBarSize={38}
          >
            {rows.map((r) => (
              <Cell
                key={r.order_number}
                fill={r.order_number === 1 ? chartColors.clay : chartColors.accentSoft}
              />
            ))}
          </Bar>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avg_order_value"
            name="Average order value"
            stroke={chartColors.accent}
            strokeWidth={2.2}
            dot={{ r: 2.5, strokeWidth: 0, fill: chartColors.accent }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/** How long repeat buyers took to come back. */
export function TimeToSecondOrderChart() {
  const rows = (data.time_to_second_order as {
    time_to_second_order: string;
    pct_of_repeat_buyers: number;
    customers: number;
  }[]).map((r) => ({ ...r, label: r.time_to_second_order.split(". ")[1] }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="label"
            {...axisProps}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={62}
          />
          <YAxis {...axisProps} tickFormatter={(v: number) => v + "%"} width={40} />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number, _n, item) => [
              value.toFixed(1) + "% (" + num((item.payload as { customers: number }).customers) + " customers)",
              "Share of repeat buyers",
            ]}
          />
          <Bar dataKey="pct_of_repeat_buyers" radius={[2, 2, 0, 0]} maxBarSize={56}>
            {rows.map((r, i) => (
              <Cell
                key={r.label}
                fill={i < 3 ? chartColors.accent : chartColors.accentSoft}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
