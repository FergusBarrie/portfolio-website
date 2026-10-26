import type { Metadata } from "next";
import {
  CategoryChart,
  ConcentrationChart,
  CountryAovChart,
  MonthlyRevenueChart,
} from "@/components/charts/EcommerceCharts";
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
import data from "@/data/ecommerce-sales.json";
import { compactGbp, gbp, num, pct, signedPct } from "@/lib/format";

const project = getProject("ecommerce-sales");
const h = data.headline;
const y = h.yoy;

export const metadata: Metadata = {
  title: project.title,
  description: project.question,
};

export default function Page() {
  const topProducts = data.top_products.slice(0, 8);
  const countries = data.countries.slice(0, 6);

  return (
    <>
      <ProjectHeader project={project} />

      <Container className="mt-14 space-y-14 pb-6">
        {/* -------------------------------------------------- at a glance */}
        <CaseSection number="01" title="At a glance">
          <StatGrid>
            <Stat value={compactGbp(h.total_revenue)} label="Revenue over two years" />
            <Stat value={num(h.orders)} label="Orders" />
            <Stat
              value={gbp(h.avg_order_value, 2)}
              label="Average order value"
              note={`Median ${gbp(h.median_order_value, 2)} — a few very large orders pull the mean up`}
            />
            <Stat
              value={num(h.identified_customers)}
              label="Identified customers"
              note={`Across ${h.countries} countries and ${num(h.products)} products`}
            />
          </StatGrid>
        </CaseSection>

        {/* ------------------------------------------------------ dataset */}
        <CaseSection number="02" title="The dataset, and what I had to fix">
          <Copy>
            <p>
              Online Retail II is a real transaction log from a UK online gift retailer
              that sells mostly to small businesses. Each row is one product line on one
              invoice, not one order — an order containing eight products is eight rows
              sharing an invoice number. That single fact determines how every metric on
              this page is calculated.
            </p>
            <p>
              The raw file has 1,067,371 lines; {num(h.transaction_lines)} survived
              cleaning. I logged the row count for every step, so each number on this page
              can be traced back to a decision:
            </p>
          </Copy>

          <div className="mt-7 max-w-3xl">
            <DataTable
              columns={["Step", "Rows", "Why"]}
              align={["left", "right", "left"]}
              rows={[
                ["Exact duplicates removed", "34,335", "Identical invoice, product, quantity, price and timestamp"],
                ["Credit notes separated", "19,104", "Invoices starting with C; kept in their own table"],
                ["Bad-debt adjustments removed", "6", "Invoices starting with A"],
                ["Quantity ≤ 0 or price ≤ 0 removed", "9,407", "Cannot be a sale"],
                ["Postage, fees, manual adjustments removed", "4,555", "Real money, but not products"],
                ["Cancelled sales removed", "5,990", "Matched back to the credit note that reversed them"],
              ]}
            />
          </div>

          <div className="mt-7 max-w-2xl">
            <Note title="The step I nearly missed" tone="warn">
              <p>
                Separating out the credit notes but keeping the original sale leaves
                cancelled orders counted as revenue. I only noticed because the
                top-products list contained an item with 80,995 units sold in a single
                order — far out of line with everything else. It had been credited back in
                full two days later, as had the second-largest sale.
              </p>
              <p>
                Matching credit notes back to the exact sale they reverse reduced revenue
                from £19.64m to {compactGbp(h.total_revenue)}, a 2.8% correction, and
                removed both items from the best-sellers list.
              </p>
            </Note>
          </div>

          <div className="mt-6 max-w-2xl">
            <Note title="A decision, not a cleaning step">
              <p>
                22.7% of lines have no customer ID. I kept them — the money was still
                taken, so they belong in revenue — but excluded them from everything
                measured per customer. They are not one anonymous customer; they are
                unknown. Revenue figures here cover 100% of the clean data, customer
                figures about 77%.
              </p>
            </Note>
          </div>
        </CaseSection>

        {/* --------------------------------------------------- the trend */}
        <CaseSection number="03" title="Growth came from bigger orders, not more of them">
          <Copy>
            <p>
              The data covers two complete 12-month windows. I compare those rather than
              calendar years, because December 2011 is only nine days long and December is
              a major trading month — a calendar comparison would invent a collapse that
              did not happen.
            </p>
          </Copy>

          <div className="mt-7 max-w-2xl">
            <DataTable
              columns={["", "Dec 09 – Nov 10", "Dec 10 – Nov 11", "Change"]}
              rows={[
                ["Revenue", gbp(y.year1_revenue), gbp(y.year2_revenue), signedPct(y.revenue_change_pct)],
                ["Orders", num(y.year1_orders), num(y.year2_orders), signedPct(y.orders_change_pct)],
                ["Units", "5,455,072", "5,111,759", signedPct(y.units_change_pct)],
                ["Average order value", gbp(y.year1_aov, 2), gbp(y.year2_aov, 2), signedPct(y.aov_change_pct)],
              ]}
            />
          </div>

          <Copy>
            <p className="mt-6">
              Revenue is up {signedPct(y.revenue_change_pct)}, but the business handled
              fewer orders and shipped fewer items. All of the growth came from a{" "}
              {signedPct(y.aov_change_pct)} rise in average order value.
            </p>
            <p>
              I cannot tell from this data <em>why</em> order value rose. Higher prices and
              a shift towards larger wholesale buyers would both look like this, and
              separating them needs a price list over time that the dataset does not
              include. Saying so is more useful than guessing.
            </p>
          </Copy>

          <div className="mt-8">
            <ChartFrame
              title="Monthly revenue and average order value"
              question="Is the business growing, and how seasonal is it? The lighter final bar is the nine-day December 2011, excluded from every growth figure."
              source="Source: Online Retail II. Calculated by sql/02_monthly_sales_trend.sql."
            >
              <MonthlyRevenueChart />
            </ChartFrame>
          </div>

          <Copy>
            <p className="mt-6">
              September to November alone produced {pct(h.autumn_share_of_revenue_pct)} of
              all revenue. The best month ({h.peak_month}, {compactGbp(h.peak_month_revenue)})
              was {h.peak_to_trough_ratio}× the worst ({h.trough_month},{" "}
              {compactGbp(h.trough_month_revenue)}). Note the drop in December itself: this
              retailer&apos;s peak is when its customers stock up for Christmas, not when
              consumers shop.
            </p>
          </Copy>
        </CaseSection>

        {/* ------------------------------------------------ where revenue */}
        <CaseSection number="04" title="Where the revenue comes from">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartFrame
              title="Revenue by product category"
              question="Which ranges carry the business?"
              source="My own keyword grouping — see the caveat below."
            >
              <CategoryChart />
            </ChartFrame>

            <ChartFrame
              title="Average order value by market"
              question="Are export customers different from UK customers? This is where the wholesale pattern shows up."
              source="Source: sql/05_sales_by_country.sql."
            >
              <CountryAovChart />
            </ChartFrame>
          </div>

          <div className="mt-6 max-w-2xl">
            <Note title="About those categories">
              <p>
                The dataset has no category column. These groups come from keywords in the
                product description, built with a <code className="text-[0.8125rem]">CASE WHEN</code>{" "}
                in SQL. About 19% of revenue matches no keyword and sits in “Other”, so
                treat this as a useful summary rather than an exact category report. The
                fix is a product master file, not more keywords.
              </p>
            </Note>
          </div>

          <Copy>
            <p className="mt-8">
              The country chart hides something the revenue totals do not show. Export
              orders are far larger than UK ones — but the big export “markets” are
              really one or two accounts each:
            </p>
          </Copy>

          <div className="mt-6">
            <DataTable
              columns={["Market", "Revenue", "Share", "Avg order", "Customers"]}
              rows={countries.map((c) => [
                c.country,
                gbp(c.revenue),
                pct(c.share_of_revenue_pct),
                gbp(c.avg_order_value, 2),
                num(c.customers),
              ])}
              caption="The Netherlands has 22 customers on paper, but one of them is 95.8% of its revenue. Ireland's three customers include two that are 92% of its revenue between them. Germany and France, with over 90 customers each, look like genuine markets."
            />
          </div>

          <Copy>
            <p className="mt-8">
              Products tell the opposite story. No single product carries the business:
              the top ten together are only {pct(h.top10_products_share_pct)} of revenue,
              across {num(h.products)} products.
            </p>
          </Copy>

          <div className="mt-6">
            <DataTable
              columns={["Product", "Units", "Revenue", "Share"]}
              rows={topProducts.map((p) => [
                p.description,
                num(p.units_sold),
                gbp(p.revenue),
                pct(p.share_of_total_pct, 2),
              ])}
              caption="Ranked by revenue rather than units: the cheapest items sell in huge volumes without contributing much money."
            />
          </div>
        </CaseSection>

        {/* ------------------------------------------------- the customers */}
        <CaseSection number="05" title="A small group of repeat buyers carries the business">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ChartFrame
                title="Share of customers against share of revenue"
                question="How concentrated is revenue? The gap between the two bars is the finding."
                source="Identified customers only — about 77% of revenue. Source: sql/06_customer_purchase_patterns.sql."
              >
                <ConcentrationChart />
              </ChartFrame>
            </div>
            <div className="lg:col-span-2">
              <DataTable
                columns={["Orders", "Customers", "% of revenue"]}
                rows={data.customer_bands.map((b) => [
                  b.order_band,
                  num(b.customers),
                  pct(b.pct_of_revenue),
                ])}
              />
              <div className="mt-5">
                <DataTable
                  columns={["Order value", "% of orders", "% of revenue"]}
                  rows={data.order_value_bands.map((b) => [
                    b.order_value_band.replace(/^[a-f]\. /, "").replace("GBP ", "£"),
                    pct(b.pct_of_orders),
                    pct(b.pct_of_revenue),
                  ])}
                  caption="The top 2.9% of orders produce more revenue than the bottom 61.5% combined."
                />
              </div>
            </div>
          </div>

          <Copy>
            <p className="mt-8">
              In a typical month, around {pct(h.typical_returning_revenue_share_pct)} of
              revenue came from customers who had bought before. The first few months of
              the data show less, but that is an artifact: customers whose first-ever
              purchase predates December 2009 look like new customers, because the data
              does not go back far enough to know otherwise.
            </p>
          </Copy>
        </CaseSection>

        {/* --------------------------------------------------- the findings */}
        <CaseSection number="06" title="What I found">
          <ol className="max-w-2xl space-y-8">
            <Finding index={1} title="Revenue grew 2.2%, but only because orders got bigger">
              <p>
                Orders fell 3.8% and units fell 6.3% while average order value rose 6.2%.
                The business served fewer orders and sold fewer items, and still took
                slightly more money.
              </p>
            </Finding>
            <Finding index={2} title="Trading is heavily seasonal">
              <p>
                September to November produced {pct(h.autumn_share_of_revenue_pct)} of
                revenue — a third of the year&apos;s money in a quarter of its months. The
                pattern repeated in both years, so it is seasonality rather than a one-off.
              </p>
            </Finding>
            <Finding index={3} title="A sixth of customers produce two thirds of revenue">
              <p>
                Of identified customers, the 16.4% who placed ten or more orders generated
                67.7% of revenue. The 27.6% who ordered once generated 3.3%.
              </p>
            </Finding>
            <Finding index={4} title="The export markets are individual accounts, not markets">
              <p>
                The Netherlands is the third-largest market at £547k, but 95.8% of that is
                one customer ID. Ireland is £606k, with 92% from two customers. Country
                reporting hides this completely.
              </p>
            </Finding>
            <Finding index={5} title="Revenue leans on a small number of large orders">
              <p>
                The 2.9% of orders worth more than £2,000 produced 27.6% of revenue. That
                is why the mean order ({gbp(h.avg_order_value, 2)}) sits well above the
                median ({gbp(h.median_order_value, 2)}).
              </p>
            </Finding>
          </ol>
        </CaseSection>

        {/* ---------------------------------------------- recommendations */}
        <CaseSection number="07" title="What I would suggest doing about it">
          <ol className="max-w-2xl space-y-8">
            <Finding index={1} title="Treat the top accounts as a commercial risk">
              <p>
                Losing the single Dutch customer would remove about 2.7% of total revenue
                on its own; the two Irish accounts are another 2.9%. The practical step is
                named account management, and reporting revenue by account alongside
                revenue by country.
              </p>
            </Finding>
            <Finding index={2} title="Plan stock and cash around the autumn peak, not the average">
              <p>
                November trades at roughly 2.9 times February. Buying and warehouse
                staffing based on an average month means running short in the peak and
                holding too much in spring.
              </p>
            </Finding>
            <Finding index={3} title="Try to get a second order out of one-time customers">
              <p>
                They are 27.6% of identified customers and 3.3% of revenue. I have
                deliberately not put a value on this: the dataset contains no marketing
                costs or channel information, so any figure would be invented. What the
                data does support is which group is largest and what it is currently
                worth.
              </p>
            </Finding>
          </ol>
        </CaseSection>

        {/* -------------------------------------------------- limitations */}
        <CaseSection number="08" title="Limitations">
          <Copy>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-accent-soft">
              <li>
                <strong className="font-medium text-ink">Revenue only, no costs.</strong>{" "}
                Nothing here speaks to profitability. A high-revenue product could be
                unprofitable.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  Customer figures cover 77% of revenue
                </strong>{" "}
                because 22.7% of lines have no customer ID.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  The categories are my own keyword grouping
                </strong>{" "}
                and leave 19% of revenue in “Other”.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  £916k of credit notes could not be matched
                </strong>{" "}
                to a specific sale, so revenue is still slightly overstated.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  There are 30 Saturday orders in two years
                </strong>
                , against 8,120 on an average Thursday — a gap in the data rather than a
                shopping pattern.
              </li>
              <li>
                <strong className="font-medium text-ink">No marketing or channel data</strong>
                , so nothing here explains <em>why</em> anything changed.
              </li>
              <li>
                <strong className="font-medium text-ink">The data is from 2009–2011.</strong>{" "}
                The patterns are real but not current, and one retailer in one sector
                generalises to nothing.
              </li>
            </ul>
          </Copy>
        </CaseSection>

        <div className="border-t border-line pt-10">
          <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-body">
            The repository has the twelve SQL queries, the cleaning script with its full
            log, the Excel dashboard, and a learning guide that explains every query and
            every figure on this page.
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
