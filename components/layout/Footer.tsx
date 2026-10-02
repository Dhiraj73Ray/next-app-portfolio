import { ArrowUpRight } from "lucide-react";
import { site as defaultSite, type SiteConfig } from "../../data/siteConfig";
import BackToTop from "./BackToTop";

export default function Footer({ data = defaultSite }: { data?: SiteConfig }) {
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-hidden bg-ink px-6 pt-16 text-cream md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="max-w-md font-serif text-3xl leading-[1.05] tracking-tight md:text-5xl">
              Let&apos;s build something good together.
            </p>
            <a
              href={`mailto:${data.email}`}
              className="mt-6 inline-flex items-center gap-2 border-b border-cream/40 pb-1 font-mono text-sm hover:border-burnt hover:text-burnt transition-colors"
            >
              {data.email} <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h3 className="mb-4 font-mono text-xs text-cream/50">Pages</h3>
            <ul className="space-y-2 font-sans text-base">
              {data.nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-burnt transition-colors">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h3 className="mb-4 font-mono text-xs text-cream/50">Elsewhere</h3>
            <ul className="space-y-2 font-sans text-base">
              {data.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-burnt transition-colors"
                  >
                    {s.label} <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
              ))}
              {data.resume && (
                <li>
                  <a href={data.resume} download className="hover:text-burnt transition-colors">
                    Résumé (PDF)
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-cream/20 pt-5 font-mono text-xs text-cream/60">
          <span>
            © {year} {data.name}
          </span>
          <span>Built with Next.js, Tailwind and Framer Motion, ShadcnUI</span>
          <BackToTop />
        </div>

        {/* Oversized name, bottom se thoda kata hua (poster style) */}
        <p
          aria-hidden="true"
          className="-mb-[0.13em] mt-10 select-none whitespace-nowrap font-serif font-bold leading-[0.85] tracking-tighter text-[clamp(3rem,13.5vw,13rem)]"
        >
          {data.name}
        </p>
      </div>
    </footer>
  );
}