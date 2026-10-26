# Portfolio website — Fergus James Barrie

A small Next.js site showing three data analysis projects. Built with Next.js (App Router),
TypeScript, Tailwind CSS v4 and Recharts, and deployed on Vercel.

Everything is statically generated — there is no database, no API and no server-side
rendering at request time. Each project's figures live in a JSON file exported by that
project's own analysis scripts, so the site and the repositories can never disagree.

---

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npx eslint src  # lint
```

Node 18.18 or newer.

## Before you deploy — fill in your details

Everything personal lives in **one file**: [`src/config/site.ts`](src/config/site.ts).
It currently contains placeholders, each marked with a `PLACEHOLDER` comment:

| Field | What to put there |
|---|---|
| `url` | The deployed URL. Used for metadata and the sitemap. |
| `contact.email` | The address you want on a public page. |
| `contact.phone` | Optional — leave as `""` to hide it. |
| `contact.linkedin` | Your LinkedIn profile URL. |
| `contact.github` | Your GitHub profile URL. |
| `contact.cv` | Put the PDF at `public/cv.pdf`, or link elsewhere. `""` hides the link. |
| `repos.*` | The three project repositories. |
| `education[].period` | Your actual graduation year. |

**Setting any contact field to an empty string removes it from the site** rather than
showing a placeholder — so nothing fake is ever published.

Two other things to do before going live:

1. Delete the setup note at the bottom of [`src/app/contact/page.tsx`](src/app/contact/page.tsx).
2. Add `public/cv.pdf`, or set `contact.cv` to `""`.

## Deploying to Vercel

The project is a standard Next.js app, so Vercel needs no configuration.

1. Push this directory to its own GitHub repository.
2. At [vercel.com/new](https://vercel.com/new), import that repository.
3. Vercel detects Next.js automatically — framework preset **Next.js**, build command
   `next build`, output handled for you. Leave everything at its default.
4. Deploy. There are no environment variables to set.

If this directory sits inside a larger repository, set **Root Directory** to `website` in
the Vercel project settings.

After the first deploy, put the real URL into `site.url` and push again, so the metadata
and sitemap point at the right place.

## How the data gets here

Each analysis project writes a `website_data.json` as the last step of its pipeline. Those
files are copied into `src/data/`:

```bash
cp ../projects/01-ecommerce-sales-analysis/outputs/website_data.json src/data/ecommerce-sales.json
cp ../projects/02-nike-financial-analysis/outputs/website_data.json  src/data/financial-performance.json
cp ../projects/03-customer-retention-analysis/outputs/website_data.json src/data/customer-retention.json
```

The charts for the retention project are also pre-rendered as PNGs in `public/charts/`,
copied from that project's `outputs/charts/`.

To update any figure on the site, re-run the analysis and copy the JSON across. Nothing is
typed into the pages by hand — the page components read the JSON and format it.

## Layout

```
src/
  app/
    page.tsx                      home
    projects/page.tsx             project index
    projects/[project]/page.tsx   three case studies, one directory each
    about/page.tsx
    contact/page.tsx
    layout.tsx, globals.css       shell and design tokens
    sitemap.ts, robots.ts
  components/
    Nav.tsx, Footer.tsx
    ui.tsx                        Container, Section, Stat, DataTable, Note, ChartFrame…
    ProjectCard.tsx, ProjectLayout.tsx
    charts/
      theme.ts                    shared chart colours and axis styling
      EcommerceCharts.tsx
      FinancialCharts.tsx
      RetentionCharts.tsx
  config/
    site.ts                       all personal details and placeholders
    projects.ts                   project metadata
  data/                           JSON exported by the analysis projects
  lib/format.ts                   currency, percentage and date formatting
```

## Design notes

- Design tokens (colour, type) are defined once in `globals.css` under Tailwind v4's
  `@theme`. There is no `tailwind.config.js`.
- Two typefaces: Source Serif 4 for headings, Inter for everything else, both loaded
  through `next/font` so there is no layout shift.
- Charts share one palette and one axis style via `components/charts/theme.ts`, so they
  read as a set rather than a collection.
- Only three components are client components — the three chart files. Everything else is
  a server component, which is why every route builds as static HTML.
- The cohort heatmap is a real HTML `<table>` rather than a rendered chart, which is both
  more readable and accessible to a screen reader.

## Accessibility

Skip link, visible keyboard focus, `aria-pressed` on the chart toggles, real table markup
with `<th scope>`, and `prefers-reduced-motion` respected. Charts are decorative on top of
figures that are also available as tables or in the linked repositories.
