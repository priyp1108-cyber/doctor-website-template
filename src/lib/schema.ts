import { site } from "@/content/site";
import { openingHoursSpecification } from "./hours";
import { filled } from "./placeholder";
import { mapsLink, siteUrl } from "./links";

/** JSON-LD for the page. Deliberately no aggregateRating / review (NMC rules). */
export function buildJsonLd() {
  const url = siteUrl();
  const { doctor, clinic } = site;
  const address = {
    "@type": "PostalAddress",
    streetAddress: [clinic.street, clinic.landmark].filter(Boolean).join(", "),
    addressLocality: [clinic.area, clinic.city].join(", "),
    addressRegion: clinic.state,
    postalCode: clinic.pin,
    addressCountry: "IN",
  };
  const geo = clinic.geo.lat && clinic.geo.lng
    ? { "@type": "GeoCoordinates", latitude: clinic.geo.lat, longitude: clinic.geo.lng }
    : undefined;
  const hours = openingHoursSpecification(clinic.hours);
  const clinicId = `${url}/#clinic`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      // Google takes the site name shown in results from WebSite.name.
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        name: site.name,
        alternateName: [clinic.shortName, doctor.name],
        url,
        publisher: { "@id": clinicId },
      },
      {
        "@type": "Physician",
        "@id": `${url}/#physician`,
        name: doctor.name,
        medicalSpecialty: site.specialty.field,
        availableLanguage: doctor.languages,
        telephone: clinic.phone,
        address,
        ...(geo && { geo }),
        openingHoursSpecification: hours,
        url,
        image: `${url}${doctor.portrait}`,
        hasMap: mapsLink(),
        ...(filled(doctor.qualifications) && { description: `${doctor.name}, ${doctor.qualifications}` }),
        parentOrganization: { "@id": clinicId },
        worksFor: { "@id": clinicId },
      },
      {
        "@type": "MedicalClinic",
        "@id": clinicId,
        name: filled(clinic.name) ?? doctor.name,
        alternateName: clinic.shortName,
        logo: `${url}${clinic.logo.full}`,
        employee: { "@id": `${url}/#physician` },
        medicalSpecialty: site.specialty.field,
        telephone: clinic.phone,
        address,
        ...(geo && { geo }),
        openingHoursSpecification: hours,
        url,
        image: `${url}${clinic.photos.reception}`,
        hasMap: mapsLink(),
      },
      buildFaqJsonLd(),
    ],
  };
}

export function buildFaqJsonLd() {
  return {
    "@type": "FAQPage",
    "@id": `${siteUrl()}/#faq`,
    mainEntity: site.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Serialise for a <script type="application/ld+json"> without breaking out of it. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

