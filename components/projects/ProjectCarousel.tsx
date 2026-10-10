"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImages, type Project } from "./data";
import Image from "next/image";

const AUTOPLAY_MS = 2000; // har slide kitni der rukegi

/* Ek slide: image/gif, ya load na ho toh placeholder */
function Slide({ src, alt, number }: { src?: string; alt: string; number: number }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-ink" />
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-ink" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-ink" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-[6rem] leading-none text-ink/10 select-none">
            {String(number).padStart(2, "0")}
          </span>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <Image
  src={src}
  alt={alt}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover object-top select-none"
  draggable={false}
/>
  );
}

export default function ProjectCarousel({
  project,
  number,
  enabled = true, // false = autoplay band (mobile par offscreen slides ke liye)
}: {
  project: Project;
  number: number;
  enabled?: boolean;
}) {
  const images = getImages(project);
  const count = Math.max(images.length, 1);
  const multi = images.length > 1;
  const reduce = useReducedMotion();

  const [[index, dir], setPage] = useState<[number, number]>([0, 1]);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const paused = hoverPaused || focusPaused;
  const [tabHidden, setTabHidden] = useState(false);
  const progress = useMotionValue(0); // 0 -> 1 = ek slide ka timer

  const go = useCallback(
    (delta: number) => {
      progress.set(0);
      setPage(([i]) => [(i + delta + count) % count, delta]);
    },
    [count, progress]
  );

  const goTo = (i: number) => {
    if (i === index) return;
    progress.set(0);
    setPage([i, i > index ? 1 : -1]);
  };

  /* Tab background mein ho toh autoplay ruk jaye */
  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  /* Autoplay: progress 0->1 chalta hai, poora hote hi next slide.
     Pause hone par wahin ruk jaata hai, resume par bacha hua time hi chalta hai. */
  const autoplay = multi && enabled && !reduce && !paused && !tabHidden;
  useEffect(() => {
    if (!autoplay) return;
    const controls = animate(progress, 1, {
      duration: (AUTOPLAY_MS / 1000) * (1 - progress.get()),
      ease: "linear",
      onComplete: () => go(1),
    });
    return () => controls.stop();
  }, [autoplay, index, progress, go]);

  const variants = {
    enter: (d: number) => ({ x: reduce ? 0 : d > 0 ? "100%" : "-100%", opacity: reduce ? 0 : 1 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: reduce ? 0 : d > 0 ? "-100%" : "100%", opacity: reduce ? 0 : 1 }),
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${project.title} screenshots`}
      tabIndex={multi ? 0 : -1}
      // Sirf asli mouse hover / keyboard focus par pause (touch tap par "atak" na jaye)
      onPointerEnter={(e) => e.pointerType === "mouse" && setHoverPaused(true)}
      onPointerLeave={() => setHoverPaused(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setFocusPaused(true)}
      onBlur={() => setFocusPaused(false)}
      onKeyDown={(e) => {
        if (!multi) return;
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      className="group/media relative h-56 sm:h-64 shrink-0 lg:h-auto lg:shrink lg:flex-1 lg:min-h-[130px] border-b-2 border-ink bg-cream overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-burnt"
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={index}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          drag={multi ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) go(1);
            else if (info.offset.x > 50) go(-1);
          }}
          className="absolute inset-0"
        >
          <Slide
            src={images[index]}
            alt={`${project.title} — image ${index + 1} of ${count}`}
            number={number}
          />
        </motion.div>
      </AnimatePresence>

      {/* Story-style progress segments (click = seedha us image par) */}
      {multi && (
        <div className="absolute z-10 top-1 left-3 right-10 flex gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === index}
              className="relative flex-1 h-4 cursor-pointer"
            >
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-cream/70 shadow-[0_0_0_1px_rgba(26,26,26,0.3)] overflow-hidden">
                <motion.span
                  className="block h-full w-full bg-burnt origin-left"
                  style={{
                    scaleX: i < index ? 1 : i === index ? (reduce ? 1 : progress) : 0,
                  }}
                />
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Arrows: dono side, beech mein */}
      {multi && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute z-10 left-2 top-1/2 -translate-y-1/2 size-8 grid place-items-center bg-cream/85 border-2 border-ink text-ink opacity-70 group-hover/media:opacity-100 hover:bg-burnt hover:text-cream transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute z-10 right-2 top-1/2 -translate-y-1/2 size-8 grid place-items-center bg-cream/85 border-2 border-ink text-ink opacity-70 group-hover/media:opacity-100 hover:bg-burnt hover:text-cream transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Chips (click/drag ko nahi rokte) */}
      {/* <span className="pointer-events-none absolute z-10 top-6 left-3 font-mono text-[10px] uppercase tracking-widest text-olive bg-cream/90 px-1.5 py-0.5">
        [{project.id}]
      </span>
      <span className="pointer-events-none absolute z-10 bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest bg-ink text-cream px-1.5 py-0.5">
        {project.type}
      </span> */}
      <span className="pointer-events-none absolute z-10 bottom-3 right-3 font-mono text-[10px] uppercase tracking-widest text-ink/70 bg-cream/90 px-1.5 py-0.5">
        {project.year}
      </span>
    </div>
  );
}