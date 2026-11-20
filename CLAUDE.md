# Doctor website template

`main` is a generic doctor's clinic homepage (placeholders everywhere,
dermatology as the example specialty). Each client site lives on its own
branch, e.g. `sa-skincure` for SA Skincure Dr. Anil Kumar Panda. Check which
branch you're on (`git branch --show-current`) before editing: client content
belongs only on its client branch, and shared fixes go on `main` first and
are then merged into the client branches.

Read `SESSION-LOG.md` first: it records what each session changed, what was
decided and why, and what is still open. Before ending a session, add a new
entry at the top using the template at the bottom of that file.

## Ground rules
- All clinic facts, including the specialty wording, live in `src/content/site.ts`. Components never hard-code them.
- NMC advertising rules: no testimonials, ratings, superlatives ("best",
  "top", "leading"), guarantees, offers, or before/after photos. A unit test
  checks the wording in `site.ts`.
- Photos: the clinic's own photos, or free-licence stock (record it in
  `photos-source/CREDITS.md`). Never AI-generated people, and never images
  taken from other websites.
- Colours only through the tokens in `src/app/globals.css`. No hex values in
  components; a test checks this.

## Commands (pnpm isn't installed globally)
- `npx pnpm@9 install`, then `npx pnpm@9 dev` (http://localhost:3000)
- `npx pnpm@9 test` for unit tests; `npx pnpm@9 build && npx pnpm@9 test:e2e` for browser tests
- `npx pnpm@9 build && npx pnpm@9 export:static` writes the shareable single-file preview to `static-export/`
- `npx pnpm@9 images:import` rebuilds the photos from `photos-source/`; `npx pnpm@9 logo` rebuilds the logo PNGs and icons

Node 20.17 is on this Mac, so Tailwind is pinned to 4.3.3.
