import Image from "next/image";
import { site } from "@/content/site";
import { filled, isPlaceholder } from "@/lib/placeholder";
import { Reveal } from "./Reveal";

export function Doctor() {
  const d = site.doctor;
  const timeline = d.timeline.filter((t) => !isPlaceholder(t.title) && !isPlaceholder(t.place));
  const facts: { term: string; detail: string }[] = [
    { term: "Registration", detail: d.registration },
    { term: "Languages", detail: d.languages.join(", ") },
    ...(d.yearsInPractice ? [{ term: "In practice", detail: `${d.yearsInPractice} years` }] : []),
    ...(d.memberships.length ? [{ term: "Memberships", detail: d.memberships.join(", ") }] : []),
  ].filter((f) => !isPlaceholder(f.detail)); // unconfirmed rows stay off the page
  const quote = filled(d.quote);
  const bio = filled(d.bio);

  return (
    <section id="doctor" className="on-dark section-y bg-ink text-paper" aria-labelledby="doctor-title">
      <div className="wrap grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16 lg:gap-24">
        <div className="md:sticky md:top-[100px] md:self-start">
          <Reveal className="relative mx-auto aspect-[730/852] max-w-[460px] overflow-hidden rounded-[var(--radius-card)] bg-ink-deep">
            <Image
              src={d.portrait}
              alt={d.portraitAlt}
              fill
              sizes="(min-width: 720px) 460px, 92vw"
              className="object-cover object-top"
            />
          </Reveal>
        </div>

        <div className="md:py-4">
          <Reveal as="h2" id="doctor-title" className="text-h2 text-paper">
            {quote ? <>&ldquo;{quote}&rdquo;</> : <>{d.name}</>}
          </Reveal>
          <Reveal as="p" index={2} className="mt-4 text-[17px] font-semibold text-on-dark">
            {d.qualifications} · Dermatologist, {site.clinic.city}
          </Reveal>
          {bio && (
            <Reveal as="p" index={3} className="text-body mt-6 max-w-[56ch] text-on-dark">
              {bio}
            </Reveal>
          )}

          {timeline.length > 0 && (
            <Reveal index={3} className="mt-12">
              <h3 className="eyebrow text-on-dark-muted">Training and posts</h3>
              <ol className="relative mt-6 border-l border-paper/20 pl-7">
                {timeline.map((t) => (
                  <li key={t.title} className="relative pb-7 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="absolute top-[7px] -left-[33px] size-[11px] rounded-full border-2 border-ink bg-leaf"
                    />
                    <p className="text-[18px] font-semibold text-paper">{t.title}</p>
                    <p className="mt-1 text-[16px] text-on-dark">{t.place}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          )}

          {facts.length > 0 && (
            <Reveal as="dl" index={4} className="mt-12 border-t border-paper/15">
              {facts.map((f) => (
                <div key={f.term} className="grid gap-1 border-b border-paper/15 py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <dt className="eyebrow pt-0.5 text-on-dark-muted">{f.term}</dt>
                  <dd className="text-[17px] text-on-dark">{f.detail}</dd>
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
