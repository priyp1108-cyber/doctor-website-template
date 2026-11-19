/**
 * Turns the real photos in photos-source/ into the web images in
 * public/images/ (cropped, resized, WebP). Run: pnpm images:import
 *
 * Sources: the clinic's Google Business Profile (google-*.jpg), free stock
 * photos (pexels-*.jpg, Pexels licence: free for commercial use, no credit
 * required; see photos-source/CREDITS.md) and the clinic's own photos.
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = (f) => path.join(root, "photos-source", f);
const out = (f) => path.join(root, "public", "images", f);

/** [source, output, crop {left, top, width, height} | null, max width] */
const jobs = [
  // Hero arch: portrait crop centred on him at his desk.
  ["google-doctor-at-desk.jpg", "portrait.webp", { left: 340, top: 0, width: 730, height: 852 }, 960],
  ["doctor-with-patient.jpg", "doctor-at-work.webp", null, 1280],
  ["google-reception.jpg", "reception.webp", null, 1280],
  ["google-treatment-room.jpg", "treatment-room.webp", null, 1280],
  ["cuticon-2024-memento.jpg", "recognition-cuticon-memento.webp", null, 1400],
  ["cuticon-2024-group.jpg", "recognition-cuticon-group.webp", null, 1400],
  ["cuticon-2024-group-2.jpg", "recognition-cuticon-group-2.webp", null, 1400],
  ["iadvl-cme-2023.jpg", "recognition-iadvl-cme.webp", null, 1400],
];

for (const [from, to, crop, max] of jobs) {
  let img = sharp(src(from)).rotate();
  if (crop) img = img.extract(crop);
  const info = await img.resize({ width: max, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out(to));
  console.log(`${to.padEnd(36)} ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
