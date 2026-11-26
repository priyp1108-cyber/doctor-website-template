import { audiences, type Article, type Audience } from "@/content/journal";
import { articleHref, audienceHref, formatDate } from "@/lib/pages";
import { ArrowIcon } from "./icons";

export function AudienceTag({ audience }: { audience: Audience }) {
  const tone = audience === "clinicians" ? "bg-tint-mint text-leaf-ink" : "bg-tint-sky text-brand";
  return <span className={`rounded-full px-3 py-1 text-[13px] font-bold ${tone}`}>{audiences[audience].label}</span>;
}

export function DraftTag() {
  return <span className="rounded-full border border-dashed border-ink/30 px-3 py-1 text-[13px] font-bold text-muted">Draft</span>;
}

/** One article in a list: whole card is the link. Heading level is set by the caller's context. */
export function ArticleCard({ article: a, headingLevel = 2 }: { article: Article; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <a
      href={articleHref(a.slug)}
      className="group flex h-full flex-col rounded-[20px] border border-ink/10 bg-white p-6 transition-colors hover:border-brand md:p-7"
    >
      <span className="flex flex-wrap items-center gap-2">
        <AudienceTag audience={a.audience} />
        {a.draft && <DraftTag />}
      </span>
      <H className="mt-4 text-[21px] leading-snug font-bold text-ink">{a.title}</H>
      <span className="mt-2 text-[15.5px] leading-relaxed text-ink-soft">{a.summary}</span>
      <span className="mt-auto flex items-center justify-between gap-3 pt-5 text-[14.5px] text-muted">
        <time dateTime={a.date}>{formatDate(a.date)}</time>
        <ArrowIcon size={18} className="text-brand transition-transform group-hover:translate-x-1" />
      </span>
    </a>
  );
}

/**
 * "All / For patients / For clinicians" filter. Plain links to static pages,
 * so it works without JavaScript and each view has its own URL.
 */
export function JournalFilter({ current }: { current?: Audience }) {
  const options: { href: string; label: string; active: boolean }[] = [
    { href: "/journal", label: "All", active: !current },
    ...(Object.keys(audiences) as Audience[]).map((a) => ({
      href: audienceHref(a),
      label: audiences[a].label,
      active: current === a,
    })),
  ];
  return (
    <nav aria-label="Filter articles" className="mt-8">
      <ul className="inline-flex flex-wrap gap-2 rounded-2xl border border-ink/10 bg-white p-1.5">
        {options.map((o) => (
          <li key={o.href}>
            <a
              href={o.href}
              aria-current={o.active ? "page" : undefined}
              className={`inline-flex min-h-[44px] items-center rounded-xl px-4 text-[15.5px] font-semibold transition-colors ${
                o.active ? "bg-brand text-paper" : "text-ink-soft hover:bg-tint-mist hover:text-ink"
              }`}
            >
              {o.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
