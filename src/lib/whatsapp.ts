import { site, type Concern } from "@/content/site";

/** Pure builder: wa.me link for a digits-only number and a message. */
export function waLink(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** wa.me link to the clinic's WhatsApp number with a pre-filled message. */
export function buildWaLink(message: string): string {
  return waLink(site.clinic.whatsapp, message);
}

/** What the visitor wants to be seen about, as used inside a sentence. */
export function concernSubject(concern: Pick<Concern, "slug" | "label">): string {
  return concern.slug === "other" ? "a skin concern" : concern.label.toLowerCase();
}

export const messages = {
  general: () => `Hello, I would like to book an appointment with ${site.doctor.shortName}.`,
  concern: (c: Pick<Concern, "slug" | "label">) =>
    `Hello, I would like to see ${site.doctor.shortName} about ${concernSubject(c)}.`,
  request: (name: string, phone: string, subject: string) =>
    `Hello, I am ${name} (${phone}). I would like an appointment with ${site.doctor.shortName} about ${subject}.`,
};
