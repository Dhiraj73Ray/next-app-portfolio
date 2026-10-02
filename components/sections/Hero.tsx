// frontend/components/sections/Hero.tsx

import { site } from "../../data/siteConfig";

export default function Hero() {
  const [first, ...rest] = site.name.split(" ");
  return (
    <section className="relative z-0 min-h-[calc(100vh-64px)] flex flex-col justify-between pt-24 pb-10 px-6 md:pt-32 md:px-16 border-b-2 border-ink">
      
      {/* Top Bar / Mono Label */}
      <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-ink">
        [ PORTFOLIO / {new Date().getFullYear()} ]
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 my-auto">
        
        {/* Left Column (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-none tracking-tight text-ink mb-6">
            {first} <br /> {rest.join(" ")}
          </h1>
          <p className="font-sans text-base sm:text-lg md:text-2xl text-ink max-w-lg mb-8 md:mb-10">
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
              <li className="flex justify-between border-b border-ink/20 pb-2">
                <span className="text-olive">AVAILABILITY</span>
                <span>{site.availability.open ? "Open to roles" : "Currently booked"}</span>
              </li>
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
      <div className="font-mono text-xs uppercase tracking-widest text-ink mt-12">
        Scroll to explore ↓
      </div>
    </section>
  );
}