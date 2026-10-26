"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import data from "@/data/minimum-wage.json";
import { axisProps, chartColors, gridProps, legendStyle, tooltipStyle } from "./theme";
import { CoefficientPlot } from "./CoefficientPlot";

type Model = { model: string; coef: number; se: number; p: number };
type Robust = { spec: string; coef: number; se: number; n: number };

/** 95% confidence interval half-width. */
const ci = (se: number) => 1.96 * se;

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-xs leading-relaxed text-muted">{children}</p>;
}

/** The central chart: every interval crosses zero. */
export function CoefficientChart() {
  const rows = (data.main_models as Model[]).map((m) => ({
    label: m.model.replace("Labour force", "Labour force").replace("Unemployment", "Unemployed"),
    coef: m.coef,
    error: ci(m.se),
    detail: `p ≈ ${m.p}`,
  }));

  return (
    <>
      <CoefficientPlot
        rows={rows}
        domain={[-0.25, 0.6]}
        ticks={[-0.2, 0, 0.2, 0.4, 0.6]}
      />
      <Caption>
        Elasticity of each outcome with respect to the real minimum wage. Dots are the point
        estimate, whiskers the 95% confidence interval from state-clustered standard errors.
        Every interval crosses the zero line.
      </Caption>
    </>
  );
}

/** The same picture across five specifications, for the labour force outcome. */
export function RobustnessChart() {
  const rows = (data.robustness as Robust[]).map((r) => ({
    label: r.spec,
    coef: r.coef,
    error: ci(r.se),
    detail: `n = ${r.n.toLocaleString()}`,
  }));

  return (
    <>
      <CoefficientPlot
        rows={rows}
        domain={[-0.3, 0.12]}
        ticks={[-0.3, -0.2, -0.1, 0, 0.1]}
        labelWidth={212}
      />
      <Caption>
        Labour force outcome only. If the null result were an artefact of one modelling choice,
        it would show up here as an interval that misses zero. None does.
      </Caption>
    </>
  );
}

/** What was actually happening to minimum wages over the period. */
export function MinWageOverTimeChart() {
  const rows = (data.by_year as {
    year: number;
    mean_real_min_wage: number;
    pct_counties_above_federal: number;
  }[]).map((r) => ({ ...r, year: String(r.year) }));

  return (
    <>
      <div className="h-[290px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis
              yAxisId="l"
              {...axisProps}
              width={52}
              domain={[7, 9]}
              tickFormatter={(v: number) => "$" + v.toFixed(2)}
            />
            <YAxis
              yAxisId="r"
              orientation="right"
              {...axisProps}
              width={46}
              domain={[0, 60]}
              tickFormatter={(v: number) => v + "%"}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(v: number, name: string) =>
                name === "Mean real minimum wage"
                  ? ["$" + v.toFixed(2), name]
                  : [v.toFixed(1) + "%", name]
              }
            />
            <Legend {...legendStyle} />
            <Bar
              yAxisId="l"
              dataKey="mean_real_min_wage"
              name="Mean real minimum wage"
              fill={chartColors.accent}
              maxBarSize={38}
              radius={[2, 2, 0, 0]}
            />
            <Line
              yAxisId="r"
              type="monotone"
              dataKey="pct_counties_above_federal"
              name="Counties above the federal floor"
              stroke={chartColors.clay}
              strokeWidth={2.2}
              dot={{ r: 2.5, strokeWidth: 0, fill: chartColors.clay }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Caption>
        The federal minimum has been $7.25 since 2009, so all the movement comes from states.
        Calculated from the panel rather than taken from the paper.
      </Caption>
    </>
  );
}
