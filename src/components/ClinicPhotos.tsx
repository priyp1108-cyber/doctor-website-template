import Image from "next/image";
import { site } from "@/content/site";
import { filled } from "@/lib/placeholder";

export function ClinicPhotos() {
  const clinicName = filled(site.clinic.shortName) ?? "the clinic";
  const city = site.clinic.city;
  const p = site.clinic.photos;
  const photos = [
    { src: p.reception, alt: `Reception at ${clinicName}, ${city}` },
    { src: p.treatment, alt: `Treatment room at ${clinicName}, ${city}` },
  ];

  return (
    <section className="section-y pt-0" aria-labelledby="photos-title">
      <div className="wrap">
        <h2 id="photos-title" className="text-h2 text-ink">
          Inside the clinic
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-6">
          {photos.map((ph) => (
            <div key={ph.src} className="relative h-[300px] overflow-hidden rounded-[28px] bg-tint-mist md:h-[480px]">
              <Image src={ph.src} alt={ph.alt} fill sizes="(min-width: 720px) 600px, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
