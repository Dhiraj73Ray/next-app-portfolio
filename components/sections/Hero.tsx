// frontend/components/sections/Hero.tsx

export default function Hero() {
  return (
    <section className="relative z-0 min-h-[calc(100vh-64px)] flex flex-col justify-between pt-32 pb-10 px-8 md:px-16 border-b-2 border-ink">
      
      {/* Top Bar / Mono Label */}
      <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-ink">
        [ PORTFOLIO / 2025 ]
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 my-auto">
        
        {/* Left Column (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-none tracking-tight text-ink mb-6">
            Aarav <br /> Sharma
          </h1>
          <p className="font-sans text-xl md:text-2xl text-ink max-w-lg mb-10">
            Full-Stack Developer & ECE Engineer. I build systems that connect hardware, data, and AI.
          </p>
          
          {/* Buttons */}
          <div className="flex gap-4">
            <a href="#work" className="bg-burnt text-cream font-mono text-sm uppercase px-6 py-3 border-2 border-ink hover:bg-ink hover:text-cream transition-colors duration-200">
              View Work
            </a>
            <a href="#contact" className="bg-transparent text-ink font-mono text-sm uppercase px-6 py-3 border-2 border-ink hover:bg-ink hover:text-cream transition-colors duration-200">
              Contact
            </a>
          </div>
        </div>

        {/* Right Column (5 cols) - Meta Box */}
        <div className="md:col-span-5 flex items-start md:items-center">
          <div className="w-full border border-ink p-6 bg-transparent">
            <ul className="font-mono text-sm space-y-4 text-ink">
              <li className="flex justify-between border-b border-ink/20 pb-2">
                <span className="text-olive">LOCATION</span>
                <span>Bengaluru, India</span>
              </li>
              <li className="flex justify-between border-b border-ink/20 pb-2">
                <span className="text-olive">AVAILABILITY</span>
                <span>Open to roles</span>
              </li>
              <li className="flex justify-between border-b border-ink/20 pb-2">
                <span className="text-olive">FOCUS</span>
                <span>Full-Stack + AI</span>
              </li>
              <li className="flex justify-between pt-2">
                <span className="text-olive">SOCIALS</span>
                <div className="flex gap-2">
                  <a href="#" className="underline hover:text-burnt">GitHub</a>
                  <a href="#" className="underline hover:text-burnt">LinkedIn</a>
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