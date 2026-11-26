/**
 * The Journal: short articles by Dr. Panda, for patients or for clinicians.
 *
 * Every article below is a DRAFT outline written for the template. Before an
 * article goes live, Dr. Panda must read it, rewrite it in his own words,
 * fill in the "pending" blocks, and set `draft: false`. With
 * NEXT_PUBLIC_HIDE_PENDING=1 drafts are left out of the site, the RSS feed
 * and the sitemap.
 *
 * Same NMC rules as site.ts: no testimonials, results promised, superlatives,
 * prices or before/after images. tests/unit/content.test.ts checks the wording.
 */

export type Audience = "patients" | "clinicians";

export const audiences: Record<Audience, { label: string; title: string; intro: string }> = {
  patients: {
    label: "For patients",
    title: "For patients",
    intro: "Plain-language notes on common skin and hair problems, and on getting the most from a visit.",
  },
  clinicians: {
    label: "For clinicians",
    title: "For clinicians",
    intro: "Notes for doctors: referral pointers, case discussions and updates from dermatology meetings.",
  },
};

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  /** Content still to come from Dr. Panda: shown as a "To add" box. */
  | { type: "pending"; text: string };

export type Article = {
  slug: string;
  title: string;
  /** One or two sentences for the list, the RSS feed and link previews. */
  summary: string;
  audience: Audience;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** True until Dr. Panda has reviewed and approved it. */
  draft: boolean;
  /** Treatment slugs from site.treatments, linked under the article. */
  related?: string[];
  body: Block[];
};

