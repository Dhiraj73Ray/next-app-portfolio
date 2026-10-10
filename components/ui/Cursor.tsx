"use client";

/**
 * DRAFTING CURSOR
 * Theme: cream / ink / burnt-orange, paper + blueprint feel
 */

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ── tuneable constants ──────────────────────────────────────── */
const ARM = 10;        // crosshair arm length
const GAP = 3;         // gap between center square and arm start
const SQ = 3;          // half-size of center square
// const SPRING = { stiffness: 80, damping: 10, mass: 0.15 } as const;
const INK = "#1A1A1A";
const BURNT = "#FF5A1F";        // brighter burnt-orange (was #D9531E)
const HOVER_ROTATE = 135;       // rotation for X shape
const STROKE_DEFAULT = 1.5;
const STROKE_HOVER = 2.5;       // bolder cross on hover so it pops on dark buttons
const STROKE_CLICK = 3;
/* ────────────────────────────────────────────────────────────── */

type CursorState = "default" | "hover" | "text" | "grab" | "grabbing";

const PRIORITY: Record<CursorState, number> = {
  grabbing: 5,
  grab: 4,
  hover: 3,
  text: 2,
  default: 1,
};

function getState(el: Element | null): CursorState {
  if (!el || typeof window === "undefined") return "default";

  let best: CursorState = "default";
  let bestPriority = PRIORITY.default;
  let current: Element | null = el;

  while (current && current !== document.documentElement) {
    const htmlEl = current as HTMLElement;
    const tag = htmlEl.tagName?.toLowerCase();
    const role = htmlEl.getAttribute?.("role");
    const cursorData = htmlEl.dataset?.cursor;
    const cs = window.getComputedStyle(htmlEl).cursor;

    let candidate: CursorState | null = null;

    if (cs === "grabbing") candidate = "grabbing";
    else if (cs === "grab") candidate = "grab";
    else if (
      tag === "a" ||
      tag === "button" ||
      tag === "label" ||
      role === "button" ||
      role === "link" ||
      role === "menuitem" ||
      cursorData === "hover" ||
      cs === "pointer"
    )
      candidate = "hover";
    else if (
      cs === "text" ||
      cs === "vertical-text" ||
      tag === "input" ||
      tag === "textarea" ||
      htmlEl.isContentEditable
    )
      candidate = "text";

    if (candidate && PRIORITY[candidate] > bestPriority) {
      best = candidate;
      bestPriority = PRIORITY[candidate];
      if (bestPriority === PRIORITY.grabbing) break;
    }

    current = current.parentElement;
  }

  return best;
}

