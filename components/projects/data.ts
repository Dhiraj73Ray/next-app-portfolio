import projectsData from "../../data/projects.json";

export interface Project {
  id: string;
  title: string;
  year: string;
  type: string;
  summary: string;
  description: string;
  tech: string[];
  facts: { label: string; value: string }[];
  links: { github?: string; live?: string };
  images: string[];
  featured: boolean;
  topics?: string[];
  categories?: string[];
}

const featured = (projectsData.projects ?? []) as Project[];
const backup = ((projectsData as any).backup_projects ?? []) as Project[];
const learning = ((projectsData as any).learning_projects ?? []) as Project[];

export const PROJECTS: Project[] = [...featured, ...backup, ...learning];

export const CATEGORIES = [
  { key: "all",       label: "All" },
  { key: "frontend",  label: "Frontend" },
  { key: "backend",   label: "Backend" },
  { key: "fullstack", label: "Full-Stack" },
  { key: "python",    label: "Python" },
  { key: "iot",       label: "IoT" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export const getCategories = (p: Project): string[] => p.categories ?? [];

export const filterProjects = (key: string): Project[] =>
  key === "all" ? PROJECTS : PROJECTS.filter((p) => getCategories(p).includes(key));

export const getImages = (p: Project): string[] => p.images ?? [];