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
  // name is used for headings and page titles, shortName for the nav and footer.
  name: "Fergus Barrie",
  shortName: "Fergus Barrie",
  role: "Economics & Business Graduate",
  tagline: "Aspiring Data & Financial Analyst",
  location: "Israel",

  // Used for page metadata, Open Graph tags and the sitemap. If you rename the
  // project in Vercel or add a custom domain, change this to match.
  url: "https://fergus-barrie.vercel.app",

  intro:
    "I graduated from Reichman University with a double major in Business Administration " +
    "and Economics. My degree covered statistics, econometrics and R, and I put them to work " +
    "in two seminar research projects built on real panel data — one on minimum wages across " +
    "US counties, one on geopolitical risk and stock returns. I am now building on that with " +
    "Excel modelling and company financial analysis.",

  contact: {
    email: "contactfergusbarrie@gmail.com",
    // Deliberately hidden. Add a number here if you want one on the site.
    phone: "",
    linkedin: "https://www.linkedin.com/in/fergusbarrie/",
    github: "https://github.com/FergusBarrie",
    // Empty by default so the site ships with no broken links. Put your CV at
    // website/public/cv.pdf and set this to "/cv.pdf", or link to it elsewhere.
    cv: "", // PLACEHOLDER
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
        { name: "Excel (formulas, pivot tables, charts)", level: "Comfortable" },
        { name: "Descriptive statistics", level: "Comfortable" },
        { name: "Panel data and regression analysis", level: "Applied in my seminar research" },
        { name: "Data cleaning and preparation", level: "Applied in my seminar research" },
        { name: "R", level: "Used for my seminar research — still building fluency" },
        { name: "Power BI", level: "Starting to learn" },
      ],
    },
    {
      group: "Finance & economics",
      items: [
        { name: "Econometrics", level: "Studied, and applied in two seminar papers" },
        { name: "Applied economics", level: "Studied at university" },
        { name: "Financial statement analysis", level: "Studied at university" },
        { name: "Financial risk management", level: "Studied at university" },
      ],
    },
    {
      group: "Working practice",
      items: [
        { name: "Research design and academic writing", level: "Comfortable" },
        { name: "Documenting assumptions and limitations", level: "Comfortable" },
        { name: "Working on joint research projects", level: "Comfortable" },
        { name: "Git and GitHub", level: "Starting to learn" },
      ],
    },
  ],
};

export type Site = typeof site;
