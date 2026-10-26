/** Shared chart styling, so every chart on the site looks like the same chart. */

export const chartColors = {
  ink: "#1b2a41",
  accent: "#2e4a72",
  accentSoft: "#8fa6c4",
  clay: "#b4663a",
  claySoft: "#d9a98c",
  muted: "#6c7a8a",
  grid: "#ebe8e3",
  line: "#e5e2dc",
  surface: "#ffffff",
};

/** Series colours, in the order they should be used. */
export const series = [
  chartColors.accent,
  chartColors.clay,
  chartColors.accentSoft,
  chartColors.ink,
];

export const axisProps = {
  stroke: chartColors.line,
  tick: { fill: chartColors.muted, fontSize: 11 },
  tickLine: false,
} as const;

export const gridProps = {
  stroke: chartColors.grid,
  strokeDasharray: "0",
  vertical: false,
} as const;

export const tooltipStyle = {
  contentStyle: {
    background: chartColors.surface,
    border: `1px solid ${chartColors.line}`,
    borderRadius: 4,
    fontSize: 12,
    boxShadow: "0 2px 10px rgba(27,42,65,0.07)",
    padding: "8px 10px",
  },
  labelStyle: { color: chartColors.ink, fontWeight: 600, marginBottom: 4 },
  itemStyle: { color: chartColors.ink, padding: 0 },
  cursor: { fill: "rgba(143,166,196,0.12)" },
} as const;

export const legendStyle = {
  wrapperStyle: { fontSize: 12, color: chartColors.muted, paddingTop: 8 },
} as const;
