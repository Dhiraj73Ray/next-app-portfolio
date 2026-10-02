import { Check, ExternalLink } from "lucide-react";
import type { Project } from "./data";

interface Props {
  project: Project;
  index: number;
  isHovered: boolean;
  isSelected: boolean;
  onPreview: (p: Project) => void;
  onPin: (p: Project) => void;
}

export default function ProjectCard({
  project,
  index,
  isHovered,
  isSelected,
  onPreview,
  onPin,
}: Props) {
  return (
    // Bahar wala wrapper PADDING se gap banata hai (margin/gap se nahi),
    // isliye do cards ke beech mouse hamesha kisi na kisi card ke hit-area mein rehta hai.
    <div
      className="p-1.5 flex"
      onMouseEnter={() => onPreview(project)}
      onFocus={() => onPreview(project)}
    >
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        onClick={() => onPin(project)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPin(project);
          }
        }}
        className={`group relative w-full p-3.5 border cursor-pointer select-none flex flex-col
          transition-[transform,border-color,background-color,box-shadow] duration-200
          hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-burnt
          ${
            isHovered
              ? "border-burnt bg-burnt/5 shadow-sm"
              : isSelected
                ? "border-burnt/70 bg-cream ring-1 ring-burnt/40"
                : "border-ink/15 bg-cream/60"
          }`}
      >
        {/* Top row: index + badges */}
        <div className="flex items-center justify-between font-mono text-[10px] mb-2">
          <span className={isHovered ? "text-burnt font-bold" : "text-ink/40"}>
            #{String(index + 1).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-1">
            {isSelected && (
              <span className="inline-flex items-center gap-0.5 text-[8px] font-mono text-burnt font-semibold">
                <Check className="w-2.5 h-2.5 stroke-[3]" /> PINNED
              </span>
            )}
            {project.featured && (
              <span className="px-1.5 py-0.5 text-[8px] tracking-wider uppercase font-semibold bg-burnt text-cream">
                ★
              </span>
            )}
            <span className="px-1.5 py-0.5 text-[8px] tracking-wider uppercase font-semibold bg-ink/10 text-ink/70">
              {project.year}
            </span>
          </div>
        </div>

        <h3 className="font-serif text-sm sm:text-base font-bold text-ink group-hover:text-burnt transition-colors leading-tight">
          {project.title}
        </h3>

        <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-olive">
          {project.type}
        </div>

        <p className="mt-1.5 text-[11px] font-sans text-ink/70 line-clamp-2 leading-snug flex-1">
          {project.summary}
        </p>

        {/* Footer: tags + links */}
        <div className="mt-2.5 pt-2 border-t border-ink/10 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1 min-w-0">
            {project.tech.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="font-mono text-[8px] text-ink/60 bg-ink/5 px-1 py-0.5 truncate"
              >
                {tag}
              </span>
            ))}
            {project.tech.length > 2 && (
              <span className="font-mono text-[8px] text-ink/40">
                +{project.tech.length - 2}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="GitHub"
                className="font-mono text-[9px] uppercase text-ink/50 hover:text-burnt transition-colors"
              >
                src
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="Live Demo"
                className="text-ink/50 hover:text-burnt transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}