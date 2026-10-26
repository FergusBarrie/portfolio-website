import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { Container, Eyebrow, LinkButton, Section } from "@/components/ui";
import { projects } from "@/config/projects";
import { site } from "@/config/site";

export default function HomePage() {
  const links = [
    site.contact.cv && { label: "CV", href: site.contact.cv, external: true },
    site.contact.github && {
      label: "GitHub",
      href: site.contact.github,
      external: true,
    },
    site.contact.linkedin && {
      label: "LinkedIn",
      href: site.contact.linkedin,
      external: true,
    },
  ].filter(Boolean) as { label: string; href: string; external: boolean }[];

  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <Container className="pt-16 pb-4 sm:pt-24">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-[3.25rem]">
            {site.name}
          </h1>
          <p className="mt-5 text-lg text-body sm:text-xl">
            {site.role}
            <span className="mx-2.5 text-line" aria-hidden="true">
              /
            </span>
            <span className="text-accent">{site.tagline}</span>
          </p>
          <p className="mt-7 max-w-2xl text-[1.0625rem] leading-relaxed text-body">
            {site.intro}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <LinkButton href="/projects">See the three projects</LinkButton>
            {links.map((link) => (
              <LinkButton
                key={link.label}
                href={link.href}
                variant="secondary"
                external={link.external}
              >
                {link.label}
              </LinkButton>
            ))}
          </div>
        </div>
      </Container>

      {/* ------------------------------------------------------ projects */}
      <Container>
        <Section
          title="Projects"
          lead={
            <>
              Three projects, each built end to end on a real public dataset: download,
              clean, analyse, write up. Every figure comes out of the code rather than
              being typed in, and each project is honest about what its data cannot tell
              you.
            </>
          }
        >
          <div className="space-y-12">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </Section>
      </Container>

      {/* -------------------------------------------------------- skills */}
      <Container>
        <Section
          title="Technical skills"
          lead={
            <>
              An honest list.{" "}
              <strong className="font-medium text-ink">Comfortable</strong> means I can do
              the kind of work shown in these projects without help.{" "}
              <strong className="font-medium text-ink">Learning</strong> means I have used
              it for real but still look things up regularly.
            </>
          }
        >
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {site.skills.map((group) => (
              <div key={group.group}>
                <h3 className="text-sm font-medium text-ink">{group.group}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.name} className="text-sm leading-snug">
                      <span className="text-body">{item.name}</span>
                      {item.level && (
                        <span className="mt-0.5 block text-xs text-muted">
                          {item.level}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </Container>

      {/* ----------------------------------------------------- education */}
      <Container>
        <Section title="Education">
          <div className="space-y-8">
            {site.education.map((entry) => (
              <div
                key={entry.institution}
                className="border-t border-line pt-6 sm:flex sm:gap-10"
              >
                <p className="text-sm text-muted sm:w-44 sm:shrink-0">{entry.period}</p>
                <div className="mt-2 sm:mt-0">
                  <h3 className="font-medium text-ink">{entry.institution}</h3>
                  <p className="mt-1 text-sm text-body">{entry.qualification}</p>
                  <p className="mt-0.5 text-sm text-muted">{entry.place}</p>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-body">
                    {entry.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </Container>

      {/* ------------------------------------------------------- contact */}
      <Container>
        <section className="mt-6 border-t border-line pt-12 pb-4">
          <Eyebrow>Get in touch</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-serif text-2xl font-semibold tracking-tight text-ink">
            I am looking for a first analyst role in Israel
          </h2>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-body">
            Junior data analyst, financial analyst, BI analyst, business analyst or FP&amp;A.
            If any of these projects is useful as a starting point for a conversation, I
            would be glad to talk through how I built them.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <LinkButton href="/contact">Contact details</LinkButton>
            <Link
              href="/about"
              className="inline-flex items-center px-1 py-2.5 text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              More about me
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
