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
export type Tint = "sky" | "ice" | "periwinkle" | "lilac" | "mist" | "sage";

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
  mapImage: "/images/map.webp",
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
    tint: "lilac",
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
  concerns,
  recognition,
  faqs,
  siteUrl: "https://[CONFIRM-domain]",
};

export type Site = typeof site;
