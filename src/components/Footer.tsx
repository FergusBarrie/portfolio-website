import Link from "next/link";
import { site } from "@/config/site";

export function Footer() {
  const links = [
    site.contact.email && {
      label: "Email",
      href: `mailto:${site.contact.email}`,
    },
    site.contact.linkedin && { label: "LinkedIn", href: site.contact.linkedin },
    site.contact.github && { label: "GitHub", href: site.contact.github },
    site.contact.cv && { label: "CV", href: site.contact.cv },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="mt-24 border-t border-line/70 no-print">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-base text-ink">{site.name}</p>
            <p className="mt-1 text-sm text-muted">
              {site.role} · {site.tagline}
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted">
          Two of these projects are university research papers written with co-authors; the
          third was built independently. Each one lists its own limitations.{" "}
          <Link href="/about" className="underline underline-offset-2 hover:text-ink">
            More about how they were built
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
