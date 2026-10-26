import type { Metadata } from "next";
import { Container, Note } from "@/components/ui";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact details for ${site.name}, ${site.tagline}.`,
};

type Entry = { label: string; value: string; href: string; external?: boolean };

export default function ContactPage() {
  const entries: Entry[] = [
    site.contact.email && {
      label: "Email",
      value: site.contact.email,
      href: `mailto:${site.contact.email}`,
    },
    site.contact.phone && {
      label: "Phone",
      value: site.contact.phone,
      href: `tel:${site.contact.phone.replace(/\s+/g, "")}`,
    },
    site.contact.linkedin && {
      label: "LinkedIn",
      value: site.contact.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
      href: site.contact.linkedin,
      external: true,
    },
    site.contact.github && {
      label: "GitHub",
      value: site.contact.github.replace(/^https?:\/\/(www\.)?/, ""),
      href: site.contact.github,
      external: true,
    },
    site.contact.cv && {
      label: "CV",
      value: "Download (PDF)",
      href: site.contact.cv,
      external: true,
    },
  ].filter(Boolean) as Entry[];

  return (
    <Container className="pt-16 pb-6 sm:pt-20">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-[2.5rem]">
          Contact
        </h1>
        <p className="mt-6 text-[1.0625rem] leading-relaxed text-body">
          I am looking for a first analyst role in {site.location} — junior data analyst,
          financial analyst, BI analyst, business analyst or FP&amp;A. Email is the easiest
          way to reach me, and I am glad to talk through how any of these projects was
          built.
        </p>

        <dl className="mt-10 divide-y divide-line border-y border-line">
          {entries.map((entry) => (
            <div
              key={entry.label}
              className="flex flex-wrap items-baseline gap-x-8 gap-y-1 py-4"
            >
              <dt className="w-24 shrink-0 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {entry.label}
              </dt>
              <dd className="min-w-0 break-words">
                <a
                  href={entry.href}
                  {...(entry.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-[0.9375rem] text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  {entry.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-sm leading-relaxed text-muted">
          Based in {site.location}. Open to roles in Tel Aviv, Herzliya and the surrounding
          area, and to hybrid or remote arrangements.
        </p>

        <div className="mt-12">
          <Note title="Note for whoever is setting this site up">
            <p>
              The contact details above are placeholders until they are filled in. They
              live in one file —{" "}
              <code className="text-[0.8125rem]">src/config/site.ts</code> — so changing
              them in that one place updates the homepage, the footer and this page at
              once. Set any entry to an empty string and it disappears from the site
              instead of showing a placeholder.
            </p>
            <p>
              The CV link expects a file at{" "}
              <code className="text-[0.8125rem]">public/cv.pdf</code>. Delete this note
              from <code className="text-[0.8125rem]">src/app/contact/page.tsx</code> once
              the real details are in.
            </p>
          </Note>
        </div>
      </div>
    </Container>
  );
}
