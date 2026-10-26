export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  question: string;
  summary: string;
  tools: string[];
  /** Where the work came from — a university seminar, or built independently. */
  context: string;
  /** Named co-authors, shown on the card and the case study page. */
  coAuthors?: string[];
  source: { name: string; url?: string; note: string };
  period: string;
  highlights: { value: string; label: string }[];
};

export const projects: Project[] = [
  {
    slug: "minimum-wage",
    title: "Minimum Wage and County Labour Markets",
    shortTitle: "Minimum wage",
    question:
      "Is a higher minimum wage associated with a smaller labour force or more " +
      "unemployment across US counties?",
    summary:
      "A policy paper for the School of Economics at Reichman University, using a panel of " +
      "3,075 US counties over ten years. The answer turned out to be no — and reporting a " +
      "null result honestly, rather than hunting for a specification that produced one, is " +
      "most of what the paper is about.",
    tools: ["Panel data", "Fixed effects regression", "R", "Excel"],
    context: "University seminar — Policy Paper, School of Economics, Reichman University, June 2026",
    coAuthors: ["Tomer Davitasvili"],
    source: {
      name: "BLS, US Department of Labor, Census Bureau, County Business Patterns",
      note: "29,076 county-year observations, 3,075 counties, all 50 states, 2010–2019",
    },
    period: "2010–2019",
    highlights: [
      { value: "29,076", label: "County-year observations across 3,075 counties" },
      { value: "0.023", label: "Minimum wage elasticity — not statistically significant" },
      { value: "5 of 5", label: "Specifications agreeing there is no detectable effect" },
    ],
  },
  {
    slug: "geopolitical-risk",
    title: "Geopolitical Risk and Stock Market Returns",
    shortTitle: "Geopolitical risk",
    question:
      "Does a country's geopolitical risk in one year predict its stock market return the " +
      "next, and is it the same in emerging and developed markets?",
    summary:
      "A finance seminar paper covering 35 countries over three decades. Geopolitical risk " +
      "does not predict a country's own return — but the relationship runs in opposite " +
      "directions in emerging and developed markets, and that difference survives every " +
      "robustness check we threw at it.",
    tools: ["Panel data", "Fixed effects regression", "R", "Excel"],
    context: "University seminar — Seminar in Finance, Arison School of Business, Reichman University, July 2026",
    coAuthors: ["Estherlola Wajsman"],
    source: {
      name: "Geopolitical Risk Index (Caldara and Iacoviello, 2022), country index returns, World Bank macro data",
      url: "https://www.matteoiacoviello.com/gpr.htm",
      note: "873 country-year observations, 35 countries, 1991–2021",
    },
    period: "1991–2021",
    highlights: [
      { value: "35", label: "Countries tracked over three decades" },
      { value: "0.078", label: "Emerging-market interaction, significant at 1%" },
      { value: "36", label: "Robustness regressions run on the main result" },
    ],
  },
  {
    slug: "take-two",
    title: "Take-Two Interactive — Financial Performance",
    shortTitle: "Take-Two",
    question:
      "Take-Two's revenue grew about 90% in four years while it reported $9.6bn of losses. " +
      "How does a company do both at once?",
    summary:
      "An independent analysis of the company behind Rockstar Games, built in Excel from its " +
      "filed accounts. Separating one accounting charge from the trading result turns a " +
      "confusing set of headlines into a straightforward story.",
    tools: ["Excel", "Financial statement analysis", "SEC filings"],
    context: "Built independently, outside university",
    source: {
      name: "Take-Two 10-K filings via the SEC XBRL company facts API",
      url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000946581&type=10-K",
      note: "FY2022–FY2026 as reported, free and public",
    },
    period: "FY2022–FY2026 (year ends 31 March)",
    highlights: [
      { value: "+90%", label: "Revenue growth over the period" },
      { value: "$9.6bn", label: "Cumulative losses reported" },
      { value: "61%", label: "Of those losses were goodwill write-downs" },
    ],
  },
];

export function getProject(slug: string): Project {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error("Unknown project: " + slug);
  return project;
}
