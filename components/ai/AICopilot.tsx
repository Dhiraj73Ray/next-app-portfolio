"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site } from "../../data/siteConfig";

const RADIAL_ITEMS = [
  { id: "chat", label: "CHAT" },
  { id: "skills", label: "SKILLS" },
  { id: "projects", label: "PROJECTS" },
  { id: "resume", label: "RESUME" },
  { id: "contact", label: "CONTACT" },
];
const JUMP_ITEMS = RADIAL_ITEMS.filter((i) => i.id !== "chat");

const SLICE = 360 / RADIAL_ITEMS.length;
const HUB_RATIO = 0.35; // hub radius / wheel radius (SVG mein 35 / 100)
const MOVE_THRESHOLD = 18; // px: isse kam hila toh "tap" maana jayega, selection nahi

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
};

export default function AICopilot() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false); // wheel dikh raha hai
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false); // chat panel

  const wheelRef = useRef<HTMLDivElement>(null);
  const lastPointerType = useRef("mouse");
  const stopGesture = useRef<(() => void) | null>(null);

  // Slice click: chat panel kholta hai, baaki items us section par le jaate hain
  const choose = (id: string) => {
    setHoveredItem(null);
    setOpen(false);
    if (id === "chat") {
      setPanelOpen(true);
      return;
    }
    setPanelOpen(false);
    if (id === "resume" && site.resume) {
      window.open(site.resume, "_blank", "noopener");
      return;
    }
    const target = id === "resume" ? "contact" : id; // resume file set nahi hai toh contact par
    document.getElementById(target)?.scrollIntoView(); // globals.css ka smooth + nav offset follow karta hai
  };

  // Screen ke point (x, y) ke neeche kaunsa slice hai? (hub aur wheel ke bahar = null)
  const sliceAt = (x: number, y: number): string | null => {
    const el = wheelRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const radius = r.width / 2;
    const dx = x - (r.left + radius);
    const dy = y - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist > radius || dist < radius * HUB_RATIO) return null;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90; // 0deg = upar, clockwise (SVG jaisa)
    return RADIAL_ITEMS[Math.floor(((angle + 360) % 360) / SLICE)].id;
  };

  // TOUCH: dabao = wheel khulta hai, ungli slide karo = slice highlight, chhodo = wo slice select.
  // Jaldi tap (hile bina) = bas ek blink: khulta hai aur band.
  const onTriggerPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse") return; // mouse hover se chalta hai
    e.preventDefault();
    stopGesture.current?.();

    const g = { id: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false, last: null as string | null };
    setOpen(true);
    navigator.vibrate?.(8);

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== g.id) return;
      if (!g.moved && Math.hypot(ev.clientX - g.x0, ev.clientY - g.y0) < MOVE_THRESHOLD) return;
      g.moved = true;
      const id = sliceAt(ev.clientX, ev.clientY);
      if (id !== g.last) {
        g.last = id;
        setHoveredItem(id);
        if (id) navigator.vibrate?.(6);
      }
    };

    const finish = (ev: PointerEvent) => {
      if (ev.pointerId !== g.id) return;
      stop();
      // Chhodne ke baad browser jo "click" bhejta hai, wo neeche ke page par na gire
      const swallow = (c: Event) => {
        c.stopPropagation();
        c.preventDefault();
      };
      document.addEventListener("click", swallow, true);
      setTimeout(() => document.removeEventListener("click", swallow, true), 400);

      const id = ev.type === "pointerup" && g.moved ? sliceAt(ev.clientX, ev.clientY) : null;
      if (id) choose(id);
      else {
        setHoveredItem(null);
        setOpen(false);
      }
    };

    const stop = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", finish);
      document.removeEventListener("pointercancel", finish);
      stopGesture.current = null;
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", finish);
    document.addEventListener("pointercancel", finish);
    stopGesture.current = stop;
  };

  useEffect(() => () => stopGesture.current?.(), []);

  // Esc se chat panel band
  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  const hidden = open || panelOpen;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 select-none md:bottom-8 md:right-8"
      onPointerDownCapture={(e) => {
        lastPointerType.current = e.pointerType;
      }}
      // MOUSE: hover = wheel, bahar nikle = band
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && !panelOpen) setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        setHoveredItem(null);
        if (!panelOpen) setOpen(false);
      }}
    >
      {/* Trigger: hamesha mounted (touch gesture isi se shuru hota hai).
          Ye in-flow hai, isliye container ki width button se aati hai aur text wrap nahi hota. */}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={hidden}
        title="Hold and slide to choose"
        onPointerDown={onTriggerPointerDown}
        onContextMenu={(e) => e.preventDefault()}
        // Keyboard (Enter/Space) = detail 0. Touch tap yahan kuch nahi karta.
        onClick={(e) => {
          if (e.detail === 0) {
            setPanelOpen(true);
            setOpen(false);
          }
        }}
        style={{ touchAction: "none", WebkitTouchCallout: "none" }}
        className={`block whitespace-nowrap border-2 border-ink bg-cream px-4 py-2 font-mono text-xs uppercase text-ink transition-[opacity,background-color,color] duration-200 hover:bg-ink hover:text-cream md:px-5 md:py-3 md:text-sm ${
          hidden ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        [ AI ]
      </button>

      <AnimatePresence>
        {/* 2. THE RADIAL MENU */}
        {open && !panelOpen && (
          <motion.div
            key="wheel"
            ref={wheelRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.15 }}
            className="absolute bottom-0 right-0 h-64 w-64"
          >
            <motion.div
              initial={{ scale: reduce ? 1 : 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: reduce ? 1 : 0.85 }}
              transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
              style={{ transformOrigin: "bottom right" }}
              className="h-full w-full"
            >
              <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-sm">
                {RADIAL_ITEMS.map((item, index) => {
                  const startAngle = index * SLICE;
                  const path = describeArc(100, 100, 100, startAngle, startAngle + SLICE);
                  const isItemHovered = hoveredItem === item.id;

                  return (
                    <g key={item.id}>
                      <path
                        d={path}
                        fill={isItemHovered ? "#D9531E" : "#F4EFE6"}
                        stroke="#1A1A1A"
                        strokeWidth="1.5"
                        className="cursor-pointer transition-colors duration-150"
                        onPointerEnter={(e) => e.pointerType === "mouse" && setHoveredItem(item.id)}
                        onPointerLeave={(e) => e.pointerType === "mouse" && setHoveredItem(null)}
                        // Touch ka "click" ignore: touch mein selection release par hota hai
                        onClick={() => {
                          if (lastPointerType.current === "mouse") choose(item.id);
                        }}
                      />
                      <text
                        x="100"
                        y="100"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${startAngle + SLICE / 2}, 100, 100) translate(0, -60)`}
                        className="pointer-events-none fill-ink font-mono text-[8px]"
                        style={{ fill: isItemHovered ? "#F4EFE6" : "#1A1A1A" }}
                      >
                        {item.label}
                      </text>
                    </g>
                  );
                })}
                <circle cx="100" cy="100" r="35" fill="#1A1A1A" stroke="#F4EFE6" strokeWidth="1.5" />
                <text
                  x="100"
                  y="100"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none fill-cream font-mono text-[10px]"
                >
                  {hoveredItem ? `[ ${hoveredItem.toUpperCase()} ]` : "[ AI ]"}
                </text>
              </svg>
            </motion.div>
          </motion.div>
        )}

        {/* 3. THE CHAT PANEL */}
        {panelOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: [0.2, 0, 0, 1] }}
            style={{ transformOrigin: "bottom right" }}
            className="absolute bottom-0 right-0 flex h-96 max-h-[70svh] w-80 max-w-[calc(100vw-2rem)] flex-col border-2 border-ink bg-cream"
          >
            <div className="flex items-center justify-between border-b-2 border-ink bg-cream p-3">
              <span className="font-mono text-xs uppercase text-ink">[ ai ]</span>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="cursor-pointer font-mono text-xs text-ink transition-colors hover:text-burnt"
              >
                [ X ]
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-cream p-4 font-sans text-sm">
              <p className="text-ink/80">The AI assistant is coming soon. For now, jump straight to a section:</p>
              <ul className="mt-4 space-y-2">
                {JUMP_ITEMS.map((j) => (
                  <li key={j.id}>
                    <button
                      type="button"
                      onClick={() => choose(j.id)}
                      className="w-full cursor-pointer border border-ink/25 px-3 py-2 text-left font-mono text-xs uppercase text-ink transition-colors hover:bg-ink hover:text-cream"
                    >
                      {j.label} →
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t-2 border-ink bg-cream p-3">
              <input
                type="text"
                disabled
                aria-label="AI chat (coming soon)"
                placeholder="Chat is coming soon..."
                className="w-full cursor-not-allowed border-none bg-transparent font-sans text-sm text-ink outline-none placeholder:text-ink/40"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}