# Dr. Anil Kumar Panda — clinic homepage

One-page, mobile-first site for a dermatology clinic in Bhubaneswar. Every
booking action is a WhatsApp (`wa.me`) or phone (`tel:`) link; there is no
backend.

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
- `siteUrl`: the final domain, e.g. `https://drpanda.in`. Until it is set,
  the site uses `NEXT_PUBLIC_SITE_URL`, then Vercel's production URL.
- The name, address and phone must match the Google Business Profile
  exactly.

Compliance (NMC advertising rules): don't add testimonials, ratings, "best /
No. 1 / top / leading", guarantees ("permanent", "100%"), offers, or
before/after photos. A unit test fails if banned words appear in `site.ts`.
This is a design rule, not legal advice; the doctor should check the final
copy himself.

## Swap the photos

Real photos now live in `photos-source/` (from the clinic's Google Business
Profile, `google-*.jpg`, and the clinic's own photos). `pnpm images:import`
crops and converts them into `public/images/`; edit the list in
`scripts/import-photos.mjs` to change a photo or its crop. Recognition photos
and captions are listed in `site.ts` under `recognition`.

Still a placeholder: `map.webp`. The concern panels have no photos and show text only; to add one, set `image` and `imageAlt` on that concern in `site.ts` (a lifestyle photo, never before/after or AI-generated).
`pnpm images:placeholders` only fills in missing files and never overwrites a
real photo.

Placeholders live in `public/images/` as tinted, labelled `.webp` files.
Replace each one with a real photo **of the same name** (JPG/PNG renamed to
`.webp` won't work; export as WebP, or change the path in `site.ts`). Next.js
serves resized AVIF/WebP automatically.

| File | Used for | Suggested size |
|---|---|---|
| `portrait.webp` | Hero arch (portrait, face in the upper third) | 960 × 1120 |
| `doctor-at-work.webp` | "The doctor" section | 1040 × 1080 |
| `reception.webp`, `treatment-room.webp` | Clinic photo strip | 1280 × 960 |
| `map.webp` | Static map shown before the interactive map loads | 1040 × 480 |

**Logo:** `public/images/logo.svg` is a vector redraw of the clinic's logo.
The only copy online (Google Business Profile) is 250 px, so
`scripts/logo-vector.py` traces the emblem and re-sets the lettering in
open-licence fonts (Tinos, Arimo) at the original's measured positions.
`pnpm logo` then renders the PNG logo and icons from it. If the clinic has
the designer's original file, prefer that: save it as `logo.svg` and run
`pnpm logo`.

Update the `imageAlt` / `portraitAlt` text in `site.ts` to describe the real photos.
`pnpm images:placeholders` regenerates the placeholders.

## Share a preview as one HTML file

```bash
pnpm build && pnpm export:static   # → static-export/dr-panda-homepage.html
```

The file is self-contained (CSS, fonts, images inlined), so it can be emailed
and opened by double-clicking. React/Next are stripped out and replaced by a
small plain-JS script (`src/static/enhance.ts`) for the reveals, open-now pill,
concern switcher, booking bar, map and request form. Re-run after any change.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project**, import the repo. It detects Next.js and pnpm;
   no settings needed.
3. **Settings → Domains**: add the clinic's domain and follow the DNS steps.
4. Set `siteUrl` in `site.ts` to that domain and redeploy.
5. Check the page in Google's Rich Results Test and submit
   `https://<domain>/sitemap.xml` in Search Console.

Optional analytics (cookieless): set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to the domain
in Vercel's environment variables. The page then sends `whatsapp_click` (with
its source), `call_click`, `map_click` and `concern_select`. It never sends
names or phone numbers.

## Website editor (Keystatic)

Dr. Panda edits two parts of the site himself at `/keystatic`:

- **Journal articles**: one Markdoc file each in `src/content/articles/<slug>.mdoc`.
- **Treatments**: names, menu group, "What it is" and "Who it helps" texts, and
  the treatment-page details (visit steps, sessions, aftercare, questions).
  All 14 are in `src/content/treatments.json`; list order is menu order. The
  menu groups themselves (Skin / Hair / Laser & procedures) stay in `site.ts`.

The editor saves its changes to those files in Git. Nothing he saves goes live
until someone reviews and merges it.

**On your machine:** run `npx pnpm@9 dev` and open
http://localhost:3000/keystatic. This is local mode: saves write straight to
the files, so use it for testing, or to edit content yourself.

**On the live site (one-time setup, done by the repo owner):**

1. On https://keystatic.cloud, create a team and a project, and connect the
   project to this GitHub repo. The free plan covers up to 3 users per team.
   Invite Dr. Panda to the team. He doesn't need a GitHub account.
2. In Vercel → Settings → Environment Variables, set
   `NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT` to the project's `team/project` name
   (shown in its settings), then redeploy. Without this variable, `/keystatic`
   returns 404 in production.
3. In GitHub → Settings → Branches (or Rules → Rulesets), protect the live
   branch (`sa-skincure`) and `main`: require a pull request with 1 approval,
   and require the **Tests and NMC wording check** status check.
4. In GitHub → Settings → Actions → General → Workflow permissions, tick
   **Allow GitHub Actions to create and approve pull requests**.
5. Send Dr. Panda this link: `https://<domain>/keystatic/branch/sa-skincure`.
   Always use this link. A plain `/keystatic` opens `main`, the generic
   template branch.

**How a change goes live:**

1. Dr. Panda edits an article or a treatment and clicks **Save**. The live
   branch is protected, so the editor asks him to create a branch. He names
   it, for example `sunscreen update`, and the editor saves it as
   `updates/sunscreen-update`.
2. `.github/workflows/website-review.yml` runs the tests (including the NMC
   wording check, which names any banned word and the article or treatment
   it is in). It also opens a pull request into `sa-skincure`. Vercel posts a
   preview link on the pull request.
3. The reviewer (you or Priya) reads the preview, works through the checklist
   in the pull request, then approves and merges.
4. Vercel deploys the live site in about two minutes.

If the check fails, ask Dr. Panda to fix the wording on the same branch in the
editor. The pull request updates itself.

Inside the editor: **Draft** stays ticked until an article is ready to go
live. **To add (note)** inserts a dashed reminder box, which is hidden on the
launch build (`NEXT_PUBLIC_HIDE_PENDING=1`). Photos are saved to
`public/images/journal/` and must be the clinic's own (see `CLAUDE.md`).

Treatments: leave a page detail empty and the treatment page shows a "To add"
box for it in previews. Changing a treatment's **Web address** changes its
page link and breaks Journal articles that link to it (the tests catch this),
so don't change it once the page is live.

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
