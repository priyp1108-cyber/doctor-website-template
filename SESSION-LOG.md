# Session log

One entry per working session, newest first. Each entry says what changed,
what was decided (and why), and what is still open, so the next session can
pick up without re-reading old conversations.

To add an entry, copy the template at the bottom, put it above the newest
entry, and fill it in before ending the session.

---

## Session 7 — 26 Nov 2026 · UI review; shorter homepage, plain headings, no scroll animation

**Goal:** pull Om's push (`eca09ef`) into Soumya's local checkout, review the
UI, and apply the top three fixes from that review.

### What changed
- **One treatment picker.** The "What's bothering you?" pill switcher
  (`Concerns.tsx`, `ConcernPanelMotion.tsx`) is gone. `TreatmentsOverview`
  now carries that heading, keeps the three group cards, and ends with an
  "Ask the clinic on WhatsApp" line for anything else (it uses the last
  entry of `site.concerns`). `site.concerns` still feeds the request form.
- **Credentials strip removed** (`Credentials.tsx`): the hero card and the
  doctor section already give the same qualifications and post.
- **Headings are one colour.** No `<em>` accent words in h2s, and the CSS
  rule that coloured them is deleted. The all-caps labels above the
  homepage headings are removed. Inner pages keep theirs (group name above
  a treatment title, `dt` terms).
- **No scroll animation.** The reveal CSS and the IntersectionObserver are
  deleted, in the app and in `src/static/enhance.ts`. `Reveal` now only
  renders its element; `RevealObserver` only starts the pulse-dot loop.
  The hero entrance is the one load animation.
- Header: the phone-only "Concerns" link is removed (`#concerns` no longer
  exists).
- Homepage is about 6,400px tall at 1440px wide (was about 7,300px).

### Decisions and why
- Kept the group cards over the pill switcher: every treatment is visible
  and links to its page without a click.
- Soumya's earlier uncommitted work (Manrope fonts, the 67-service header
  menu) clashed with Om's push in all 11 files, so it is in
  `git stash` ("Soumya local work before Om's eca09ef"), not applied.
  Om's Sessions 4–6 here are a different line of work from that stash.

### Second pass (same session): the rest of the review
- **Hero, desktop:** text sits in its own white column on the left, photos
  on the right (was a card floating over the photo). Phones are unchanged.
- **FAQ:** the section and its FAQPage schema only appear with three or
  more answered questions (`shownFaqs` / `MIN_FAQS` in `placeholder.ts`).
  One is answered today, so "Good to know" is hidden. It returns by itself
  when two more answers are confirmed in `site.faqs`.
- **Treatments menu:** panel is 48px taller so the note under the buttons
  is no longer clipped.
- **Clinic photos:** the scroll parallax is removed, so the two photos line
  up. `ParallaxMotion.tsx` and `useIdleModule.ts` are deleted and the
  `motion` package is removed from `package.json` (nothing else used it).
- **Footer:** now three columns: clinic details, page links, clinic hours.
- **Tap targets:** treatment chips and the header logo link are 44px tall.

### Still open
- Decide whether to bring the stashed Manrope font change in, or drop the stash.
- Content: treatment pages are mostly "To add" placeholders; all three
  Journal articles are drafts; two more FAQ answers are needed.
- Committed and pushed to `sa-skincure`. `static-export/` was not rebuilt.
- Type check, 71 unit tests and 17 browser tests pass.

---

## Session 6 — 26 Nov 2026 · Phases 2–4: treatment pages, Journal, For doctors

**Goal:** finish the site plan: 14 treatment pages, the Journal (blog) and
a For doctors page, with visible placeholders wherever the clinic's facts
are missing.

### What changed
- **Placeholders on inner pages:** `<Pending>` (dashed "To add" box) marks
  every missing fact. `NEXT_PUBLIC_HIDE_PENDING=1` hides the boxes, the
  draft articles and any section that would be empty: set it for launch
  (`src/lib/pending.ts`). Home-page placeholders still hide as before.
- **Shared shell:** `PageShell` (skip link, header, footer, booking bar),
  `PageIntro` (breadcrumbs + BreadcrumbList JSON-LD + H1), `BookPanel`
  (dark WhatsApp/call/hours panel), `pageMetadata()` in `src/lib/meta.ts`
  (title template `%s | site name`, own canonical per page). Home JSON-LD
  moved from the layout into `page.tsx`.
- **Header:** links are now real pages (`/#doctor`, `/journal`,
  `/for-doctors`, `/#visit`); the logo goes to `/`. Treatments in the menu
  are links to their pages; the details card has "Read more" + "Ask about
  this". Phone menu has "Read more" per treatment and an "all treatments" link.
- **Phase 2 — Treatments:** `/treatments` (grouped cards) and
  `/treatments/[slug]` for all 14, from one template: who it helps, what
  happens, sessions, aftercare, questions, "who you will see", more in the
  group, related Journal articles, booking panel, MedicalWebPage JSON-LD.
  Optional `details` (steps, sessions, aftercare, faqs) on each treatment in
  `site.ts`; missing parts show "To add". Home overview chips now link.
