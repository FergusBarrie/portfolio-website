import type { Metadata } from "next";
import {
  CoefficientChart,
  MinWageOverTimeChart,
  RobustnessChart,
} from "@/components/charts/MinimumWageCharts";
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
import data from "@/data/minimum-wage.json";
import { num } from "@/lib/format";

const project = getProject("minimum-wage");
const s = data.summary;

export const metadata: Metadata = {
  title: "Minimum Wage and County Labour Markets",
  description: project.question,
};

export default function Page() {
  return (
    <>
      <ProjectHeader project={project} />

      <Container className="mt-14 space-y-14 pb-6">
        <CaseSection number="01" title="At a glance">
          <StatGrid>
            <Stat value={num(s.observations)} label="County-year observations"
                  note={`${num(s.counties)} counties across all ${s.states} states`} />
            <Stat value={`${s.first_year}–${s.last_year}`} label="Years covered"
                  note="The federal minimum has been $7.25 since 2009" />
            <Stat value={`$${s.mean_real_min_wage}`} label="Average real minimum wage"
                  note={`Ranging from $${s.min_real_min_wage} to $${s.max_real_min_wage}`} />
            <Stat value={`${s.states_raising}`} label="States that raised their real minimum"
                  note={`Median change across states: $${s.median_state_change}`} />
          </StatGrid>
        </CaseSection>

        <CaseSection number="02" title="Why the question is worth asking">
          <Copy>
            <p>
              Economic theory does not settle this one. In a simple competitive market, making
              labour more expensive should mean firms buy less of it. But if employers have
              some power to set wages — which is plausible in a small town with few employers —
              a modest rise need not cost jobs, and might even raise employment.
            </p>
            <p>
              The evidence is split too. Card and Krueger (1994) found no job losses in New
              Jersey; Neumark and Wascher (2000) found the opposite using different data on the
              same episode. Dube, Lester and Reich (2010) showed that comparing counties on
              either side of a state border shrinks the negative effects considerably.
            </p>
            <p>
              Because the federal minimum has been frozen at $7.25 since 2009, almost all recent
              movement comes from individual states. That gives variation across places and over
              time that can be used to study the question.
            </p>
          </Copy>

          <div className="mt-8">
            <ChartFrame
              title="What was actually happening to minimum wages"
              question="The federal floor never moved, so every change came from a state deciding to act."
            >
              <MinWageOverTimeChart />
            </ChartFrame>
          </div>
        </CaseSection>

        <CaseSection number="03" title="How we measured it">
          <Copy>
            <p>
              Each row of the panel is one county in one year. The two outcomes are the size of
              the county labour force and the number of unemployed people, both from the Bureau
              of Labor Statistics. The variable of interest is the state minimum wage, adjusted
              for inflation.
            </p>
            <p>
              Everything is in logs, which means the coefficient can be read directly as an{" "}
              <strong className="font-medium text-ink">elasticity</strong>: if it were 0.10, a
              10% rise in the minimum wage would be associated with a 1% change in the outcome.
            </p>
            <p>
              The model uses <strong className="font-medium text-ink">two-way fixed effects</strong>.
              In plain terms: county fixed effects absorb permanent differences between places,
              so a rural county is only ever compared with itself; year fixed effects absorb
              anything hitting the whole country in a given year, such as the business cycle.
              The extended model also lets each county follow its own trend over time. Standard
              errors are clustered by state, because that is the level at which the policy is
              actually set.
            </p>
          </Copy>

          <div className="mt-7 max-w-2xl">
            <Note title="One thing we were careful about">
              <p>
                The outcome is the <em>size</em> of the labour force, not the participation
                rate. Population is controlled for separately, but the two are mechanically
                linked — the labour force is part of the population. We say so in the paper
                rather than letting the large, significant population coefficient look like a
                finding.
              </p>
            </Note>
          </div>
        </CaseSection>

        <CaseSection number="04" title="The answer: no detectable effect">
          <div className="mt-2">
            <ChartFrame
              title="Minimum wage elasticity, four specifications"
              question="Does a higher minimum wage move the labour force or unemployment?"
              source="Coefficients transcribed from the submitted paper, Table 2."
            >
              <CoefficientChart />
            </ChartFrame>
          </div>

          <Copy>
            <p className="mt-8">
              Every estimate is small, and every confidence interval crosses zero. In the labour
              force regressions the coefficient is 0.023 in the baseline and −0.009 once county
              trends are added — p-values of roughly 0.46 and 0.79. For unemployment it is 0.115
              and 0.229, again not significant.
            </p>
          </Copy>

          <div className="mt-7">
            <DataTable
              columns={["", "Labour force", "Unemployment", "LF + trends", "Unemp. + trends"]}
              rows={[
                ["ln(real minimum wage)", "0.0226", "0.1147", "−0.0085", "0.2294"],
                ["Standard error", "(0.0303)", "(0.1753)", "(0.0324)", "(0.1766)"],
                ["ln(population)", "1.0601***", "0.4115", "1.0600***", "1.5257***"],
                ["Low-wage industry share", "−0.1451***", "0.1973*", "−0.1716**", "0.2724***"],
                ["Within R²", "0.296", "0.013", "0.098", "0.038"],
              ]}
              caption="29,076 observations in every column. Standard errors clustered at state level. *** p<0.001, ** p<0.01, * p<0.05."
            />
          </div>

          <div className="mt-7 max-w-2xl">
            <Note title="What a null result does and does not mean" tone="warn">
              <p>
                Finding no significant effect is not the same as proving there is none. Our
                confidence intervals are wide enough to contain economically meaningful effects
                in both directions, so the honest statement is that we{" "}
                <em>could not detect</em> one — not that the minimum wage does not matter.
              </p>
              <p>
                There is also a design limit worth naming: the minimum wage is set at state
                level, so the variation identifying the effect comes from states changing policy
                over time, not from genuine differences between neighbouring counties.
              </p>
            </Note>
          </div>
        </CaseSection>

        <CaseSection number="05" title="Does the result survive being poked at?">
          <Copy>
            <p>
              A single specification producing a null result is not persuasive on its own. We
              re-ran the labour force regression four more ways: adding county-specific time
              trends, restricting to counties observed at least eight years, and splitting states
              into those that raised their real minimum a lot and a little.
            </p>
          </Copy>

          <div className="mt-7">
            <ChartFrame
              title="Five specifications, same answer"
              question="If the null result came from one modelling choice, this is where it would show."
              source="Labour force outcome. Transcribed from the paper, Table 3."
            >
              <RobustnessChart />
            </ChartFrame>
          </div>

          <Copy>
            <p className="mt-8">
              None of them is significant. The largest estimate in absolute terms is the
              low-change states at −0.089, with a standard error of 0.085 — still comfortably
              inside the noise.
            </p>
          </Copy>
        </CaseSection>

        <CaseSection number="06" title="What we take from it">
          <ol className="max-w-2xl space-y-8">
            <Finding index={1} title="No detectable employment effect, in any specification">
              <p>
                Across four main models and five robustness checks, the minimum wage coefficient
                is small and statistically insignificant. This sits with the body of work that
                finds little evidence of large employment losses.
              </p>
            </Finding>
            <Finding index={2} title="The controls behave sensibly, which is reassuring">
              <p>
                Population enters at about 1.0 in the labour force regressions — close to
                proportional, which is what you would expect. Counties with more low-wage
                industry have slightly smaller labour forces and slightly more unemployment.
                These are associations, not causal effects, and we treat them as such.
              </p>
            </Finding>
            <Finding index={3} title="Unemployment is barely explained at all">
              <p>
                The within R² for the unemployment regressions is 0.013 in the baseline. The
                model explains almost none of the year-to-year variation in unemployment within
                a county — worth saying out loud rather than hiding in a table.
              </p>
            </Finding>
          </ol>
        </CaseSection>

        <CaseSection number="07" title="Limitations">
          <Copy>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-accent-soft">
              <li>
                <strong className="font-medium text-ink">A null result is not proof of no
                effect.</strong> The intervals are wide enough to include effects that would
                matter in practice.
              </li>
              <li>
                <strong className="font-medium text-ink">Identification comes from state policy
                changes,</strong> not from comparing neighbouring counties across a border, which
                is the stronger design used by Dube and co-authors.
              </li>
              <li>
                <strong className="font-medium text-ink">The population control is partly
                mechanical,</strong> since the labour force is a component of population.
              </li>
              <li>
                <strong className="font-medium text-ink">Ten years, one country, one
                decade</strong> — a period of recovery after the financial crisis, which may not
                generalise.
              </li>
              <li>
                <strong className="font-medium text-ink">We measure counts, not wages.</strong>{" "}
                The data cannot say whether hours, wages or job composition shifted.
              </li>
            </ul>
          </Copy>
        </CaseSection>

        <div className="border-t border-line pt-10">
          <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-body">
            This was a joint paper with Tomer Davitasvili, submitted to the School of Economics
            at Reichman University in June 2026. The regression results shown here are taken from
            the submitted paper; the descriptive charts are calculated from the same panel file.
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
