import type { Metadata } from "next";
import Link from "next/link";
import { Container, LinkButton, Note } from "@/components/ui";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Economics and business graduate from Reichman University, learning data analysis " +
    "by working through real public datasets end to end.",
};

export default function AboutPage() {
  return (
    <Container className="pt-16 pb-6 sm:pt-20">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-[2.5rem]">
          About
        </h1>

        <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-body">
          <p>
            I studied Business Administration and Economics at Reichman University in
            Herzliya. The economics half gave me statistics, econometrics and a habit of
            asking what a number is actually measuring; the business half gave me the
            financial statements and the commercial context to put around it.
          </p>
          <p>
            What my degree did not give me was much practice with real, messy data. Course
            datasets arrive clean. Real ones have cancelled orders still sitting in the
            revenue total, a fifth of the rows missing a customer ID, and a column of stock
            codes where fourteen of them turn out to be postage.
          </p>
          <p>
            So I set out to fix that by working through three public datasets properly —
            download, clean, analyse, write up — rather than following tutorials. The goal
            each time was not to produce an impressive-looking chart but to end up with
            something I could defend: every figure traceable to a line of code, every
            cleaning decision logged, and an honest list of what the data cannot tell you.
          </p>
          <p>
            The parts I enjoyed most were the ones where the obvious answer was wrong. In
            the sales project, revenue had grown year on year — until you noticed the
            business had actually handled fewer orders and shipped fewer items. In the NIKE
            analysis, two non-operating lines had “expense” in their names and turned out
            to be signed as income, which I only found because my bridge to pre-tax profit
            would not reconcile. Those are the moments where analysis stops being
            arithmetic.
          </p>
          <p>
            I am now looking for a first analyst role in {site.location} — data, financial,
            BI, business or FP&amp;A. I am comfortable with SQL and Excel, I am still
            building my Python and Power BI, and I would rather say that plainly than
            overstate it.
          </p>
        </div>

        <div className="mt-10">
          <Note title="How these projects were built">
            <p>
              These are learning projects, and I want to be straightforward about that. I
              used documentation, worked examples and AI tools while building them — the
              same way most people learn to code now.
            </p>
            <p>
              What matters is that I understand and can defend every part of what is here.
              Each project ships a learning guide that walks through every query, every
              calculation and every judgement call, including the mistakes I made and had
              to fix. I am happy to open any repository in an interview and talk through
              it line by line, or to reproduce a piece of the analysis from scratch.
            </p>
            <p>
              I have not claimed professional experience I do not have, and the skills list
              on the homepage marks what I am still learning as exactly that.
            </p>
          </Note>
        </div>

        <h2 className="mt-14 font-serif text-xl font-semibold tracking-tight text-ink">
          Education
        </h2>
        <div className="mt-6 space-y-6">
          {site.education.map((entry) => (
            <div key={entry.institution} className="border-t border-line pt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-medium text-ink">{entry.institution}</h3>
                <p className="text-sm text-muted">{entry.period}</p>
              </div>
              <p className="mt-1.5 text-sm text-body">{entry.qualification}</p>
              <p className="mt-0.5 text-sm text-muted">{entry.place}</p>
              <p className="mt-3 text-sm leading-relaxed text-body">{entry.detail}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-serif text-xl font-semibold tracking-tight text-ink">
          What I am working on next
        </h2>
        <div className="mt-5 space-y-4 text-[0.9375rem] leading-relaxed text-body">
          <p>
            Rebuilding one of these dashboards in Power BI, so I have a version of the same
            analysis in the tool most job adverts ask for. Beyond that, extracting NIKE&apos;s
            segment data from the SEC filings — the biggest gap in that project is that I
            can say profit fell but not which region it fell in.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <LinkButton href="/projects">See the projects</LinkButton>
          <Link
            href="/contact"
            className="inline-flex items-center px-1 py-2.5 text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </Container>
  );
}
