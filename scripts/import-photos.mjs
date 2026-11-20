/**
 * Turns the real photos in photos-source/ into the web images in
 * public/images/ (cropped, resized, WebP). Run: pnpm images:import
 *
 * Use the clinic's own photos (or its Google Business Profile photos) and
 * free-licence stock only; record every source in photos-source/CREDITS.md.
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = (f) => path.join(root, "photos-source", f);
const out = (f) => path.join(root, "public", "images", f);

/** [source, output, crop {left, top, width, height} | null, max width]
 *  Put the originals in photos-source/ and list them here, e.g.:
 *    ["doctor-at-desk.jpg", "portrait.webp", { left: 340, top: 0, width: 730, height: 852 }, 960],
 *    ["doctor-with-patient.jpg", "doctor-at-work.webp", null, 1280],
 *    ["reception.jpg", "reception.webp", null, 1280],
 *    ["treatment-room.jpg", "treatment-room.webp", null, 1280],
 *    ["conference-2024.jpg", "recognition-1.webp", null, 1400],
 */
const jobs = [];

for (const [from, to, crop, max] of jobs) {
  let img = sharp(src(from)).rotate();
  if (crop) img = img.extract(crop);
  const info = await img.resize({ width: max, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out(to));
  console.log(`${to.padEnd(36)} ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
