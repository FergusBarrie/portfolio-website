/** Small formatting helpers, kept in one place so figures look the same everywhere. */

export function gbp(value: number, decimals = 0): string {
  return "£" + value.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function usd(value: number, decimals = 0): string {
  return "$" + value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** £19.1m, £1.4m, £504k — for chart axes and headline tiles. */
export function compactGbp(value: number): string {
  if (Math.abs(value) >= 1_000_000) return "£" + (value / 1_000_000).toFixed(1) + "m";
  if (Math.abs(value) >= 1_000) return "£" + Math.round(value / 1_000) + "k";
  return "£" + Math.round(value);
}

/** $46.4bn, $3.8bn, $464m — the SEC figures are already in millions. */
export function compactUsdMillions(value: number): string {
  if (Math.abs(value) >= 1_000) return "$" + (value / 1_000).toFixed(1) + "bn";
  return "$" + Math.round(value).toLocaleString("en-US") + "m";
}

export function pct(value: number, decimals = 1): string {
  return value.toFixed(decimals) + "%";
}

/** +2.2% / −3.8%, with a real minus sign rather than a hyphen. */
export function signedPct(value: number, decimals = 1): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return sign + Math.abs(value).toFixed(decimals) + "%";
}

export function num(value: number): string {
  return value.toLocaleString("en-GB");
}

/** "2010-03" -> "Mar 2010" */
export function monthLabel(value: string): string {
  const [year, month] = value.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const index = Number(month) - 1;
  if (Number.isNaN(index) || !names[index]) return value;
  return names[index] + " " + year;
}

/** "2010-03" -> "Mar 10" — compact enough for a dense monthly axis. */
export function compactMonthLabel(value: string): string {
  const [year, month] = value.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const index = Number(month) - 1;
  if (Number.isNaN(index) || !names[index]) return value;
  return names[index] + " " + year.slice(2);
}
