"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LeftSidebar, RightSidebar } from "../about/AboutSidebar";
import profile from "../../data/profile.json";

export default function About() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const sections = document.querySelectorAll(".doc-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div id="about">
      {/* =========================================================
          MOBILE & TABLET: Simple Old Layout (hidden on lg+)
         ========================================================= */}
      <section className="lg:hidden py-16 px-6 border-b-4 border-ink bg-cream">
        {/* Header */}
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-ink block mb-2">
            [ 01 — ABOUT ]
          </span>
          <h2 className="font-serif text-4xl text-ink tracking-tight">
            About
          </h2>
        </div>

        {/* Bio */}
        <div className="space-y-5 mb-10">
          <p className="font-sans text-base leading-relaxed text-ink">
            {profile.about.long}
          </p>
          <p className="font-sans text-base leading-relaxed text-ink">
            {profile.about.short}
          </p>
        </div>

        {/* Facts */}
        <ul className="border-t-2 border-ink pt-4 space-y-4">
          {profile.about.facts.map(
            (fact: { label: string; value: string }) => (
              <li
                key={fact.label}
                className="flex justify-between border-b border-ink/20 pb-2"
              >
                <span className="font-mono text-xs uppercase text-olive">
                  {fact.label}
                </span>
                <span className="font-mono text-sm text-ink text-right">
                  {fact.value}
                </span>
              </li>
            )
          )}
        </ul>
      </section>

      {/* =========================================================
          DESKTOP: Documentation Layout (hidden below lg)
         ========================================================= */}
      <section className="hidden lg:block relative z-10 w-full bg-cream">
        <div className="max-w-[1400px] mx-auto flex items-start px-8 py-24">
          <LeftSidebar activeSection={activeSection} />

          <main className="flex-1 min-w-0 lg:px-12">
            <div className="max-w-2xl mx-auto">
              {/* Doc path label */}
              <div className="font-mono text-xs text-olive mb-3">
                docs / identity / about.md
              </div>

              {/* Title */}
              <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-ink mb-4">
                About
              </h1>
              <p className="font-sans text-base text-ink/70 leading-relaxed mb-8 max-w-xl">
                The complete blueprint of my engineering identity, core
                philosophy, and offline background processes.
              </p>
              <div className="h-px bg-ink w-full mb-16" />

              {/* SECTION 1: OVERVIEW */}
              <motion.section
                id="overview"
                className="doc-section scroll-mt-28 mb-20"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
              >
                <h2 className="font-serif text-2xl md:text-3xl text-ink mb-6">
                  Overview
                </h2>
                <p className="font-sans text-base text-ink/80 leading-relaxed mb-6">
                  {profile.about.long}
                </p>

                <div className="border-l-4 border-burnt border-y border-r border-ink bg-cream p-5 my-8">
                  <span className="font-mono text-[10px] font-bold text-burnt block mb-2 uppercase tracking-widest">
                    Note
                  </span>
                  <p className="font-sans text-sm text-ink/80 leading-relaxed">
                    <strong className="text-ink font-medium">
                      Core Concept:{" "}
                    </strong>
                    {profile.about.short}
                  </p>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-8 pt-6 border-t border-ink/20">
                  {profile.about.facts.map(
                    (fact: { label: string; value: string }) => (
                      <li
                        key={fact.label}
                        className="flex flex-col border-b border-ink/20 pb-3"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-widest text-olive mb-1">
                          {fact.label}
                        </span>
                        <span className="font-sans text-sm text-ink">
                          {fact.value}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </motion.section>

              {/* SECTION 2: PHILOSOPHY */}
              <motion.section
                id="philosophy"
                className="doc-section scroll-mt-28 mb-20"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
              >
                <h2 className="font-serif text-2xl md:text-3xl text-ink mb-6">
                  Architectural Philosophy
                </h2>
                <p className="font-sans text-base text-ink/80 leading-relaxed mb-8">
                  I don't just write code that compilers understand; I write
                  code that humans can maintain. My methodology is anchored on
                  three strict principles:
                </p>

                <ul className="space-y-6">
                  {profile.about.philosophy.map((item) => (
                    <li key={item.id} className="flex gap-5 items-start">
                      <span className="font-mono text-[10px] border border-ink text-ink px-2 py-1 mt-0.5 flex-shrink-0">
                        {item.id}
                      </span>
                      <div>
                        <strong className="font-sans text-base text-ink block mb-1">
                          {item.title}
                        </strong>
                        <p className="font-sans text-sm text-ink/70 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* SECTION 3: BACKGROUND */}
              <motion.section
                id="background"
                className="doc-section scroll-mt-28"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
              >
                <h2 className="font-serif text-2xl md:text-3xl text-ink mb-6">
                  Background Processes
                </h2>
                <p className="font-sans text-base text-ink/80 leading-relaxed mb-8">
                  {profile.about.background.intro}
                </p>

                {profile.about.background.sections.map((section) => (
                  <div key={section.title} className="mb-6">
                    <h3 className="font-sans text-base font-medium text-ink mb-2">
                      {section.title}
                    </h3>
                    <p className="font-sans text-sm text-ink/70 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}

                <div className="mt-10 border-2 border-ink overflow-hidden">
                  <div className="bg-cream border-b-2 border-ink font-mono text-[10px] text-olive px-4 py-2">
                    runtime_env.json
                  </div>
                  <pre className="bg-ink text-cream p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                    <code>
                      {"{\n  "}
                      <span className="text-burnt">"status"</span>:{" "}
                      <span className="text-[#A3E635]">
                        "{profile.about.background.runtime.status}"
                      </span>
                      {",\n  "}
                      <span className="text-burnt">"up_time"</span>:{" "}
                      <span className="text-[#A3E635]">
                        "{profile.about.background.runtime.up_time}"
                      </span>
                      {",\n  "}
                      <span className="text-burnt">"fuel_sources"</span>: [
                      {profile.about.background.runtime.fuel_sources.map(
                        (source, i) => (
                          <span key={source}>
                            {"\n    "}
                            <span className="text-[#A3E635]">
                              "{source}"
                            </span>
                            {i <
                            profile.about.background.runtime.fuel_sources
                              .length -
                              1
                              ? ","
                              : ""}
                          </span>
                        )
                      )}
                      {"\n  ]\n}"}
                    </code>
                  </pre>
                </div>
              </motion.section>
            </div>
          </main>

          <RightSidebar activeSection={activeSection} />
        </div>
      </section>
    </div>
  );
}