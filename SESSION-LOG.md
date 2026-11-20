# Session log

One entry per working session, newest first. Each entry says what changed,
what was decided (and why), and what is still open, so the next session can
pick up without re-reading old conversations.

To add an entry, copy the template at the bottom, put it above the newest
entry, and fill it in before ending the session.

---

## Session 1 — 18–20 Nov 2026 · First build, real content, GitHub

**Goal:** build the clinic homepage from `Dr Panda homepage build spec.md`,
fill it with the clinic's real details, and get it ready to share and deploy.

### What changed

**Build (from the spec)**
- One-page, mobile-first Next.js 16 site: Header, Hero, Marquee, Concerns,
  Doctor, Visit steps, Clinic photos, Recognition, FAQ, Visit panel with
  request form, Footer, mobile Booking bar.
- All clinic facts live in `src/content/site.ts`; components never hard-code them.
- Booking is only `wa.me` / `tel:` links (no backend).
- JSON-LD: WebSite, Physician, MedicalClinic, FAQPage (no ratings or reviews).
- Tests: Vitest unit tests (hours, WhatsApp links, phone, contrast,
  compliance) and Playwright smoke tests.

**Real clinic details** (from the Google Business Profile, checked 19 Nov 2026)
- Site name: **SA Skincure Dr. Anil Kumar Panda**. Used in the page title,
  `og:site_name` and the WebSite structured data (alternate names
  "SA Skincure" and "Dr. Anil Kumar Panda").
- Address: N5/98, Block N5, IRC Village, Nayapalli, Bhubaneswar, Odisha 751015.
- Phone and WhatsApp: +91 76089 54504 (the user confirmed WhatsApp uses the same number).
- Hours: Mon–Sat 6:00–9:00 pm, Sunday closed.
- Map: real pin (20.2978379, 85.8140253) and the Google Maps listing link.
- Qualifications "MBBS, MD (Skin & VD)" and teaching post "Assistant
  Professor, Department of Skin & VD, IMS & SUM Hospital, Bhubaneswar"
  (both from the clinic's own poster and signboard).
- Consultation fee: removed from the site, including its FAQ.

**Logo**
- `public/images/logo.svg`: a vector redraw of the logo. The only copy online
  is 250 px. The emblem is traced, and the lettering is re-set in open-licence
  fonts (Tinos, Arimo) by `scripts/logo-vector.py`.
- `pnpm logo` renders `logo-full.png`, the browser-tab icon and the
  home-screen icon from the SVG.

**Photos** (sources in `photos-source/`, credits in `photos-source/CREDITS.md`)
- Hero: Dr. Panda at his desk (Google profile).
- Doctor section: him with a patient seen from behind (clinic's own photo).
- Inside the clinic: reception and treatment room only. The outside/building
  photo was removed at the user's request.
- Recognition section (new, before the FAQ): CUTICON Odisha 2024 ×3 and IADVL
  Odisha CME 19 Mar 2023, with factual captions only.
- Concern panels: **no images at all**, text only (user's request).
  `image`/`imageAlt` are optional on a concern.
- `pnpm images:import` rebuilds the web images from `photos-source/`.

**Copy and design**
- Hero heading: "Dermatology for skin, hair, and nails". Below it: "MBBS, MD (Skin & VD)".
- Buttons: glossy "Lens" glass pills (`.lens` + `.lens-brand` /
  `.lens-clear` / `.lens-sky` in `globals.css`), with a sheen on hover.
- A "Decode" scrambling-label effect was tried and **removed** at the user's request.

**Sharing and hosting**
- `pnpm build && pnpm export:static` writes a single self-contained preview
  file, `static-export/dr-panda-homepage.html` (~2 MB, works offline).
  A copy was sent as `SA-Skincure-homepage-preview.html`.
- Project folder: `~/sa-skincure-website`.
- GitHub: private repo `priyp1108-cyber/sa-skincure-website`, branch `main`.

### Decisions and why
- **No before/after photos and no "before treatment" acne photo.** NMC
  advertising rules forbid before/after images. Photos taken from the web
  also carry copyright and patient-consent problems.
- **Stock photos only from free-licence sources** (Pexels etc.), and never
  AI-generated people (from the spec). No free photo of an Indian girl with
  acne was found, so the concern images were dropped entirely.
- **Recognition captions stay factual** (event and date), with no
  "award-winning" wording, also because of the NMC rules.
- **Tailwind pinned to 4.3.3**, because newer versions need Node ≥ 20.19 and
  this Mac has Node 20.17.
- **pnpm isn't installed globally.** Run it as `npx pnpm@9 <command>`.

### Still open
- Placeholders in `site.ts` (`[CONFIRM]`): registration number, quote, bio,
  colleges for each degree, "How Dr. Panda approaches it" text, two FAQ
  answers (appointments, children), and a visit-step line.
- `public/images/map.webp` is still a placeholder image.
- `siteUrl` isn't set. The domain `saskincure.com` exists but currently shows a blank page.
- Not deployed yet (Vercel: Add New → Project → import the repo).
- Lighthouse mobile Performance is 80–91 locally against a target of ≥ 90.
  Next 16 and React 19 alone are ~190 KB of gzipped JavaScript.
- The clinic should approve the logo redraw, the recognition section and the
  photo use, including the photos with other people in them. If they have
  the original logo file, swap it in.
- Google Business Profile name is "S A SKINCURE | Dr. ANIL KUMAR PANDA".
  Consider renaming it to match the site name exactly.

### How to resume
```bash
cd ~/sa-skincure-website
npx pnpm@9 install        # node_modules isn't in git
npx pnpm@9 dev            # http://localhost:3000
npx pnpm@9 test           # unit tests
```

---

## Template

```markdown
## Session N — DD Mon YYYY · Short title

**Goal:** …

### What changed
- …

### Decisions and why
- …

### Still open
- …
```
