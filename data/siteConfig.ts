import raw from "./site.json";

export interface SiteConfig {
  name: string;
  role: string;
  tagline: string;
  url: string;
  email: string;
  location: string;
  timezone: string; // IANA, e.g. "Asia/Kolkata"
  availability: { open: boolean; label: string };
  responseTime: string;
  resume: string; // e.g. "/resume.pdf" (file public/ mein). Khali = button hidden
  socials: { label: string; url: string }[];
  nav: { label: string; href: string }[];
  topics: string[];
}

export const site: SiteConfig = raw;