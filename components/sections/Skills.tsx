"use client";

/*
  SKILLS — "The Card Catalogue"
  Ek purani library ka cabinet. Har category = ek drawer. Drawer kholo -> index cards ki row,
  drag / swipe karke riffle karo. Hover-inspect ya pin nahi: har card par details pehle se chhapi hain.

  Data: data/skillsData.ts (SKILLS, SKILL_CATEGORIES). Sirf id, name, cat, desc use hote hain.
  Toggle: title ke saamne wala button catalogue <-> "unlock my skills" puzzle (rush-hour-skills) switch karta hai.
  Dependencies: framer-motion, Tailwind, rush-hour-skills, lucide-react.
*/

import { useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SKILLS, SKILL_CATEGORIES } from "../../data/skillsData";
import {
  StackLayout,
  type Tokens,
  type Slots,
  type HeaderSlotProps,
  type CaptionSlotProps,
} from "rush-hour-skills";
import "rush-hour-skills/style.css";
import { Archive, Puzzle } from "lucide-react";
import { SKILL_PUZZLES } from "../../data/skills";

type CatKey = keyof typeof SKILL_CATEGORIES;
const CAT_KEYS = Object.keys(SKILL_CATEGORIES) as CatKey[];
const pad = (n: number) => String(n).padStart(2, "0");

// Paper aur ledger lines (index card ka classic red header rule + blue-ish ruled lines, theme ke rang mein)
const RULED: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0, transparent 19px, rgba(26,26,26,0.14) 19px, rgba(26,26,26,0.14) 20px)",
  backgroundPosition: "0 4px",
};

