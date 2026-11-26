/**
 * Every fact about the doctor and the clinic lives in this file.
 *
 * Anything starting with "[CONFIRM]" is a placeholder the owner must replace
 * before launch. In development the browser console lists every one that is
 * still left (see src/components/ConfirmWarning.tsx).
 *
 * Compliance reminder (NMC advertising rules): no testimonials, ratings,
 * "best / No. 1 / top / leading", guarantees, discounts or before/after photos.
 */

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
/** A session as ["HH:MM", "HH:MM"], 24h, Asia/Kolkata. "24:00" may close a day. */
export type Session = readonly [string, string];
export type WeekHours = Record<DayKey, readonly Session[]>;

/** Names of the tint tokens defined in src/app/globals.css (--color-tint-*). */
export type Tint = "sky" | "ice" | "periwinkle" | "mint" | "mist" | "sage";

export type Concern = {
  /** URL-safe id, reserved for future /conditions/[slug] pages. */
  slug: string;
  label: string;
  title: string;
  blurb: string;
  approach: string;
  button: string;
  tint: Tint;
  /** Lifestyle image (never before/after). Path under /public. Omit for a text-only panel. */
  image?: string;
  imageAlt?: string;
};

export type Treatment = {
  slug: string;
  name: string;
  /** What it is and what happens, in one or two plain sentences. */
  description: string;
  /** Who it is for: the problems it treats. */
  forWhom: string;
  /**
   * Extra detail for the treatment's own page (/treatments/[slug]). Each part
   * is optional: while it is missing the page shows a "To add" box instead
   * (see src/lib/pending.ts). Fill these in with Dr. Panda's own wording.
   */
  details?: {
    /** What happens at the visit or session, step by step. */
    steps?: string[];
    /** How many sessions, how far apart, how long each takes. */
    sessions?: string;
    /** Aftercare and what to avoid afterwards. */
    aftercare?: string;
    faqs?: Faq[];
  };
};

export type TreatmentGroup = { id: string; label: string; intro: string; treatments: Treatment[] };

export type HeroSlide = {
  /** Short label shown on the photo ("Consultation"). */
  label: string;
  image: string;
  alt: string;
  /** Focus point for object-position, e.g. "60% 40%". */
  focus?: string;
};

export type TimelineItem = { title: string; place: string };

export type Faq = { question: string; answer: string };

export type RecognitionPhoto = { image: string; alt: string; caption: string };

const doctor = {
  name: "Dr. Anil Kumar Panda",
  shortName: "Dr. Panda",
  qualifications: "MBBS, MD (Skin & VD)", // as on the clinic's own poster and signboard
  qualificationDetail: "[CONFIRM] MBBS — college · MD Dermatology — college",
  yearsInPractice: null as number | null, // hide the item if null
  registration: "[CONFIRM] Odisha Council of Medical Registration no.",
  /** Teaching post, from the clinic's poster and signboard. */
  position: "Assistant Professor, Department of Skin & VD, IMS & SUM Hospital, Bhubaneswar",
  memberships: [] as string[], // e.g. ["IADVL"]; hidden if empty
  /** Training and posts, oldest first. Years go in `title` once confirmed.
   *  MD institution: from his public Secondmedic profile (checked 26 Nov 2026);
   *  the MBBS college is still to confirm, so that row stays hidden. */
  timeline: [
    { title: "MBBS", place: "[CONFIRM] Medical college" },
    {
      title: "MD, Dermatology, Venereology & Leprosy",
      place: "IMS & SUM Hospital, Siksha 'O' Anusandhan University, Bhubaneswar",
    },
    { title: "Assistant Professor, Dept. of Skin & VD", place: "IMS & SUM Hospital, Bhubaneswar" },
    { title: "Consultant dermatologist", place: "SA Skincure, Nayapalli, Bhubaneswar" },
  ] as TimelineItem[],
  languages: ["English", "Hindi", "Odia"],
  quote: "[CONFIRM] One sentence in his own words",
  bio: "[CONFIRM] Short paragraph: training, years in Bhubaneswar, what to expect",
  portrait: "/images/portrait.webp",
  portraitAlt: "Dr. Anil Kumar Panda at his desk at SA Skincure, Bhubaneswar",
  atWork: "/images/doctor-at-work.webp",
  atWorkAlt: "Dr. Anil Kumar Panda talking with a patient in his consultation room",
};

