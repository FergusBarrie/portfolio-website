import type { Metadata } from "next";
import {
  GoodwillChart,
  ReportedVsUnderlyingChart,
  RevenueMarginChart,
} from "@/components/charts/TakeTwoCharts";
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
import data from "@/data/take-two.json";
import { usd } from "@/lib/format";

const project = getProject("take-two");
const h = data.headline;
const fin = data.financials;

export const metadata: Metadata = {
  title: "Take-Two Interactive — Financial Performance",
  description: project.question,
};

const fy = (y: number) => "FY" + y;

export default function Page() {
  return (
    <>
      <ProjectHeader project={project} />

      <Container className="mt-14 space-y-14 pb-6">
        <CaseSection number="01" title="At a glance">
          <StatGrid>
            <Stat value={`+${h.revenue_growth_pct}%`} label="Revenue growth, FY2022 to FY2026"
                  note={`$${(h.revenue_first / 1000).toFixed(1)}bn to $${(h.revenue_last / 1000).toFixed(1)}bn`} />
            <Stat value={`$${(h.cumulative_net_loss / 1000).toFixed(1)}bn`}
                  label="Cumulative losses, FY2023 to FY2026" />
            <Stat value={`${h.impairment_share_of_loss_pct}%`}
                  label="Of those losses were goodwill write-downs"
                  note={`$${(h.cumulative_goodwill_impairment / 1000).toFixed(1)}bn in total`} />
            <Stat value={`${h.latest_operating_margin_pct}%`} label="FY2026 operating margin"
                  note={`Improved from ${fin.find((f) => f.fiscal_year === 2025)?.operating_margin_pct.toFixed(1)}% a year earlier`} />
          </StatGrid>
        </CaseSection>

        <CaseSection number="02" title="The puzzle">
          <Copy>
            <p>
              Take-Two owns Rockstar Games, whose Rockstar North studio in Edinburgh makes Grand
              Theft Auto. Over four years its revenue grew about 90%, from $3.5bn to $6.7bn. Over
              the same four years it reported losses totalling $9.6bn.
            </p>
            <p>
              Those two facts look contradictory. A company selling far more than it used to,
              losing billions a year, is not an obvious combination — and the headlines at the
              time mostly reported one or the other.
            </p>
          </Copy>

          <div className="mt-8">
            <ChartFrame
              title="Revenue and operating margin"
              question="Revenue climbs steadily while the margin collapses and then comes back."
              source="Source: Take-Two 10-K filings via the SEC XBRL API."
            >
              <RevenueMarginChart />
            </ChartFrame>
          </div>
        </CaseSection>

        <CaseSection number="03" title="Where the numbers come from">
          <Copy>
            <p>
              Take-Two&apos;s own 10-K filings, read through the SEC&apos;s XBRL company facts
              API. Every US-listed company tags its financial statements and the SEC publishes
              the tags, free and without registration — so the figures here are exactly as
              filed and can be checked against the published accounts.
            </p>
            <p>
              A short script downloads the data; everything after that is Excel. The workbook
              has only the reported figures typed in. Margins, growth rates and the underlying
              profit calculation are all formulas, so any number can be clicked on and traced
              back to its inputs.
            </p>
            <p>
              Three reconciliations run every time the data is extracted, and all three come to
              zero: revenue less cost of revenue equals reported gross profit; gross profit less
              operating expenses equals reported operating income; pre-tax income less tax
              equals reported net income. If a tag were wrong, one of those would break.
            </p>
          </Copy>
        </CaseSection>

        <CaseSection number="04" title="The answer: most of the loss is one accounting charge">
          <Copy>
            <p>
              In May 2022 Take-Two bought Zynga, the mobile games company, for about $12.7bn.
              When one company buys another for more than the value of its identifiable assets,
              the difference is recorded on the balance sheet as{" "}
              <strong className="font-medium text-ink">goodwill</strong>.
            </p>
            <p>
              Goodwill sits there until the acquirer concludes the business is not worth what was
              paid. At that point it is written down, and the write-down goes through the income
              statement as a loss — even though no cash leaves the building. It is a real loss of
              value, but it reflects a judgement about a past purchase, not how the business
              traded that year.
            </p>
          </Copy>

          <div className="mt-8">
            <ChartFrame
              title="Goodwill: acquired, then written off"
              question="The balance sheet tells the story more plainly than the income statement."
            >
              <GoodwillChart />
            </ChartFrame>
          </div>

          <div className="mt-8">
            <ChartFrame
              title="Operating result, reported against underlying"
              question="What the trading looks like once the write-downs are added back."
              source="Underlying = reported operating income + goodwill impairment that year."
            >
              <ReportedVsUnderlyingChart />
            </ChartFrame>
          </div>

          <div className="mt-7">
            <DataTable
              columns={["USD millions", ...fin.map((f) => fy(f.fiscal_year))]}
              rows={[
                ["Revenue", ...fin.map((f) => usd(f.revenue))],
                ["Gross margin", ...fin.map((f) => f.gross_margin_pct.toFixed(1) + "%")],
                ["Goodwill impairment", ...fin.map((f) => f.goodwill_impairment ? usd(f.goodwill_impairment) : "—")],
                ["Operating income (reported)", ...fin.map((f) => usd(f.operating_income))],
                ["Operating income (underlying)", ...fin.map((f) => usd(f.operating_income_ex_impairment))],
                ["Net income", ...fin.map((f) => usd(f.net_income))],
                ["Diluted EPS", ...fin.map((f) => "$" + f.eps_diluted.toFixed(2))],
              ]}
              caption="As reported, except the underlying row, which adds the goodwill impairment back to operating income."
            />
          </div>

          <Copy>
            <p className="mt-8">
              Of the $9.6bn of cumulative losses, $5.9bn — {h.impairment_share_of_loss_pct}% —
              is goodwill impairment. Strip it out and the picture changes: the business was
              still loss-making, but the underlying operating loss shrinks from $1.2bn in FY2024
              to $846m in FY2025 and just $104m in FY2026.
            </p>
            <p>
              That is a company recovering, not a company collapsing. And FY2026 revenue grew{" "}
              {h.latest_revenue_growth_pct}% with a gross margin of {h.latest_gross_margin_pct}%,
              the highest in the five years.
            </p>
          </Copy>

          <div className="mt-7 max-w-2xl">
            <Note title="Being fair about this" tone="warn">
              <p>
                Adding impairments back is a standard adjustment, but it should not become a way
                of ignoring bad news. Take-Two really did pay $12.7bn for Zynga and really did
                conclude it was worth about $5.9bn less. Shareholders lost that value.
              </p>
              <p>
                The right reading is that there are two separate stories — a poor acquisition and
                an improving trading business — and the headline loss mixes them together.
              </p>
            </Note>
          </div>
        </CaseSection>

        <CaseSection number="05" title="What I would watch">
          <ol className="max-w-2xl space-y-8">
            <Finding index={1} title="Whether FY2027 turns the underlying loss into a profit">
              <p>
                The underlying operating loss narrowed to $104m in FY2026 on rising revenue. One
                more year at that trajectory crosses into profit; a stall would suggest the
                recovery was release-driven rather than structural.
              </p>
            </Finding>
            <Finding index={2} title="Cash generation, which turned around sharply">
              <p>
                Operating cash flow went from −$45m in FY2025 to $624m in FY2026. Cash is harder
                to flatter with accounting choices than profit is, so it is the better check on
                whether the recovery is real.
              </p>
            </Finding>
            <Finding index={3} title="The remaining goodwill">
              <p>
                About $1.1bn is still on the balance sheet. After two large write-downs, whether
                that survives is a reasonable question.
              </p>
            </Finding>
          </ol>
        </CaseSection>

        <CaseSection number="06" title="Limitations">
          <Copy>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-accent-soft">
              <li>
                <strong className="font-medium text-ink">No segment detail.</strong> The filings
                break revenue down further; I did not extract it, so I cannot say which part of
                the business drove the recovery.
              </li>
              <li>
                <strong className="font-medium text-ink">Five years, one company.</strong> No
                peer comparison, so nothing here separates Take-Two from the games sector.
              </li>
              <li>
                <strong className="font-medium text-ink">Nothing here explains demand.</strong>{" "}
                Financial statements record outcomes. I have used no source other than the
                filings — no management commentary, no sales data, no release schedule.
              </li>
              <li>
                <strong className="font-medium text-ink">Adding back impairments is a
                judgement.</strong> It is standard practice, but it is still a choice, and both
                figures are shown side by side for that reason.
              </li>
              <li>
                <strong className="font-medium text-ink">No valuation and no view on the
                shares.</strong> This describes performance; it says nothing about whether the
                company is worth buying.
              </li>
            </ul>
          </Copy>
        </CaseSection>

        <div className="border-t border-line pt-10">
          <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-body">
            Built independently, outside university, using free public filings and Excel.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href={project.source.url!} variant="secondary" external>
              Take-Two filings on SEC EDGAR
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
