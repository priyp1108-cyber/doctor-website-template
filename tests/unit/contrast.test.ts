import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Reads the tokens straight from globals.css so the test tracks the real palette.
const css = readFileSync(new URL("../../src/app/globals.css", import.meta.url), "utf8");
const tokens: Record<string, string> = Object.fromEntries([...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}
function ratio(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1! + 0.05) / (l2! + 0.05);
}

// [text, background, minimum ratio]
const pairs: [string, string, number][] = [
  ["ink", "paper", 4.5],
  ["ink", "white", 4.5],
  ["ink-soft", "paper", 4.5],
  ["ink-soft", "white", 4.5],
  ["muted", "paper", 4.5],
  ["muted", "white", 4.5],
  ["brand", "paper", 4.5],
  ["brand", "white", 4.5],
  ["paper", "brand", 4.5],
  ["paper", "ink", 4.5],
  ["on-dark", "ink", 4.5],
  ["on-dark-muted", "ink", 4.5],
  ["accent", "ink", 4.5],
  ["ink", "accent", 4.5],
  ["ink", "tint-sky", 4.5],
  ["ink", "tint-mint", 4.5],
  ["ink", "tint-sage", 4.5],
  ["leaf-ink", "white", 4.5],
  ["leaf-ink", "paper", 4.5],
  ["leaf-ink", "tint-sky", 4.5],
  ["leaf-ink", "tint-mint", 4.5],
  ["brand", "tint-mint", 4.5],
  ["ink-soft", "tint-sky", 4.5],
  ["ink-soft", "tint-mint", 4.5],
  ["paper", "ink-deep", 4.5],
  ["on-dark-muted", "ink-deep", 4.5],
];

describe("WCAG AA contrast of token pairs", () => {
  it("parsed the palette", () => expect(Object.keys(tokens).length).toBeGreaterThanOrEqual(11));

  it.each(pairs)("%s on %s ≥ %s:1", (fg, bg, min) => {
    expect(tokens[fg], fg).toBeDefined();
    expect(tokens[bg], bg).toBeDefined();
    expect(ratio(tokens[fg]!, tokens[bg]!)).toBeGreaterThanOrEqual(min);
  });

  it("accent text on brand is never allowed (documented rule)", () => {
    expect(ratio(tokens.accent!, tokens.brand!)).toBeLessThan(4.5);
  });

  it("has no red-ish hue anywhere in the palette", () => {
    for (const [name, hex] of Object.entries(tokens)) {
      const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
      expect(r > g + 40 && r > b + 40, `${name} ${hex}`).toBe(false);
    }
  });
});
