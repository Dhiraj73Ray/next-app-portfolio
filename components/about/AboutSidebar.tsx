"use client";

import { motion } from "framer-motion";

// ============================================
// LEFT SIDEBAR — Primary navigation
// ============================================
export function LeftSidebar({ activeSection }: { activeSection: string }) {
  const menuStructure = [
    { title: "Getting Started", links: [{ id: "overview", label: "Overview" }] },
    { title: "Configuration", links: [{ id: "philosophy", label: "Philosophy" }] },
    { title: "Ecosystem", links: [{ id: "background", label: "Background Processes" }] },
  ];

  return (
    <aside className="hidden md:block sticky top-28 w-60 h-[calc(100vh-8rem)] overflow-y-auto pr-4 flex-shrink-0">
      <span className="mb-9 block font-mono text-xs uppercase tracking-widest text-ink">[ 02 — ABOUT ]</span>
      {menuStructure.map((group) => (
        <div key={group.title} className="mb-8">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-olive mb-3 border-b border-ink/20 pb-2">
            {group.title}
          </h4>
          <ul className="space-y-1 relative">
            {group.links.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id} className="relative">
                  <a
                    href={`#${link.id}`}
                    className={`block py-2 pl-3 font-sans text-sm transition-colors relative z-10 ${
                      isActive
                        ? "text-burnt font-medium"
                        : "text-ink/60 hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </a>
                  {/* Active indicator: 2px burnt orange left border */}
                  {isActive && (
                    <motion.div
                      layoutId="aboutActiveLeft"
                      className="absolute inset-y-0 left-0 w-0.5 bg-burnt pointer-events-none"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}

// ============================================
// RIGHT SIDEBAR — On This Page TOC
// ============================================
export function RightSidebar({ activeSection }: { activeSection: string }) {
  const tocItems = [
    { id: "overview", label: "Overview" },
    { id: "philosophy", label: "Philosophy" },
    { id: "background", label: "Background" },
  ];

  return (
    <aside className="hidden lg:block sticky top-28 w-56 h-[calc(100vh-8rem)] overflow-y-auto border-l border-ink/20 pl-6 flex-shrink-0">
      <h4 className="font-mono text-[10px] uppercase tracking-widest text-olive mb-4">
        On This Page
      </h4>
      <ul className="space-y-3 relative">
        {tocItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <li key={item.id} className="relative pl-4">
              <a
                href={`#${item.id}`}
                className={`block font-sans text-xs transition-colors relative z-10 truncate ${
                  isActive
                    ? "text-burnt font-medium"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {item.label}
              </a>
              {isActive && (
                <motion.div
                  layoutId="aboutActiveRight"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-burnt"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}