const clinic = {
  // Name, address, phone and hours: from the Google Business Profile
  // "S A SKINCURE | Dr. ANIL KUMAR PANDA" (checked 19 Nov 2026).
  /** Full name: the site's name in search results, page title and structured data. */
  name: "SA Skincure Dr. Anil Kumar Panda",
  /** Short clinic name, for running text ("Inside SA Skincure"). */
  shortName: "SA Skincure",
  /** Vector logo (redrawn from the Google profile image; see scripts/logo-vector.py).
   *  `full` is a 1600 px PNG for Google and link previews. Regenerate with `pnpm logo`. */
  logo: { src: "/images/logo.svg", width: 944, height: 180, full: "/images/logo-full.png" },
  street: "N5/98, Block N5",
  landmark: "", // optional; leave "" if there isn't a well-known one
  area: "IRC Village, Nayapalli",
  city: "Bhubaneswar",
  state: "Odisha",
  pin: "751015",
  geo: { lat: 20.2978379, lng: 85.8140253 }, // for the map and structured data
  mapsUrl: "https://maps.google.com/?cid=14699926951035334201",
  mapImage: "/images/map.webp", // OpenStreetMap; rebuild with `npx pnpm@9 map` if geo changes
  phone: "+91 76089 54504",
  whatsapp: "917608954504", // digits only, used in wa.me (same number as phone, confirmed)
  // 24h times, Asia/Kolkata. Each day can have several sessions.
  hours: {
    mon: [["18:00", "21:00"]],
    tue: [["18:00", "21:00"]],
    wed: [["18:00", "21:00"]],
    thu: [["18:00", "21:00"]],
    fri: [["18:00", "21:00"]],
    sat: [["18:00", "21:00"]],
    sun: [],
  } satisfies WeekHours as WeekHours,
  nextAvailable: "", // free text, e.g. "Today, 5:30 pm"; the card hides if empty
  photos: {
    reception: "/images/reception.webp",
    treatment: "/images/treatment-room.webp",
  },
};

/**
 * Home-page hero. The photos are the clinic's own (Google Business Profile
 * and clinic photos in photos-source/). No portrait here: his portrait is in
 * the "Meet Dr. Panda" section. Replace or add slides after a clinic photo
 * shoot (dermatoscope exam, trichoscopy screen); never AI images of people,
 * never before/after.
 */
const hero = {
  headline: "Skin, hair and laser care in Nayapalli, Bhubaneswar",
  slides: [
    {
      label: "Consultation",
      image: "/images/doctor-at-work.webp",
      alt: "Dr. Anil Kumar Panda listening to a patient across his desk at SA Skincure",
      focus: "62% 30%",
    },
    {
      label: "Procedures & laser",
      image: "/images/treatment-room.webp",
      alt: "The treatment room at SA Skincure with a procedure couch and treatment units",
      focus: "60% 55%",
    },
    {
      label: "The clinic",
      image: "/images/reception.webp",
      alt: "Reception and waiting area at SA Skincure",
      focus: "60% 50%",
    },
    {
      label: "Teaching & CME",
      image: "/images/recognition-iadvl-cme.webp",
      alt: "Dr. Anil Kumar Panda with fellow dermatologists at an IADVL Odisha CME",
      focus: "50% 35%",
    },
  ] as HeroSlide[],
};

const approach = "[CONFIRM] two sentences in his words";

const concerns: Concern[] = [
  {
    slug: "acne",
    label: "Acne",
    title: "Acne & acne scars",
    blurb: "Breakouts that keep returning, and the marks they leave behind.",
    approach,
    button: "Book for acne",
    tint: "sky",
  },
  {
    slug: "pigmentation",
    label: "Pigmentation",
    title: "Pigmentation & melasma",
    blurb: "Dark patches, uneven tone and tanning that will not fade.",
    approach,
    button: "Book for pigmentation",
    tint: "ice",
  },
  {
    slug: "hair-fall",
    label: "Hair fall",
    title: "Hair fall & scalp",
    blurb: "Thinning, shedding, dandruff and patchy hair loss.",
    approach,
    button: "Book for hair fall",
    tint: "periwinkle",
  },
  {
    slug: "fungal",
    label: "Fungal infection",
    title: "Fungal infections",
    blurb: "Itchy rings and rashes that come back after creams.",
    approach,
    button: "Book for fungal infection",
    tint: "mint",
  },
  {
    slug: "eczema-psoriasis",
    label: "Eczema & psoriasis",
    title: "Eczema & psoriasis",
    blurb: "Dry, itchy or scaly skin that flares up.",
    approach,
    button: "Book for eczema & psoriasis",
    tint: "mist",
  },
  {
    slug: "other",
    label: "Something else",
    title: "Something else",
    blurb: "Moles, nails, allergies, white patches — or you are not sure what it is.",
    approach,
    button: "Ask the clinic",
    tint: "sage",
  },
];

