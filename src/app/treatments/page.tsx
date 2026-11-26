import { site } from "@/content/site";
import { PageShell } from "@/components/PageShell";
import { PageIntro } from "@/components/PageIntro";
import { BookPanel } from "@/components/BookPanel";
import { ArrowIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/meta";
import { treatmentHref } from "@/lib/pages";
import { messages } from "@/lib/whatsapp";

export const metadata = pageMetadata({
  title: `Treatments: skin, hair and laser`,
  description: `Skin, hair and laser treatments with ${site.doctor.name} at ${site.clinic.shortName}, ${site.clinic.area}, ${site.clinic.city}.`,
  path: "/treatments",
});

export default function TreatmentsPage() {
  return (
    <PageShell>
      <PageIntro
        crumbs={[{ href: "/treatments", label: "Treatments" }]}
        eyebrow="Treatments"
        title={<>Skin, hair and laser care</>}
        lede={`What ${site.doctor.shortName} treats at ${site.clinic.shortName}. Every treatment starts with a consultation and an examination; the plan is decided after that.`}
      />
      {site.treatments.map((group) => (
        <section key={group.id} className="pb-14 md:pb-20" aria-labelledby={`group-${group.id}`}>
          <div className="wrap">
            <div className="flex items-center gap-3 border-t border-ink/12 pt-8">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-leaf" />
              <h2 id={`group-${group.id}`} className="text-h3 text-ink">
                {group.label}
              </h2>
            </div>
            <p className="mt-2 max-w-[60ch] text-[16px] text-ink-soft">{group.intro}</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.treatments.map((t) => (
                <li key={t.slug}>
                  <a
                    href={treatmentHref(t.slug)}
                    className="group flex h-full flex-col rounded-[20px] border border-ink/10 bg-white p-6 transition-colors hover:border-brand"
                  >
                    <span className="text-[19px] font-bold text-ink">{t.name}</span>
                    <span className="mt-2 text-[15.5px] leading-relaxed text-ink-soft">{t.description}</span>
                    <span className="mt-auto inline-flex items-center gap-2 pt-4 font-semibold text-brand">
                      Read more <ArrowIcon size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
      <BookPanel title="Not sure which one you need?" message={messages.general()} source="treatments-index" />
    </PageShell>
  );
}
