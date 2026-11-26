import type { MetadataRoute } from "next";
import { audiences, type Audience } from "@/content/journal";
import { siteUrl } from "@/lib/links";
import { allTreatments, articleHref, audienceHref, journalArticles, treatmentHref } from "@/lib/pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/treatments`, changeFrequency: "monthly", priority: 0.8 },
    ...allTreatments().map(({ treatment }) => ({ url: `${base}${treatmentHref(treatment.slug)}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${base}/journal`, changeFrequency: "weekly", priority: 0.6 },
    ...(Object.keys(audiences) as Audience[]).map((a) => ({ url: `${base}${audienceHref(a)}`, changeFrequency: "weekly" as const, priority: 0.5 })),
    // Drafts carry noindex, so only approved articles go in the sitemap.
    ...journalArticles()
      .filter((a) => !a.draft)
      .map((a) => ({ url: `${base}${articleHref(a.slug)}`, lastModified: a.date, changeFrequency: "yearly" as const, priority: 0.5 })),
    { url: `${base}/for-doctors`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
