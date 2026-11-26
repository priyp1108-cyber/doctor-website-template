import Image from "next/image";
import { site } from "@/content/site";
import { PageShell } from "@/components/PageShell";
import { PageIntro } from "@/components/PageIntro";
import { Pending } from "@/components/Pending";
import { ArticleCard } from "@/components/Journal";
import { ArrowIcon, ChatIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/meta";
import { audienceHref, journalArticles } from "@/lib/pages";
import { filled, isPlaceholder } from "@/lib/placeholder";
import { showPending } from "@/lib/pending";
import { fullAddress, telLink } from "@/lib/links";
import { buildWaLink, messages } from "@/lib/whatsapp";

const d = site.doctor;
const f = site.forDoctors;

export const metadata = pageMetadata({
  title: `For doctors: ${d.name}`,
  description: `Profile, publications and talks of ${d.name}, ${d.qualifications}, ${d.position}. Refer a patient, invite him to speak or discuss research.`,
  path: "/for-doctors",
});

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`${id}-title`} className="border-t border-ink/12 py-10 md:grid md:grid-cols-[260px_1fr] md:gap-10">
      <h2 id={`${id}-title`} className="text-h3 text-ink">
        {title}
      </h2>
      <div className="mt-5 min-w-0 md:mt-0">{children}</div>
    </section>
  );
}

