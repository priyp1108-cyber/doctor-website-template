import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { audiences } from "@/content/journal";
import { PageShell } from "@/components/PageShell";
import { PageIntro } from "@/components/PageIntro";
import { BookPanel } from "@/components/BookPanel";
import { Pending } from "@/components/Pending";
import { ArticleCard, AudienceTag, DraftTag } from "@/components/Journal";
import { ArrowIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/meta";
import { articleHref, audienceHref, findArticle, findTreatment, formatDate, journalArticles, treatmentHref } from "@/lib/pages";
import { siteUrl } from "@/lib/links";
import { jsonLdString } from "@/lib/schema";
import { messages } from "@/lib/whatsapp";

export const dynamicParams = false;

export function generateStaticParams() {
  return journalArticles().map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const a = findArticle((await params).slug);
  if (!a) return {};
  return {
    ...pageMetadata({ title: a.title, description: a.summary, path: articleHref(a.slug), type: "article" }),
    // Drafts are visible in previews only; keep them out of search engines.
    ...(a.draft && { robots: { index: false, follow: true } }),
  };
}

export default async function ArticlePage({ params }: Props) {
  const a = findArticle((await params).slug);
  if (!a) notFound();
  const related = (a.related ?? []).map(findTreatment).filter((t) => !!t);
  const more = journalArticles(a.audience).filter((x) => x.slug !== a.slug).slice(0, 2);
  const url = `${siteUrl()}${articleHref(a.slug)}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.summary,
    datePublished: a.date,
    url,
    mainEntityOfPage: url,
    author: { "@type": "Person", name: site.doctor.name, "@id": `${siteUrl()}/#physician` },
    publisher: { "@id": `${siteUrl()}/#clinic` },
    audience: { "@type": a.audience === "clinicians" ? "MedicalAudience" : "PeopleAudience", audienceType: audiences[a.audience].label },
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(ld) }} />
      <PageIntro
        crumbs={[
          { href: "/journal", label: "Journal" },
          { href: audienceHref(a.audience), label: audiences[a.audience].label },
          { href: articleHref(a.slug), label: a.title },
        ]}
        title={a.title}
        lede={a.summary}
      >
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] text-muted">
          <AudienceTag audience={a.audience} />
          {a.draft && <DraftTag />}
          <span>
            By <span className="font-semibold text-ink-soft">{site.doctor.name}</span>, {site.doctor.qualifications}
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={a.date}>{formatDate(a.date)}</time>
        </p>
      </PageIntro>

      <div className="wrap pb-16 md:pb-24">
        <article className="max-w-[68ch]">
          {a.draft && (
            <Pending className="mb-8">
              This is a draft outline. Dr. Panda to review, rewrite in his own words and approve before it is published.
            </Pending>
          )}
          <div className="space-y-5">
            {a.body.map((b, i) => {
              switch (b.type) {
                case "h2":
                  return (
                    <h2 key={i} className="text-h3 pt-4 text-ink">
                      {b.text}
                    </h2>
                  );
                case "ul":
                  return (
                    <ul key={i} className="text-body list-disc space-y-2 pl-6 text-ink-soft marker:text-leaf">
                      {b.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                case "pending":
                  return <Pending key={i}>{b.text}</Pending>;
                default:
                  return (
                    <p key={i} className="text-body text-ink-soft">
                      {b.text}
                    </p>
                  );
              }
            })}
          </div>

          {related.length > 0 && (
            <nav aria-labelledby="related-title" className="mt-12 rounded-[20px] bg-tint-sky p-6">
              <h2 id="related-title" className="eyebrow text-[13px] text-leaf-ink">
                Related treatments
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {related.map(({ treatment: t }) => (
                  <li key={t.slug}>
                    <a href={treatmentHref(t.slug)} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-4 font-semibold text-brand">
                      {t.name} <ArrowIcon size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <p className="mt-10 border-t border-ink/10 pt-6 text-[14px] text-muted">
            {a.audience === "patients"
              ? "This article is general information and is not a substitute for a consultation."
              : "Written for registered medical practitioners. Clinical decisions remain with the treating doctor."}
          </p>
        </article>

        {more.length > 0 && (
          <section aria-labelledby="more-title" className="mt-16">
            <h2 id="more-title" className="text-h3 text-ink">
              More {audiences[a.audience].label.toLowerCase()}
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {more.map((m) => (
                <li key={m.slug}>
                  <ArticleCard article={m} headingLevel={3} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {a.audience === "patients" && <BookPanel title="Questions about your skin or hair?" message={messages.general()} source={`article:${a.slug}`} />}
    </PageShell>
  );
}
