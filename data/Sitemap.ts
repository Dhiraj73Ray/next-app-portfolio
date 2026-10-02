import type { MetadataRoute } from "next";
import { site } from "../data/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified: new Date() }];
}