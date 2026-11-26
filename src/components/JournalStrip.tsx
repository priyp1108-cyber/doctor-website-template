import { journalArticles } from "@/lib/pages";
import { ArticleCard } from "./Journal";
import { Reveal } from "./Reveal";
import { ArrowIcon } from "./icons";

/** Home page: the three newest Journal articles. Hidden when there are none. */
export function JournalStrip() {
  const latest = journalArticles().slice(0, 3);
  if (latest.length === 0) return null;
  return (
    <section id="journal" className="section-y pt-0" aria-labelledby="journal-title">
      <div className="wrap">
        <Reveal as="p" className="eyebrow text-leaf-ink">From the Journal</Reveal>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <Reveal as="h2" index={1} id="journal-title" className="text-h2 max-w-[20ch] text-ink">
            Notes for patients and <em>doctors</em>
          </Reveal>
          <a href="/journal" className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-brand underline decoration-1 underline-offset-[5px] hover:decoration-2">
            All articles <ArrowIcon size={18} />
          </a>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {latest.map((a, i) => (
            <Reveal as="li" key={a.slug} index={i}>
              <ArticleCard article={a} headingLevel={3} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
