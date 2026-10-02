"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PROJECTS, type Project } from "./data";
import ProjectInspector from "./ProjectInspector";

/* Mobile/tablet (< lg): left list nahi, sirf inspector, aur wo hi projects ka carousel.
   Native scroll-snap use kiya hai, isliye swipe smooth + battery-friendly. */
export default function MobileProjectsCarousel({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const total = projects.length;

  const onScroll = () => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const target = (i + total) % total; // wrap-around
    el.scrollTo({ left: target * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="lg:hidden" role="region" aria-roledescription="carousel" aria-label="Projects">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((p, i) => (
          <div
            key={p.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}`}
            className="w-full shrink-0 snap-center snap-always px-0.5"
          >
            <ProjectInspector
              project={p}
              number={PROJECTS.findIndex((x) => x.id === p.id) + 1}
              previewing={false}
              badge={`Build ${i + 1} of ${total}`}
              autoplay={i === active}
            />
          </div>
        ))}
      </div>

      {/* Controls: prev, segments, next */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="Previous project"
          className="size-9 shrink-0 grid place-items-center border-2 border-ink text-ink hover:bg-ink hover:text-cream transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 flex gap-1">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${p.title}`}
              aria-current={i === active}
              className="flex-1 h-6 flex items-center cursor-pointer"
            >
              <span
                className={`block w-full h-1 transition-colors duration-200 ${
                  i === active ? "bg-burnt" : "bg-ink/20"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label="Next project"
          className="size-9 shrink-0 grid place-items-center border-2 border-ink text-ink hover:bg-ink hover:text-cream transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-olive">
        [ swipe the card or use arrows ]
      </p>
    </div>
  );
}