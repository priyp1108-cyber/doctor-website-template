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
        <Reveal as="p" className="eyebrow text-brand">Recognition</Reveal>
        <Reveal as="h2" index={1} id="recognition-title" className="text-h2 mt-4 max-w-[18ch] text-ink">
          Part of Odisha&rsquo;s <em>dermatology</em> community
        </Reveal>
        <Reveal as="p" index={2} className="text-body mt-6 max-w-[56ch] text-ink-soft">
          {site.doctor.shortName} takes part in state dermatology conferences and continuing medical
          education (CME) programmes, where doctors share new research and treatment updates.
        </Reveal>

        <ul className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-2">
          {photos.map((p, i) => (
            <Reveal as="li" key={p.image} index={i % 2}>
              <figure>
                <div className="relative h-[260px] overflow-hidden rounded-[28px] bg-tint-mist sm:h-[340px]">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 720px) 600px, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 text-[16px] font-semibold text-ink-soft">{p.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
