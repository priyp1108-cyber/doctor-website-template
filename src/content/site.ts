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

/**
 * The doctor's specialty. Change these (and the concerns and FAQs below) to
 * use the template for another kind of practice.
 */
const specialty = {
  /** "Dermatologist in <city>" in the page title and link previews. */
  title: "Dermatologist",
  /** schema.org medicalSpecialty, e.g. "Dermatology", "Pediatric", "Dentistry". */
  field: "Dermatology",
  /** Used in running text: "a dermatology clinic", "the dermatology community". */
  adjective: "dermatology",
  /** The hero heading, one word per rising word. */
  headline: "Dermatology for skin, hair, and nails",
  /** Short line on the link-preview image. */
  tagline: "Skin, hair and nail care",
};

const doctor = {
  name: "[CONFIRM] Dr. Full Name",
  /** Used in sentences and WhatsApp messages: "see Dr. Surname about …". */
  shortName: "[CONFIRM] Dr. Surname",
  qualifications: "[CONFIRM] MBBS, MD (Dermatology)",
  qualificationDetail: "[CONFIRM] MBBS — college · MD — college",
  yearsInPractice: null as number | null, // hide the item if null
  registration: "[CONFIRM] State Medical Council registration no.",
  /** Teaching or hospital post; hidden if empty. */
  position: "",
  memberships: [] as string[], // e.g. ["IADVL"]; hidden if empty
  languages: ["English", "Hindi"],
  quote: "[CONFIRM] One sentence in the doctor's own words",
  bio: "[CONFIRM] Short paragraph: training, years in practice, what to expect",
  portrait: "/images/portrait.webp",
  portraitAlt: "[CONFIRM] Dr. Full Name at the clinic",
  atWork: "/images/doctor-at-work.webp",
  atWorkAlt: "[CONFIRM] Dr. Full Name with a patient in the consultation room",
};

const clinic = {
  /** Full name: the site's name in search results, page title and structured data.
   *  Match the Google Business Profile name exactly. */
  name: "[CONFIRM] Clinic Name Dr. Full Name",
  /** Short clinic name, for running text ("Inside Clinic Name"). */
  shortName: "[CONFIRM] Clinic Name",
  /** Logo (`full` is a PNG for Google and link previews). Regenerate the PNGs with `pnpm logo`. */
  logo: { src: "/images/logo.svg", width: 944, height: 180, full: "/images/logo-full.png" },
  street: "[CONFIRM] Street",
  landmark: "", // optional; leave "" if there isn't a well-known one
  area: "[CONFIRM] Area",
  city: "[CONFIRM] City",
  state: "[CONFIRM] State",
  pin: "[CONFIRM]",
  geo: { lat: 0, lng: 0 }, // for the map and structured data (right-click the pin in Google Maps)
  mapsUrl: "[CONFIRM] Google Maps link to the Business Profile",
  mapImage: "/images/map.webp",
  phone: "+91XXXXXXXXXX",
  whatsapp: "91XXXXXXXXXX", // digits only, with country code, used in wa.me
  // 24h times, Asia/Kolkata. Each day can have several sessions; [] = closed.
  hours: {
    mon: [["10:00", "13:00"], ["17:00", "20:00"]],
    tue: [["10:00", "13:00"], ["17:00", "20:00"]],
    wed: [["10:00", "13:00"], ["17:00", "20:00"]],
    thu: [["10:00", "13:00"], ["17:00", "20:00"]],
    fri: [["10:00", "13:00"], ["17:00", "20:00"]],
    sat: [["10:00", "13:00"]],
    sun: [],
  } satisfies WeekHours as WeekHours,
  nextAvailable: "", // free text, e.g. "Today, 5:30 pm"; the card hides if empty
  photos: {
    reception: "/images/reception.webp",
    treatment: "/images/treatment-room.webp",
  },
};

const approach = "[CONFIRM] two sentences in the doctor's words";

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
 * Conference and CME photos, shown near the end of the page; the section is
 * hidden while this list is empty. Keep captions factual (event, place, date),
 * with no "award-winning" or similar claims. Example:
 *   { image: "/images/recognition-1.webp", alt: "Dr. … at …", caption: "Event name, Month YYYY" }
 */
const recognition: RecognitionPhoto[] = [];

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
  specialty,
  doctor,
  clinic,
  concerns,
  recognition,
  faqs,
  siteUrl: "https://[CONFIRM-domain]",
};

export type Site = typeof site;
