import { chartColors } from "./theme";

export type Estimate = {
  label: string;
  coef: number;
  /** Half-width of the confidence interval. */
  error: number;
  detail?: string;
};

/**
 * A horizontal coefficient plot: one row per estimate, showing the point
 * estimate as a dot and the 95% confidence interval as a whisker.
 *
 * Drawn as plain SVG rather than with a chart library. There are only a
 * handful of rows, the layout is fixed, and the result is easier to read than
 * a bar chart — a bar implies the area between zero and the estimate means
 * something, which for a regression coefficient it does not.
 *
 * The important visual job is the zero line: if a whisker crosses it, the
 * estimate is not distinguishable from no effect.
 */
export function CoefficientPlot({
  rows,
  domain,
  ticks,
  unit = "",
  labelWidth = 186,
}: {
  rows: Estimate[];
  domain: [number, number];
  ticks: number[];
  unit?: string;
  labelWidth?: number;
}) {
  const W = 720;
  const ROW = 42;
  const TOP = 14;
  const AXIS = 42;
  const H = TOP + rows.length * ROW + AXIS;
  const plotLeft = labelWidth;
  const plotRight = W - 18;
  const span = domain[1] - domain[0];
  const x = (v: number) =>
    plotLeft + ((Math.min(Math.max(v, domain[0]), domain[1]) - domain[0]) / span) *
      (plotRight - plotLeft);
  const zeroX = x(0);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label="Coefficient estimates with 95% confidence intervals"
      style={{ display: "block" }}
    >
      {/* gridlines */}
      {ticks.map((t) => (
        <line
          key={"g" + t}
          x1={x(t)}
          x2={x(t)}
          y1={TOP - 6}
          y2={TOP + rows.length * ROW}
          stroke={chartColors.grid}
          strokeWidth={1}
        />
      ))}

      {/* the zero line, drawn heavier because it carries the finding */}
      <line
        x1={zeroX}
        x2={zeroX}
        y1={TOP - 6}
        y2={TOP + rows.length * ROW}
        stroke={chartColors.ink}
        strokeWidth={1.4}
      />

      {rows.map((r, i) => {
        const cy = TOP + i * ROW + ROW / 2;
        const lo = x(r.coef - r.error);
        const hi = x(r.coef + r.error);
        const crossesZero = r.coef - r.error < 0 && r.coef + r.error > 0;
        const colour = crossesZero ? chartColors.accentSoft : chartColors.clay;
        return (
          <g key={r.label}>
            <text
              x={plotLeft - 14}
              y={cy + 4}
              textAnchor="end"
              fontSize={12}
              fill={chartColors.ink}
            >
              {r.label}
            </text>
            {/* whisker */}
            <line x1={lo} x2={hi} y1={cy} y2={cy} stroke={colour} strokeWidth={2.2} />
            <line x1={lo} x2={lo} y1={cy - 6} y2={cy + 6} stroke={colour} strokeWidth={2.2} />
            <line x1={hi} x2={hi} y1={cy - 6} y2={cy + 6} stroke={colour} strokeWidth={2.2} />
            {/* point estimate */}
            <circle cx={x(r.coef)} cy={cy} r={5} fill={chartColors.accent} />
            <title>
              {`${r.label}: ${r.coef.toFixed(4)}${unit} (95% CI ${(r.coef - r.error).toFixed(3)} to ${(r.coef + r.error).toFixed(3)})${r.detail ? ", " + r.detail : ""}`}
            </title>
          </g>
        );
      })}

      {/* value axis */}
      <line
        x1={plotLeft}
        x2={plotRight}
        y1={TOP + rows.length * ROW}
        y2={TOP + rows.length * ROW}
        stroke={chartColors.line}
      />
      {ticks.map((t) => (
        <text
          key={"t" + t}
          x={x(t)}
          y={TOP + rows.length * ROW + 18}
          textAnchor="middle"
          fontSize={11}
          fill={chartColors.muted}
        >
          {t.toFixed(2)}
        </text>
      ))}
      <text
        x={(plotLeft + plotRight) / 2}
        y={H - 4}
        textAnchor="middle"
        fontSize={11}
        fill={chartColors.muted}
      >
        Estimated elasticity, with 95% confidence interval
      </text>
    </svg>
  );
}
