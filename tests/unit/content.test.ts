import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildTreatmentGroups, site, treatmentGroupInfo, type TreatmentFileEntry } from "@/content/site";
import treatmentsFile from "@/content/treatments.json" with { type: "json" };
import { findConfirmValues, shownFaqs } from "@/lib/placeholder";
import { buildJsonLd } from "@/lib/schema";
import { allArticles, articlesDir, audiences, parseArticle } from "@/content/journal";
import { validateBody } from "@/lib/markdoc";
import { allTreatments } from "@/lib/pages";

const articles = allArticles();
const banned = /\b(best|no\.\s?1|number one|top|leading|guarantee[d]?|permanent|100\s?%|discount|offer)\b/i;

const srcDir = fileURLToPath(new URL("../../src/", import.meta.url));
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : /\.(tsx?|css)$/.test(e.name) ? [join(dir, e.name)] : [],
  );

describe("content & compliance", () => {
  it("finds [CONFIRM] placeholders by path", () => {
    expect(findConfirmValues({ a: { b: "[CONFIRM] x" }, c: ["ok", "[CONFIRM]"] })).toEqual(["a.b", "c[1]"]);
  });

  it("concerns have unique slugs", () => {
    const slugs = site.concerns.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("JSON-LD has Physician and MedicalClinic, FAQPage only when the FAQ is shown, and no ratings or reviews", () => {
    const json = JSON.stringify(buildJsonLd());
    expect(json).toContain('"Physician"');
    expect(json).toContain('"MedicalClinic"');
    // The FAQ section and its schema appear together (three or more answers).
    expect(json.includes('"FAQPage"')).toBe(shownFaqs(site.faqs).length > 0);
    expect(json).not.toMatch(/aggregateRating|"review"/i);
  });

  it("JSON-LD names the site with both the clinic and the doctor", () => {
    const graph = buildJsonLd()["@graph"] as { "@type": string; name?: string; alternateName?: unknown }[];
    const website = graph.find((n) => n["@type"] === "WebSite");
    expect(website?.name).toBe("SA Skincure Dr. Anil Kumar Panda");
    expect(website?.alternateName).toEqual(["SA Skincure", "Dr. Anil Kumar Panda"]);
    expect(graph.find((n) => n["@type"] === "MedicalClinic")?.name).toBe(site.name);
  });

  it("treatment slugs are unique across groups", () => {
    const slugs = allTreatments().map((t) => t.treatment.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("journal articles have unique slugs, a known audience, ISO dates and real related treatments", () => {
    const slugs = articles.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const treatments = new Set(allTreatments().map((t) => t.treatment.slug));
    for (const a of articles) {
      expect(Object.keys(audiences)).toContain(a.audience);
      expect(a.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const r of a.related ?? []) expect(treatments.has(r), `${a.slug} → ${r}`).toBe(true);
    }
  });

  it("no banned NMC wording in copy", () => {
    expect(JSON.stringify(site)).not.toMatch(banned);
  });

  // Articles come from the Journal editor, so each failure names the
  // article and the word: this message is what the reviewer sees on the PR.
  it.each(articles.map((a) => [a.slug, a] as const))("no banned NMC wording in article %s", (slug, a) => {
    const found = JSON.stringify(a).match(banned);
    expect(found, `"${found?.[0]}" is not allowed under NMC rules (src/content/articles/${slug}.mdoc)`).toBeNull();
  });

  it.each(articles.map((a) => [a.slug, a] as const))("article %s body is valid Markdoc", (slug, a) => {
    const errors = validateBody(a.body).map((e) => `line ${e.lines[0] ?? "?"}: ${e.error.message}`);
    expect(errors, `src/content/articles/${slug}.mdoc`).toEqual([]);
  });

  // Treatments come from the editor too (treatments.json): name the treatment in failures.
  it.each(treatmentsFile.treatments.map((t) => [t.name, t] as const))("no banned NMC wording in treatment %s", (name, t) => {
    const found = JSON.stringify(t).match(banned);
    expect(found, `"${found?.[0]}" is not allowed under NMC rules (treatment "${name}" in src/content/treatments.json)`).toBeNull();
  });

  it("treatments.json: valid web addresses, known menu groups, every group used", () => {
    const groups = new Set<string>(treatmentGroupInfo.map((g) => g.id));
    for (const t of treatmentsFile.treatments) {
      expect(t.slug, `web address of "${t.name}"`).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(groups.has(t.group), `menu group of "${t.name}"`).toBe(true);
    }
    for (const g of site.treatments) expect(g.treatments.length, `group "${g.label}" has no treatments`).toBeGreaterThan(0);
  });

  it("buildTreatmentGroups treats blank editor fields as missing and keeps filled ones", () => {
    const base: TreatmentFileEntry = { name: " N ", slug: "n", group: "skin", description: "D", forWhom: "F" };
    const blank = buildTreatmentGroups([{ ...base, details: { steps: ["", " "], sessions: "  ", aftercare: "", faqs: [{ question: "", answer: "" }] } }]);
    expect(blank[0]!.treatments[0]).toEqual({ slug: "n", name: "N", description: "D", forWhom: "F" });
    const filled = buildTreatmentGroups([{ ...base, details: { steps: ["One"], sessions: "Two", aftercare: "", faqs: [{ question: "Q", answer: "A" }] } }]);
    expect(filled[0]!.treatments[0]!.details).toEqual({ steps: ["One"], sessions: "Two", faqs: [{ question: "Q", answer: "A" }] });
    expect(() => buildTreatmentGroups([{ ...base, group: "nails" }])).toThrow(/unknown group "nails"/);
  });

  it("every file in src/content/articles is an .mdoc article", () => {
    expect(readdirSync(articlesDir).filter((f) => !f.endsWith(".mdoc"))).toEqual([]);
  });

  it("parseArticle reads front matter and rejects missing fields", () => {
    const ok = parseArticle("x", '---\ntitle: "A: b"\nsummary: S\naudience: patients\ndate: 2026-11-20\ndraft: false\nrelated: []\n---\nBody\n');
    expect(ok).toMatchObject({ slug: "x", title: "A: b", date: "2026-11-20", draft: false, body: "Body", related: undefined });
    expect(() => parseArticle("y", "---\ntitle: T\naudience: patients\ndate: 2026-11-20\n---\n")).toThrow(/y\.mdoc: "summary" is missing/);
    expect(() => parseArticle("z", "no front matter")).toThrow(/front matter/);
  });

  it("the NMC check catches a banned word in an article and names it", () => {
    const a = parseArticle("t", "---\ntitle: T\nsummary: S\naudience: patients\ndate: 2026-11-20\n---\nThe best results, guaranteed.\n");
    expect(JSON.stringify(a).match(banned)?.[0]).toBe("best");
  });

  it("components use tokens, not hard-coded hex colours", () => {
    const offenders = files(join(srcDir, "components")).filter((f) => /#[0-9a-fA-F]{6}\b/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });
});