- **Phase 3 — Journal:** content in `src/content/journal.ts` (5 DRAFT
  outlines: 3 for patients, 2 for clinicians). `/journal`,
  `/journal/for/patients`, `/journal/for/clinicians` (filter = links, so it
  works without JS and each view has a URL), `/journal/[slug]` with
  BlogPosting JSON-LD (drafts are `noindex`), `/journal/rss.xml`, and a
  "From the Journal" strip on the home page before the FAQ.
- **Phase 4 — For doctors:** `/for-doctors`: profile, clinical interests,
  training timeline, publications, talks + conferences, CV, clinician notes,
  and green (`btn-peer`) refer / invite to speak / research WhatsApp cards.
  Content in `site.forDoctors`.
- `BookingBar` now shows on pages without a hero/visit button (it stayed
  invisible there before).
- **Map:** checked the address in Google Maps. The clinic's own listing
  (N5/98) is at 20.2978379, 85.8140253, the same pin and listing ID already
  in `site.ts`, so the location data was correct. A plain address search
  lands ~200 m west on N-5-74, so it is not used. The placeholder
  `map.webp` is replaced by a real OpenStreetMap image with a navy pin
  (`npx pnpm@9 map`, `scripts/make-map.mjs`); the "© OpenStreetMap
  contributors" credit shows on the map. Google map images can't be saved
  under its terms, so they are not used.
- Sitemap lists every page (approved articles only). Dev console also lists
  treatment pages without details, draft articles and empty doctor lists.
- Tests: unit (unique treatment slugs, article checks, NMC wording now also
  covers `journal.ts`); 6 new e2e tests (all 14 treatment pages, Journal
  filter URLs, RSS, home strip, For doctors contact messages, phone overflow
  + booking bar). 71 unit and 17 e2e tests pass.

### Decisions and why
- Journal articles are drafts written for the template, not Dr. Panda's
  words. They must not go live until he rewrites/approves them, so drafts
  carry a "Draft" tag, a "To add" banner and `noindex`, and drop out with
  `NEXT_PUBLIC_HIDE_PENDING=1`. Patient drafts contain only general,
  well-established advice; clinician drafts are mostly "To add".
- Talks vs. events: the clinic photos only prove he was at CUTICON 2024 and
  the IADVL CME 2023, not that he spoke, so they are listed as
  "Conferences and CMEs" and Talks stays "To add".
- Menu treatment items became links (`aria-current` removed: it means
  "current page" on links). On touch tablets a tap now opens the page
  instead of the details card.

### Still open
- Clinic to supply: treatment `details` (14), MBBS college + years,
  registration, memberships, bio, clinical interests, publications, talks,
  CV PDF, email for doctors; Dr. Panda to rewrite and approve the 5 articles.
- The single-file static export still covers the home page only; links to
  the new pages from it do not work offline.
- Not committed yet (phase 1 and these phases are both uncommitted on `sa-skincure`).

---

## Session 5 — 26 Nov 2026 · Phase 1 of the redesign: hero slider, buttons, type

