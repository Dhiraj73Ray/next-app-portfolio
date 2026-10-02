"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { PROJECTS, filterProjects, type Project } from "../projects/data";
import CategoryTabs from "../projects/CategoryTabs";
import ProjectCard from "../projects/ProjectCard";
import ProjectInspector from "../projects/ProjectInspector";
import MobileProjectsCarousel from "../projects/MobileProjectsCarousel";

export const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project>(PROJECTS[0]);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [moreBelow, setMoreBelow] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const filteredProjects = filterProjects(activeCategory);
  const activeProject = hoveredProject ?? selectedProject;
  const activeNumber = PROJECTS.findIndex((p) => p.id === activeProject.id) + 1;

  /* Hover-intent: mouse bahar jaye toh 150ms baad hi preview hatta hai.
     Right panel ke upar aaye toh cancel (taaki previewed project ke links click ho sakein). */
  const preview = (p: Project) => {
    clearTimeout(leaveTimer.current);
    setHoveredProject(p);
  };
  const keepPreview = () => clearTimeout(leaveTimer.current);
  const endPreview = () => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setHoveredProject(null), 150);
  };
  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  /* Neeche aur cards hain toh hi fade cue dikhao */
  const updateCue = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setMoreBelow(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);
  useEffect(() => {
    updateCue();
    window.addEventListener("resize", updateCue);
    return () => window.removeEventListener("resize", updateCue);
  }, [updateCue, activeCategory]);

  const changeCategory = (key: string) => {
    setActiveCategory(key);
    const first = filterProjects(key)[0];
    if (first) {
      setSelectedProject(first);
      setHoveredProject(null);
    }
    listRef.current?.scrollTo({ top: 0 });
  };

  return (
    <MotionConfig reducedMotion="user">
      {/*
        STAGE: desktop par section = 100svh - navbar, toh sab ek screen mein.
        Navbar height globals.css ke --nav-h se aati hai.
      */}
      <section
        id="projects"
        className="relative w-full max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-8 flex flex-col lg:h-[calc(100svh-var(--nav-h))] lg:min-h-[660px]"
      >
        {/* Header + tabs: ek row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-burnt font-mono text-[10px] uppercase tracking-widest font-semibold mb-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-burnt animate-pulse" />
              Selected Builds
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink font-bold tracking-tight leading-none">
              Projects<span className="italic font-normal text-swiss">.</span>
            </h2>
          </div>
          <CategoryTabs active={activeCategory} onChange={changeCategory} />
        </div>

        {/* MOBILE / TABLET: sirf inspector, projects ka swipe carousel */}
        <MobileProjectsCarousel key={activeCategory} projects={filteredProjects} />

        {/* DESKTOP: dono columns same height (items-stretch) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-stretch flex-1 min-h-0">
          {/* LEFT: purana card deck, ab fixed-height scroll area ke andar */}
          <div className="lg:col-span-7 flex flex-col min-h-0">
            <div className="relative flex-1 min-h-0">
              <div
                ref={listRef}
                onScroll={updateCue}
                onMouseLeave={endPreview}
                className="h-[440px] lg:h-full overflow-y-auto overscroll-contain grid grid-cols-1 sm:grid-cols-2 content-start"
                style={{ scrollbarWidth: "thin", scrollbarColor: "var(--orange) transparent" }}
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    isHovered={hoveredProject?.id === project.id}
                    isSelected={selectedProject.id === project.id}
                    onPreview={preview}
                    onPin={setSelectedProject}
                  />
                ))}
              </div>

              <div
                className={`pointer-events-none absolute bottom-0 left-0 right-2 h-10 bg-gradient-to-t from-[var(--cream)] to-transparent transition-opacity duration-200 ${
                  moreBelow ? "opacity-90" : "opacity-0"
                }`}
              />
            </div>

            <div className="shrink-0 mt-2 font-mono text-[10px] uppercase tracking-widest text-olive">
              [ {filteredProjects.length} projects — hover to preview, click to pin ]
            </div>
          </div>

          {/* RIGHT: inspector */}
          <div
            className="lg:col-span-5 min-h-0"
            onMouseEnter={keepPreview}
            onMouseLeave={endPreview}
          >
            <ProjectInspector
              project={activeProject}
              number={activeNumber}
              previewing={Boolean(hoveredProject)}
            />
          </div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default Projects;