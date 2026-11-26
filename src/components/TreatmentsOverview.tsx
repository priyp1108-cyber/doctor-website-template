import { site } from "@/content/site";
import { buildWaLink, messages } from "@/lib/whatsapp";
import { treatmentHref } from "@/lib/pages";
import { Reveal } from "./Reveal";
import { ArrowIcon } from "./icons";

/** The three treatment groups from the signboard: Skin · Hair · Laser. */
export function TreatmentsOverview() {
  return (
    <section id="treatments" className="section-y pt-0" aria-labelledby="treatments-title">
      <div className="wrap">
        <Reveal as="p" className="eyebrow text-leaf-ink">Treatments</Reveal>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <Reveal as="h2" index={1} id="treatments-title" className="text-h2 max-w-[20ch] text-ink">
            Skin, hair and <em>laser</em> care under one roof
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
                      className="inline-flex min-h-[36px] items-center rounded-full bg-tint-mist px-3.5 py-1.5 text-[14.5px] font-medium text-ink transition-colors hover:bg-tint-sky"
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
      </div>
    </section>
  );
}
