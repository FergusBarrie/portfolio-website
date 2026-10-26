import type { Metadata } from "next";
import {
  ForecastChart,
  MarginBridgeChart,
  MarginsChart,
  RevenueMarginChart,
  SgaSplitChart,
} from "@/components/charts/FinancialCharts";
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
import data from "@/data/financial-performance.json";
import { compactUsdMillions, pct, signedPct, usd } from "@/lib/format";

const project = getProject("financial-performance");
const h = data.headline;
const fin = data.financials;
const ratios = data.ratios;

export const metadata: Metadata = {
  title: "Financial Performance Analysis — NIKE",
  description: project.question,
};

const fy = (year: number) => "FY" + String(year).slice(2);

export default function Page() {
  const years = fin.map((f) => f.fiscal_year);

  return (
    <>
      <ProjectHeader project={project} />

      <Container className="mt-14 space-y-14 pb-6">
        {/* -------------------------------------------------- at a glance */}
        <CaseSection number="01" title="At a glance">
          <StatGrid>
            <Stat
              value={signedPct(h.revenue_change_from_peak_pct)}
              label="Revenue since the FY2024 peak"
              note={`${compactUsdMillions(h.peak_revenue)} to ${compactUsdMillions(h.latest_revenue)}`}
            />
            <Stat
              value={signedPct(h.operating_income_change_from_peak_pct)}
              label="Operating income over the same period"
              note="Profit fell about four times as fast as revenue"
            />
            <Stat
              value={pct(h.operating_margin_latest_pct)}
              label="FY2026 operating margin"
              note={`Down from ${pct(h.operating_margin_peak_pct)} in FY2024 and ${pct(h.operating_margin_best_pct)} in FY${h.operating_margin_best_year}`}
            />
            <Stat
              value={compactUsdMillions(h.free_cash_flow_latest)}
              label="FY2026 free cash flow"
              note={`Down from ${compactUsdMillions(h.free_cash_flow_peak)} in FY2024`}
            />
          </StatGrid>
        </CaseSection>

        {/* ------------------------------------------------------- source */}
        <CaseSection number="02" title="Where the numbers come from">
          <Copy>
            <p>
              Not a data provider or a stock website — NIKE&apos;s own 10-K filings, read
              through the SEC&apos;s XBRL company facts API. Every US-listed company tags
              its financial statements in XBRL and the SEC publishes those tags. The
              endpoint is free, needs no key, and returns the figures exactly as filed, so
              they can be checked line by line against the PDF of the 10-K.
            </p>
            <p>
              Two things in that data are easy to get wrong, and both would produce
              plausible-looking but incorrect numbers:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-accent-soft">
              <li>
                The <code className="text-[0.8125rem]">fy</code> field is the year of the{" "}
                <em>filing</em>, not of the figure. A 10-K reports three years of income
                statement and all three carry the same{" "}
                <code className="text-[0.8125rem]">fy</code>. I derive the fiscal year from
                each fact&apos;s own period end date instead.
              </li>
              <li>
                The same year appears in several filings, sometimes restated. I keep the
                version from the most recently filed report.
              </li>
            </ul>
          </Copy>

          <div className="mt-7 max-w-2xl">
            <Note title="The sign convention I got wrong first time" tone="warn">
              <p>
                The two non-operating lines are tagged{" "}
                <code className="text-[0.8125rem]">InterestIncomeExpenseNonoperatingNet</code>{" "}
                and <code className="text-[0.8125rem]">OtherNonoperatingIncomeExpense</code>.
                Both have “expense” in the name, so my first version subtracted them — and
                the bridge to reported pre-tax income was out by up to $524m, with the
                error flipping sign between years. That flip is the clue: a sign problem,
                not a missing figure.
              </p>
              <p>
                Testing against the reported pre-tax figure showed that both tags are
                signed as <em>income</em>. The lesson is simple: never assume a sign
                convention, reconcile against something the company reports.
              </p>
            </Note>
          </div>

          <Copy>
            <p className="mt-7">
              The extraction script runs four reconciliation checks every time, all of
              which come to exactly zero: revenue less cost of sales equals reported gross
              profit; marketing plus overhead equals reported SG&amp;A; operating income
              plus interest plus other equals reported pre-tax income; and pre-tax less tax
              equals reported net income.
            </p>
          </Copy>

          <div className="mt-6 max-w-2xl">
            <Note title="One definition to be aware of">
              <p>
                NIKE does not publish an operating income line. Its income statement runs
                from gross profit straight to SG&amp;A and then to pre-tax income. Operating
                income throughout this analysis is{" "}
                <strong className="font-medium text-ink">gross profit less SG&amp;A</strong>,
                which is what is normally called EBIT for this company. Anyone comparing
                with a published figure should check the definition matches.
              </p>
            </Note>
          </div>
        </CaseSection>

        {/* --------------------------------------------- income statement */}
        <CaseSection number="03" title="Seven years of results">
          <DataTable
            columns={["USD millions", ...years.map(fy)]}
            rows={[
              ["Revenue", ...fin.map((f) => usd(f.revenue))],
              ["Gross profit", ...fin.map((f) => usd(f.gross_profit))],
              ["Gross margin", ...ratios.map((r) => pct(r.gross_margin_pct))],
              ["SG&A", ...fin.map((f) => usd(f.sg_and_a))],
              ["SG&A % of revenue", ...ratios.map((r) => pct(r.sg_and_a_pct_of_revenue))],
              ["Operating income", ...fin.map((f) => usd(f.operating_income))],
              ["Operating margin", ...ratios.map((r) => pct(r.operating_margin_pct))],
              ["Net income", ...fin.map((f) => usd(f.net_income))],
              ["Diluted EPS", ...fin.map((f) => "$" + f.eps_diluted.toFixed(2))],
            ]}
            caption="As reported. Only these figures are typed into the Excel workbook; every margin, growth rate, ratio and forecast line in it is a formula."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <ChartFrame
              title="Revenue and operating margin"
              question="Did margin fall with revenue, or further than it?"
              source="Source: NIKE 10-K filings via the SEC XBRL API."
            >
              <RevenueMarginChart />
            </ChartFrame>
            <ChartFrame
              title="The three margins"
              question="Where in the income statement is the pressure? The widening gap between gross and operating margin is the cost story."
              source="Operating income is gross profit less SG&A."
            >
              <MarginsChart />
            </ChartFrame>
          </div>

          <Copy>
            <p className="mt-8">
              Revenue recovered strongly from the COVID year, grew for four years, peaked
              in FY2024 and then fell {signedPct(h.revenue_change_from_peak_pct)}. FY2025
              was the fall, at −9.8%; FY2026 was flat at{" "}
              {signedPct(h.latest_revenue_growth_pct)}. So the decline stopped, but nothing
              has come back.
            </p>
            <p>
              Profit fell much further. Operating income is down{" "}
              {signedPct(h.operating_income_change_from_peak_pct)}, net income{" "}
              {signedPct(h.net_income_change_from_peak_pct)} and EPS{" "}
              {signedPct(h.eps_change_from_peak_pct)}. That gap between a 9.7% revenue fall
              and a 39.8% profit fall is operating leverage: most of the cost base does not
              shrink when sales do.
            </p>
          </Copy>
        </CaseSection>

        {/* --------------------------------------------------- the bridge */}
        <CaseSection number="04" title="Where the $2,514m of operating profit went">
          <Copy>
            <p>
              Saying “profit fell because sales fell” is not an analysis. Splitting the
              fall into its causes is. Each effect below is a formula in the workbook, and
              the three add back to the reported change exactly — a visible check cell that
              must always read zero.
            </p>
          </Copy>

          <div className="mt-7 grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ChartFrame
                title="Operating income bridge, FY2024 to FY2026"
                question="Three causes, sized. Three bars replace a paragraph."
                source="Source: outputs/tables/margin_bridge.csv."
              >
                <MarginBridgeChart />
              </ChartFrame>
            </div>
            <div className="lg:col-span-2">
              <DataTable
                columns={["Cause", "USD m", "Share"]}
                rows={[
                  ["Lower revenue", "−2,212", "88%"],
                  ["Lower gross margin", "−764", "30%"],
                  ["Lower SG&A", "+462", "−18%"],
                  ["Total", "−2,514", "100%"],
                ]}
                caption="Revenue effect = change in revenue × the FY2024 gross margin. Margin effect = FY2026 revenue × the change in gross margin. Together they cover the change exactly once."
              />
            </div>
          </div>

          <Copy>
            <p className="mt-8">
              Lower revenue explains 88% of it. This is a demand problem first and a margin
              problem second, and the cost savings offset less than a fifth of the damage.
            </p>
            <p>
              The margin part is not trivial either. Gross margin fell from{" "}
              {pct(h.gross_margin_peak_pct)} to {pct(h.gross_margin_latest_pct)}. At
              current revenue, one percentage point of gross margin is worth about{" "}
              <strong className="font-medium text-ink">
                {usd(h.one_point_of_gross_margin)}m
              </strong>{" "}
              of operating profit — around 12% of FY2026 operating income. Margin is the
              faster lever of the two.
            </p>
          </Copy>
        </CaseSection>

        {/* ------------------------------------------------------- SG&A */}
        <CaseSection number="05" title="The cost base did not follow revenue down">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <DataTable
                columns={["FY2024 → FY2026", "Change"]}
                rows={[
                  ["Revenue", signedPct(h.revenue_change_from_peak_pct)],
                  ["Marketing (demand creation)", signedPct(h.demand_creation_change_pct)],
                  ["Operating overhead", signedPct(h.overhead_change_pct)],
                  ["Total SG&A", signedPct(h.sga_change_pct)],
                  ["SG&A as % of revenue", `${pct(h.sga_pct_peak)} → ${pct(h.sga_pct_latest)}`],
                ]}
              />
            </div>
            <div className="lg:col-span-3">
              <ChartFrame
                title="SG&A as a share of revenue, split in two"
                question="The chart that shows marketing rising while overhead was cut."
                source="Demand creation is NIKE's term for marketing spend."
              >
                <SgaSplitChart />
              </ChartFrame>
            </div>
          </div>

          <Copy>
            <p className="mt-8">
              SG&amp;A fell only {Math.abs(h.sga_change_pct)}% while revenue fell 9.7%, so
              it rose from {pct(h.sga_pct_peak)} to {pct(h.sga_pct_latest)} of revenue. But
              the two halves moved in opposite directions: marketing rose{" "}
              {signedPct(h.demand_creation_change_pct)} in cash terms while overhead fell{" "}
              {signedPct(h.overhead_change_pct)}.
            </p>
            <p>
              NIKE cut back-office cost and spent more on marketing into a falling top
              line. That reads as a deliberate decision to defend demand rather than a
              failure to control costs. Whether it worked would show up in revenue after
              FY2026, which this data does not cover — so I describe the choice rather than
              grading it.
            </p>
            <p>
              “SG&amp;A fell 2.8%” is true and almost completely uninformative. The split is
              the finding.
            </p>
          </Copy>
        </CaseSection>

        {/* -------------------------------------------------------- cash */}
        <CaseSection number="06" title="Cash generation weakened more than profit">
          <DataTable
            columns={["", "FY2024", "FY2025", "FY2026"]}
            rows={[
              ["Free cash flow", "$6,617m", "$3,268m", "$2,184m"],
              ["Cash returned to shareholders", "$6,419m", "$5,285m", "$2,553m"],
              ["Returned as % of free cash flow", "97%", "162%", "117%"],
              ["Accounts receivable", "$4,427m", "$4,717m", "$5,931m"],
              ["Receivable days", "31.5", "37.2", "46.7"],
              ["Inventory days", "96", "103", "103"],
              ["Return on equity", "40.1%", "23.3%", "22.1%"],
              ["Current ratio", "2.40", "2.21", "1.96"],
            ]}
          />

          <Copy>
            <p className="mt-7">
              Free cash flow fell 67% between FY2024 and FY2026, considerably more than the{" "}
              {Math.abs(h.net_income_change_from_peak_pct)}% fall in net income. Working
              capital explains most of the gap: receivables rose{" "}
              {usd(h.receivables_increase)}m <em>while revenue fell</em>, taking collection
              from {h.receivable_days_peak} days to {h.receivable_days_latest} days, and
              inventory held flat in cash terms on lower sales.
            </p>
            <p>
              NIKE also returned more to shareholders than it generated in free cash flow in
              both FY2025 and FY2026. Buybacks were cut sharply in FY2026 — from $2,985m to
              $146m — which looks like exactly that pressure being managed.
            </p>
            <p>
              The balance sheet absorbed all of this comfortably. Long-term debt came down{" "}
              {usd(Math.abs(h.long_term_debt_change))}m, equity rose, and the current ratio
              is still {h.current_ratio_latest}. Return on equity nearly halved, but that is
              a profitability story, not a solvency one.
            </p>
          </Copy>
        </CaseSection>

        {/* ---------------------------------------------------- forecast */}
        <CaseSection number="07" title="What it would take to recover">
          <Copy>
            <p>
              A deliberately simple two-year forecast. Three scenarios, four assumptions
              each, every one of them visible in the workbook next to what the last seven
              years actually did. There is no DCF, no cost of capital and no target price —
              those answer “what is the company worth”, which is a different question
              needing assumptions I have no basis for.
            </p>
          </Copy>

          <div className="mt-7">
            <DataTable
              columns={["Scenario", "Revenue growth", "Gross margin", "SG&A growth", "FY2028 op. margin", "FY2028 EPS"]}
              rows={[
                ["Low", "−2%", "42.0%", "+1%", "5.1%", "$1.31"],
                ["Base", "+2%", "43.5%", "+2%", "8.8%", "$2.41"],
                ["High", "+5%", "44.5%", "+2%", "11.7%", "$3.40"],
              ]}
              caption={`For reference, FY2026 actual: operating margin ${pct(h.operating_margin_latest_pct)}, EPS $2.10. Historically, revenue growth has averaged +4.0% (range −9.8% to +19.1%) and the gross margin has ranged from 42.7% to 46.0%.`}
            />
          </div>

          <div className="mt-8">
            <ChartFrame
              title="Forecast by scenario"
              question="Switch the measure to see how sensitive each one is to the assumptions."
              source="A sensitivity exercise, not a prediction. The assumptions are mine."
            >
              <ForecastChart />
            </ChartFrame>
          </div>

          <Copy>
            <p className="mt-8">
              The useful result is the High case. Five per cent revenue growth every year{" "}
              <em>and</em> the gross margin all the way back to its FY2024 level still only
              produces an 11.7% operating margin in FY2028 — below FY2024&apos;s{" "}
              {pct(h.operating_margin_peak_pct)} and well short of FY2021&apos;s{" "}
              {pct(h.operating_margin_best_pct)}. The reason is in the assumptions: SG&amp;A
              keeps growing at 2%. Revenue recovery on its own does not rebuild the old
              margin; the cost base has to come down too.
            </p>
            <p>
              That conclusion comes out of the model rather than being asserted, which is
              the point of building one.
            </p>
          </Copy>
        </CaseSection>

        {/* --------------------------------------------------- the findings */}
        <CaseSection number="08" title="What I would watch">
          <ol className="max-w-2xl space-y-8">
            <Finding index={1} title="Gross margin, as closely as revenue">
              <p>
                One percentage point is worth about {usd(h.one_point_of_gross_margin)}m of
                operating profit at current revenue — roughly 12% of FY2026 operating
                income. It moves faster than the top line.
              </p>
            </Finding>
            <Finding index={2} title="Whether SG&A comes down">
              <p>
                At {pct(h.sga_pct_latest)} of revenue the cost base is sized for a larger
                company. If revenue stays near $46bn, the forecast shows that holding SG&amp;A
                flat is not enough to rebuild the margin.
              </p>
            </Finding>
            <Finding index={3} title="Receivables and inventory">
              <p>
                Receivable days up 15 and inventory flat on lower sales are the clearest
                signs of pressure in these statements, and they explain why free cash flow
                fell further than profit. A reversal would release cash quickly; further
                deterioration would do the opposite.
              </p>
            </Finding>
          </ol>
        </CaseSection>

        {/* -------------------------------------------------- limitations */}
        <CaseSection number="09" title="Limitations">
          <Copy>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-accent-soft">
              <li>
                <strong className="font-medium text-ink">
                  No segment or geographic detail.
                </strong>{" "}
                It exists in the filings but is tagged with dimensions I did not extract, so
                I cannot say which region, brand or channel drove the decline. This is the
                biggest gap here and the first thing I would fix.
              </li>
              <li>
                <strong className="font-medium text-ink">Operating income is derived</strong>{" "}
                as gross profit less SG&amp;A, because NIKE does not report it.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  One-off items are not separated out.
                </strong>{" "}
                FY2024 included $443m of restructuring charges, so the FY2024 starting point
                is already depressed and the underlying decline is slightly larger than the
                reported one.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  Nothing here explains why demand fell.
                </strong>{" "}
                Financial statements record outcomes. I used no source other than the
                filings — no management commentary, no market data, no competitor figures.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  No valuation and no view on the shares.
                </strong>{" "}
                This is a performance analysis, not an investment recommendation.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  Annual data, seven years, one company.
                </strong>{" "}
                No quarterly detail and no peer comparison, so there is no way to tell how
                much of this is NIKE-specific and how much is the sector.
              </li>
            </ul>
          </Copy>
        </CaseSection>

        <div className="border-t border-line pt-10">
          <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-body">
            The repository has the extraction script with its reconciliation checks, the
            seven-sheet Excel workbook where the forecast is live, and a learning guide
            explaining every ratio and the arithmetic of the margin bridge.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href={project.repo} external>
              View the repository
            </LinkButton>
            <LinkButton href="/projects" variant="secondary">
              All projects
            </LinkButton>
          </div>
        </div>
      </Container>
    </>
  );
}
