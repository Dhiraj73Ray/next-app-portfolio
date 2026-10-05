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
/**
 * SKILL PUZZLES — Rush Hour Skills (13 levels). All levels verified solvable by BFS.
 *
 * Notation: space-separated rows, "." empty, letter = car. Car "A" is the main car and must
 * reach the exit. exit.side must match A's orientation (top/bottom = vertical, left/right = horizontal)
 * and exit.position must equal A's column (vertical) or row (horizontal).
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
    skills: {
      A: "Python",
      B: "JavaScript",
      C: "SQL",
    },
  },
  {
    id: "stack",
    title: "The Stack",
    subtitle: "Production stack behind my projects.",
    puzzle: ".A.... .A..C. .A..C. .BBB.. ...... ......",
    exit: { side: "bottom", position: 1 },
    skills: {
      A: "React",
      B: "FastAPI",
      C: "PostgreSQL",
    },
  },
  {
    id: "arsenal",
    title: "Frontend Arsenal",
    subtitle: "The toolkit behind every interface I ship.",
    puzzle: "..BBC. ..D.C. ..D.CA ..E..A ..E..A ..EFFF",
    exit: { side: "bottom", position: 5 },
    skills: {
      A: "Next.js",
      B: "Vite",
      C: "Framer Motion",
      D: "GSAP",
      E: "Tailwind CSS",
      F: "TypeScript",
    },
  },
  {
    id: "cloud",
    title: "Ship It",
    subtitle: "Where the code goes live.",
    puzzle: "BB... .A... .A..C DD..C EEE.C",
    exit: { side: "bottom", position: 1 },
    skills: {
      A: "Vercel",
      B: "GitHub",
      C: "Cloudflare",
      D: "Render",
      E: "Netlify",
    },
  },
  {
    id: "tools",
    title: "The Toolbelt",
    subtitle: "What I reach for every single day.",
    puzzle: "B.DDD B..E. CC.E. ...F. .AAF.",
    exit: { side: "right", position: 4 },
    skills: {
      A: "VS Code",
      B: "Postman",
      C: "Deepseek",
      D: "npm / pip",
      E: "Git / Github",
      F: "Powershell",
    },
  },
  {
    id: "security",
    title: "Lockdown",
    subtitle: "Know how it breaks, so it doesn't.",
    puzzle: "EED.C A.D.C ABB.C ..... .....",
    exit: { side: "top", position: 0 },
    skills: {
      A: "Kali Linux",
      B: "OAuth 2.0",
      C: "Wireshark",
      D: "OSI Model",
      E: "TCP/IP",
    },
  },
  {
    id: "database",
    title: "Data Vault",
    subtitle: "Where everything gets remembered.",
    puzzle: "...... .A.... .ABBB. CC.D.. EEFD.. ..FD..",
    exit: { side: "bottom", position: 1 },
    skills: {
      A: "PostgreSQL",
      B: "MySQL",
      C: "Supabase",
      D: "TabPlus",
      E: "SQLite",
      F: "MongoDB",
    },
  },
  {
    id: "backend",
    title: "Server Room",
    subtitle: "The engine behind every endpoint.",
    puzzle: "...E.. ...EAA ...E.. ...BBB F..CCC F.DDD.",
    exit: { side: "left", position: 1 },
    skills: {
      A: "FastAPI",
      B: "REST API",
      C: "Node.js",
      D: "Express",
      E: "Flask",
      F: "JWT",
    },
  },
  {
    id: "frontend",
    title: "Pixel Pushers",
    subtitle: "Everything you can see and touch.",
    puzzle: ".A.B.. .A.B.. CC.B.. DD.EE. .FFFG. ....G.",
    exit: { side: "bottom", position: 1 },
    skills: {
      A: "React",
      B: "Framer Motion",
      C: "Next.js",
      D: "Zustand",
      E: "Vite",
      F: "Tailwind CSS",
      G: "GSAP",
    },
  },
  {
    id: "ai",
    title: "Neural Garage",
    subtitle: "Models, prompts and local LLM tinkering.",
    puzzle: ".BCCC. .B.... ..DD.G AAAEFG ...EFG ...E..",
    exit: { side: "right", position: 3 },
    skills: {
      A: "Claude API",
      B: "PyTorch",
      C: "Prompt Eng.",
      D: "Ollama",
      E: "OpenAI API",
      F: "Gemini",
      G: "LangChain",
    },
  },
  {
    id: "cs",
    title: "First Principles",
    subtitle: "The theory that keeps the code honest.",
    puzzle: "B..... B..... BCCC.. DDEA.. .FEA.. .FGGG.",
    exit: { side: "bottom", position: 3 },
    skills: {
      A: "DSA",
      B: "Design Patterns",
      C: "OS Concepts",
      D: "Linux CLI",
      E: "DBMS",
      F: "OOP",
      G: "Networking",
    },
  },
  {
    id: "hardware",
    title: "Hardware Hour",
    subtitle: "ECE roots: wires, signals and microcontrollers.",
    puzzle: "...HH. .GGGF. .EEEFD ..ACCD ..A.BB ......",
    exit: { side: "top", position: 2 },
    skills: {
      A: "Arduino",
      B: "ADC/DAC",
      C: "LTSpice",
      D: "ESP32",
      E: "Raspberry Pi",
      F: "MQTT",
      G: "I2C / SPI",
      H: "DSP",
    },
  },
  {
    id: "everything",
    title: "The Final Boss",
    subtitle: "Nine cars, one exit. Everything I have got.",
    puzzle: ".ABBB. .A.C.D EE.CFD ..GGF. .HHHF. .II...",
    exit: { side: "bottom", position: 1 },
    skills: {
      A: "Python",
      B: "PostgreSQL",
      C: "Next.js",
      D: "Arduino",
      E: "React",
      F: "Claude API",
      G: "JWT",
      H: "FastAPI",
      I: "DSA",
    },
  },
];