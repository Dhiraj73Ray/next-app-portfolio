"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "../../data/siteConfig";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Menu khula ho: Esc se band, aur peeche ka page scroll lock
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

  // Screen desktop size ho jaye (rotate/resize) toh menu band
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
      <header className="fixed top-0 left-0 w-full z-50 bg-cream/90 backdrop-blur-sm border-b border-ink">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          {/* Left: Logo / Name */}
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-ink">
            {site.name}
          </Link>

          {/* Right: Links */}
          <nav aria-label="Primary" className="hidden md:flex gap-8">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-xs uppercase tracking-widest text-ink hover:text-burnt transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden font-mono text-xs border border-ink px-3 py-1 text-ink cursor-pointer"
          >
            {open ? "[ CLOSE ]" : "[ MENU ]"}
          </button>
        </div>
      </header>

      {/* Header ke bahar render kiya hai: backdrop-blur wale parent ke andar fixed element sahi se nahi chipakta */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-40 flex flex-col overflow-y-auto border-t-2 border-ink bg-cream"
          >
            <nav aria-label="Mobile">
              <ul>
                {site.nav.map((item, i) => (
                  <li key={item.href} className="border-b-2 border-ink">
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 px-8 py-5 font-serif text-4xl tracking-tight text-ink transition-colors hover:text-burnt active:bg-ink active:text-cream"
                    >
                      <span className="font-mono text-xs text-olive">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto space-y-3 px-8 py-6 font-mono text-xs text-ink">
              <a
                href={`mailto:${site.email}`}
                className="block break-all underline decoration-burnt underline-offset-4"
              >
                {site.email}
              </a>
              <div className="flex gap-5">
                {site.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-burnt transition-colors"
                  >
                    {s.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}