/**
 * SKILL PUZZLES — Rush Hour Skills
 *
 * Puzzle notation:
 *   Space-separated rows. Each row = one row of the grid.
 *   '.' = empty cell  |  Letter = car occupying that cell
 *
 * Rules:
 *   - Car 'A' is ALWAYS the main car (burnt-orange, must reach exit)
 *   - Exit direction must match A's orientation:
 *       side "bottom" or "top" → A must be VERTICAL (appears in same column, multiple rows)
 *       side "left" or "right" → A must be HORIZONTAL (same row, multiple cols)
 *   - A's column/row must equal exit.position
 *   - All cars must have length ≥ 2
 *   - Puzzle must NOT already be solved on load
 *
 * Adding more puzzles:
 *   Just push more objects into this array.
 *   id must be unique. skills object maps letter → skill name shown on the car.
 */

export interface SkillPuzzle {
  id: string;
  title: string;
  subtitle: string;
  puzzle: string;
  exit: { side: "top" | "bottom" | "left" | "right"; position: number };
  skills: Record<string, string>;
}

export const SKILL_PUZZLES: SkillPuzzle[] = [
  {
    id: "foundation",
    title: "Foundation",
    subtitle: "The three languages everything starts with.",
    puzzle: ".A.. .A.C .A.C .BBC",
    exit: { side: "bottom", position: 1 },
    skills: { A: "Python", B: "JS", C: "SQL" },
  },
  {
    id: "stack",
    title: "The Stack",
    subtitle: "Production stack behind my projects.",
    puzzle: ".A.... .A..C. .A..C. .BBB.. ...... ......",
    exit: { side: "bottom", position: 1 },
    skills: { A: "React", B: "FastAPI", C: "PostgreSQL" },
  },
  {
    id: "arsenal",
    title: "Full Arsenal",
    subtitle: "Everyday essentials — the whole toolkit.",
    puzzle: "...... .A.... .A.DD. .A.EE. .BBB.C .....C",
    exit: { side: "bottom", position: 1 },
    skills: {
      A: "Next.js",
      B: "Tailwind",
      C: "SQLAlchemy",
      D: "Docker",
      E: "TypeScript",
    },
  },
];