/**
 * Treatments menu (header). Grouped like the clinic's signboard:
 * "Skin | Hair | Laser".
 *
 * Drafted 26 Nov 2026 from the signboard and public directory listings
 * (Justdial: laser hair removal; Lybrate: trichology, cosmetology;
 * Secondmedic: clinical, surgical and aesthetic dermatology). The clinic has
 * NOT confirmed the list yet: remove anything Dr. Panda does not do, then set
 * `treatmentsConfirmed` to true. Wording must stay factual (no results
 * promised, no "permanent", no prices or offers).
 */
const treatmentsConfirmed = false;

const treatments: TreatmentGroup[] = [
  {
    id: "skin",
    label: "Skin",
    intro: "Medical care for acne, pigmentation, rashes, infections and allergies.",
    treatments: [
      {
        slug: "acne",
        name: "Acne & acne scars",
        description:
          "Medicines, skin-care advice and in-clinic procedures to bring breakouts under control and soften the marks they leave.",
        forWhom: "Pimples, blackheads, painful cysts, dark or pitted marks.",
      },
      {
        slug: "pigmentation",
        name: "Pigmentation & melasma",
        description:
          "Finding the cause of the dark patches first, then creams, sun-protection advice and peels where they suit your skin.",
        forWhom: "Melasma, tanning, dark circles, uneven skin tone.",
      },
      {
        slug: "eczema-psoriasis",
        name: "Eczema & psoriasis",
        description: "Long-term care to calm flare-ups, ease the itch and keep skin comfortable between visits.",
        forWhom: "Dry, scaly, itchy or inflamed patches that keep returning.",
      },
      {
        slug: "fungal",
        name: "Fungal infections",
        description: "A clear diagnosis and a full course of treatment, so the infection clears instead of returning after creams.",
        forWhom: "Ringworm, jock itch, nail fungus, recurring itchy rashes.",
      },
      {
        slug: "vitiligo",
        name: "Vitiligo & white patches",
        description: "Examination of the white patches and a treatment plan to slow their spread and help colour return.",
        forWhom: "White or light patches on the skin or lips.",
      },
      {
        slug: "allergies",
        name: "Skin allergies & hives",
        description: "Working out what sets off the reaction, then treating the rash, swelling and itch.",
        forWhom: "Hives (urticaria), contact allergy, rashes after medicines.",
      },
    ],
  },
  {
    id: "hair",
    label: "Hair",
    intro: "Finding the reason for hair loss or a scalp problem, then treating that reason.",
    treatments: [
      {
        slug: "hair-fall",
        name: "Hair fall & thinning",
        description: "A scalp examination and, where needed, blood tests to find the reason, then treatment matched to it.",
        forWhom: "Heavy shedding, a widening parting, a receding hairline.",
      },
      {
        slug: "scalp",
        name: "Dandruff & scalp care",
        description: "Treatment for flaking, itching and infections of the scalp.",
        forWhom: "Dandruff, seborrhoeic dermatitis, an itchy or sore scalp.",
      },
      {
        slug: "alopecia-areata",
        name: "Patchy hair loss",
        description: "Treatment for alopecia areata, including in-clinic injections into the patches where suitable.",
        forWhom: "Round bald patches on the scalp or beard.",
      },
      {
        slug: "prp",
        name: "PRP for hair",
        description:
          "Platelet-rich plasma, prepared from a small sample of your own blood, is injected into the scalp to support hair growth. Done as a course of sessions.",
        forWhom: "Early thinning, as part of a wider hair-fall plan.",
      },
    ],
  },
  {
    id: "laser",
    label: "Laser & procedures",
    intro: "Laser sessions and minor procedures in the clinic's treatment room.",
    treatments: [
      {
        slug: "laser-hair-reduction",
        name: "Laser hair reduction",
        description: "Laser sessions that reduce unwanted hair growth over a course of treatments, spaced a few weeks apart.",
        forWhom: "Face, underarms, arms and legs; excess hair from hormonal causes.",
      },
      {
        slug: "chemical-peels",
        name: "Chemical peels",
        description: "A controlled peel applied in the clinic that clears the outer layer of skin to improve tone and texture.",
        forWhom: "Acne marks, tanning, dull or uneven skin.",
      },
      {
        slug: "acne-scar-procedures",
        name: "Acne-scar procedures",
        description: "Microneedling and similar procedures to smooth depressed scars, done over several sessions.",
        forWhom: "Pitted, rolling or boxcar acne scars.",
      },
      {
        slug: "skin-surgery",
        name: "Mole, wart & skin-tag removal",
        description: "Minor procedures under local anaesthesia, usually finished in a single visit.",
        forWhom: "Warts, skin tags, moles, corns, milia.",
      },
    ],
  },
];