**Goal:** first phase of the site plan
(https://claude.ai/artifact/RmoEdTy4VHKzn2jyPoCz5p): a hero photo slider
instead of the portrait, calm clinical buttons, new type, a credentials
strip, a treatments overview and the portrait moved to "Meet Dr. Panda".

### What changed
- **Hero** (`Hero.tsx`): crossfading slider of the clinic's own photos
  (consultation, treatment room, reception, IADVL CME) with a still text
  card: headline "Skin, hair and laser care in Nayapalli, Bhubaneswar",
  name, qualifications, teaching post, WhatsApp + Call. Phones: photo on
  top, card below. Slides and headline live in `site.hero`.
  Behaviour in `src/lib/heroSlider.ts`, shared by `HeroSliderEnhancer` and
  the static export: 6 s per photo, labelled dots, pause/play, stops on
  hover/focus/hidden tab, no rotation for reduced motion.
- **Buttons:** the glossy "lens" pills are gone. `.btn` is now a solid,
  12 px-corner button with roles `.btn-primary` (logo navy),
  `.btn-secondary` (navy outline), `.btn-on-dark`, `.btn-peer` (green, for
  doctor-to-doctor contact later). Role classes are unlayered on purpose so
  they beat the `btn` utility's transparent border.
- **Type:** Figtree for everything (headings 650–700). Instrument Serif and
  Manrope removed. `<em>` in headings is upright logo blue. Section headings
  reveal with a short blur.
- **Credentials strip** (`Credentials.tsx`) replaces the scrolling marquee:
  MD (Skin & VD), Assistant Professor at IMS & SUM, languages, evening hours.
  This also closes the "marquee pause control" item.
- **Treatments overview** (`TreatmentsOverview.tsx`): Skin / Hair / Laser &
  procedures cards listing every treatment, each with an "Ask about …"
  WhatsApp link. Group intros in `site.treatments[].intro`.
- **Meet Dr. Panda** (`Doctor.tsx`): portrait moved here from the hero, plus
  a "Training and posts" timeline from `site.doctor.timeline`.
- Section order: Hero → Credentials → Concerns → Treatments → Meet Dr. Panda
  → Visit steps → Clinic photos → Teaching and conferences → FAQ → Visit.
- Tests: e2e for the slider (one photo at a time, dots, pause, no portrait
  in the hero) and for reduced motion (no rotation); h1 test reads
  `site.hero.headline`.

### Decisions and why
- Hero photos are the clinic's own, not stock: real rooms build more trust,
  and there is no licence question. A dermatoscope/trichoscopy shoot would
  still improve slides 1 and 2.
- The slider was built in-house rather than taken from 21st.dev or React
  Bits: none of those had the pause control, focus/hover stop and
  reduced-motion handling the WAI carousel guidance needs.
- MD institution in the timeline comes from his public Secondmedic profile;
  the MBBS row stays hidden until the college is confirmed.
- This work stays on `sa-skincure` only. The shared pieces (buttons, type,
  slider, credentials, menu) are not on `main` yet.

### Still open
- Port the shared components to `main` (generic content there).
- Clinic to confirm: MBBS college and years, the MD detail, treatment list.
- Phase 2 (treatment pages), Phase 3 (Journal), Phase 4 (For doctors).
- Dev tip: after switching branches, delete both `.next/cache/images` and
  `.next/dev/cache/images`; the browser pane may also keep stale images.

---

## Session 4 — 26 Nov 2026 · Treatments menu and logo colours

**Goal:** add a Treatments menu to the header that lists what the clinic
treats and describes each one, and match the site colours to the logo.
Work is on `sa-skincure` only (moved to a Windows machine this session).

### What changed
- **Treatments menu (desktop/tablet).** "Treatments" in the header opens a
  panel with 14 treatments in three groups, following the signboard's
  "Skin | Hair | Laser": Skin, Hair, Laser & procedures. Hovering or focusing
  a treatment shows a details card (what it is, "Helps with", and an "Ask
  about this" WhatsApp button pre-filled with the treatment's name). A strip
  at the bottom links "not sure what you need" visitors to WhatsApp.
  Keyboard: Enter/ArrowDown opens, arrows move, Escape closes and returns focus.
- **Phone menu.** New menu button in the header opens a full-screen sheet:
  treatments as an accordion with the same descriptions and WhatsApp links,
  then Concerns / The doctor / Visit and a "Book on WhatsApp" button. This
  closes the "phone nav menu" item from session 3.
- Content lives in `site.treatments` (`src/content/site.ts`), with
  `treatmentsConfirmed = false`; the dev console lists it until confirmed.
  New `messages.treatment()` in `src/lib/whatsapp.ts`.
- Menu behaviour is plain DOM code in `src/lib/treatmentsMenu.ts`, used by
  both the React site (`TreatmentsMenuEnhancer`) and the static export
  (`enhance.ts`). Without JS the panel opens on hover/focus (CSS) and the
  phone menu is a native `<details>`.
- **Colours from the logo.** brand = logo navy `#26448F`, accent = logo sky
  `#12A6EC`, new `leaf` `#1FA866` (logo green, non-text) and `leaf-ink`
  `#12784A` (green text). Ink, muted and tints were re-derived around them;
  tint `lilac` became `mint`. Hero blobs now use sky + mint. OG image and
  theme colour updated. New contrast pairs added to `contrast.test.ts`.
- Tests: two new e2e tests (desktop menu, phone menu) and a no-JS hover
  test. The no-JS test now checks the header "Book a visit" link instead of
  "the first wa.me link" (that is now inside the closed menu panel).

### Decisions and why
- The clinic has no public treatment list. The 14 items are drafted from the
  signboard and directory listings (Justdial: laser hair removal; Lybrate:
  trichology, cosmetology; Secondmedic: clinical, surgical and aesthetic
  dermatology) plus the six concerns already on the page. Descriptions are
  factual, with no promised results, "permanent", prices or offers (NMC).
- Treatments are buttons, not links: there are no treatment pages yet. The
  details card carries the action (WhatsApp). Slugs are ready for
  `/treatments/[slug]` pages later.
- Header on phones (< 640px) is now logo + menu button; "Book a visit" moved
  into the menu sheet, because logo + book + menu do not fit at 375px. The
  bottom booking bar still covers booking. Concerns and Visit links show in
  the header from 1024px; between 720 and 1024px it shows Treatments and
  The doctor only.
- The sheet is sized with `100dvh`, not `bottom: 0`: the header's backdrop
  blur makes it the containing block for `position: fixed`.

### Still open
- **Clinic must confirm the treatment list** (remove what Dr. Panda does not
  do, e.g. PRP or acne-scar procedures), then set `treatmentsConfirmed`.
- Everything from session 3 except the phone menu.
- The static export was rebuilt but its menu was not clicked through in a
  browser this session.
- Running `next dev` after switching from `main` can serve `main`'s
  placeholder photos from `.next/cache/images`; delete that folder.

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
