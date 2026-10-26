import Link from "next/link";
import type { ReactNode } from "react";

/** Page width container. One value, used everywhere. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-6 ${className}`}>{children}</div>
  );
}

/** A titled section with consistent vertical rhythm. */
export function Section({
  title,
  lead,
  children,
  id,
  className = "",
}: {
  title?: string;
  lead?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`py-12 sm:py-16 ${className}`}>
      {title && (
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
          {title}
        </h2>
      )}
      {lead && (
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-body">
          {lead}
        </p>
      )}
      <div className={title || lead ? "mt-8" : ""}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
      {children}
    </p>
  );
}

/** A headline figure. Deliberately plain: a number and what it means. */
export function Stat({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note?: string;
}) {
  return (
    <div className="border-t border-line pt-4">
      <p className="tnum font-serif text-[1.75rem] leading-none font-semibold text-ink">
        {value}
      </p>
      <p className="mt-2 text-sm text-body">{label}</p>
      {note && <p className="mt-1 text-xs leading-relaxed text-muted">{note}</p>}
    </div>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}

/** A labelled aside — used for caveats and data notes. */
export function Note({
  title,
  children,
  tone = "neutral",
}: {
  title?: string;
  children: ReactNode;
  tone?: "neutral" | "warn";
}) {
  const accent =
    tone === "warn" ? "border-l-clay/60" : "border-l-accent-soft";
  return (
    <aside
      className={`rounded-r border-l-2 bg-surface/70 px-5 py-4 ${accent}`}
    >
      {title && (
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
          {title}
        </p>
      )}
      <div className="mt-1.5 space-y-2 text-sm leading-relaxed text-body">
        {children}
      </div>
    </aside>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs text-muted">
      {children}
    </span>
  );
}

/** A numbered finding or recommendation. */
export function Finding({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-5">
      <span className="tnum mt-0.5 shrink-0 font-serif text-lg font-semibold text-accent-soft">
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <h3 className="font-medium text-ink">{title}</h3>
        <div className="mt-2 space-y-3 text-[0.9375rem] leading-relaxed text-body">
          {children}
        </div>
      </div>
    </li>
  );
}

/** Simple, readable data table. Numbers get tabular figures. */
export function DataTable({
  columns,
  rows,
  caption,
  align = [],
}: {
  columns: string[];
  rows: (string | number | ReactNode)[][];
  caption?: string;
  align?: ("left" | "right")[];
}) {
  return (
    <figure className="not-prose">
      <div className="overflow-x-auto rounded border border-line bg-surface">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-paper/60">
              {columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`px-4 py-3 font-medium text-ink whitespace-nowrap ${
                    (align[i] ?? (i === 0 ? "left" : "right")) === "right"
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr
                key={r}
                className="border-b border-line-soft last:border-0 transition-colors hover:bg-paper/70"
              >
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={`px-4 py-2.5 ${
                      (align[i] ?? (i === 0 ? "left" : "right")) === "right"
                        ? "tnum text-right text-ink"
                        : "text-left text-body"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs leading-relaxed text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
}) {
  const base =
    "inline-flex items-center gap-2 rounded px-4 py-2.5 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-ink text-white hover:bg-accent"
      : "border border-line bg-surface text-ink hover:border-accent hover:text-accent";

  const content = (
    <>
      {children}
      {external && (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="opacity-60"
        >
          <path
            d="M7 17L17 7M17 7H9M17 7v8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );

  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={`${base} ${styles}`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {content}
    </Link>
  );
}

/** Wrapper that gives a chart a title, a short "why this chart" line and a source. */
export function ChartFrame({
  title,
  question,
  source,
  children,
}: {
  title: string;
  question?: string;
  source?: string;
  children: ReactNode;
}) {
  return (
    <figure className="rounded border border-line bg-surface p-5 sm:p-6">
      <figcaption className="mb-5">
        <h3 className="text-[0.9375rem] font-medium text-ink">{title}</h3>
        {question && (
          <p className="mt-1 text-sm leading-relaxed text-muted">{question}</p>
        )}
      </figcaption>
      {children}
      {source && <p className="mt-4 text-xs text-muted">{source}</p>}
    </figure>
  );
}
