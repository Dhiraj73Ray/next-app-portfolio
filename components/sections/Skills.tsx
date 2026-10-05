"use client";

import { StackLayout, type Tokens } from "rush-hour-skills";
import "rush-hour-skills/style.css";
import { SKILL_PUZZLES } from "../../data/skills";

const tokens: Partial<Tokens> = {
  // surface / text
  bg: "transparent",
  text: "var(--black)",
  muted: "var(--olive)",
  accent: "var(--orange)",
  success: "var(--olive)",

  // panels
  panelGradient: "var(--cream)",
  panelBorder: "rgba(26, 26, 26, 0.55)",

  // tray
  trayBg: "#E6DFCE",
  trayShadow: "inset 0 0 0 1px rgba(26, 26, 26, 0.12)",

  // preview tray
  previewTrayBg: "#E6DFCE",

  // buttons
  btnBg: "transparent",
  btnBgHover: "rgba(217, 83, 30, 0.12)",
  btnBorder: "rgba(26, 26, 26, 0.55)",

  // dots
  dotBg: "rgba(26, 26, 26, 0.2)",

  // blocks (cars)
  blockMainBg: "var(--orange)",
  blockObstacleBg: "var(--olive)",
  blockDarkOverlay: "#C9BFA8",
  blockShadow: "0 6px 14px rgba(26, 26, 26, 0.25)",
  blockRadius: "10px",

  // preview pieces
  previewPieceBg: "var(--olive)",
  previewMainBg: "var(--orange)",

  // exit
  exitBg: "var(--orange)",
  exitGlow: "0 0 0 2px rgba(217, 83, 30, 0.35)",

  // lock
  lockBg: "rgba(244, 239, 230, 0.88)",
  lockIconColor: "var(--black)",

  // sizing
  radius: "10px",
  radiusInner: "6px",
};

export default function Skills() {
  return (
    <section id="skills">
      <StackLayout
        puzzles={SKILL_PUZZLES}
        tokens={tokens}
        header={{
          title: "UNLOCK MY SKILLS",
          subtitle: "Slides out the orange car through the exit.",
        }}
      />
    </section>
  );
}
