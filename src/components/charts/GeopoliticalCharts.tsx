"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ErrorBar,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import data from "@/data/geopolitical-risk.json";
import { axisProps, chartColors, gridProps, tooltipStyle } from "./theme";

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-xs leading-relaxed text-muted">{children}</p>;
}

/** The global geopolitical risk index over the sample period. */
export function GprOverTimeChart() {
  const rows = (data.gpr_by_year as { Year: number; GPR: number }[]).map((r) => ({
    year: String(r.Year),
    gpr: r.GPR,
  }));

  return (
    <>
      <div className="h-[270px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 16, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="year" {...axisProps} minTickGap={24} />
            <YAxis {...axisProps} width={44} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => [v.toFixed(1), "GPR index"]} />
            <ReferenceLine x="2001" stroke={chartColors.clay} strokeDasharray="4 3">
              <Label value="9/11" position="top" fill={chartColors.clay} fontSize={11} />
            </ReferenceLine>
            <Line
              type="monotone"
              dataKey="gpr"
              stroke={chartColors.accent}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Caption>
        The global index from Caldara and Iacoviello (2022), which counts newspaper coverage of
        geopolitical events. Calculated from the project workbook.
      </Caption>
    </>
  );
}

/** Mean next-year return by risk quartile, with 95% intervals that overlap. */
export function ReturnByQuartileChart() {
  const rows = (data.return_by_quartile as {
    quartile: number;
    mean_return_pct: number;
    ci_low_pct: number;
    ci_high_pct: number;
    n: number;
  }[]).map((r) => ({
    label: ["Lowest risk", "2nd", "3rd", "Highest risk"][r.quartile - 1],
    mean: r.mean_return_pct,
    error: [r.mean_return_pct - r.ci_low_pct, r.ci_high_pct - r.mean_return_pct] as [
      number,
      number,
    ],
    n: r.n,
  }));

  return (
    <>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis
              {...axisProps}
              width={46}
              domain={[0, 14]}
              tickFormatter={(v: number) => v + "%"}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(_v: number, _n, item) => {
                const r = item.payload as { mean: number; n: number };
                return [`${r.mean.toFixed(2)}%  (n = ${r.n})`, "Mean next-year return"];
              }}
            />
            <Bar dataKey="mean" maxBarSize={56} radius={[2, 2, 0, 0]} fill={chartColors.accent}>
              <ErrorBar
                dataKey="error"
                width={6}
                strokeWidth={1.6}
                stroke={chartColors.ink}
                direction="y"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Caption>
        Countries sorted into four equal groups by geopolitical risk. Whiskers are 95%
        confidence intervals; they overlap, so there is no clear pattern across quartiles.
      </Caption>
    </>
  );
}

/** Average next-year return within each of ten risk groups. */
export function DecileScatterChart() {
  const rows = data.decile_scatter as {
    decile: number;
    log_gprc: number;
    mean_return_pct: number;
    n: number;
  }[];

  return (
    <>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 14, bottom: 24, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis
              type="number"
              dataKey="log_gprc"
              {...axisProps}
              domain={["dataMin - 0.1", "dataMax + 0.1"]}
              tickFormatter={(v: number) => v.toFixed(1)}
            >
              <Label
                value="log(country geopolitical risk)"
                position="insideBottom"
                offset={-12}
                fill={chartColors.muted}
                fontSize={11}
              />
            </XAxis>
            <YAxis
              type="number"
              dataKey="mean_return_pct"
              {...axisProps}
              width={46}
              domain={[0, 14]}
              tickFormatter={(v: number) => v + "%"}
            />
            <Tooltip
              {...tooltipStyle}
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(v: number, name: string) =>
                name === "mean_return_pct"
                  ? [v.toFixed(2) + "%", "Mean next-year return"]
                  : [Number(v).toFixed(2), "log(GPR)"]
              }
            />
            <Scatter data={rows} fill={chartColors.clay} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <Caption>
        Each point is the average next-year return for one tenth of the sample, ordered by
        geopolitical risk. The relationship is flat — which is what Model 1 reports.
      </Caption>
    </>
  );
}

/** The two market groups pulling in opposite directions. */
export function GroupSlopeChart() {
  const rows = (data.group_slopes as { group: string; slope: number; t: number }[]).map((r) => ({
    label: r.group,
    slope: r.slope,
    t: r.t,
  }));

  return (
    <>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis {...axisProps} width={58} domain={[-0.08, 0.08]} />
            <Tooltip
              {...tooltipStyle}
              formatter={(_v: number, _n, item) => {
                const r = item.payload as { slope: number; t: number };
                return [`${r.slope.toFixed(3)}  (t = ${r.t})`, "Slope on log(GPR)"];
              }}
            />
            <ReferenceLine y={0} stroke={chartColors.ink} strokeWidth={1.2} />
            <Bar dataKey="slope" maxBarSize={70} radius={[2, 2, 0, 0]}>
              {rows.map((r) => (
                <Cell key={r.label} fill={r.slope >= 0 ? chartColors.accent : chartColors.clay} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Caption>
        The gap between these two bars is the interaction term of 0.078, significant at the 1%
        level. Neither individual slope is as reliable as the difference between them.
      </Caption>
    </>
  );
}
