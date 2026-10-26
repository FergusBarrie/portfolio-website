import type { Metadata } from "next";
import {
  DecileScatterChart,
  GprOverTimeChart,
  GroupSlopeChart,
  ReturnByQuartileChart,
} from "@/components/charts/GeopoliticalCharts";
import { CaseSection, Copy, ProjectHeader } from "@/components/ProjectLayout";
import {
  ChartFrame,
  Container,
  DataTable,
  Finding,
  LinkButton,
  Note,
  Stat,
  StatGrid,
} from "@/components/ui";
import { getProject } from "@/config/projects";
import data from "@/data/geopolitical-risk.json";
import { num } from "@/lib/format";

const project = getProject("geopolitical-risk");
const s = data.summary;

export const metadata: Metadata = {
  title: "Geopolitical Risk and Stock Market Returns",
  description: project.question,
};

export default function Page() {
  return (
    <>
      <ProjectHeader project={project} />

      <Container className="mt-14 space-y-14 pb-6">
        <CaseSection number="01" title="At a glance">
          <StatGrid>
            <Stat value={String(s.countries)} label="Countries"
                  note={`${num(s.observations)} country-year observations`} />
            <Stat value={`${s.first_year}–${s.last_year}`} label="Years of predictor data"
                  note="Each year's risk matched to the following year's return" />
            <Stat value={`${s.mean_annual_return_pct}%`} label="Mean annual return"
                  note={`${num(s.emerging_obs)} emerging, ${num(s.developed_obs)} developed observations`} />
            <Stat value={String(s.interaction)} label="Emerging-market interaction"
                  note={`t = ${s.interaction_t}, significant at the 1% level`} />
          </StatGrid>
        </CaseSection>

        <CaseSection number="02" title="Why this is hard to test">
          <Copy>
            <p>
              Wars, attacks and diplomatic crises obviously move markets. What is not obvious is
              what happens <em>next</em>. Prices may fall when the news lands and then recover.
              Investors may demand higher future returns for bearing the risk. Or the
              information may already be in the price, in which case last year&apos;s risk tells
              you nothing about this year&apos;s return.
            </p>
            <p>
              Testing it used to be difficult because geopolitical risk is hard to measure
              without picking events after the fact. Caldara and Iacoviello (2022) solved that
              with an index built from newspaper coverage, available globally and per country,
              which makes comparison across countries and years possible.
            </p>
          </Copy>

          <div className="mt-8">
            <ChartFrame
              title="The global geopolitical risk index, 1991–2021"
              question="What the index actually looks like over the sample period."
            >
              <GprOverTimeChart />
            </ChartFrame>
          </div>
        </CaseSection>

        <CaseSection number="03" title="How we set it up">
          <Copy>
            <p>
              Each observation is one country in one year. We take that year&apos;s geopolitical
              risk and match it to the <em>following</em> year&apos;s stock market return, which
              is what makes it a test of prediction rather than reaction.
            </p>
            <p>
              The regression uses two-way fixed effects — country effects absorb permanent
              differences such as a country simply being a riskier place, year effects absorb
              global shocks that hit everyone at once. Controls are inflation, unemployment, GDP
              growth and economy size. Standard errors are clustered by country.
            </p>
            <p>
              Risk enters in logs, so the coefficient describes the effect of a{" "}
              <em>proportional</em> change — a doubling of risk, rather than a one-point move on
              an index whose scale is arbitrary.
            </p>
          </Copy>

          <div className="mt-7 max-w-2xl">
            <Note title="The three excluded observations">
              <p>
                Three country-years had extreme returns that would dominate the estimates. We
                excluded them using a rule applied mechanically to every country, so we could
                not choose which ones to drop — and we report the result with them restored.
                Both versions are in the workbook.
              </p>
            </Note>
          </div>
        </CaseSection>

        <CaseSection number="04" title="First answer: no, risk does not predict returns">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartFrame
              title="Mean next-year return by risk quartile"
              question="If risk predicted returns, these bars would trend."
            >
              <ReturnByQuartileChart />
            </ChartFrame>
            <ChartFrame
              title="The raw relationship, in ten groups"
              question="Average return within each tenth of the sample, ordered by risk."
            >
              <DecileScatterChart />
            </ChartFrame>
          </div>

          <Copy>
            <p className="mt-8">
              The coefficient on country risk is 0.002 on its own (t = 0.12) and 0.003 with
              controls (t = 0.17). Neither is remotely significant. Once you remove permanent
              country differences and global year effects, a country&apos;s own geopolitical risk
              does not tell you what its market will do next year.
            </p>
            <p>
              The adjusted R² is actually negative, at −0.081. That is possible in a fixed
              effects model and it means exactly what it looks like: risk explains almost none
              of the variation left once country and year effects are taken out.
            </p>
          </Copy>
        </CaseSection>

        <CaseSection number="05" title="Second answer: but the two groups differ">
          <Copy>
            <p>
              The more interesting result comes from asking whether emerging and developed
              markets behave the same way. They do not.
            </p>
          </Copy>

          <div className="mt-7 grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ChartFrame
                title="Slope by market group"
                question="Opposite directions."
              >
                <GroupSlopeChart />
              </ChartFrame>
            </div>
            <div className="lg:col-span-3">
              <DataTable
                columns={["", "Model 1", "Model 2", "Model 3"]}
                rows={[
                  ["log(GPRC)", "0.002", "0.003", "−0.048**"],
                  ["", "(0.122)", "(0.171)", "(−2.019)"],
                  ["log(GPRC) × emerging", "—", "—", "0.078***"],
                  ["", "", "", "(2.844)"],
                  ["Macro controls", "No", "Yes", "Yes"],
                  ["Observations", "873", "873", "873"],
                  ["Adjusted R²", "−0.081", "−0.076", "−0.067"],
                ]}
                caption="t-statistics in parentheses, standard errors clustered by country. In Model 3 the log(GPRC) row is the developed-market slope; adding the interaction gives an implied emerging-market slope of 0.030 (t = 1.67). Transcribed from the paper, Table 3."
              />
            </div>
          </div>

          <div className="mt-7 max-w-2xl">
            <Note title="What the interaction does and does not say" tone="warn">
              <p>
                The 0.078 measures the <em>difference between the two groups</em>. It does not
                say that emerging-market returns rise with risk. Testing that directly gives a
                slope of 0.030 with t = 1.67 — marginal at best, and not significant at 5%.
              </p>
              <p>
                Much of the difference comes from the developed-market side being negative. That
                was not what we predicted, and we say so rather than presenting it as a clean
                confirmation.
              </p>
            </Note>
          </div>

          <Copy>
            <p className="mt-7">
              To put a size on it: doubling a country&apos;s geopolitical risk corresponds to a
              gap of roughly {s.doubling_gpr_gap_pct} percentage points in the following
              year&apos;s return between the two groups. Next to a sample average return of{" "}
              {s.mean_annual_return_pct}%, that is large — though it is a difference between
              groups, not a return either group earns.
            </p>
          </Copy>
        </CaseSection>

        <CaseSection number="06" title="Trying to break the result">
          <Copy>
            <p>
              With only 35 countries, a single influential one could drive everything. So we
              re-estimated the model 35 times, dropping one country each time, and ran four
              other checks.
            </p>
          </Copy>

          <div className="mt-7">
            <DataTable
              columns={["Check", "Interaction", "t-statistic"]}
              rows={(data.robustness as { check: string; interaction: number; t: number }[]).map(
                (r) => [r.check, r.interaction.toFixed(3), r.t.toFixed(2)]
              )}
              caption="Across all 35 leave-one-country-out regressions the interaction stayed between 0.063 and 0.088 and never changed sign."
            />
          </div>

          <Copy>
            <p className="mt-7">
              It mostly holds. The one check that does break it is the last: using the{" "}
              <em>change</em> in risk rather than its level gives 0.027 with t = 0.74. That tells
              us the difference is about countries sitting at sustained high risk, not about
              year-to-year movements — a real limitation on how the result should be read, and
              one we report rather than bury.
            </p>
            <p>
              Clustering standard errors by year instead of country also weakens it, to t = 1.81.
              The result is less precise than the main table alone suggests.
            </p>
          </Copy>
        </CaseSection>

        <CaseSection number="07" title="What we concluded">
          <ol className="max-w-2xl space-y-8">
            <Finding index={1} title="Geopolitical risk does not predict a country's own return">
              <p>
                Insignificant with and without controls. This is consistent with markets already
                pricing in publicly available information.
              </p>
            </Finding>
            <Finding index={2} title="But the relationship is not the same in the two groups">
              <p>
                The emerging-versus-developed difference is 0.078, significant at 1%, and it
                survives restoring the extremes and dropping any single country.
              </p>
            </Finding>
            <Finding index={3} title="The emerging-market effect on its own is weak">
              <p>
                A slope of 0.030 with t = 1.67 does not establish reliable predictability inside
                emerging markets. Much of the group difference is the negative developed-market
                side, which we did not predict.
              </p>
            </Finding>
            <Finding index={4} title="It is about levels, not changes">
              <p>
                Re-running on year-to-year changes makes the difference disappear. Whatever is
                being captured relates to countries that sit at persistently high risk.
              </p>
            </Finding>
          </ol>
        </CaseSection>

        <CaseSection number="08" title="Limitations">
          <Copy>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-accent-soft">
              <li>
                <strong className="font-medium text-ink">35 countries is a small
                cross-section,</strong> which is why we ran the leave-one-out check.
              </li>
              <li>
                <strong className="font-medium text-ink">Annual data over a long horizon.</strong>{" "}
                Zaremba and co-authors find emerging-market predictability at monthly frequency;
                our result differs, and the levels-versus-changes check suggests why.
              </li>
              <li>
                <strong className="font-medium text-ink">The index measures newspaper
                coverage,</strong> not risk itself. Coverage intensity and actual risk are not
                the same thing.
              </li>
              <li>
                <strong className="font-medium text-ink">Clustering choice matters.</strong>{" "}
                By year rather than country, the interaction falls to t = 1.81.
              </li>
              <li>
                <strong className="font-medium text-ink">The emerging-market classification is
                fixed</strong> over a 30-year window in which some countries changed status. We
                test Israel specifically; others we do not.
              </li>
              <li>
                <strong className="font-medium text-ink">This is not a trading
                strategy.</strong> It is a statistical relationship across countries, with no
                costs, no implementation and no out-of-sample test.
              </li>
            </ul>
          </Copy>
        </CaseSection>

        <div className="border-t border-line pt-10">
          <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-body">
            This was a joint paper with Estherlola Wajsman, supervised by Prof. Doron Israeli,
            submitted to the Arison School of Business at Reichman University in July 2026.
            Regression results shown here come from the submitted paper; the descriptive charts
            are calculated from the same workbook.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/projects" variant="secondary">
              All projects
            </LinkButton>
          </div>
        </div>
      </Container>
    </>
  );
}
