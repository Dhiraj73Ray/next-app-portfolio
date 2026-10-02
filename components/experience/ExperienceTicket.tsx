"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface Role {
  id: string;
  company: string;
  role: string;
  type: string;
  location: string;
  start: string;
  end: string | null;
  highlights: string[];
  stack: string[];
}

interface Props {
  item: Role;
  index: number;
  total: number;
}

// Barcode: same role always gives same bars (deterministic from id)
function Barcode({ seed }: { seed: string }) {
  const bars = Array.from((seed + seed).slice(0, 26)).map(
    (ch) => 1 + (ch.charCodeAt(0) % 3)
  );
  return (
    <div className="flex items-end gap-[2px] h-9" aria-hidden="true">
      {bars.map((w, i) => (
        <span key={i} className="block h-full bg-ink" style={{ width: w }} />
      ))}
    </div>
  );
}

export default function ExperienceTicket({ item, index, total }: Props) {
  const reduce = useReducedMotion();
  const isCurrent = item.end === null;

  return (
    <article className="relative mb-16">
      {/* Node on the rail */}
      <motion.span
        aria-hidden="true"
        className="absolute top-8 -left-[34px] md:-left-[46px] size-[14px] rounded-full border-2 border-ink bg-cream"
        whileInView={{ backgroundColor: "#D9531E" }}
        viewport={{ margin: "-45% 0px -45% 0px" }}
      />

      <div className="group relative flex flex-col md:flex-row bg-cream border-2 border-ink transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#1A1A1A]">
        {/* MAIN */}
        <div className="flex-1 p-6 md:p-8">
          <p className="font-mono text-xs text-olive mb-4">
            {item.start} → {item.end ?? "Present"} · {item.type}
          </p>

          <h3 className="font-serif text-4xl md:text-5xl tracking-tight text-ink leading-[1.05]">
            {item.company}
          </h3>
          <p className="font-sans text-lg text-ink mt-2">
            {item.role}
            <span className="text-ink/50"> — {item.location}</span>
          </p>

          <ul className="mt-6 space-y-3 max-w-xl">
            {item.highlights.map((h) => (
              <li key={h} className="flex gap-3 font-sans text-sm text-ink/80 leading-relaxed">
                <span className="font-mono text-burnt shrink-0">+</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-2">
            {item.stack.map((s) => (
              <li
                key={s}
                className="font-mono text-[11px] border border-ink px-2 py-1 transition-colors group-hover:bg-ink group-hover:text-cream"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* PERFORATION + notches (desktop) */}
        <span
          aria-hidden="true"
          className="hidden md:block absolute top-0 bottom-0 right-56 border-l-2 border-dashed border-ink"
        />
        <span
          aria-hidden="true"
          className="hidden md:block absolute -top-[2px] right-56 translate-x-1/2 w-5 h-[11px] rounded-b-full border-2 border-t-0 border-ink bg-cream"
        />
        <span
          aria-hidden="true"
          className="hidden md:block absolute -bottom-[2px] right-56 translate-x-1/2 w-5 h-[11px] rounded-t-full border-2 border-b-0 border-ink bg-cream"
        />

        {/* STUB */}
        <div className="relative md:w-56 shrink-0 p-6 flex md:flex-col justify-between items-center md:items-start gap-6 border-t-2 border-dashed border-ink md:border-t-0">
          <p className="font-mono text-xs text-ink/60">
            Stop {index + 1} of {total}
          </p>

          {/* The stamp: the one moment of motion */}
          <motion.div
            className={`self-center border-[3px] px-3 py-1 font-mono text-sm font-bold uppercase tracking-widest ${
              isCurrent ? "text-burnt border-burnt" : "text-olive border-olive"
            }`}
            style={{ rotate: -8 }}
            initial={reduce ? false : { scale: 2.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.25 }}
          >
            {isCurrent ? "On duty" : "Shipped"}
          </motion.div>

          <div className="hidden md:block">
            <Barcode seed={item.id} />
            <p className="font-mono text-[10px] text-ink/50 mt-1">{item.id}</p>
          </div>
        </div>
      </div>
    </article>
  );
}