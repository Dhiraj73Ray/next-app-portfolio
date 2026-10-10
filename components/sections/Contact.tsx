"use client";

import { ArrowUpRight, Download } from "lucide-react";
import { site as defaultSite, type SiteConfig } from "../../data/siteConfig";
import CopyEmail from "../contact/CopyEmail";
import ContactForm from "../contact/ContactForm";
import LiveClock from "../contact/LiveClock";

// `data` prop: kisi aur portfolio mein reuse karna ho toh apna SiteConfig pass karo
export default function Contact({ data = defaultSite }: { data?: SiteConfig }) {
  const open = data.availability.open;

  return (
    <section id="contact" className="relative bg-cream px-6 py-16 md:px-16 lg:py-24 border-b-4 border-ink">
      <div className="mx-auto max-w-7xl grid gap-14 lg:grid-cols-12">
        <h2 className="sr-only lg:hidden">Contact</h2>

        {/* LEFT: sirf desktop par. Mobile par sirf form (email/socials Footer mein hain) */}
        <div className="hidden lg:block lg:col-span-5">
          <span className="block font-mono text-xs uppercase tracking-widest text-ink mb-3">
            [ 06 — CONTACT ]
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[0.95] text-ink">
            Have something in mind? Let&apos;s talk.
          </h2>
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-ink/75">
            A project, a role, or an odd idea that needs both software and hardware thinking. Send a
            note and I will reply personally.
          </p>

          <dl className="mt-10 border border-ink p-6 font-mono text-sm text-ink">
            <div className="flex justify-between gap-4 border-b border-ink/20 pb-3">
              <dt className="text-olive">Location</dt>
              <dd className="text-right">{data.location}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-ink/20 py-3">
              <dt className="text-olive">Status</dt>
              <dd className="flex items-center gap-2 text-right">
                <span className="relative flex size-2.5" aria-hidden="true">
                  {open && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-burnt opacity-60 motion-safe:animate-ping" />
                  )}
                  <span
                    className={`relative inline-flex size-2.5 rounded-full ${open ? "bg-burnt" : "bg-ink/30"}`}
                  />
                </span>
                {data.availability.label}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-ink/20 py-3">
              <dt className="text-olive">Local time</dt>
              <dd>
                <LiveClock timeZone={data.timezone} />
              </dd>
            </div>
            <div className="flex justify-between gap-4 pt-3">
              <dt className="text-olive">Replies</dt>
              <dd className="text-right">{data.responseTime}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            {data.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border-2 border-ink px-4 py-2 font-mono text-xs uppercase text-ink hover:bg-ink hover:text-cream transition-colors"
              >
                {s.label} <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ))}
            {data.resume && (
              <a
                href={data.resume}
                // download
                target="_blank"
                className="inline-flex items-center gap-1.5 border-2 border-ink bg-ink px-4 py-2 font-mono text-xs uppercase text-cream hover:bg-burnt transition-colors"
              >
                Résumé <Download className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* RIGHT: the dispatch slip */}
        <div className="lg:col-span-7 lg:pt-5">
          <ContactForm email={data.email} topics={data.topics} />
        </div>
      </div>
    </section>
  );
}