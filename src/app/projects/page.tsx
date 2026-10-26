import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { Container, Note } from "@/components/ui";
import { projects } from "@/config/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Three data analysis projects built end to end on real public datasets: SQL sales " +
    "analysis, a financial performance analysis from SEC filings, and a customer " +
    "retention and cohort analysis.",
};

export default function ProjectsPage() {
  return (
    <Container className="pt-16 pb-6 sm:pt-20">
      <div className="max-w-3xl">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-[2.5rem]">
          Projects
        </h1>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-body">
          Two of these are research papers I wrote at Reichman University, each with a
          co-author. The third I built on my own afterwards. All three start with a question
          someone might actually ask, work through real data, and end by saying plainly what
          the numbers do and do not support.
        </p>
      </div>

      <div className="mt-10 max-w-3xl">
        <Note title="How to read these">
          <p>
            The two seminar papers report regression results exactly as they were submitted.
            The descriptive charts are calculated from the same datasets so they can be checked
            against the papers rather than taken on trust.
          </p>
          <p>
            Two of the three main findings are null results — cases where we could not detect
            the effect we were looking for. Those are reported as they came out, which is the
            part of the work I would most want someone to look at.
          </p>
        </Note>
      </div>

      <div className="mt-14 space-y-14">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </Container>
  );
}