export default function ForDoctorsPage() {
  const timeline = d.timeline.filter((t) => showPending || (!isPlaceholder(t.title) && !isPlaceholder(t.place)));
  const registration = filled(d.registration);
  const cv = filled(f.cv);
  const email = filled(f.email);
  const notes = journalArticles("clinicians").slice(0, 2);

  return (
    <PageShell>
      <PageIntro crumbs={[{ href: "/for-doctors", label: "For doctors" }]} eyebrow="For doctors" title={d.name} lede={f.intro}>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#contact" className="btn btn-peer">
            Refer, invite or collaborate <ArrowIcon size={18} />
          </a>
          {cv && (
            <a href={cv} className="btn btn-secondary" download>
              Download CV (PDF)
            </a>
          )}
        </div>
      </PageIntro>

      <div className="wrap pb-16 md:pb-24">
        {/* Profile */}
        <section aria-labelledby="profile-title" className="grid gap-10 pb-12 md:grid-cols-[320px_1fr] md:gap-14">
          <div className="relative mx-auto aspect-[730/852] w-full max-w-[320px] overflow-hidden rounded-[var(--radius-card)] bg-tint-mist">
            <Image src={d.portrait} alt={d.portraitAlt} fill sizes="320px" className="object-cover object-top" />
          </div>
          <div>
            <h2 id="profile-title" className="text-h3 text-ink">
              Profile
            </h2>
            <dl className="mt-5 border-t border-ink/12">
              {[
                { term: "Qualifications", detail: d.qualifications },
                { term: "Post", detail: d.position },
                { term: "Practice", detail: `${site.clinic.shortName}, ${fullAddress()} (evening clinic)` },
                { term: "Languages", detail: d.languages.join(", ") },
                ...(d.memberships.length ? [{ term: "Memberships", detail: d.memberships.join(", ") }] : []),
                ...(registration ? [{ term: "Registration", detail: registration }] : []),
              ].map((row) => (
                <div key={row.term} className="grid gap-1 border-b border-ink/12 py-4 sm:grid-cols-[170px_1fr] sm:gap-6">
                  <dt className="eyebrow pt-0.5 text-[13px] text-muted">{row.term}</dt>
                  <dd className="text-[16.5px] text-ink">{row.detail}</dd>
                </div>
              ))}
            </dl>
            {!registration && <Pending className="mt-4">Medical council and registration number.</Pending>}
            {d.memberships.length === 0 && <Pending className="mt-3">Professional memberships (e.g. IADVL, with membership number if he wants it shown).</Pending>}
            {!filled(d.bio) && <Pending className="mt-3">A short professional bio: training, years in practice, clinical and teaching work.</Pending>}

            <h3 className="eyebrow mt-10 text-[13px] text-leaf-ink">Clinical interests</h3>
            {f.interests.length ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {f.interests.map((i) => (
                  <li key={i} className="rounded-full bg-tint-mint px-3.5 py-1.5 text-[15px] font-medium text-ink">
                    {i}
                  </li>
                ))}
              </ul>
            ) : (
              <Pending className="mt-3">The areas of dermatology he is most interested in and takes referrals for.</Pending>
            )}
          </div>
        </section>

        <Section id="training" title="Training and posts">
          <ol className="relative border-l border-ink/15 pl-7">
            {timeline.map((t) => (
              <li key={t.title} className="relative pb-6 last:pb-0">
                <span aria-hidden="true" className="absolute top-[7px] -left-[33px] size-[11px] rounded-full border-2 border-paper bg-leaf" />
                <p className="text-[17.5px] font-semibold text-ink">{t.title}</p>
                {isPlaceholder(t.place) ? (
                  <Pending className="mt-2">Medical college and years.</Pending>
                ) : (
                  <p className="mt-1 text-[16px] text-ink-soft">{t.place}</p>
                )}
              </li>
            ))}
          </ol>
          <Pending className="mt-6">Years for each step of training and each post.</Pending>
        </Section>

        {(f.publications.length > 0 || showPending) && (
        <Section id="publications" title="Publications">
          {f.publications.length ? (
            <ol className="space-y-5">
              {f.publications.map((p) => (
                <li key={p.title} className="text-[16.5px] leading-relaxed text-ink-soft">
                  <span className="text-ink">{p.authors}.</span>{" "}
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener" className="font-semibold text-brand underline underline-offset-4">
                      {p.title}
                    </a>
                  ) : (
                    <span className="font-semibold text-ink">{p.title}</span>
                  )}
                  . <em>{p.journal}</em>. {p.year}.
                </li>
              ))}
            </ol>
          ) : (
            <Pending>
              Peer-reviewed papers, newest first: authors, title, journal, year and a DOI or PubMed link. Add them to{" "}
              <code>forDoctors.publications</code> in <code>site.ts</code>.
            </Pending>
          )}
        </Section>
        )}

        <Section id="talks" title="Talks and conferences">
          {f.talks.length > 0 && (
            <ul className="mb-6 space-y-4">
              {f.talks.map((t) => (
                <li key={t.title + t.date}>
                  <p className="text-[17px] font-semibold text-ink">{t.title}</p>
                  <p className="text-[15.5px] text-ink-soft">
                    {t.event} · {t.date}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {f.talks.length === 0 && (
            <Pending className="mb-6">Talks he has given: title, meeting and date (CMEs, conferences, medical-college lectures).</Pending>
          )}
          <h3 className="eyebrow text-[13px] text-leaf-ink">Conferences and CMEs</h3>
          <ul className="mt-3 border-t border-ink/12">
            {f.events.map((e) => (
              <li key={e.event} className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-ink/12 py-3.5 text-[16px]">
                <span className="font-semibold text-ink">{e.event}</span>
                <span className="text-ink-soft">{e.date}</span>
              </li>
            ))}
          </ul>
        </Section>

        {(cv || showPending) && (
        <Section id="cv" title="CV">
          {cv ? (
            <a href={cv} className="btn btn-secondary" download>
              Download CV (PDF)
            </a>
          ) : (
            <Pending>A PDF of his CV. Put it in <code>public/docs/</code> and set <code>forDoctors.cv</code> to its path.</Pending>
          )}
        </Section>
        )}

        {notes.length > 0 && (
          <Section id="notes" title="Notes for clinicians">
            <ul className="grid gap-5 lg:grid-cols-2">
              {notes.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} headingLevel={3} />
                </li>
              ))}
            </ul>
            <a href={audienceHref("clinicians")} className="mt-5 inline-flex min-h-[44px] items-center gap-2 font-semibold text-brand">
              All notes for clinicians <ArrowIcon size={16} />
            </a>
          </Section>
        )}
      </div>

      {/* Doctor-to-doctor contact: green (btn-peer), kept apart from patient booking. */}
      <section id="contact" className="section-y bg-tint-mint" aria-labelledby="contact-title">
        <div className="wrap">
          <p className="eyebrow text-leaf-ink">Doctor to doctor</p>
          <h2 id="contact-title" className="text-h2 mt-4 max-w-[22ch] text-ink">
            Refer a patient, invite him to speak, or discuss a case
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {f.contacts.map((c) => (
              <li key={c.id} className="flex flex-col rounded-[20px] bg-white p-7">
                <h3 className="text-[21px] font-bold text-ink">{c.title}</h3>
                <p className="mt-2 mb-auto text-[16px] leading-relaxed text-ink-soft">{c.text}</p>
                <a
                  href={buildWaLink(messages.peer(c))}
                  target="_blank"
                  rel="noopener"
                  data-track="whatsapp_click"
                  data-source={`for-doctors:${c.id}`}
                  className="btn btn-sm btn-peer mt-6 self-start"
                >
                  <ChatIcon size={18} /> {c.button}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[16px] text-ink-soft">
            Or call the clinic on{" "}
            <a href={telLink()} data-track="call_click" data-source="for-doctors" className="font-semibold text-brand underline underline-offset-4">
              {site.clinic.phone}
            </a>
            {email && (
              <>
                {" "}or email{" "}
                <a href={`mailto:${email}`} className="font-semibold text-brand underline underline-offset-4">
                  {email}
                </a>
              </>
            )}
            .
          </p>
          {!email && <Pending className="mt-4">An email address for referral letters and invitations.</Pending>}
        </div>
      </section>
    </PageShell>
  );
}
