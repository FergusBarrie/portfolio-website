import type { Metadata } from "next";
import Link from "next/link";
import { Container, LinkButton, Note } from "@/components/ui";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Economics and business graduate from Reichman University, with research experience in " +
    "panel data analysis and an interest in financial analysis.",
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
            Herzliya. The economics half gave me statistics, econometrics and R, and a habit
            of asking what a number is actually measuring; the business half gave me
            financial statements and the commercial context to put around it.
          </p>
          <p>
            The two seminar papers on this site are where that training actually got used. One
            asks whether minimum wage increases are associated with smaller labour forces or
            more unemployment across 3,075 US counties. The other asks whether geopolitical
            risk predicts a country&apos;s stock market return the following year, across 35
            countries and three decades. Both were written with a co-author, and both are
            credited as such.
          </p>
          <p>
            What I took from them was not really the econometrics. It was how much of the work
            is deciding what you are allowed to claim. Our minimum wage paper found nothing —
            no significant effect in any of nine specifications. The tempting thing is to keep
            adjusting the model until something appears. The right thing is to report the null
            result, explain that it is not the same as proving there is no effect, and be
            specific about why the data cannot settle the question.
          </p>
          <p>
            The geopolitical risk paper had the opposite problem. We found a result that was
            significant at the 1% level, and most of the work went into trying to break it —
            dropping each country in turn, restoring the observations we had excluded,
            clustering the errors differently. One of those checks did weaken it, and that is
            in the paper too.
          </p>
          <p>
            The Take-Two analysis I built afterwards, on my own, to practise reading a set of
            filed accounts. A company that grew revenue 90% while reporting $9.6bn of losses
            seemed like a good puzzle, and the answer turned out to be one accounting line.
          </p>
          <p>
            I am now looking for a first analyst role in {site.location} — data, financial, BI,
            business or FP&amp;A. I am comfortable in Excel and with the statistics and
            econometrics I used in my research; I am starting on Power BI, and I do not yet
            write SQL. I would rather say that plainly than overstate it.
          </p>
        </div>

        <div className="mt-10">
          <Note title="About the two seminar papers">
            <p>
              Both were joint work. The minimum wage paper was written with Tomer Davitasvili,
              and the geopolitical risk paper with Estherlola Wajsman, supervised by Prof.
              Doron Israeli. The regression results shown on this site are taken from the
              papers as submitted.
            </p>
            <p>
              The descriptive charts were produced separately from the same datasets, so the
              summary figures on each page can be checked against the papers.
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
            Power BI, because most analyst adverts here ask for it and I have datasets ready to
            rebuild in it. After that, extending the Take-Two work to the segment detail in the
            filings — at the moment I can say profit fell but not which part of the business
            drove it.
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
