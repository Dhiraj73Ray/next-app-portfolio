"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { site } from "../../data/siteConfig";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (typeof window !== "undefined") {
      setIsVisible(latest > window.innerHeight * 0.5);
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsVisible(window.scrollY > window.innerHeight * 0.5);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 z-50 h-[var(--nav-h)] w-full border-b border-ink bg-cream/90 backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-8">
          <Link href="/" className="font-serif text-lg font-bold tracking-tight text-ink md:text-xl">
            {site.name}
          </Link>

          <nav aria-label="Primary" className="hidden gap-8 md:flex">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:text-burnt"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="cursor-pointer border border-ink px-3 py-1.5 font-mono text-[11px] text-ink md:hidden"
          >
            {open ? "[ CLOSE ]" : "[ MENU ]"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              aria-hidden="true"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-ink/25 md:hidden"
            />
            <motion.div
              id="mobile-menu"
              key="panel"
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              exit={{ clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 top-[var(--nav-h)] z-40 border-b-2 border-ink bg-cream md:hidden"
            >
              <nav aria-label="Mobile">
                <ul>
                  {site.nav.map((item, i) => (
                    <li key={item.href} className="border-b border-ink/15">
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between px-6 py-3.5 transition-colors active:bg-ink/5"
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="font-mono text-[10px] text-olive">{String(i + 1).padStart(2, "0")}</span>
                          <span className="font-serif text-2xl tracking-tight text-ink group-hover:text-burnt">
                            {item.label}
                          </span>
                        </span>
                        <span aria-hidden="true" className="font-mono text-sm text-ink/30 group-hover:text-burnt">
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex items-center justify-between gap-4 px-6 py-3 font-mono text-[11px] text-ink">
                <a href={`mailto:${site.email}`} className="truncate underline decoration-burnt underline-offset-4">
                  {site.email}
                </a>
                <span className="flex shrink-0 gap-4">
                  {site.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-burnt"
                    >
                      {s.label} ↗
                    </a>
                  ))}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}