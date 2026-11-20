// Generates tinted, labelled placeholder photos in public/images.
// Replace each file with a real photo of the same name (any size, ideally
// at least as large as below). Run: pnpm images:placeholders
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const out = new URL("../public/images/", import.meta.url);
await mkdir(out, { recursive: true });

const ink = "#14304F";
const images = [
  ["portrait", 960, 1120, "#D6E8F7", "Doctor portrait"],
  ["doctor-at-work", 1040, 1080, "#23466E", "Doctor at work"],
  ["reception", 1280, 960, "#E6ECF4", "Reception"],
  ["treatment-room", 1280, 960, "#DDE3F3", "Treatment room"],
  ["map", 1040, 480, "#23466E", "Static map of the clinic"],
];

import { existsSync } from "node:fs";

for (const [name, w, h, bg, label] of images) {
  // Never overwrite a real photo that has replaced its placeholder.
  if (existsSync(fileURLToPath(new URL(`${name}.webp`, out))) && !process.argv.includes("--force")) {
    console.log("kept", `${name}.webp`);
    continue;
  }
  const dark = bg === "#23466E";
  const fg = dark ? "#C5D3E3" : ink;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><radialGradient id="g" cx="70%" cy="25%" r="80%">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="${dark ? 0.08 : 0.55}"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient></defs>
    <rect width="100%" height="100%" fill="${bg}"/>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
      font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(w / 26)}" font-weight="600"
      fill="${fg}" fill-opacity="0.55" letter-spacing="2">${label.toUpperCase()}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(fileURLToPath(new URL(`${name}.webp`, out)));
  console.log("wrote", `${name}.webp`);
}
