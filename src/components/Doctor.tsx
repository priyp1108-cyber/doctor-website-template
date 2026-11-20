import Image from "next/image";
import { site } from "@/content/site";
import { filled, isPlaceholder } from "@/lib/placeholder";
import { Reveal } from "./Reveal";

export function Doctor() {
  const d = site.doctor;
  const facts: { term: string; detail: string }[] = [
    { term: "Qualifications", detail: d.qualificationDetail },
    ...(d.position ? [{ term: "Teaching", detail: d.position }] : []),
    { term: "Registration", detail: d.registration },
    { term: "Languages", detail: d.languages.join(", ") },
    ...(d.yearsInPractice ? [{ term: "In practice", detail: `${d.yearsInPractice} years` }] : []),
    ...(d.memberships.length ? [{ term: "Memberships", detail: d.memberships.join(", ") }] : []),
  ].filter((f) => !isPlaceholder(f.detail)); // unconfirmed rows stay off the page
  const quote = filled(d.quote);
  const bio = filled(d.bio);

  return (
    <section id="doctor" className="on-dark section-y bg-ink text-paper" aria-labelledby="doctor-title">
      <div className="wrap grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16 lg:gap-24">
        <div className="md:sticky md:top-[100px] md:self-start">
          <Reveal className="relative h-[440px] overflow-hidden rounded-[32px] bg-ink-deep md:h-[540px]">
            <Image src={d.atWork} alt={d.atWorkAlt} fill sizes="(min-width: 720px) 520px, 100vw" className="object-cover" />
          </Reveal>
        </div>

        <div className="md:py-6">
          <Reveal as="p" className="eyebrow text-accent">The doctor</Reveal>
          <Reveal as="h2" index={1} id="doctor-title" className="text-h2 mt-5 text-paper">
            {quote ? <>&ldquo;{quote}&rdquo;</> : d.name}
          </Reveal>
          {bio && (
            <Reveal as="p" index={2} className="text-body mt-8 max-w-[56ch] text-on-dark">
              {bio}
            </Reveal>
          )}
          <Reveal as="dl" index={3} className="mt-12 border-t border-paper/15">
            {facts.map((f) => (
              <div key={f.term} className="grid gap-1 border-b border-paper/15 py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
                <dt className="eyebrow pt-0.5 text-on-dark-muted">{f.term}</dt>
                <dd className="text-[17px] text-on-dark">{f.detail}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
