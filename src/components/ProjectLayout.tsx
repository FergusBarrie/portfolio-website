import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/config/projects";
import { Container, Eyebrow, Pill } from "./ui";

/** The shared shell for the three case study pages. */
export function ProjectHeader({ project }: { project: Project }) {
  return (
    <Container className="pt-12 sm:pt-16">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> All projects
      </Link>

      <div className="mt-7 max-w-3xl">
        <Eyebrow>Case study</Eyebrow>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-[2.5rem]">
          {project.title}
        </h1>
        <p className="mt-4 text-sm text-muted">{project.context}</p>
        {project.coAuthors && (
          <p className="mt-1 text-sm text-muted">
            Joint work with{" "}
            <span className="text-body">{project.coAuthors.join(" and ")}</span>
          </p>
        )}
        <p className="mt-5 border-l-2 border-accent-soft pl-5 text-base leading-relaxed text-body">
          <span className="font-medium text-ink">The question. </span>
          {project.question}
        </p>
      </div>

      <dl className="mt-10 grid gap-x-10 gap-y-6 border-t border-line pt-7 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
            Methods and tools
          </dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {project.tools.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
            Period
          </dt>
          <dd className="mt-2 text-sm text-body">{project.period}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
            Data
          </dt>
          <dd className="mt-2 text-sm text-body">
            {project.source.url ? (
              <a
                href={project.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {project.source.name}
              </a>
            ) : (
              project.source.name
            )}
            <span className="mt-1 block text-xs text-muted">{project.source.note}</span>
          </dd>
        </div>
      </dl>
    </Container>
  );
}

/** A numbered heading used down the case study pages. */
export function CaseSection({
  number,
  title,
  children,
  id,
}: {
  number: string;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-line pt-10">
      <div className="flex items-baseline gap-4">
        <span className="tnum font-serif text-sm text-accent-soft">{number}</span>
        <h2 className="font-serif text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Body copy block with consistent measure and spacing. */
export function Copy({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-2xl space-y-4 text-[0.9375rem] leading-relaxed text-body">
      {children}
    </div>
  );
}
