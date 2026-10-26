import { site } from "./site";

export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  question: string;
  summary: string;
  tools: string[];
  dataset: { name: string; url: string; note: string };
  period: string;
  repo: string;
  /** Three figures for the project card. */
  highlights: { value: string; label: string }[];
};

export const projects: Project[] = [
  {
    slug: "ecommerce-sales",
    title: "E-commerce Sales Analysis",
    shortTitle: "E-commerce sales",
    question:
      "Where does this online retailer's revenue actually come from, and how did it " +
      "change over two years?",
    summary:
      "I used SQL to work through two years of transactions from a UK online gift " +
      "retailer — about a million rows — to find out which products, customers and " +
      "markets the revenue really comes from. The headline answer was not the one the " +
      "totals suggest: revenue grew, but only because orders got bigger.",
    tools: ["SQL (SQLite)", "Excel", "Python (pandas)"],
    dataset: {
      name: "Online Retail II, UCI Machine Learning Repository",
      url: "https://archive.ics.uci.edu/dataset/502/online+retail+ii",
      note: "1,067,371 transaction lines, Dec 2009 – Dec 2011, CC BY 4.0",
    },
    period: "December 2009 – December 2011",
    repo: site.repos.ecommerce,
    highlights: [
      { value: "£19.1m", label: "Revenue analysed" },
      { value: "+2.2%", label: "Year-on-year revenue, with orders down 3.8%" },
      { value: "67.7%", label: "Of revenue from 16.4% of customers" },
    ],
  },
  {
    slug: "financial-performance",
    title: "Financial Performance Analysis — NIKE, Inc.",
    shortTitle: "Financial performance",
    question:
      "NIKE's revenue peaked in FY2024 and has fallen since. How much of the drop in " +
      "profit is lower sales, and how much is margins and costs?",
    summary:
      "I pulled seven years of NIKE's filed accounts straight from the SEC's XBRL API, " +
      "built a live Excel model from them, and split the fall in operating profit into " +
      "the three things that caused it. The answer is mostly revenue — but not entirely.",
    tools: ["Excel", "Python (pandas)", "SEC XBRL API"],
    dataset: {
      name: "NIKE 10-K filings via the SEC XBRL company facts API",
      url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000320187&type=10-K",
      note: "FY2020 – FY2026 as reported, free and public",
    },
    period: "FY2020 – FY2026 (year ends 31 May)",
    repo: site.repos.financial,
    highlights: [
      { value: "−9.7%", label: "Revenue since the FY2024 peak" },
      { value: "−39.8%", label: "Operating income over the same period" },
      { value: "88%", label: "Of the profit fall explained by lower revenue" },
    ],
  },
  {
    slug: "customer-retention",
    title: "Customer Behaviour and Retention Analysis",
    shortTitle: "Customer retention",
    question:
      "Of the customers this retailer acquired, how many came back, how fast did " +
      "activity fall away, and what is an acquired customer worth?",
    summary:
      "A cohort analysis of 23,570 customers tracked from their first ever purchase for " +
      "up to 18 months. It answers a question most sales reports cannot: how much of a " +
      "customer's value arrives after the first order.",
    tools: ["SQL (SQLite)", "Python (pandas, matplotlib)"],
    dataset: {
      name: "CDNOW master dataset, published by Bruce Hardie",
      url: "https://www.brucehardie.com/datasets/",
      note: "69,659 transactions, 23,570 customers, Jan 1997 – Jun 1998",
    },
    period: "January 1997 – June 1998",
    repo: site.repos.retention,
    highlights: [
      { value: "51.1%", label: "Of customers never placed a second order" },
      { value: "$102.74", label: "Value of an acquired customer over 15 months" },
      { value: "37.1%", label: "Of that value came from the first order" },
    ],
  },
];

export function getProject(slug: string): Project {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error("Unknown project: " + slug);
  return project;
}
