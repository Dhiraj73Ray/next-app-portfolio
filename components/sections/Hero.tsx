// frontend/components/sections/Hero.tsx
"use client";

import { site, type SiteConfig } from "../../data/siteConfig";
import { ArrowUpRight, Download } from "lucide-react";
import TechText from "../hero/TechText";


export default function Hero({ data = site }: { data?: SiteConfig }) {
  const [first, ...rest] = site.name.split(" ");
  const open = data.availability.open;

  const techProps = {
    fontSize: 250, // Increased from 150
    fontWeight: 600,
    reveal: "letter" as const,
    dashLength: 5,
    dashGap: 2,
    specks: 5,
    color: "#1A1A1A",
    accentColor: "#1A1A1A",
    letterSpacing: -0.05,
    reach: 80,
    softness: 0.7,
    strokeWidth: 1.5,
    speed: 1,
    lineStyle: "dashed" as const,
    selection: true,
    labels: true,
    draggable: true,
    sweep: true,
    fontMap: {
      a: "Isometra, serif",   // ← literal family name, no var()
    },
    fontScale: {
      a: 0.90,   // ← tune this
    },
  };

  return (
    <section id="home" className="relative z-0 min-h-[calc(100vh-64px)] flex flex-col justify-between pt-12 pb-8 px-6 md:pt-12 md:px-16 border-b-2 border-ink overflow-hidden">
      
      {/* Top Bar / Mono Label */}
      <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-ink mb-4">
        [ PORTFOLIO / {new Date().getFullYear()} ]
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-auto">
        
        {/* Left Column (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-center">
          
          {/* Stacked Animated Name - Tighter heights and margins */}
          <div className="flex flex-col w-full mb-4 md:mb-5">
            <div className="w-full h-[90px] md:h-[160px]  relative">
              <TechText {...techProps} text={first} />
            </div>
            {rest.length > 0 && (
              <div className="w-full h-[90px] md:h-[160px] relative mt-1 md:mt-2">
                <TechText {...techProps} text={rest.join(" ")} />
              </div>
            )}
          </div>

          <p className="font-sans text-base sm:text-lg md:text-xl text-ink max-w-lg mb-6 md:mb-8">
            {site.role}. {site.tagline}
          </p>
          
          {/* Buttons */}
          <div className="flex flex-wrap gap-3 md:gap-4">
            <a href="#projects" className="bg-burnt text-cream font-mono text-xs md:text-sm uppercase whitespace-nowrap px-4 py-2.5 md:px-6 md:py-3 border-2 border-ink hover:bg-ink hover:text-cream transition-colors duration-200">
              View Work
            </a>
            <a href="#contact" className="bg-transparent text-ink font-mono text-xs md:text-sm uppercase whitespace-nowrap px-4 py-2.5 md:px-6 md:py-3 border-2 border-ink hover:bg-ink hover:text-cream transition-colors duration-200">
              Contact
            </a>
            {data.resume && (
              <a
                href={data.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border-2 border-ink bg-ink px-4 py-2 font-mono text-xs uppercase text-cream hover:bg-burnt transition-colors"
              >
                Résumé <Download className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Right Column (5 cols) - Meta Box */}
        <div className="md:col-span-5 flex items-start md:items-center">
          <div className="w-full border border-ink p-4 md:p-6 bg-transparent">
            <ul className="font-mono text-xs md:text-sm space-y-3 md:space-y-4 text-ink">
              <li className="flex justify-between border-b border-ink/20 pb-2">
                <span className="text-olive">LOCATION</span>
                <span>{site.location}</span>
              </li>
              <div className="flex justify-between gap-4 border-b border-ink/20 py-1">
                <dt className="text-olive">STATUS</dt>
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
              <li className="flex justify-between border-b border-ink/20 pb-2">
                <span className="text-olive">FOCUS</span>
                <span>{site.focus}</span>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-olive">SOCIALS</span>
                <div className="flex gap-2">
                  {site.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-burnt"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Spacer / Marquee placeholder */}
      <div className="font-mono text-xs uppercase tracking-widest text-ink mt-6 md:mt-8">
        Scroll to explore ↓
      </div>
    </section>
  );
}