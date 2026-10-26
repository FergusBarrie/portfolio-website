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
          Each of these started with a public dataset and a question, and ran all the way
          through to a write-up: download the data, clean it and record every decision,
          analyse it, build the charts, then say plainly what the numbers do and do not
          support.
        </p>
      </div>

      <div className="mt-10 max-w-3xl">
        <Note title="How to read these">
          <p>
            Every figure on this site is calculated from the data by the code in the
            linked repository — nothing is typed in by hand. Each project also ships a
            learning guide explaining how each query works and where its weaknesses are.
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
