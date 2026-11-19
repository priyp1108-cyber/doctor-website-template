import { site } from "@/content/site";
import { filled } from "./placeholder";

export function telLink(phone = site.clinic.phone): string {
  return `tel:${phone.replace(/[^\d+]/g, "") || phone}`;
}

/** The Business Profile link, or a Maps search while it is still a placeholder. */
export function mapsLink(): string {
  const url = filled(site.clinic.mapsUrl);
  if (url) return url;
  const { lat, lng } = site.clinic.geo;
  const query = lat && lng ? `${lat},${lng}` : `${site.doctor.name} ${site.clinic.city}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function mapsEmbedUrl(): string {
  const { lat, lng } = site.clinic.geo;
  const q = lat && lng ? `${lat},${lng}` : `${site.doctor.name} ${site.clinic.city}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;
}

export function fullAddress(): string {
  const c = site.clinic;
  return [c.street, c.landmark, c.area, `${c.city}, ${c.state} ${c.pin}`].filter(Boolean).join(", ");
}

/** Absolute site URL; falls back to env / localhost until the domain is set. */
export function siteUrl(): string {
  return (
    filled(site.siteUrl) ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, "");
}
