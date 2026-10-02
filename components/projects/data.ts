import projectsData from "../../data/projects.json";

export interface Project {
  id: string;
  title: string;
  year: string;
  type: string;
  summary: string;
  description: string;
  tech: string[];
  metrics: { label: string; value: string }[];
  links: { github?: string; live?: string };
  image: string; // purana single image (fallback)
  images?: string[]; // screenshots / gifs / logo, e.g. ["/projects/dc-1.png", "/projects/dc-demo.gif"]
  featured: boolean;
}

export const PROJECTS: Project[] = projectsData.projects as Project[];

export const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "fullstack", label: "Full-Stack" },
  { key: "iot", label: "IoT" },
  { key: "hardware", label: "Hardware" },
] as const;

export const getCategory = (type: string): string => {
  if (type.includes("IoT") || type.includes("Embedded")) return "iot";
  if (type.includes("VLSI") || type.includes("Hardware")) return "hardware";
  return "fullstack";
};

export const filterProjects = (key: string): Project[] =>
  key === "all" ? PROJECTS : PROJECTS.filter((p) => getCategory(p.type) === key);

// images[] ho toh wahi, warna purana image field, warna khali
export const getImages = (p: Project): string[] =>
  p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [];