# SA Skincure Dr. Anil Kumar Panda — clinic homepage

Read `SESSION-LOG.md` first: it records what each session changed, what was
decided and why, and what is still open. Before ending a session, add a new
entry at the top using the template at the bottom of that file.

## Ground rules
- All clinic facts live in `src/content/site.ts`. Components never hard-code them.
- Exceptions, edited by Dr. Panda in Keystatic (`/keystatic`,
  `keystatic.config.ts`): Journal articles in `src/content/articles/*.mdoc`
  and the treatments in `src/content/treatments.json`. His saves reach the
  live branch only through a reviewed PR (README "Website editor").
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
