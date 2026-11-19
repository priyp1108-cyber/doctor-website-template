import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/links";

export default function sitemap(): MetadataRoute.Sitemap {
  // Later: add /conditions/[slug] entries from site.concerns.
  return [{ url: `${siteUrl()}/`, changeFrequency: "monthly", priority: 1 }];
}