export const articles: Article[] = [
  {
    slug: "sunscreen-in-a-hot-humid-climate",
    title: "Sunscreen in a hot, humid climate: how much and how often",
    summary: "How to choose a sunscreen, how much to apply and when to reapply it in Odisha's heat and humidity.",
    audience: "patients",
    date: "2026-11-20",
    draft: true,
    related: ["pigmentation", "chemical-peels"],
    body: [
      {
        type: "p",
        text: "Sunlight darkens pigmentation and melasma and slows the fading of acne marks. A sunscreen used every day, in the right amount, is part of treating these problems, not an extra.",
      },
      { type: "h2", text: "Choosing one" },
      {
        type: "ul",
        items: [
          "Broad spectrum (protects against UVA and UVB), SPF 30 or more.",
          "A gel or fluid texture is easier to wear in humid weather than a thick cream.",
          "If you have acne-prone skin, look for a label that says non-comedogenic.",
        ],
      },
      { type: "h2", text: "How much and when" },
      {
        type: "p",
        text: "Most people apply far less than the amount the SPF is tested at. For the face and neck, a common guide is two finger-lengths of sunscreen. Apply it 15 minutes before going out.",
      },
      {
        type: "p",
        text: "Reapply every two to three hours when you are outdoors, and after sweating heavily or washing your face. Indoors near a window, one morning application is usually enough.",
      },
      { type: "pending", text: "Dr. Panda's own advice for patients on pigmentation treatment, and any products he prefers patients to avoid." },
    ],
  },
  {
    slug: "first-visit-for-hair-fall",
    title: "Your first visit for hair fall: what to bring and what happens",
    summary: "A short checklist for your first consultation about hair fall, and what the examination involves.",
    audience: "patients",
    date: "2026-11-12",
    draft: true,
    related: ["hair-fall", "scalp", "alopecia-areata"],
    body: [
      {
        type: "p",
        text: "Hair fall has many causes: a recent illness or fever, low iron or thyroid levels, hormonal changes, stress, hair styling, scalp conditions and family patterns among them. The first visit is about finding which one applies to you.",
      },
      { type: "h2", text: "What to bring" },
      {
        type: "ul",
        items: [
          "Old prescriptions and any blood-test reports from the last year.",
          "The shampoos, oils, serums and supplements you use now.",
          "A note of when the hair fall started, and anything that changed around then (illness, a new medicine, pregnancy, a change in diet).",
        ],
      },
      { type: "h2", text: "What happens" },
      {
        type: "p",
        text: "Dr. Panda will ask about your health and your hair-care routine, examine your scalp and hair, and may ask for blood tests. Treatment is planned once the cause is clear.",
      },
      { type: "pending", text: "Whether the clinic does trichoscopy (scalp magnification) at the first visit, and how long the visit usually takes." },
    ],
  },
  {
    slug: "fungal-infections-that-keep-coming-back",
    title: "Fungal infections that keep coming back",
    summary: "Why ringworm often returns after creams, and what helps it clear.",
    audience: "patients",
    date: "2026-11-05",
    draft: true,
    related: ["fungal"],
    body: [
      {
        type: "p",
        text: "Fungal skin infections such as ringworm (tinea) are common in hot, humid weather. Many people find the rash fades with a cream and then returns a few weeks later.",
      },
      { type: "h2", text: "Common reasons it returns" },
      {
        type: "ul",
        items: [
          "Stopping treatment as soon as the itch settles, before the infection has cleared.",
          "Creams that contain a steroid. They reduce redness at first but can make the infection spread and harder to treat.",
          "Family members with the same rash, or shared towels and clothes.",
          "Clothes that stay damp with sweat for long periods.",
        ],
      },
      { type: "h2", text: "What helps" },
      {
        type: "p",
        text: "See a dermatologist before starting another cream, and bring the creams you have already used. Finish the full course you are given, even after the rash fades, and wash and dry clothes and towels well.",
      },
      { type: "pending", text: "Dr. Panda's advice on household measures and when family members should be seen too." },
    ],
  },
  {
    slug: "referring-a-patient-to-sa-skincure",
    title: "Referring a patient to SA Skincure",
    summary: "What to send with a referral, which problems Dr. Panda sees, and how to reach him.",
    audience: "clinicians",
    date: "2026-11-18",
    draft: true,
    body: [
      {
        type: "p",
        text: "SA Skincure is an evening dermatology clinic in Nayapalli, Bhubaneswar. Referrals can be sent on WhatsApp to the clinic number; the For doctors page has a ready-made message.",
      },
      { type: "h2", text: "What to send" },
      {
        type: "ul",
        items: [
          "The patient's name, age and contact number.",
          "The reason for referral and the treatment tried so far, with doses.",
          "Relevant reports, and clinical photos if the patient agrees.",
        ],
      },
      { type: "h2", text: "Problems Dr. Panda sees" },
      { type: "pending", text: "The conditions Dr. Panda is happy to take referrals for, and any he would rather see urgently." },
      { type: "h2", text: "After the visit" },
      { type: "pending", text: "How and when the referring doctor hears back (a note on WhatsApp, a letter with the patient)." },
    ],
  },
  {
    slug: "notes-on-topical-steroid-misuse-in-tinea",
    title: "Notes on topical steroid misuse in tinea",
    summary: "A short case-based note for referring doctors on steroid-modified tinea.",
    audience: "clinicians",
    date: "2026-11-02",
    draft: true,
    related: ["fungal"],
    body: [
      {
        type: "p",
        text: "Fixed-dose creams that combine a steroid with an antifungal and an antibiotic are widely available without a prescription. They are a frequent reason for extensive or recurrent tinea seen in dermatology clinics.",
      },
      { type: "h2", text: "Case" },
      { type: "pending", text: "A de-identified case from Dr. Panda's practice (with the patient's consent): history, findings, management and follow-up." },
      { type: "h2", text: "Points for practice" },
      { type: "pending", text: "Dr. Panda's key points for general practitioners, with references to current IADVL guidance." },
    ],
  },
];

/** Articles shown on the site: everything while drafts are visible, otherwise only approved ones. Newest first. */
export function visibleArticles(showDrafts: boolean): Article[] {
  return articles.filter((a) => showDrafts || !a.draft).sort((a, b) => b.date.localeCompare(a.date));
}
