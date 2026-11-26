import { site, type Treatment, type TreatmentGroup } from "@/content/site";
import { articles, visibleArticles, type Article, type Audience } from "@/content/journal";
import { showPending } from "./pending";

/** Every treatment with its group, in menu order. */
export function allTreatments(): { group: TreatmentGroup; treatment: Treatment }[] {
  return site.treatments.flatMap((group) => group.treatments.map((treatment) => ({ group, treatment })));
}

export function findTreatment(slug: string) {
  return allTreatments().find((t) => t.treatment.slug === slug);
}

export const treatmentHref = (slug: string) => `/treatments/${slug}`;
export const articleHref = (slug: string) => `/journal/${slug}`;
export const audienceHref = (a: Audience) => `/journal/for/${a}`;

/** Journal articles on the site (drafts included until launch), newest first. */
export function journalArticles(audience?: Audience): Article[] {
  return visibleArticles(showPending).filter((a) => !audience || a.audience === audience);
}

export function findArticle(slug: string): Article | undefined {
  return journalArticles().find((a) => a.slug === slug);
}

/** Every article regardless of status, for tests. */
export { articles };

/** "2026-11-20" → "20 November 2026". */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
