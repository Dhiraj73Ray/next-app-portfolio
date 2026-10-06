"use client";

import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

// Lazy-load the 3D scene. Keeps Three.js out of the initial bundle
// and lets the rest of the page paint first.
const WelcomeCrowd = dynamic(() => import("../hero/WelcomeCrowd"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-cream" />,
});

export default function Welcome() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const crowdScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.8]);
  const crowdSpread = useTransform(scrollYProgress, [0, 0.25], [0, 100]);
  const crowdOpacity = useTransform(scrollYProgress, [0, 0.25, 0.3], [1, 1, 0]);

  const words = useMemo(
    () => [
      "Agile", "Breakthrough", "Champion", "Conceptualize", "Dedication", "Evolve",
      "Foundation", "Grit", "High-performance", "Ingenuity", "Iteration", "Junction",
      "Kinetic", "Leverage", "Milestone", "Nexus", "Overcome", "Paradigm",
      "Quantifiable", "Resilience", "Solution-oriented", "Tactical", "Ultimate",
      "Velocity", "Zeal", "Abstract", "Byte", "Capacity", "Deployment", "Efficiency",
      "Framework", "Generation", "Hypothesis", "Implementation", "Journey", "Kernel",
      "Latency", "Methodical", "Node", "Operational", "Pipeline", "Quality",
      "Real-time", "Scalability", "Threshold", "Utilitarian", "Virtualization",
      "Web-scale", "X-factor", "Yield", "Architected", "Resilient", "Automated",
      "Tenacity", "Refactored", "Strategist", "Scalable", "Persistence", "Engineered",
      "Mastery", "Analytical", "Legacy", "Streamlined", "Precision", "Boss-fight",
      "Modular", "Unapologetic", "Deployment", "Hustle", "Algorithmic", "Protagonist",
      "Optimized", "Endurance", "Dynamic", "Syntax", "Catalyst", "Visionary",
      "Level-up", "Robust", "Synergy", "Immersive", "Debugged", "Disciplined",
      "Quest", "Documentation", "Empowered", "Logic", "Grinding", "Deployment",
      "Versatile", "Awakening", "Performance", "Lifecycle", "Meticulous",
      "Optimization", "Adaptive", "Impact", "Coffee-to-code", "Infrastructure",
      "Workflow",
    ],
    []
  );

  return (
    <motion.section
      ref={targetRef}
      className="relative h-[100vh] w-full overflow-hidden bg-cream border-b-4 border-ink"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Word Cloud */}
        <div className="absolute inset-0 select-none overflow-hidden font-sans pointer-events-none">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
            className="absolute inset-0 p-10 flex flex-wrap content-center gap-6 z-0"
          >
            {words.map((word, i) => {
              const colors = ["text-ink/10", "text-olive/15", "text-burnt/10"];
              const sizes = ["text-2xl", "text-4xl", "text-5xl"];
              return (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className={`${colors[i % colors.length]} ${sizes[i % sizes.length]} font-black uppercase`}
                >
                  {word}
                </motion.span>
              );
            })}
          </motion.div>
        </div>

        {/* 3D Canvas — instanced, lazy-loaded, self-pausing */}
        {/* 3D Canvas — instanced, lazy-loaded, self-pausing */}
<motion.div
  className="absolute inset-0 w-full h-full z-10"
  style={{
    scale: crowdScale,
    x: crowdSpread,
    y: crowdSpread,
    opacity: crowdOpacity,
    transformOrigin: "center center",     // ← new
    willChange: "transform, opacity",     // ← new: promote to its own compositor layer
  }}
>
  <div className="absolute inset-0 w-full h-full">   {/* ← new wrapper to anchor the R3F canvas */}
    <WelcomeCrowd imageUrl="/img/Its ME.jpg" />
  </div>
</motion.div>

        {/* Giant Background Text */}
        <div className="absolute inset-0 flex items-end justify-center pb-24 lg:pb-28 z-[-1] pointer-events-none">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-[7.5rem] text-burnt font-black tracking-[0.2em] uppercase text-center"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.2, 0.3], [0.55, 0.55, 0]),
            }}
          >
            DHIRAJ RAY
          </motion.h1>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-10 z-30 text-olive text-xs font-mono tracking-widest uppercase flex items-center gap-1.5 pointer-events-auto">
          <span>Scroll Down</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </div>
      </div>
    </motion.section>
  );
}