export default function Cursor() {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  // const sx = useSpring(mx, SPRING);
  // const sy = useSpring(my, SPRING);

  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);
      setState(getState(e.target as Element));
    };
    const onOver = (e: MouseEvent) => setState(getState(e.target as Element));
    const onLeave = () => setVisible(false);
    const onDown = (e: MouseEvent) => {
      setClicking(true);
      setState(getState(e.target as Element));
    };
    const onUp = () => setClicking(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [mx, my, visible]);

  const isHover = state === "hover";
  const isText = state === "text";
  const isGrab = state === "grab" || state === "grabbing";
  const isGrabbing = state === "grabbing";
  const color = isHover ? BURNT : INK;

  /* ── crosshair geometry ── */
  const armInner = isHover ? 1 : GAP + SQ;
  const armOuter = armInner + ARM;

  /* ── animation targets ── */
  const groupRotate = isHover ? HOVER_ROTATE : 0;
  const groupScale = clicking ? 0.15 : 1;
  const strokeW = clicking ? STROKE_CLICK : isHover ? STROKE_HOVER : STROKE_DEFAULT;
  const squareScale = isHover ? 0 : clicking ? 0 : 1;
  const squareOpacity = isHover ? 0 : clicking ? 0 : 1;

  return (
    <motion.div
      ref={cursorRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden [@media(hover:hover)_and_(pointer:fine)]:block"
      style={{
        x: mx,
        y: my,
        translateX: "-50%",
        translateY: "-50%",
        opacity: visible ? 1 : 0,
      }}
    >
      <svg
        width="60"
        height="60"
        viewBox="-30 -30 60 60"
        overflow="visible"
        style={{ display: "block" }}
      >
        {/* ── TEXT: serif I-beam ── */}
        {isText && (
          <g>
            <line x1="0" y1="-13" x2="0" y2="13"
              stroke={INK} strokeWidth="1.5" strokeLinecap="square" />
            <line x1="-5" y1="-13" x2="5" y2="-13"
              stroke={INK} strokeWidth="1.5" strokeLinecap="square" />
            <line x1="-5" y1="13" x2="5" y2="13"
              stroke={INK} strokeWidth="1.5" strokeLinecap="square" />
          </g>
        )}

        {/* ── GRAB / GRABBING: brackets ── */}
        {isGrab && (
          <g>
            <motion.g animate={{ x: isGrabbing ? 2 : -1 }} transition={{ duration: 0.1 }}>
              <line x1="-8" y1="-10" x2="-8" y2="10"
                stroke={INK} strokeWidth="1.5" strokeLinecap="square" />
              <line x1="-8" y1="-10" x2="-4" y2="-10"
                stroke={INK} strokeWidth="1.5" strokeLinecap="square" />
              <line x1="-8" y1="10" x2="-4" y2="10"
                stroke={INK} strokeWidth="1.5" strokeLinecap="square" />
            </motion.g>
            <motion.g animate={{ x: isGrabbing ? -2 : 1 }} transition={{ duration: 0.1 }}>
              <line x1="8" y1="-10" x2="8" y2="10"
                stroke={INK} strokeWidth="1.5" strokeLinecap="square" />
              <line x1="8" y1="-10" x2="4" y2="-10"
                stroke={INK} strokeWidth="1.5" strokeLinecap="square" />
              <line x1="8" y1="10" x2="4" y2="10"
                stroke={INK} strokeWidth="1.5" strokeLinecap="square" />
            </motion.g>
            <circle cx="0" cy="0" r="1.5" fill={INK} />
          </g>
        )}

        {/* ── DEFAULT + HOVER ── */}
        {!isText && !isGrab && (
          <g>
            {/* Center square — gone on hover, shrinks on click */}
            <motion.rect
              x={-SQ}
              y={-SQ}
              width={SQ * 2}
              height={SQ * 2}
              fill={color}
              animate={{
                scale: squareScale,
                opacity: squareOpacity,
                fill: color,
              }}
              transition={{ type: "spring", stiffness: 600, damping: 22 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />

            {/* Outer group: shrinks on click */}
            <motion.g
              animate={{ scale: groupScale }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {/* Arms group: rotates 135° on hover */}
              <motion.g
                animate={{ rotate: groupRotate }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {/* TOP arm */}
                <motion.line
                  x1="0"
                  y1={-armInner}
                  x2="0"
                  y2={-armOuter}
                  stroke={color}
                  strokeLinecap="square"
                  strokeWidth={STROKE_DEFAULT}
                  animate={{
                    y1: -armInner,
                    y2: -armOuter,
                    stroke: color,
                    strokeWidth: strokeW,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
                {/* BOTTOM arm */}
                <motion.line
                  x1="0"
                  y1={armInner}
                  x2="0"
                  y2={armOuter}
                  stroke={color}
                  strokeLinecap="square"
                  strokeWidth={STROKE_DEFAULT}
                  animate={{
                    y1: armInner,
                    y2: armOuter,
                    stroke: color,
                    strokeWidth: strokeW,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
                {/* LEFT arm */}
                <motion.line
                  y1="0"
                  x1={-armInner}
                  x2={-armOuter}
                  stroke={color}
                  strokeLinecap="square"
                  strokeWidth={STROKE_DEFAULT}
                  animate={{
                    x1: -armInner,
                    x2: -armOuter,
                    stroke: color,
                    strokeWidth: strokeW,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
                {/* RIGHT arm */}
                <motion.line
                  y1="0"
                  x1={armInner}
                  x2={armOuter}
                  stroke={color}
                  strokeLinecap="square"
                  strokeWidth={STROKE_DEFAULT}
                  animate={{
                    x1: armInner,
                    x2: armOuter,
                    stroke: color,
                    strokeWidth: strokeW,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              </motion.g>
            </motion.g>
          </g>
        )}
      </svg>
    </motion.div>
  );
}