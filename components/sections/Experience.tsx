import data from "../../data/experience.json";
import TimelineRail from "../experience/TimeLineRail";
import ExperienceTicket, { type Role } from "../experience/ExperienceTicket";

export default function Experience() {
  const roles = data.roles as Role[];

  return (
    <section id="experience" className="py-24 px-6 md:px-16 border-b-4 border-ink bg-cream">
      {/* Header */}
      <div className="mb-16 max-w-3xl">
        <span className="font-mono text-xs uppercase tracking-widest text-ink block mb-3">
          [ 05 — EXPERIENCE ]
        </span>
        <h2 className="font-serif text-5xl md:text-7xl tracking-tight text-ink leading-none">
          Where I&apos;ve shipped
        </h2>
        <p className="font-sans text-base text-ink/70 mt-5 max-w-md leading-relaxed">
          Each ticket is a place I have worked. Keep scrolling and the route draws
          itself.
        </p>
      </div>

      <TimelineRail>
        {roles.map((r, i) => (
          <ExperienceTicket key={r.id} item={r} index={i} total={roles.length} />
        ))}

        {/* Next stop */}
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute top-8 -left-[34px] md:-left-[46px] size-[14px] rounded-full border-2 border-dashed border-ink bg-cream"
          />
          <div className="border-2 border-dashed border-ink p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-serif text-3xl md:text-4xl text-ink">Next stop: your team</h3>
              <p className="font-sans text-sm text-ink/70 mt-2">
                This ticket is still blank. Let&apos;s fill it together.
              </p>
            </div>
            <a
              href="#contact"
              className="self-start bg-burnt text-cream font-mono text-sm uppercase px-6 py-3 border-2 border-ink hover:bg-ink transition-colors duration-200"
            >
              Get in touch
            </a>
          </div>
        </div>
      </TimelineRail>
    </section>
  );
}