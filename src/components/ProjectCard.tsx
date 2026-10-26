import Link from "next/link";
import type { Project } from "@/config/projects";
import { Pill } from "./ui";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article className="group relative border-t border-line pt-7">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
        <div className="sm:w-16 sm:shrink-0">
          <span className="tnum font-serif text-sm text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-xl font-semibold tracking-tight text-ink">
            <Link
              href={`/projects/${project.slug}`}
              className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
            >
              {project.title}
            </Link>
          </h3>

          <p className="mt-1.5 text-xs text-muted">
            {project.context}
            {project.coAuthors && (
              <> · with {project.coAuthors.join(" and ")}</>
            )}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-muted italic">
            {project.question}
          </p>

          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-body">
            {project.summary}
          </p>

          <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-3">
            {project.highlights.map((h) => (
              <div key={h.label}>
                <dt className="sr-only">{h.label}</dt>
                <dd>
                  <span className="tnum block font-serif text-lg font-semibold text-ink">
                    {h.value}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                    {h.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {project.tools.map((tool) => (
              <Pill key={tool}>{tool}</Pill>
            ))}
          </div>

          <p className="mt-5 text-sm font-medium text-accent">
            Read the case study{" "}
            <span
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}