function IndexCard({ skill, code, no, i, reduce }: { skill: (typeof SKILLS)[number]; code: string; no: number; i: number; reduce: boolean }) {
  // Deterministic halka tilt, taaki cards haath se rakhe hue lagein
  const tilt = (((i * 37) % 5) - 2) * 0.5;
  const tabLeft = 8 + (i % 3) * 30;

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, x: -24, rotate: tilt - 3 }}
      animate={{ opacity: 1, x: 0, rotate: tilt }}
      transition={{ duration: 0.35, delay: reduce ? 0 : Math.min(i, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="relative mt-5 h-[300px] w-[232px] shrink-0 snap-start list-none sm:w-[248px]"
    >
      {/* Divider tab, jo card ke upar nikla hota hai */}
      <span
        aria-hidden="true"
        style={{ left: `${tabLeft}%` }}
        className="absolute -top-[22px] z-0 border-2 border-b-0 border-ink bg-[#FBF7EE] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink"
      >
        {code}·{pad(no)}
      </span>

      <article className="relative z-10 flex h-full flex-col border-2 border-ink bg-[#FBF7EE] p-4 shadow-[3px_3px_0_0_rgba(26,26,26,0.18)]">
        <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest text-olive">
          <span>Call no.</span>
          <span>{code}-{pad(no)}</span>
        </div>

        <h3 className="mt-2 border-b-2 border-swiss pb-1.5 font-serif text-[28px] font-bold leading-[1.05] tracking-tight text-ink">
          {skill.name}
        </h3>

        {/* Typewriter body on ruled lines */}
        <p style={RULED} className="mt-2 flex-1 overflow-hidden font-mono text-[11px] leading-[20px] text-ink/85">
          {skill.desc}
        </p>

        {/* Punched hole + stamp */}
        <div className="relative mt-2 flex h-9 items-end justify-center">
          <span aria-hidden="true" className="size-3.5 rounded-full border-2 border-ink bg-[#E6DFCE] shadow-[inset_1px_1px_0_rgba(26,26,26,0.35)]" />
          <span
            aria-hidden="true"
            className="absolute bottom-0 right-0 -rotate-6 border-2 border-burnt px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest text-burnt/90"
          >
            Filed · {code}
          </span>
        </div>
      </article>
    </motion.li>
  );
}

function Drawer({
  ck, index, open, onToggle, reduce,
}: { ck: CatKey; index: number; open: boolean; onToggle: () => void; reduce: boolean }) {
  const code = String.fromCharCode(65 + index);
  const cards = SKILLS.filter((s) => s.cat === ck);
  const first = `${code}-01`;
  const last = `${code}-${pad(cards.length)}`;

  const trayRef = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [pos, setPos] = useState(1);

  const onDown = (e: RPointerEvent<HTMLUListElement>) => {
    const el = trayRef.current;
    if (!el || e.pointerType !== "mouse") return;
    drag.current = { x: e.clientX, left: el.scrollLeft };
    el.style.scrollSnapType = "none";
    el.setPointerCapture(e.pointerId);
  };
  const onMove = (e: RPointerEvent<HTMLUListElement>) => {
    const el = trayRef.current;
    if (!el || !drag.current) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const onUp = () => {
    const el = trayRef.current;
    drag.current = null;
    if (el) el.style.scrollSnapType = "";
  };
  const onScroll = () => {
    const el = trayRef.current;
    if (!el) return;
    const cardW = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 240;
    setPos(Math.min(cards.length, Math.round(el.scrollLeft / (cardW + 12)) + 1));
  };

  return (
    <div className="border-2 border-b-0 border-ink last:border-b-2">
      {/* DRAWER FRONT */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`drawer-${ck}`}
        className={`group flex w-full cursor-pointer items-center gap-4 px-4 py-4 text-left transition-colors duration-200 md:gap-8 md:px-8 ${
          open ? "bg-ink text-cream" : "bg-cream text-ink hover:bg-ink/5"
        }`}
      >
        <span className="w-8 font-serif text-3xl font-bold leading-none md:w-12 md:text-5xl">{code}</span>

        {/* Brass-style label holder */}
        <span
          className={`flex-1 border-2 px-3 py-2 md:flex-none md:min-w-[320px] ${
            open ? "border-cream/70" : "border-ink"
          }`}
        >
          <span className="block border border-dashed border-current/40 px-2 py-1 text-center font-mono text-[11px] uppercase tracking-[0.2em] md:text-xs">
            {SKILL_CATEGORIES[ck].label}
          </span>
        </span>

        <span className="hidden font-mono text-[11px] uppercase tracking-widest opacity-70 md:inline">
          {first} → {last}
        </span>

        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest opacity-70 md:text-xs">
          {pad(cards.length)} cards
        </span>

        {/* Knob */}
        <span
          aria-hidden="true"
          className={`size-5 shrink-0 rounded-full border-2 transition-all duration-300 ${
            open ? "border-cream bg-burnt" : "border-ink bg-cream group-hover:bg-burnt"
          }`}
        />
      </button>

      {/* TRAY */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`drawer-${ck}`}
            key="tray"
            initial={reduce ? false : { height: 0 }}
            animate={{ height: "auto" }}
            exit={reduce ? undefined : { height: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-[#E6DFCE]"
          >
            <div className="shadow-[inset_0_6px_8px_-6px_rgba(26,26,26,0.45)]">
              <ul
                ref={trayRef}
                onScroll={onScroll}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                tabIndex={0}
                aria-label={`${SKILL_CATEGORIES[ck].label} cards`}
                className="flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-6 pt-3 active:cursor-grabbing md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {cards.map((s, i) => (
                  <IndexCard key={s.id} skill={s} code={code} no={i + 1} i={i} reduce={!!reduce} />
                ))}
                <li aria-hidden="true" className="w-8 shrink-0" />
              </ul>

              <div className="flex items-center justify-between border-t border-ink/20 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ink/60 md:px-8">
                <span>[ drag / swipe to riffle ]</span>
                <span>
                  card {pad(pos)} / {pad(cards.length)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const tokens: Partial<Tokens> = {
  bg: "transparent",
  text: "var(--black)",
  muted: "var(--olive)",
  accent: "var(--orange)",
  success: "var(--olive)",
  panelGradient: "var(--cream)",
  panelBorder: "rgba(26, 26, 26, 0.55)",
  trayBg: "#E6DFCE",
  trayShadow: "inset 0 0 0 1px rgba(26, 26, 26, 0.12)",
  previewTrayBg: "#E6DFCE",
  btnBg: "transparent",
  btnBgHover: "rgba(217, 83, 30, 0.12)",
  btnBorder: "rgba(26, 26, 26, 0.55)",
  dotBg: "rgba(26, 26, 26, 0.2)",
  blockMainBg: "var(--orange)",
  blockObstacleBg: "var(--olive)",
  blockDarkOverlay: "#C9BFA8",
  blockShadow: "0 6px 14px rgba(26, 26, 26, 0.25)",
  blockRadius: "10px",
  previewPieceBg: "var(--olive)",
  previewMainBg: "var(--orange)",
  exitBg: "var(--orange)",
  exitGlow: "0 0 0 2px rgba(217, 83, 30, 0.35)",
  lockBg: "rgba(244, 239, 230, 0.88)",
  lockIconColor: "var(--black)",
  radius: "10px",
  radiusInner: "6px",
};

const VISIBLE_DRAWERS = 5;

function Cabinet({ reduce }: { reduce: boolean }) {
  const [openKey, setOpenKey] = useState<CatKey | null>(CAT_KEYS[0]);
  const [expanded, setExpanded] = useState(false);

  const renderDrawer = (ck: CatKey, i: number) => (
    <Drawer
      key={ck}
      ck={ck}
      index={i}
      reduce={reduce}
      open={openKey === ck}
      onToggle={() => setOpenKey((cur) => (cur === ck ? null : ck))}
    />
  );

  const linkBtn =
    "cursor-pointer font-mono text-xs uppercase tracking-widest text-ink underline decoration-burnt decoration-2 underline-offset-4 transition-colors hover:text-burnt";

  return (
    <>
      <div className="relative">
        <div className="border-x-0 shadow-[8px_8px_0_0_#1A1A1A]">
          <div className="border-2 border-ink bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cream md:px-8">
            Skills Index · Est. 2026 · Please return cards to their drawer
          </div>

          {CAT_KEYS.slice(0, VISIBLE_DRAWERS).map((ck, i) => renderDrawer(ck, i))}

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="more"
                initial={reduce ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reduce ? undefined : { height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                {CAT_KEYS.slice(VISIBLE_DRAWERS).map((ck, i) => renderDrawer(ck, i + VISIBLE_DRAWERS))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fade over the last visible drawer + "see more" link */}
        {!expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-36 items-end justify-center bg-gradient-to-t from-cream via-cream/85 to-transparent pb-4">
            <button type="button" onClick={() => setExpanded(true)} className={`pointer-events-auto ${linkBtn}`}>
              See more · {CAT_KEYS.length - VISIBLE_DRAWERS} more drawers ↓
            </button>
          </div>
        )}
      </div>

      {expanded && (
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={() => setExpanded(false)} className={linkBtn}>
            See less ↑
          </button>
        </div>
      )}
    </>
  );
}

/*
  Puzzle title ab board ke UPAR hai.
  Package ka header slot sirf `index` deta hai (puzzle config nahi), isliye hum
  SKILL_PUZZLES[index] se title/subtitle uthate hain. Package ka apna main
  title/subtitle ("UNLOCK MY SKILLS") ab bilkul render nahi hota, kyunki slot usko replace kar deta hai.
  Slot components module scope mein hain, taaki har render par naye component na bane (warna remount hota).
*/
function PuzzleHeader({ index }: HeaderSlotProps) {
  const p = SKILL_PUZZLES[index];
  if (!p) return null;
  return (
    <div className="mb-4 text-center">
      <h3 className="font-serif text-2xl font-bold leading-tight tracking-tight text-ink md:text-3xl">
        {p.title}
      </h3>
      {/* min-h: mobile par lambe subtitle 2 line lete hain, isse level badalne par board upar-neeche nahi kudta */}
      <p className="mx-auto mt-1 min-h-9 max-w-md text-balance font-mono text-[11px] uppercase leading-relaxed tracking-wider text-olive sm:min-h-0">
        {p.subtitle}
      </p>
    </div>
  );
}

// Title upar chala gaya, neeche sirf "01 / 13" bacha. Theme tokens (muted) follow karta hai.
function PuzzleIndex({ index, total }: CaptionSlotProps) {
  return (
    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-olive tabular-nums">
      {pad(index + 1)} / {pad(total)}
    </span>
  );
}

const PUZZLE_SLOTS: Slots = { header: PuzzleHeader, caption: PuzzleIndex };

function PuzzleBoard() {
  return <StackLayout puzzles={SKILL_PUZZLES} tokens={tokens} slots={PUZZLE_SLOTS} />;
}

export default function Skills() {
  const reduce = !!useReducedMotion();
  const [mode, setMode] = useState<"catalogue" | "puzzle">("catalogue");
  const isPuzzle = mode === "puzzle";

  return (
    <section id="skills" className="relative border-b-4 border-ink bg-cream px-6 py-16 md:px-16 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className={isPuzzle ? "mb-8" : "mb-12"}>
          <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-ink">[ 02 — SKILLS ]</span>

          {/* Title + switch on one horizontal line */}
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
            <h2 className="font-serif text-5xl leading-none tracking-tight text-ink md:text-7xl">
              {isPuzzle ? "The Skill vault" : "The Skill catalogue"}
              <span className="italic font-normal text-swiss">.</span>
            </h2>

            <button
              type="button"
              onClick={() => setMode(isPuzzle ? "catalogue" : "puzzle")}
              className="group inline-flex cursor-pointer items-center gap-3 border-2 border-ink bg-cream px-4 py-3 font-mono text-xs uppercase tracking-wider text-ink shadow-[4px_4px_0_0_#1A1A1A] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-burnt hover:text-cream hover:shadow-[6px_6px_0_0_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
              {isPuzzle ? <Archive className="size-4 shrink-0" /> : <Puzzle className="size-4 shrink-0" />}
              {isPuzzle ? (
                <span>
                  Back to the <b className="font-bold">card catalogue</b>
                </span>
              ) : (
                <span>
                  Wanna play with{" "}
                  <span className="bg-ink px-1.5 py-0.5 text-cream transition-colors group-hover:bg-cream group-hover:text-ink">
                    unlock my skills
                  </span>
                  ?
                </span>
              )}
            </button>
          </div>

          <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-ink/70">
            {isPuzzle
              ? `Free the orange car and each level unlocks a stack of skills.`
              : `${SKILLS.length} skills, filed by hand into ${CAT_KEYS.length} drawers. Pull one open and riffle through the cards.`}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {isPuzzle ? <PuzzleBoard /> : <Cabinet reduce={reduce} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}