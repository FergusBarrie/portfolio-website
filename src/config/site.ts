/**
 * Site configuration.
 *
 * Everything personal lives here so it can be changed in one place.
 *
 * Anything still to be filled in carries a trailing comment saying so. Setting
 * a contact field to an empty string removes it from the site entirely rather
 * than publishing something half-finished.
 */

export const site = {
  name: "Fergus James Barrie",
  shortName: "Fergus Barrie",
  role: "Economics & Business Graduate",
  tagline: "Aspiring Data & Financial Analyst",
  location: "Israel",

  // Used for metadata and the sitemap. Change after the first deploy.
  url: "https://fergusbarrie.vercel.app", // PLACEHOLDER

  intro:
    "I graduated from Reichman University with a double major in Business Administration " +
    "and Economics. Since then I have been teaching myself the practical side of data " +
    "analysis — SQL, Excel modelling and Python — by working through real public datasets " +
    "end to end rather than following tutorials. The three projects here are the result.",

  contact: {
    // PLACEHOLDER — replace with the address you want on a public site.
    email: "your.email@example.com",
    // Deliberately hidden. Add a number here if you want one on the site.
    phone: "",
    linkedin: "https://www.linkedin.com/in/fergusbarrie/",
    github: "https://github.com/FergusBarrie",
    // Empty by default so the site ships with no broken links. Put your CV at
    // website/public/cv.pdf and set this to "/cv.pdf", or link to it elsewhere.
    cv: "", // PLACEHOLDER
  },

  // GitHub repository for each project. These names must match the
  // repositories you create — see the push commands in the root README.
  repos: {
    ecommerce: "https://github.com/FergusBarrie/ecommerce-sales-analysis",
    financial: "https://github.com/FergusBarrie/nike-financial-analysis",
    retention: "https://github.com/FergusBarrie/customer-retention-analysis",
  },

  education: [
    {
      institution: "Reichman University",
      place: "Herzliya, Israel",
      qualification: "BA, double major in Business Administration and Economics",
      period: "Graduated 2026",
      detail:
        "Coursework included statistics, econometrics, applied economics, business data " +
        "analysis, financial risk management and programming in R.",
    },
  ],

  /**
   * Skills, with an honest level for each one.
   *
   * The levels are deliberately conservative. "Comfortable" means I can use it
   * without help on the kind of work shown in these projects. "Learning" means
   * I have used it for real but still look things up regularly.
   */
  skills: [
    {
      group: "Data & analysis",
      items: [
        { name: "SQL (SQLite, joins, CTEs, window functions)", level: "Comfortable" },
        { name: "Excel (formulas, pivot tables, charts, simple models)", level: "Comfortable" },
        { name: "Data cleaning and preparation", level: "Comfortable" },
        { name: "Exploratory analysis and descriptive statistics", level: "Comfortable" },
        { name: "Python (pandas, matplotlib)", level: "Learning" },
        { name: "R", level: "Learning — used during my degree" },
        { name: "Power BI", level: "Learning" },
      ],
    },
    {
      group: "Finance & economics",
      items: [
        { name: "Financial statement analysis", level: "Comfortable" },
        { name: "Ratio analysis and margin bridges", level: "Comfortable" },
        { name: "Scenario forecasting with stated assumptions", level: "Comfortable" },
        { name: "Econometrics", level: "Studied at university" },
        { name: "Financial risk management", level: "Studied at university" },
      ],
    },
    {
      group: "Working practice",
      items: [
        { name: "Reproducible analysis (scripts, not manual steps)", level: "Comfortable" },
        { name: "Documenting assumptions and limitations", level: "Comfortable" },
        { name: "Git and GitHub", level: "Learning" },
      ],
    },
  ],
};

export type Site = typeof site;
