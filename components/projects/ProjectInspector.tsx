"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Info, Sparkles } from "lucide-react";
import type { Project } from "./data";
import ProjectCarousel from "./ProjectCarousel";

interface Props {
  project: Project;
  number: number; // 1-based position in PROJECTS
  previewing: boolean;
  badge?: string; // label override (mobile: "Build 2 of 6")
  autoplay?: boolean; // image carousel autoplay on/off
}

/* ---------- Inspector ---------- */
export default function ProjectInspector({
  project,
  number,
  previewing,
  badge,
  autoplay = true,
}: Props) {
  return (
    <div className="relative h-full border-2 border-ink bg-cream overflow-hidden">
      {/* Corner ribbon */}
      <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden z-10">
        <div className="absolute transform rotate-45 bg-burnt text-cream text-[7px] font-mono py-0.5 right-[-35px] top-[10px] w-[100px] text-center uppercase tracking-widest font-bold">
          Spec
        </div>
      </div>

      {/* key badalta hai -> sirf content slide-fade hota hai, panel ka size nahi */}
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="h-full flex flex-col"
      >
        <ProjectCarousel project={project} number={number} enabled={autoplay} />

        {/* Body: slots ki height fixed hai, taaki image ka rectangle hilta na rahe */}
        <div className="shrink-0 p-3.5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-burnt flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3" />
            {badge ?? (previewing ? "Previewing" : "Pinned")}
          </div>

          <h4 className="font-serif text-xl sm:text-2xl font-bold text-ink leading-tight truncate">
            {project.title}
          </h4>

          <div className="mt-3 border-t border-b border-ink/10 py-3 space-y-3">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-ink/50 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-olive" />
                Overview
              </div>
              <p className="text-xs text-ink/80 leading-snug line-clamp-3 h-[3.1rem]">
                {project.description}
              </p>
            </div>

            {project.facts && project.facts.length > 0 && (
            <div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-ink/50 mb-1.5 flex items-center gap-1.5">
                <Info className="w-3 h-3 text-burnt" />
                Details
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(project.facts ?? []).map((f) => (
                  <div
                    key={f.label}
                    className="border-l-2 border-burnt pl-2 min-w-0"
                  >
                    <div className="font-serif text-sm text-ink leading-none mb-0.5 truncate">
                      {f.value}
                    </div>
                    <div className="font-mono text-[8px] uppercase tracking-widest text-olive leading-tight truncate">
                      {f.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
          
          {project.tech && project.tech.length > 0 && (
          <div className="mt-3">
            <div className="font-mono text-[9px] uppercase tracking-wider text-ink/50 mb-1.5">
              Stack
            </div>
            <div className="flex flex-wrap content-start gap-1 h-[44px] overflow-hidden">
              {project.tech.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] bg-ink text-cream px-1.5 py-0.5 flex items-center gap-1"
                >
                  <span className="text-burnt font-bold">/</span>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          )}

          <div className="mt-3 flex gap-3 pt-3 border-t border-ink/10 min-h-[30px]">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ink border-b border-ink pb-0.5 hover:text-burnt hover:border-burnt transition-colors"
              >
                GitHub <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ink border-b border-ink pb-0.5 hover:text-burnt hover:border-burnt transition-colors"
              >
                Live <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
