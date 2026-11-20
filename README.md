# Doctor website template

One-page, mobile-first homepage for an Indian doctor's clinic. Every booking
action is a WhatsApp (`wa.me`) or phone (`tel:`) link; there is no backend.

`main` is the generic template, with placeholders throughout and dermatology
as the example specialty. Each client site lives on its own branch:

| Branch | Site |
|---|---|
| `sa-skincure` | SA Skincure Dr. Anil Kumar Panda, Bhubaneswar (dermatology) |

**New client:** branch off `main` (`git switch -c <client-name> main`), then
fill in `src/content/site.ts`, swap the photos and logo, and add the branch
to the table above. Fixes that every site should get go on `main` first and
are then merged into the client branches.

Stack: Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 ·
Motion · Lenis · Vitest · Playwright.

## Run it

Use Node 22 or newer if you can (Node 20.17 works, but prints an
`ExperimentalWarning` during `build`; newer Tailwind releases need Node ≥ 20.19).

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
pnpm test         # unit tests (hours, WhatsApp links, phone, contrast, compliance)
pnpm test:e2e     # Playwright smoke test (run `pnpm build` first;
                  # first time: `pnpm exec playwright install chromium`)
```

No pnpm? `npx pnpm@9 <command>` works too.

## Edit the clinic's details: `src/content/site.ts`

Every fact on the page comes from this one file. Components never hard-code
clinic details.

- `specialty`: the page title ("Dermatologist in <city>"), hero heading,
  link-preview tagline and the schema.org specialty. For a non-dermatology
  practice, also rewrite `concerns` and `faqs`.

- Anything starting with `[CONFIRM]` is a placeholder. While `pnpm dev` is
  running, the browser console lists every placeholder still left.
- `phone` is how it is shown and dialled (`+91…`). `whatsapp` is digits only,
  with the country code and no `+` (e.g. `919876543210`).
- `hours`: 24-hour times in Indian time; a day can have several sessions;
  `[]` means closed. The "Open now" pill, the hours list and the Google
  structured data are all built from this.
- `nextAvailable`: free text such as `"Today, 5:30 pm"`. Leave it `""` to
  hide the card on the portrait.
- `yearsInPractice: null` hides that item; an empty `memberships` list hides
  memberships.
- `geo` (latitude/longitude) drives the map embed and structured data. Copy
  them from Google Maps (right-click the pin).
- `siteUrl`: the final domain, e.g. `https://drsurname.in`. Until it is set,
  the site uses `NEXT_PUBLIC_SITE_URL`, then Vercel's production URL.
- The name, address and phone must match the Google Business Profile
  exactly.

Compliance (NMC advertising rules): don't add testimonials, ratings, "best /
No. 1 / top / leading", guarantees ("permanent", "100%"), offers, or
before/after photos. A unit test fails if banned words appear in `site.ts`.
This is a design rule, not legal advice; the doctor should check the final
copy themselves.

## Swap the photos and logo

`public/images/` holds tinted, labelled placeholders. Put the real photos in
`photos-source/`, list them (with any crop) in `scripts/import-photos.mjs`
and run `pnpm images:import` to write the web versions. Record every photo's
source and licence in `photos-source/CREDITS.md`.

| File | Used for | Suggested size |
|---|---|---|
| `portrait.webp` | Hero arch (portrait, face in the upper third) | 960 × 1120 |
| `doctor-at-work.webp` | "The doctor" section | 1040 × 1080 |
| `reception.webp`, `treatment-room.webp` | Clinic photo strip | 1280 × 960 |
| `map.webp` | Static map shown before the interactive map loads | 1040 × 480 |
| `recognition-*.webp` | Optional conference / CME photos (list them in `site.ts` → `recognition`; the section hides when empty) | 1400 wide |

Concern panels show text only by default. To add a photo, set `image` and
`imageAlt` on that concern in `site.ts`. Use a lifestyle photo, never
before/after or AI-generated. Update the `*Alt` texts in `site.ts` to
describe the real photos. `pnpm images:placeholders` only fills in missing
files and never overwrites a real photo.

**Logo:** replace `public/images/logo.svg` (about 944 × 180, transparent
background) and `public/images/emblem.svg` (square mark for icons) with the
clinic's own artwork, then run `pnpm logo` to render the PNG logo, the
browser-tab icon and the home-screen icon.

## Share a preview as one HTML file

```bash
pnpm build && pnpm export:static   # → static-export/doctor-homepage.html
```

The file is self-contained (CSS, fonts, images inlined), so it can be emailed
and opened by double-clicking. React/Next are stripped out and replaced by a
small plain-JS script (`src/static/enhance.ts`) for the reveals, open-now pill,
concern switcher, booking bar, map and request form. Re-run after any change.

## Deploy to Vercel

1. Push the client's branch to GitHub.
2. In Vercel: **Add New → Project**, import the repo and set the production
   branch to the client's branch. It detects Next.js and pnpm;
   no settings needed.
3. **Settings → Domains**: add the clinic's domain and follow the DNS steps.
4. Set `siteUrl` in `site.ts` to that domain and redeploy.
5. Check the page in Google's Rich Results Test and submit
   `https://<domain>/sitemap.xml` in Search Console.

Optional analytics (cookieless): set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to the domain
in Vercel's environment variables. The page then sends `whatsapp_click` (with
its source), `call_click`, `map_click` and `concern_select`. It never sends
names or phone numbers.

## How it's built

```
src/app/            layout (fonts, metadata, JSON-LD), page, OG image, sitemap, robots, globals.css
src/components/     one file per section, plus Reveal, icons, BookingBar, …
src/content/site.ts all clinic facts
src/lib/            hours (open/closed in Asia/Kolkata), whatsapp, schema (JSON-LD), links, phone
```

- **Design tokens** are in the `@theme` block of `globals.css` (colours,
  breakpoint, shadows). Components only use these; a test checks
  every colour pair meets WCAG AA and that components have no hex values.
- **Motion with JS off:** content renders fully visible on the server. An
  inline script adds a `js` class to `<html>` before paint, and only then do
  the hidden start states apply. If the app never starts, everything reveals
  after 4s anyway.
- **Reduced motion:** all CSS animations and transitions are switched off,
  reveals show at once, Lenis doesn't start, and the parallax and marquee stay still.
- **Performance:** the decorative loops (blobs, float, marquee, pulse) start
  only after the page has loaded and is idle. The Motion library (concern
  crossfade, photo parallax) loads at that point too, so it stays off the
  critical path.
