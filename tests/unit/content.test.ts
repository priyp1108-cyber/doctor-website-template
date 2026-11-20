import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { findConfirmValues } from "@/lib/placeholder";
import { buildJsonLd } from "@/lib/schema";

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

  it("JSON-LD has Physician, MedicalClinic and FAQPage, without ratings or reviews", () => {
    const json = JSON.stringify(buildJsonLd());
    expect(json).toContain('"Physician"');
    expect(json).toContain('"MedicalClinic"');
    expect(json).toContain('"FAQPage"');
    expect(json).not.toMatch(/aggregateRating|"review"/i);
  });

  it("JSON-LD names the site with both the clinic and the doctor", () => {
    const graph = buildJsonLd()["@graph"] as { "@type": string; name?: string; alternateName?: unknown }[];
    const website = graph.find((n) => n["@type"] === "WebSite");
    expect(website?.name).toBe(site.name);
    expect(website?.alternateName).toEqual([site.clinic.shortName, site.doctor.name]);
    expect(graph.find((n) => n["@type"] === "MedicalClinic")?.name).toBeTruthy();
  });

  it("no banned NMC wording in copy", () => {
    const copy = JSON.stringify(site);
    const banned = /\b(best|no\.\s?1|number one|top|leading|guarantee[d]?|permanent|100\s?%|discount|offer)\b/i;
    expect(copy).not.toMatch(banned);
  });

  it("components use tokens, not hard-coded hex colours", () => {
    const offenders = files(join(srcDir, "components")).filter((f) => /#[0-9a-fA-F]{6}\b/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });
});
