/**
 * Renders the raster logo assets from the vector logo (public/images/logo.svg
 * and emblem.svg, made by scripts/logo-vector.py):
 *   public/images/logo-full.png  1600 px wide, transparent (Google, link preview)
 *   src/app/icon.png             64 px emblem for the browser tab
 *   src/app/apple-icon.png       180 px emblem on white, for home-screen shortcuts
 * The header uses logo.svg directly, so it stays sharp at any size.
 * Run: pnpm logo
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const r = (...p) => path.join(root, ...p);

const full = await sharp(r("public/images/logo.svg"), { density: 600 })
  .resize({ width: 1600 })
  .png({ compressionLevel: 9, palette: true, quality: 95 })
  .toFile(r("public/images/logo-full.png"));
console.log("logo-full.png", full.width, "x", full.height);

const emblem = r("public/images/emblem.svg");
await sharp(emblem, { density: 300 }).resize(64, 64).png({ palette: true }).toFile(r("src/app/icon.png"));
await sharp(emblem, { density: 600 })
  .resize(152, 152)
  .extend({ top: 14, bottom: 14, left: 14, right: 14, background: "#ffffff" })
  .flatten({ background: "#ffffff" })
  .png({ palette: true })
  .toFile(r("src/app/apple-icon.png"));
console.log("icons written");