/**
 * Conference and CME photos (shown near the end of the page). Keep captions
 * factual: event, place, date. No "award-winning" or similar claims.
 */
const recognition: RecognitionPhoto[] = [
  {
    image: "/images/recognition-cuticon-memento.webp",
    alt: "Dr. Anil Kumar Panda receiving a memento on stage at CUTICON Odisha 2024",
    caption: "Receiving a memento at CUTICON Odisha 2024",
  },
  {
    image: "/images/recognition-cuticon-group.webp",
    alt: "Dr. Anil Kumar Panda with colleagues holding mementos at CUTICON Odisha 2024",
    caption: "With colleagues at CUTICON Odisha 2024",
  },
  {
    image: "/images/recognition-iadvl-cme.webp",
    alt: "Dr. Anil Kumar Panda with fellow doctors at the IADVL Odisha CME on Therapeutic Updates",
    caption: "IADVL Odisha CME on Therapeutic Updates, 19 March 2023",
  },
  {
    image: "/images/recognition-cuticon-group-2.webp",
    alt: "Dr. Anil Kumar Panda with fellow dermatologists at CUTICON Odisha 2024",
    caption: "Among fellow dermatologists at CUTICON Odisha 2024",
  },
];

export type Publication = { title: string; authors: string; journal: string; year: string; url?: string };
export type Talk = { title: string; event: string; date: string };
export type PeerContact = { id: string; title: string; text: string; button: string; message: string };

/**
 * "For doctors" page (/for-doctors): profile, publications, talks, CV and
 * doctor-to-doctor contact. Empty lists and "[CONFIRM]" values show as
 * "To add" boxes until filled in.
 */
const forDoctors = {
  intro:
    "For doctors who refer patients, organise CMEs and conferences, or are looking for a dermatology colleague in Bhubaneswar.",
  /** Clinical interests, in his words. Empty = "To add" box. */
  interests: [] as string[],
  /** Peer-reviewed papers, newest first. */
  publications: [] as Publication[],
  /** Talks he has given (not events attended), newest first. */
  talks: [] as Talk[],
  /** Conferences and CMEs from the clinic's photos (factual: event and date only). */
  events: [
    { event: "CUTICON Odisha", date: "2024" },
    { event: "IADVL Odisha CME on Therapeutic Updates", date: "19 March 2023" },
  ],
  /** Path under /public to a PDF CV, e.g. "/docs/dr-anil-kumar-panda-cv.pdf". */
  cv: "[CONFIRM] CV as a PDF",
  /** Email for doctors (referral letters, invitations). */
  email: "[CONFIRM] email address for doctors",
  contacts: [
    {
      id: "refer",
      title: "Refer a patient",
      text: "Send the patient's name, age and the reason for referral. Reports and photos can follow on WhatsApp.",
      button: "Refer on WhatsApp",
      message: "Hello Dr. Panda, I am a doctor and would like to refer a patient to you.",
    },
    {
      id: "speak",
      title: "Invite to speak",
      text: "For CMEs, conferences, medical-college sessions and public health talks. Please include the date, venue and topic.",
      button: "Send an invitation",
      message: "Hello Dr. Panda, I would like to invite you to speak at an event.",
    },
    {
      id: "research",
      title: "Research and case discussion",
      text: "For case discussions, case reports and research collaboration in dermatology.",
      button: "Start a conversation",
      message: "Hello Dr. Panda, I am a doctor and would like to discuss a case or a research collaboration.",
    },
  ] as PeerContact[],
};

const faqs: Faq[] = [
  { question: "Do I need an appointment?", answer: "[CONFIRM]" },
  {
    question: "What should I bring?",
    answer: "Old prescriptions, reports, and the products you use on your skin or hair.",
  },
  { question: "Do you see children?", answer: "[CONFIRM]" },
];

export const site = {
  /** The site's full name (clinic + doctor), used for SEO everywhere. */
  name: clinic.name,
  doctor,
  clinic,
  hero,
  concerns,
  treatments,
  treatmentsConfirmed,
  recognition,
  forDoctors,
  faqs,
  siteUrl: "https://[CONFIRM-domain]",
};

export type Site = typeof site;
