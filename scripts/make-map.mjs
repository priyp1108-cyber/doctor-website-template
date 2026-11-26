/**
 * Builds the static map in the Visit section (public/images/map.webp) from
 * OpenStreetMap tiles, centred on site.clinic.geo, with a pin on the clinic.
 *
 *   node scripts/make-map.mjs
 *
 * Map data © OpenStreetMap contributors (ODbL); the credit is shown on the
 * page next to the map (MapEmbed.tsx). Google Maps imagery is not used: its
 * terms don't allow saving map images. Re-run if the clinic's pin changes.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteSrc = await readFile(path.join(root, "src/content/site.ts"), "utf8");
const [, lat, lng] = siteSrc.match(/geo:\s*\{\s*lat:\s*([\d.]+),\s*lng:\s*([\d.]+)/).map(Number);

const ZOOM = 16;
const W = 1040;
const H = 480;
const TILE = 256;

// Web Mercator: world pixel position of the clinic at this zoom.
const scale = TILE * 2 ** ZOOM;
const cx = ((lng + 180) / 360) * scale;
const sinLat = Math.sin((lat * Math.PI) / 180);
const cy = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
const left = Math.round(cx - W / 2);
const top = Math.round(cy - H / 2);

const tiles = [];
for (let tx = Math.floor(left / TILE); tx <= Math.floor((left + W - 1) / TILE); tx++) {
  for (let ty = Math.floor(top / TILE); ty <= Math.floor((top + H - 1) / TILE); ty++) {
    const res = await fetch(`https://tile.openstreetmap.org/${ZOOM}/${tx}/${ty}.png`, {
      headers: { "User-Agent": "doctor-website-template static map script (one-off build)" },
    });
    if (!res.ok) throw new Error(`Tile ${tx}/${ty}: HTTP ${res.status}`);
    tiles.push({ input: Buffer.from(await res.arrayBuffer()), left: tx * TILE - left, top: ty * TILE - top });
  }
}

// Tiles can hang over the edges, so composite onto a padded canvas, then crop.
const pad = TILE;
const base = await sharp({ create: { width: W + 2 * pad, height: H + 2 * pad, channels: 3, background: "#eeeeee" } })
  .composite(tiles.map((t) => ({ ...t, left: t.left + pad, top: t.top + pad })))
  .png()
  .toBuffer();

// Pin in the logo navy, tip on the clinic.
const pin = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="56" height="72" viewBox="0 0 56 72">
  <ellipse cx="28" cy="68" rx="10" ry="3.5" fill="rgba(0,0,0,0.25)"/>
  <path d="M28 2C14.2 2 3 13 3 26.6 3 44 28 68 28 68s25-24 25-41.4C53 13 41.8 2 28 2Z" fill="#26448F" stroke="#ffffff" stroke-width="3"/>
  <circle cx="28" cy="26" r="9" fill="#ffffff"/>
</svg>`);

const out = await sharp(base)
  .extract({ left: pad, top: pad, width: W, height: H })
  .composite([{ input: pin, left: Math.round(W / 2 - 28), top: Math.round(H / 2 - 68) }])
  .webp({ quality: 82 })
  .toBuffer();

const file = path.join(root, "public/images/map.webp");
await writeFile(file, out);
console.log(`Wrote ${path.relative(root, file)} (${W}×${H}, z${ZOOM}, centre ${lat}, ${lng}, ${tiles.length} tiles)`);
