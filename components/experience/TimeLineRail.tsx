"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

// Wraps the tickets. A burnt-orange line "draws" down as you scroll.
export default function TimelineRail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  return (
    <div ref={ref} className="relative pl-10 md:pl-16">
      {/* track */}
      <div aria-hidden="true" className="absolute left-3 md:left-6 top-0 bottom-0 w-[2px] bg-ink/15" />
      {/* fill */}
      <motion.div
        aria-hidden="true"
        className="absolute left-3 md:left-6 top-0 bottom-0 w-[2px] bg-burnt origin-top"
        style={{ scaleY: reduce ? 1 : scaleY }}
      />
      {children}
    </div>
  );
}