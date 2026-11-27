/**
 * The Journal: short articles by Dr. Panda, for patients or for clinicians.
 *
 * Each article is one Markdoc file in src/content/articles/ (front matter +
 * body). Dr. Panda edits them in the Keystatic editor at /keystatic (see
 * keystatic.config.ts and README "Website editor"); developers can also edit
 * the files directly.
 *
 * The five articles that ship with the template are DRAFT outlines. Before
 * one goes live, Dr. Panda must rewrite it in his own words, replace the
 * {% pending %} notes and untick "Draft". With NEXT_PUBLIC_HIDE_PENDING=1
 * drafts are left out of the site, the RSS feed and the sitemap.
 *
 * Same NMC rules as site.ts: no testimonials, results promised, superlatives,
 * prices or before/after images. tests/unit/content.test.ts checks the wording.
 *
 * Server-only: reads files from disk. Client components must not import it.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";

export type Audience = "patients" | "clinicians";

export const audiences: Record<Audience, { label: string; title: string; intro: string }> = {
  patients: {
    label: "For patients",
    title: "For patients",
    intro: "Plain-language notes on common skin and hair problems, and on getting the most from a visit.",
  },
  clinicians: {
    label: "For clinicians",
    title: "For clinicians",
    intro: "Notes for doctors: referral pointers, case discussions and updates from dermatology meetings.",
  },
};

export type Article = {
  /** File name without .mdoc; the URL is /journal/<slug>. */
  slug: string;
  title: string;
  /** One or two sentences for the list, the RSS feed and link previews. */
  summary: string;
  audience: Audience;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** True until Dr. Panda has reviewed and approved it. */
  draft: boolean;
  /** Treatment slugs from site.treatments, linked under the article. */
  related?: string[];
  /** Markdoc source. Rendered by src/components/ArticleBody.tsx. */
  body: string;
};

export const articlesDir = join(process.cwd(), "src", "content", "articles");

const frontMatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** Parses one article file. Throws with the file name if a field is missing or wrong. */
export function parseArticle(slug: string, source: string): Article {
  const m = frontMatter.exec(source);
  if (!m) throw new Error(`${slug}.mdoc: missing front matter (--- ... ---)`);
  // JSON schema keeps dates as plain strings ("2026-11-20").
  const data = (yaml.load(m[1]!, { schema: yaml.JSON_SCHEMA }) ?? {}) as Record<string, unknown>;
  const str = (key: string) => {
    const v = data[key];
    if (typeof v !== "string" || !v.trim()) throw new Error(`${slug}.mdoc: "${key}" is missing`);
    return v.trim();
  };
  const audience = str("audience");
  if (!(audience in audiences)) throw new Error(`${slug}.mdoc: unknown audience "${audience}"`);
  const related = Array.isArray(data.related) ? data.related.filter((r): r is string => typeof r === "string") : [];
  return {
    slug,
    title: str("title"),
    summary: str("summary"),
    audience: audience as Audience,
    date: str("date"),
    draft: data.draft !== false,
    related: related.length ? related : undefined,
    body: m[2]!.trim(),
  };
}

function loadArticles(): Article[] {
  return readdirSync(articlesDir)
    .filter((f) => f.endsWith(".mdoc"))
    .map((f) => parseArticle(f.slice(0, -".mdoc".length), readFileSync(join(articlesDir, f), "utf8")));
}

let cache: Article[] | undefined;

/**
 * Every article, drafts included. Production builds read the files once.
 * In dev they are re-read on every call: the dev server doesn't know the
 * .mdoc files are dependencies, so a cached copy would miss articles saved
 * from the editor until a restart.
 */
export function allArticles(): Article[] {
  if (process.env.NODE_ENV !== "development") return (cache ??= loadArticles());
  return loadArticles();
}

/** Articles shown on the site: everything while drafts are visible, otherwise only approved ones. Newest first. */
export function visibleArticles(showDrafts: boolean): Article[] {
  return allArticles().filter((a) => showDrafts || !a.draft).sort((a, b) => b.date.localeCompare(a.date));
}
