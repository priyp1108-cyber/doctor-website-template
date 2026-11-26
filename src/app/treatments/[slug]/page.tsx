import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { PageShell } from "@/components/PageShell";
import { PageIntro } from "@/components/PageIntro";
import { BookPanel } from "@/components/BookPanel";
import { Pending } from "@/components/Pending";
import { ArrowIcon, ChatIcon, PlusIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/meta";
import { allTreatments, articleHref, findTreatment, journalArticles, treatmentHref } from "@/lib/pages";
import { siteUrl } from "@/lib/links";
import { jsonLdString } from "@/lib/schema";
import { buildWaLink, inSentence, messages } from "@/lib/whatsapp";
import { showPending } from "@/lib/pending";

export const dynamicParams = false;

export function generateStaticParams() {
  return allTreatments().map(({ treatment }) => ({ slug: treatment.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const found = findTreatment((await params).slug);
  if (!found) return {};
  const t = found.treatment;
  return pageMetadata({
    title: `${t.name} in ${site.clinic.city}`,
    description: `${t.description} With ${site.doctor.name} at ${site.clinic.shortName}, ${site.clinic.area}, ${site.clinic.city}.`,
    path: treatmentHref(t.slug),
  });
}

export default async function TreatmentPage({ params }: Props) {
  const found = findTreatment((await params).slug);
  if (!found) notFound();
  const { group, treatment: t } = found;
  const d = t.details ?? {};
  const siblings = group.treatments.filter((x) => x.slug !== t.slug);
  const reading = journalArticles().filter((a) => a.related?.includes(t.slug));
  const wa = buildWaLink(messages.treatment(t));

  const ld = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: t.name,
    description: t.description,
    url: `${siteUrl()}${treatmentHref(t.slug)}`,
    about: { "@type": "MedicalTherapy", name: t.name },
    reviewedBy: { "@id": `${siteUrl()}/#physician` },
    publisher: { "@id": `${siteUrl()}/#clinic` },
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(ld) }} />
      <PageIntro
        crumbs={[
          { href: "/treatments", label: "Treatments" },
          { href: treatmentHref(t.slug), label: t.name },
        ]}
        eyebrow={group.label}
        title={t.name}
        lede={t.description}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={wa} target="_blank" rel="noopener" data-track="whatsapp_click" data-source={`treatment-page:${t.slug}`} className="btn btn-primary">
            <ChatIcon /> Ask about this on WhatsApp
          </a>
        </div>
      </PageIntro>

      <div className="wrap grid gap-12 pb-16 md:grid-cols-[1.4fr_1fr] md:gap-16 md:pb-24">
        <article className="min-w-0 space-y-12">
          <section aria-labelledby="helps-title">
            <h2 id="helps-title" className="text-h3 text-ink">Who it can help</h2>
            <p className="text-body mt-3 text-ink-soft">{t.forWhom}</p>
          </section>

          <section aria-labelledby="visit-title">
            <h2 id="visit-title" className="text-h3 text-ink">What happens</h2>
            {d.steps?.length ? (
              <ol className="mt-4 space-y-3">
                {d.steps.map((s, i) => (
                  <li key={s} className="flex gap-4 text-body text-ink-soft">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tint-sky text-[15px] font-bold text-brand">{i + 1}</span>
                    <span className="pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <>
                <p className="text-body mt-3 text-ink-soft">
                  The first visit is a consultation: {site.doctor.shortName} asks about the problem and the treatment tried so far,
                  examines the skin, hair or nails, and explains the options. Please bring old prescriptions, reports and the
                  products you use.
                </p>
                <Pending className="mt-4">Step-by-step: what happens during a {inSentence(t.name)} visit or session.</Pending>
              </>
            )}
          </section>

          {(d.sessions || showPending) && (
          <section aria-labelledby="sessions-title">
            <h2 id="sessions-title" className="text-h3 text-ink">Sessions and follow-up</h2>
            {d.sessions ? (
              <p className="text-body mt-3 text-ink-soft">{d.sessions}</p>
            ) : (
              <Pending className="mt-4">How many sessions or follow-up visits are usual, how far apart, and how long each takes.</Pending>
            )}
          </section>
          )}

          {(d.aftercare || showPending) && (
          <section aria-labelledby="aftercare-title">
            <h2 id="aftercare-title" className="text-h3 text-ink">Aftercare</h2>
            {d.aftercare ? (
              <p className="text-body mt-3 text-ink-soft">{d.aftercare}</p>
            ) : (
              <Pending className="mt-4">Aftercare advice, and anything to avoid before or after treatment.</Pending>
            )}
          </section>
          )}

          {(d.faqs?.length || showPending) && (
          <section aria-labelledby="faq-title">
            <h2 id="faq-title" className="text-h3 text-ink">Questions</h2>
            {d.faqs?.length ? (
              <div className="mt-4 border-t border-ink/12">
                {d.faqs.map((f) => (
                  <details key={f.question} className="group border-b border-ink/12">
                    <summary className="flex min-h-[60px] cursor-pointer items-center justify-between gap-6 py-4 text-[18px] font-semibold text-ink">
                      {f.question}
                      <span className="faq-icon grid size-9 shrink-0 place-items-center rounded-full border border-ink/15 text-brand group-open:bg-brand group-open:text-paper">
                        <PlusIcon size={16} />
                      </span>
                    </summary>
                    <p className="text-body pb-5 text-ink-soft">{f.answer}</p>
                  </details>
                ))}
              </div>
            ) : (
              <Pending className="mt-4">Two or three common questions patients ask about {inSentence(t.name)}, with Dr. Panda&rsquo;s answers.</Pending>
            )}
          </section>
          )}

          <p className="border-t border-ink/10 pt-6 text-[14px] text-muted">
            This page is general information, not medical advice. Whether a treatment suits you is decided at a consultation.
          </p>
        </article>

        <aside className="space-y-8 md:sticky md:top-[100px] md:self-start">
          <div className="rounded-[20px] bg-tint-sky p-6">
            <p className="eyebrow text-[12px] text-leaf-ink">Who you will see</p>
            <p className="mt-2 text-[19px] font-bold text-ink">{site.doctor.name}</p>
            <p className="mt-1 text-[15px] text-ink-soft">{site.doctor.qualifications}</p>
            <p className="mt-1 text-[15px] text-ink-soft">{site.doctor.position}</p>
            <a href="/#doctor" className="mt-3 inline-flex min-h-[44px] items-center gap-2 font-semibold text-brand">
              About {site.doctor.shortName} <ArrowIcon size={16} />
            </a>
          </div>

          {siblings.length > 0 && (
            <nav aria-labelledby="more-title">
              <h2 id="more-title" className="eyebrow text-[13px] text-leaf-ink">
                More in {group.label.toLowerCase()}
              </h2>
              <ul className="mt-3 border-t border-ink/12">
                {siblings.map((s) => (
                  <li key={s.slug} className="border-b border-ink/12">
                    <a href={treatmentHref(s.slug)} className="flex min-h-[52px] items-center justify-between gap-3 py-2 font-semibold text-ink hover:text-brand">
                      {s.name} <ArrowIcon size={16} className="shrink-0 text-brand" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {reading.length > 0 && (
            <nav aria-labelledby="reading-title">
              <h2 id="reading-title" className="eyebrow text-[13px] text-leaf-ink">
                From the Journal
              </h2>
              <ul className="mt-3 space-y-3">
                {reading.map((a) => (
                  <li key={a.slug}>
                    <a href={articleHref(a.slug)} className="font-semibold text-brand underline decoration-1 underline-offset-4 hover:decoration-2">
                      {a.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
      </div>

      <BookPanel title={`Book a visit about ${inSentence(t.name)}`} message={messages.treatment(t)} source={`treatment-page-bottom:${t.slug}`} />
    </PageShell>
  );
}
