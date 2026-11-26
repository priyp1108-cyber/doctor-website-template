import { site } from "@/content/site";
import { buildWaLink, messages } from "@/lib/whatsapp";
import { treatmentHref } from "@/lib/pages";
import { Reveal } from "./Reveal";
import { ArrowIcon } from "./icons";

/**
 * The one treatment picker on the homepage: the three groups from the
 * signboard (Skin · Hair · Laser), each treatment linking to its page, and a
 * WhatsApp line for anyone unsure where their problem fits.
 */
export function TreatmentsOverview() {
  const other = site.concerns[site.concerns.length - 1]!;
  return (
    <section id="treatments" className="section-y" aria-labelledby="treatments-title">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal as="h2" id="treatments-title" className="text-h2 max-w-[20ch] text-ink">
            What&rsquo;s bothering you?
          </Reveal>
          <a href="/treatments" className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-brand underline decoration-1 underline-offset-[5px] hover:decoration-2">
            All treatments <ArrowIcon size={18} />
          </a>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {site.treatments.map((g, i) => (
            <Reveal as="li" key={g.id} index={i} className="flex flex-col rounded-[var(--radius-card)] border border-ink/10 bg-white p-7">
              <p className="flex items-center gap-2.5">
                <span aria-hidden="true" className="size-2.5 rounded-full bg-leaf" />
                <span className="text-h3 text-ink">{g.label}</span>
              </p>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{g.intro}</p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${g.label} treatments`}>
                {g.treatments.map((t) => (
                  <li key={t.slug}>
                    <a
                      href={treatmentHref(t.slug)}
                      className="inline-flex min-h-[44px] items-center rounded-full bg-tint-mist px-4 py-1.5 text-[14.5px] font-medium text-ink transition-colors hover:bg-tint-sky"
                    >
                      {t.name}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={buildWaLink(messages.treatment({ name: g.label }))}
                target="_blank"
                rel="noopener"
                data-track="whatsapp_click"
                data-source={`treatments-overview:${g.id}`}
                className="mt-auto inline-flex min-h-[44px] items-center gap-2 pt-6 font-semibold text-brand underline decoration-1 underline-offset-[5px] hover:decoration-2"
              >
                Ask about {g.label.toLowerCase()} <ArrowIcon size={18} />
              </a>
            </Reveal>
          ))}
        </ul>

        <p className="mt-8 text-[16px] leading-relaxed text-ink-soft">
          {other.blurb}{" "}
          <a
            href={buildWaLink(messages.concern(other))}
            target="_blank"
            rel="noopener"
            data-track="whatsapp_click"
            data-source="treatments-overview:other"
            className="font-semibold text-brand underline decoration-1 underline-offset-[5px] hover:decoration-2"
          >
            {other.button} on WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}
