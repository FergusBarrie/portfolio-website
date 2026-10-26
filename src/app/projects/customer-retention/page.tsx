import type { Metadata } from "next";
import {
  CohortExplorer,
  CohortHeatmap,
  FrequencyChart,
  OrderDropoffChart,
  TimeToSecondOrderChart,
} from "@/components/charts/RetentionCharts";
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
import data from "@/data/customer-retention.json";
import { num, pct, usd } from "@/lib/format";

const project = getProject("customer-retention");
const h = data.headline;

export const metadata: Metadata = {
  title: "Customer Behaviour and Retention Analysis",
  description: project.question,
};

export default function Page() {
  return (
    <>
      <ProjectHeader project={project} />

      <Container className="mt-14 space-y-14 pb-6">
        {/* -------------------------------------------------- at a glance */}
        <CaseSection number="01" title="At a glance">
          <StatGrid>
            <Stat
              value={num(h.customers)}
              label="Customers tracked from their first ever purchase"
              note={`${num(h.orders)} orders over 18 months`}
            />
            <Stat
              value={pct(h.one_time_buyer_pct)}
              label="Never placed a second order"
              note={`They are ${pct(h.one_time_buyer_revenue_pct)} of revenue`}
            />
            <Stat
              value={usd(h.value_per_acquired_customer_15m, 2)}
              label="Value of an acquired customer over 15 months"
              note="Including everyone who never came back"
            />
            <Stat
              value={pct(h.top_decile_revenue_pct)}
              label="Of revenue from the top-spending 10%"
              note={`Averaging ${usd(h.top_decile_avg_spend, 2)} each`}
            />
          </StatGrid>
        </CaseSection>

        {/* ----------------------------------------------------- dataset */}
        <CaseSection number="02" title="Why this dataset, and the first decision">
          <Copy>
            <p>
              CDNOW was an online CD retailer. This file is the complete purchase history,
              to 30 June 1998, of the {num(h.customers)} people who made their{" "}
              <strong className="font-medium text-ink">first ever</strong> purchase there
              during the first quarter of 1997.
            </p>
            <p>
              That shape is the reason to use it. In most transaction datasets you cannot
              tell whether a customer appearing in month one is new or has been buying for
              years, so “months since first purchase” is guesswork. Here every
              customer&apos;s first purchase is inside the file, which means retention is{" "}
              <strong className="font-medium text-ink">measured, not estimated</strong>.
            </p>
            <p>
              It is old data, and I say so plainly: I chose it because it is the right
              shape for doing cohort analysis properly, not because it describes today&apos;s
              market. The method transfers; the percentages are not benchmarks.
            </p>
          </Copy>

          <div className="mt-7 max-w-2xl">
            <Note title="A row is not an order">
              <p>
                The raw file has 69,659 transaction <em>lines</em> but only{" "}
                {num(h.orders)} orders — 2.6% of customer-days have more than one line.
                Everything behavioural depends on getting this right: measured from lines,
                orders per customer is 2.96 and average order value $35.89; measured from
                orders, it is {h.avg_orders_per_customer} and {usd(h.avg_order_value, 2)}.
              </p>
              <p>
                The difference is small on this dataset. The habit is what matters —
                establish the grain of the table before calculating anything.
              </p>
            </Note>
          </div>
        </CaseSection>

        {/* ---------------------------------------------------- retention */}
        <CaseSection number="03" title="Retention falls off a cliff, then holds steady">
          <Copy>
            <p>
              Group customers by the month of their first order, then track each group
              forward. This separates “we are losing customers” from “we acquired fewer
              customers”, which a total revenue chart mixes together.
            </p>
          </Copy>

          <div className="mt-7">
            <ChartFrame
              title="Cohort explorer"
              question="Switch between retention and cumulative value, and toggle cohorts on and off."
              source="Source: sql/03_cohort_retention.sql and sql/09_cohort_cumulative_revenue.sql."
            >
              <CohortExplorer />
            </ChartFrame>
          </div>

          <Copy>
            <p className="mt-8">
              Two things come out of it. First, the drop is immediate: only about{" "}
              {pct(h.month1_retention_pct)} of a cohort bought again in the month after
              their first purchase. Second, and more interesting, the curve then{" "}
              <strong className="font-medium text-ink">flattens</strong>. From month six
              onwards it settles at around {pct(h.settled_retention_pct)} active in any
              given month and stays there, rather than continuing to decay.
            </p>
            <p>
              So this is not a business steadily bleeding customers. It is a business with
              a small, stable core of regulars and a large group who bought once and never
              returned.
            </p>
          </Copy>

          <div className="mt-8">
            <ChartFrame
              title="The cohort grid"
              question="Percentage of each cohort placing at least one order, by month since their first purchase."
            >
              <CohortHeatmap />
            </ChartFrame>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <Note title="The trap in every cohort table" tone="warn">
              <p>
                The data ends on 30 June 1998, so the January cohort can be observed for 17
                months, February&apos;s for 16 and March&apos;s for 15. Build the table
                without accounting for that and the newer cohorts show{" "}
                <em>zero</em> retention in their final months — when in fact those months
                were never observed.
              </p>
              <p>
                That mistake makes older cohorts look better than newer ones in every
                cohort analysis ever built, and leads to the wrong and expensive conclusion
                that newer customers are worse. Every comparison here is capped at month{" "}
                {h.comparable_months}, which all three cohorts have.
              </p>
            </Note>
            <Note title="What “retention” means here">
              <p>
                CDNOW is not a subscription, so nobody cancels. “Retention” means{" "}
                <em>placed an order that month</em> and nothing more. A customer inactive
                in month 7 and active in month 9 was quiet, not churned and returned.
              </p>
              <p>
                Nobody is ever marked as lost, which is part of why the curve flattens
                instead of falling to zero. Measuring churn properly would need a model,
                and that is beyond what this project does.
              </p>
            </Note>
          </div>

          <Copy>
            <p className="mt-8">
              One reassuring check: the three cohorts behave almost identically — repeat
              rates of {h.cohort_repeat_rate_range}, and revenue per customer within $6.27
              of each other over the first 15 months. A boring table, and an important one:
              it means the retention curve is a property of the business rather than an
              artifact of one month&apos;s intake.
            </p>
          </Copy>

          <div className="mt-6">
            <DataTable
              columns={["Cohort", "Customers", "Repeat rate", "Avg orders (15m)", "Avg revenue (15m)"]}
              rows={data.cohort_summary.map((c) => [
                c.cohort_month,
                num(c.cohort_customers),
                pct(c.repeat_buyer_pct),
                c.avg_orders_first_15_months.toFixed(2),
                usd(c.avg_revenue_first_15_months, 2),
              ])}
            />
          </div>
        </CaseSection>

        {/* -------------------------------------------------------- value */}
        <CaseSection number="04" title="The first order is about a third of what a customer is worth">
          <Copy>
            <p>
              Switch the explorer above to “Cumulative value” to see this. Across all three
              cohorts, an acquired customer was worth{" "}
              <strong className="font-medium text-ink">
                {usd(h.value_per_acquired_customer_15m, 2)}
              </strong>{" "}
              over 15 months, of which {usd(h.first_order_value, 2)} —{" "}
              {pct(h.first_order_share_of_15m_value_pct)} — came from the first order.
            </p>
            <p>
              The remaining {pct(100 - h.first_order_share_of_15m_value_pct)} depended
              entirely on the customer coming back. The denominator is the whole cohort,
              including everyone who never returned, which is what makes it the right
              figure to compare against an acquisition cost.
            </p>
            <p>
              The curve is close to linear after the first couple of months, adding roughly
              $3.50 to $4.50 per acquired customer per month with no sign of flattening
              inside 15 months.
            </p>
          </Copy>
        </CaseSection>

        {/* ---------------------------------------------------- behaviour */}
        <CaseSection number="05" title="Each order makes the next one more likely, and larger">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartFrame
              title="Drop-off and order value by order number"
              question="Does loyalty compound? Both lines move in the customer's favour."
              source="Source: sql/08_value_by_order_number.sql."
            >
              <OrderDropoffChart />
            </ChartFrame>
            <ChartFrame
              title="Orders placed: customers against revenue"
              question="Where does revenue actually sit?"
              source="Source: sql/02_purchase_frequency.sql."
            >
              <FrequencyChart />
            </ChartFrame>
          </div>

          <Copy>
            <p className="mt-8">
              The chance of stopping falls from {pct(h.dropoff_after_first_order_pct)} after
              the first order to {pct(h.dropoff_after_third_order_pct)} after the third and
              about 17% by the tenth, while average order value rises 30%, from{" "}
              {usd(h.aov_first_order, 2)} to {usd(h.aov_tenth_order, 2)}.
            </p>
          </Copy>

          <div className="mt-6 max-w-2xl">
            <Note title="One honest caveat">
              <p>
                Customers who reach a tenth order are the keenest buyers by definition, so
                part of the rise in order value is selection rather than customers genuinely
                spending more over time. This dataset cannot separate the two. The drop-off
                column is less affected and is the more reliable half of the finding.
              </p>
            </Note>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ChartFrame
                title="How long repeat buyers took to come back"
                question="When is a follow-up still timely?"
                source="Source: sql/06_time_to_second_order.sql."
              >
                <TimeToSecondOrderChart />
              </ChartFrame>
            </div>
            <div className="lg:col-span-2">
              <DataTable
                columns={["Segment", "% customers", "% revenue"]}
                rows={data.segments.map((s) => [
                  s.segment,
                  pct(s.pct_of_customers),
                  pct(s.pct_of_revenue),
                ])}
                caption={`${h.best_segment_customer_pct}% of customers produce ${h.best_segment_revenue_pct}% of revenue. The spend threshold is the median total spend of repeat buyers, calculated by the query rather than hard-coded.`}
              />
            </div>
          </div>

          <Copy>
            <p className="mt-8">
              {pct(h.second_order_within_3_months_pct)} of all second orders happened within
              three months, and {pct(h.second_order_within_1_month_pct)} within a single
              month. This is the most directly usable number in the project: a reactivation
              email at six months is mostly reaching people who have already gone.
            </p>
          </Copy>
        </CaseSection>

        {/* --------------------------------------------------- the findings */}
        <CaseSection number="06" title="What I found">
          <ol className="max-w-2xl space-y-8">
            <Finding index={1} title="Half the customers never came back, and they are a seventh of revenue">
              <p>
                {pct(h.one_time_buyer_pct)} of customers placed exactly one order, together
                producing {pct(h.one_time_buyer_revenue_pct)} of revenue.
              </p>
            </Finding>
            <Finding index={2} title="Retention drops hard in month one, then holds">
              <p>
                About {pct(h.month1_retention_pct)} of a cohort buys in the following
                month, settling at roughly {pct(h.settled_retention_pct)} from month six
                onwards — and staying there rather than decaying further.
              </p>
            </Finding>
            <Finding index={3} title="The three cohorts are near-identical">
              <p>
                Repeat rates of {h.cohort_repeat_rate_range}. The curve is a property of
                the business, not of one month&apos;s intake.
              </p>
            </Finding>
            <Finding index={4} title="The first order is only a third of a customer's value">
              <p>
                {usd(h.first_order_value, 2)} of {usd(h.value_per_acquired_customer_15m, 2)}{" "}
                over 15 months. The rest depends on them coming back.
              </p>
            </Finding>
            <Finding index={5} title="Revenue is very concentrated">
              <p>
                The top-spending 10% produced {pct(h.top_decile_revenue_pct)} of revenue,
                and the top 20% produced {pct(h.top_two_deciles_revenue_pct)}.
              </p>
            </Finding>
          </ol>
        </CaseSection>

        {/* ---------------------------------------------- recommendations */}
        <CaseSection number="07" title="What I would suggest doing about it">
          <ol className="max-w-2xl space-y-8">
            <Finding index={1} title="Concentrate on the second order, in the first month">
              <p>
                It is the single biggest break point —{" "}
                {pct(h.dropoff_after_first_order_pct)} of customers are lost there against{" "}
                {pct(h.dropoff_after_third_order_pct)} after a third order. And the timing
                is unambiguous: {pct(h.second_order_within_1_month_pct)} of second orders
                come within a month. A programme aimed at the first four to six weeks
                addresses the largest break point while it is still open.
              </p>
            </Finding>
            <Finding index={2} title="Judge acquisition on the 15-month figure, not the first order">
              <p>
                A channel that looks marginal against a {usd(h.first_order_value, 2)} first
                order may be comfortably worthwhile against{" "}
                {usd(h.value_per_acquired_customer_15m, 2)}. This analysis gives a
                defensible number to use in that comparison.
              </p>
            </Finding>
            <Finding index={3} title="Measure the top decile separately">
              <p>
                2,357 customers averaging {usd(h.top_decile_avg_spend, 2)} each produce half
                of all revenue. Whether that group is growing or shrinking is the most
                important thing about this business, and total revenue would hide it.
              </p>
            </Finding>
          </ol>

          <div className="mt-8 max-w-2xl">
            <Note title="Why there are no money figures above">
              <p>
                The dataset contains no acquisition costs, no marketing spend and no product
                margin, so any claim about return on investment would be invented. What the
                data supports is where the opportunity is and how large each group is — and
                that is what I have written.
              </p>
            </Note>
          </div>
        </CaseSection>

        {/* -------------------------------------------------- limitations */}
        <CaseSection number="08" title="Limitations">
          <Copy>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-accent-soft">
              <li>
                <strong className="font-medium text-ink">The data is from 1997–98.</strong>{" "}
                The method transfers; the percentages are not benchmarks for a modern
                business.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  Only customer, date, quantity and value.
                </strong>{" "}
                No product, channel, marketing or demographic data, so this describes{" "}
                <em>what</em> customers did and never <em>why</em>.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  No acquisition cost and no margin
                </strong>
                , so nothing here can be turned into a return on investment.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  Three cohorts, all from one quarter.
                </strong>{" "}
                No way to see seasonality or a trend in acquisition quality.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  Comparisons are capped at {h.comparable_months} months
                </strong>{" "}
                because the data ends in June 1998.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  “Retention” means ordering in a given month
                </strong>
                , not the opposite of cancelling. Customers are never marked as lost.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  Order-number figures are affected by survivorship.
                </strong>
              </li>
              <li>
                <strong className="font-medium text-ink">
                  255 duplicate rows (0.37%) were kept
                </strong>
                , worth 0.17% of revenue. No conclusion depends on the choice.
              </li>
            </ul>
          </Copy>
        </CaseSection>

        <div className="border-t border-line pt-10">
          <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-body">
            The repository has the ten SQL queries, the cleaning script, nine charts, and a
            learning guide that walks through how the cohort table is built — including a
            bug I had to fix in my own export code.
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
