import raw from "./site.json";

export interface SiteConfig {
  name: string;
  role: string;
  tagline: string;
  focus: string; // short line for the Hero meta box
  url: string;
  email: string;
  location: string;
  timezone: string; // IANA, e.g. "Asia/Kolkata"
  availability: {
    open: boolean;
    label: string;
  };
  about: {
    short: string;
    long: string;
    facts: {
      label: string;
      value: string;
    }[];
    philosophy: {
      id: string;
      title: string;
      description: string;
    }[];
    background: {
      intro: string;
      sections: {
        title: string;
        content: string;
      }[];
      runtime: {
        status: string;
        up_time: string;
        fuel_sources: string[];
      };
    };
  };
  responseTime: string;
  resume: string; // e.g. "/resume.pdf" (file public/ mein). Khali = button hidden
  socials: {
    label: string;
    url: string;
  }[];
  nav: {
    label: string;
    href: string;
  }[];
  topics: string[];
}

export const site: SiteConfig = raw;