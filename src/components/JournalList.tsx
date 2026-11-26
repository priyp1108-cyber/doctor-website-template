import { site } from "@/content/site";
import { audiences, type Audience } from "@/content/journal";
import { audienceHref, journalArticles } from "@/lib/pages";
import { showPending } from "@/lib/pending";
import { PageShell } from "./PageShell";
import { PageIntro } from "./PageIntro";
import { ArticleCard, JournalFilter } from "./Journal";
import { Pending } from "./Pending";

/** The Journal index, all articles or one audience. Used by /journal and /journal/for/[audience]. */
export function JournalList({ audience }: { audience?: Audience }) {
  const list = journalArticles(audience);
  const crumbs = [{ href: "/journal", label: "Journal" }];
  if (audience) crumbs.push({ href: audienceHref(audience), label: audiences[audience].label });

  return (
    <PageShell>
      <PageIntro
        crumbs={crumbs}
        eyebrow="Journal"
        title={audience ? audiences[audience].title : <>Notes from {site.doctor.shortName}</>}
        lede={
          audience
            ? audiences[audience].intro
            : `Short articles by ${site.doctor.name} on skin, hair and nail problems: plain-language notes for patients, and clinical notes for doctors.`
        }
      >
        <JournalFilter current={audience} />
        <p className="mt-4 text-[15px] text-muted">
          <a href="/journal/rss.xml" className="underline underline-offset-4 hover:text-ink">
            RSS feed
          </a>
        </p>
      </PageIntro>
      <section className="pb-20 md:pb-28" aria-label="Articles">
        <div className="wrap">
          {showPending && list.some((a) => a.draft) && (
            <Pending className="mb-6">
              The articles marked Draft are outlines written for the template. Dr. Panda needs to review and rewrite each one
              before it is published; drafts are hidden in the launch build.
            </Pending>
          )}
          {list.length ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body text-ink-soft">New articles are on the way.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
