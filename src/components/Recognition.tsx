import Image from "next/image";
import { site } from "@/content/site";
import { Reveal } from "./Reveal";

/**
 * Conference and CME photos. Captions stay factual (event, date); NMC rules
 * rule out "award-winning" style claims.
 */
export function Recognition() {
  const photos = site.recognition;
  if (photos.length === 0) return null;

  return (
    <section className="section-y pt-0" aria-labelledby="recognition-title">
      <div className="wrap">
        <Reveal as="h2" id="recognition-title" className="text-h2 max-w-[18ch] text-ink">
          Part of Odisha&rsquo;s dermatology community
        </Reveal>
        <Reveal as="p" index={2} className="text-body mt-6 max-w-[56ch] text-ink-soft">
          {site.doctor.shortName} takes part in state dermatology conferences and continuing medical
          education (CME) programmes, where doctors share new research and treatment updates.
        </Reveal>

        {/* Phones: one swipeable row. Wider screens: all photos side by side. */}
        <Reveal index={3} className="mt-12">
          <ul
            tabIndex={0}
            aria-label="Conference photos"
            className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4"
          >
            {photos.map((p) => (
              <li key={p.image} className="w-[78%] shrink-0 snap-center md:w-auto">
                <figure>
                  <div className="relative h-[220px] overflow-hidden rounded-[28px] bg-tint-mist md:h-[260px] lg:h-[220px]">
                    <Image
                      src={p.image}
                      alt={p.alt}
                      fill
                      sizes="(min-width: 1024px) 290px, (min-width: 720px) 50vw, 78vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 text-[16px] font-semibold text-ink-soft">{p.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
