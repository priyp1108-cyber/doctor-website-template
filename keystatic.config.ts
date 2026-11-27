/**
 * Keystatic: the website editor at /keystatic. Dr. Panda edits Journal
 * articles (src/content/articles/*.mdoc) and the treatments
 * (src/content/treatments.json: names, texts and treatment-page details).
 *
 * Storage depends on NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT:
 * - set ("team/project" from keystatic.cloud): Keystatic Cloud. Editors log in
 *   without a GitHub account, and every save is a commit to this repo.
 *   Saves go to `updates/...` branches, never straight to the live branch
 *   (branch protection, see README "Website editor"); a GitHub workflow
 *   opens a pull request for review.
 * - not set: local mode, for `pnpm dev` only. Saves write the files in
 *   src/content/articles/ on this machine. The editor is switched off in
 *   production builds without a cloud project.
 *
 * Client-safe: this file is bundled into the editor page, so it must not
 * import anything that reads from disk (e.g. src/content/journal.ts).
 */
import { collection, config, fields, singleton } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { site, treatmentGroupInfo } from "@/content/site";

const cloudProject = process.env.NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT?.trim() || undefined;

/** True when /keystatic should be reachable: always in dev, in production only with Keystatic Cloud. */
export const editorEnabled = process.env.NODE_ENV !== "production" || !!cloudProject;

const treatmentOptions = site.treatments.flatMap((g) => g.treatments.map((t) => ({ label: t.name, value: t.slug })));

export default config({
  storage: cloudProject ? { kind: "cloud", branchPrefix: "updates/" } : { kind: "local" },
  ...(cloudProject && { cloud: { project: cloudProject } }),
  ui: {
    brand: { name: `${site.clinic.shortName} website` },
    navigation: { Content: ["articles", "treatments"] },
  },
  singletons: {
    treatments: singleton({
      label: "Treatments",
      path: "src/content/treatments",
      format: { data: "json" },
      schema: {
        treatments: fields.array(
          fields.object({
            name: fields.text({
              label: "Name",
              description: "As shown in the menu and on the treatment's page.",
              validation: { length: { min: 3, max: 60 } },
            }),
            slug: fields.text({
              label: "Web address",
              description:
                "The end of the page's link: /treatments/<this>. Lower-case letters, numbers and dashes. Do not change it once the page is live; Journal articles link to it.",
              validation: { pattern: { regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: "Use lower-case letters, numbers and dashes only, e.g. laser-hair-reduction." } },
            }),
            group: fields.select({
              label: "Menu group",
              options: treatmentGroupInfo.map((g) => ({ label: g.label, value: g.id })),
              defaultValue: "skin",
            }),
            description: fields.text({
              label: "What it is",
              description: "One or two plain sentences: what the treatment is and what happens.",
              multiline: true,
              validation: { length: { min: 20, max: 260 } },
            }),
            forWhom: fields.text({
              label: "Who it helps",
              description: "The problems it treats, in a short list.",
              multiline: true,
              validation: { length: { min: 5, max: 160 } },
            }),
            details: fields.object(
              {
                steps: fields.array(fields.text({ label: "Step", multiline: true }), {
                  label: "What happens at the visit",
                  description: "Step by step. Leave empty to show a \"To add\" box in previews.",
                  itemLabel: (props) => props.value || "New step",
                }),
                sessions: fields.text({
                  label: "Sessions",
                  description: "How many sessions, how far apart, how long each takes.",
                  multiline: true,
                }),
                aftercare: fields.text({
                  label: "Aftercare",
                  description: "What to do and avoid afterwards.",
                  multiline: true,
                }),
                faqs: fields.array(
                  fields.object({
                    question: fields.text({ label: "Question" }),
                    answer: fields.text({ label: "Answer", multiline: true }),
                  }),
                  {
                    label: "Questions patients ask",
                    itemLabel: (props) => props.fields.question.value || "New question",
                  },
                ),
              },
              { label: "Treatment page details" },
            ),
          }),
          {
            label: "Treatments",
            description:
              "Menu order follows this list; drag to reorder. NMC rules: no promised results, no \"permanent\", \"best\" or \"guaranteed\", no prices or offers.",
            itemLabel: (props) => props.fields.name.value || "New treatment",
          },
        ),
      },
    }),
  },
  collections: {
    articles: collection({
      label: "Journal articles",
      path: "src/content/articles/*",
      slugField: "title",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "date"],
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { length: { min: 10, max: 90 } } },
          slug: {
            label: "Web address",
            description: "The end of the article's link: /journal/<this>. Do not change it after the article is published.",
          },
        }),
        summary: fields.text({
          label: "Summary",
          description: "One or two sentences. Shown in the article list, link previews and the RSS feed.",
          multiline: true,
          validation: { length: { min: 20, max: 220 } },
        }),
        audience: fields.select({
          label: "Written for",
          options: [
            { label: "Patients", value: "patients" },
            { label: "Doctors (clinicians)", value: "clinicians" },
          ],
          defaultValue: "patients",
        }),
        date: fields.date({
          label: "Date",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        draft: fields.checkbox({
          label: "Draft",
          description: "Keep this ticked while you are still writing. Untick it when the article is ready to go live.",
          defaultValue: true,
        }),
        related: fields.multiselect({
          label: "Related treatments",
          description: "Linked under the article, and the article is listed on these treatment pages.",
          options: treatmentOptions,
        }),
        body: fields.markdoc({
          label: "Article",
          description:
            "NMC rules: no patient stories or testimonials, no promised results, no words like best, top, leading or guaranteed, no prices or offers, and no before/after photos.",
          options: {
            heading: [2, 3],
            bold: true,
            italic: true,
            link: true,
            unorderedList: true,
            orderedList: true,
            image: { directory: "public/images/journal", publicPath: "/images/journal/" },
            strikethrough: false,
            code: false,
            codeBlock: false,
            blockquote: false,
            table: false,
            divider: false,
          },
          components: {
            pending: wrapper({
              label: "To add (note)",
              description: "A note for something still to write. Shows as a dashed box in previews and is hidden on the live site.",
              schema: {},
            }),
          },
        }),
      },
    }),
  },
});
