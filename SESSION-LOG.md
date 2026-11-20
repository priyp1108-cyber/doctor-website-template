# Session log

One entry per working session, newest first. Each entry says what changed,
what was decided (and why), and what is still open, so the next session can
pick up without re-reading old conversations.

To add an entry, copy the template at the bottom, put it above the newest
entry, and fill it in before ending the session.

---

## Session 3 — 20 Nov 2026 · Design critique and fixes

**Goal:** review the UI and flow on desktop and phone, then fix what does not
need the clinic's input.

### What changed
- Unconfirmed content is hidden instead of printed. Marquee items, the
  concern "approach" block, the doctor quote, bio and fact rows, the step 3
  text, FAQ answers and the footer registration only render once their
  `[CONFIRM]` value is replaced. The FAQ structured data skips unanswered
  questions too (`answeredFaqs` in `src/lib/placeholder.ts`).
- Hero now names the doctor above the qualifications.
- Booking bar is phone-only. The floating desktop pill is gone (it covered
  text; the header button does the same job). On phones the bar stays hidden
  while the hero's or the form's WhatsApp button is on screen.
- Recognition is one swipeable row on phones and four across on desktop
  (was a 2×2 grid of large photos; about 1,080px shorter on a phone).
- Clinic photos are the same height; the request form card no longer
  stretches; the form's concern select starts on "Choose one"; phone-number
  links have a 44px tap area.
- Playwright mobile test updated for the new booking-bar behaviour.

### Decisions and why
- While the doctor's quote is unconfirmed, the Doctor section heading falls
  back to his name, so the section still has a heading.
- Kept the header "Book a visit" button on phones: without it the phone
  header is only a logo, and hiding the bottom bar at the hero already
  removes the triple WhatsApp button.
- These are shared component fixes, so they were committed on `main` first
  and then cherry-picked onto `sa-skincure`. A plain `git merge main` is not
  safe there: `main` sits on top of the commit `sa-skincure` points at, so
  the merge would fast-forward the client branch into the generic template
  and replace the clinic's content with placeholders. Cherry-pick shared
  fixes onto client branches instead.

### Still open
- The 8 `[CONFIRM]` values in `site.ts` (plus the step 3 text in
  `VisitSteps.tsx`) still need the clinic's facts. Only one FAQ shows until
  the other two answers are confirmed.
- `public/images/map.webp` is still the placeholder that reads "STATIC MAP OF
  THE CLINIC". It needs a real static map of the pin.
- Not done from the critique: a phone nav menu, fewer type sizes (14 in
  use), tab roles on the concern picker, a pause control for the marquee
  (it pauses on hover only).
- `.claude/launch.json` was added locally so the app's browser pane can start
  the dev server.

---

## Session 2 — 20 Nov 2026 · Generic template on main, client on a branch

**Goal:** make the repo a reusable doctor-website template, with each client
site on its own branch.

### What changed
- GitHub repo renamed `sa-skincure-website` → `priyp1108-cyber/doctor-website-template`
  (still private). Local folder renamed to `~/doctor-website-template`.
- New branch `sa-skincure`: the SA Skincure site exactly as it was at the end
  of session 1 (Session 1 below describes that branch).
- `main` is now the generic template:
  - `site.ts` uses `[CONFIRM]` placeholders for the doctor and clinic,
    sample hours, an empty `recognition` list (section hidden) and no position.
  - New `site.specialty` (title, schema field, adjective, hero headline,
    tagline). It drives the page title, description, link-preview image,
    JSON-LD `medicalSpecialty`, hero heading and recognition text.
    `*word*` in the headline sets that word in italics.
  - Clinic photos, conference photos and `photos-source/` originals removed.
    Labelled placeholders are in their place, and `CREDITS.md` is an empty table.
  - Placeholder logo ("Clinic Name / YOUR SPECIALTY" with a cross emblem).
    The SA Skincure logo redraw script was removed from main.
  - `scripts/import-photos.mjs` has an empty job list with examples.
  - The preview export is now `static-export/doctor-homepage.html`.
  - Tests read names from `site.ts` instead of hard-coding Dr. Panda.
  - README, CLAUDE.md and package name updated for the template.

### Decisions and why
- One repo, one branch per client: shared improvements land on `main` and are
  merged into client branches, so every site benefits.
- The template stays India-specific (Asia/Kolkata hours, +91 numbers, NMC
  rules), because that's the market.

### Still open
- The SA Skincure items listed under Session 1 still apply on the `sa-skincure` branch.
- `git log` on `main` still contains the SA Skincure photos (the repo is
  private). If the template is ever shared publicly, start a fresh repo from
  `main` instead of making this one public.
- Vercel: set each client project's production branch to its client branch.

---

## Session 1 — 18–20 Nov 2026 · First build, real content, GitHub (now the `sa-skincure` branch)

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
cd ~/doctor-website-template && git switch sa-skincure
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
