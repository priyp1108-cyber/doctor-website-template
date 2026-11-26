import { site } from "@/content/site";
import { buildWaLink, messages } from "@/lib/whatsapp";
import { treatmentHref } from "@/lib/pages";
import { TreatmentsMenuEnhancer } from "./TreatmentsMenuEnhancer";
import { ArrowIcon, ChatIcon, ChevronDownIcon, CloseIcon, MenuIcon, PlusIcon } from "./icons";

/** Header links. `wide` links only fit in the header from the lg breakpoint.
 *  Home-page sections use "/#id" so they work from every page. */
const links = [
  { href: "/#doctor", label: "The doctor", wide: false },
  { href: "/journal", label: "Journal", wide: false },
  { href: "/for-doctors", label: "For doctors", wide: true },
  { href: "/#visit", label: "Visit", wide: true },
];

/* eslint-disable @next/next/no-img-element -- tiny fixed-size logo; plain <img> keeps it out of the image optimiser and inlines cleanly in the static export */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur-[14px]">
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        {/* Logo + doctor's name; the alt text carries the full site name. */}
        <a href="/" className="flex min-h-[44px] min-w-0 items-center gap-4 text-ink">
          <img
            src={site.clinic.logo.src}
            width={site.clinic.logo.width}
            height={site.clinic.logo.height}
            alt={site.name}
            className="h-[34px] w-auto shrink-0 sm:h-[40px]"
          />
          <span
            aria-hidden="true"
            className="hidden border-l border-ink/15 pl-4 text-[13px] leading-tight font-semibold tracking-[0.06em] whitespace-nowrap text-muted uppercase xl:block"
          >
            {site.doctor.name}
          </span>
        </a>
        <nav aria-label="Main" className="flex items-center gap-3 md:gap-6 lg:gap-7">
          <ul className="hidden items-center gap-6 md:flex lg:gap-7">
            <TreatmentsMenu />
            {links.map((l) => (
              <li key={l.href} className={l.wide ? "hidden lg:block" : undefined}>
                <a href={l.href} className="text-[16px] font-medium text-ink-soft transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={buildWaLink(messages.general())}
            target="_blank"
            rel="noopener"
            data-track="whatsapp_click"
            data-source="header"
            className="btn btn-sm btn-primary hidden sm:inline-flex"
          >
            Book a visit
          </a>
          <MobileMenu />
        </nav>
      </div>
      <TreatmentsMenuEnhancer />
    </header>
  );
}

/** Desktop: "Treatments" opens a panel with every treatment, grouped, and a details card. */
function TreatmentsMenu() {
  const first = site.treatments[0]?.treatments[0]?.slug;
  return (
    <li data-tm className="tm">
      <button
        type="button"
        data-tm-toggle
        aria-expanded="false"
        aria-controls="tm-panel"
        className="flex h-[72px] items-center gap-1.5 text-[16px] font-medium text-ink-soft transition-colors hover:text-ink aria-expanded:text-ink"
      >
        Treatments
        <ChevronDownIcon size={18} className="tm-chevron text-brand" />
      </button>

      <div id="tm-panel" data-tm-panel className="tm-panel absolute inset-x-0 top-full border-b border-ink/10 bg-paper shadow-soft">
        <div className="wrap py-8">
          <div className="relative pb-[268px] lg:min-h-[440px] lg:pr-[392px] lg:pb-0">
            <div className="tm-list grid grid-cols-3 gap-6 lg:gap-8">
              {site.treatments.map((group) => (
                <div key={group.id}>
                  <p className="eyebrow mb-3 flex items-center gap-2 text-[13px] text-leaf-ink">
                    <span aria-hidden="true" className="size-2 rounded-full bg-leaf" />
                    {group.label}
                  </p>
                  <ul className="-mx-3">
                    {group.treatments.map((t) => (
                      <li key={t.slug} data-tm-item className="tm-item" data-active={t.slug === first ? "" : undefined}>
                        <a
                          href={treatmentHref(t.slug)}
                          data-tm-trigger
                          className="tm-trigger flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[16px] leading-snug font-medium text-ink-soft transition-colors"
                        >
                          {t.name}
                          <ArrowIcon size={16} className="tm-arrow shrink-0 text-brand" />
                        </a>
                        <TreatmentDetail group={group.label} treatment={t} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-tint-mint px-5 py-4 text-[15px] text-ink-soft">
            <span>
              Not sure which treatment you need? Describe the problem and the clinic will guide you, or{" "}
              <a href="/treatments" className="font-semibold text-brand underline underline-offset-4">
                see all treatments
              </a>
              .
            </span>
            <a
              href={buildWaLink(messages.general())}
              target="_blank"
              rel="noopener"
              data-track="whatsapp_click"
              data-source="treatments:unsure"
              className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-brand"
            >
              Message the clinic <ArrowIcon size={16} />
            </a>
          </p>
        </div>
      </div>
    </li>
  );
}

function TreatmentDetail({ group, treatment: t }: { group: string; treatment: (typeof site.treatments)[number]["treatments"][number] }) {
  return (
    <div className="tm-detail absolute inset-x-0 bottom-0 h-[244px] flex-col overflow-hidden rounded-[var(--radius-card)] bg-tint-sky p-6 lg:inset-x-auto lg:top-0 lg:right-0 lg:h-auto lg:w-[360px] lg:p-7">
      <p className="eyebrow text-[12px] text-leaf-ink">{group}</p>
      <p className="mt-2 font-display text-[26px] font-bold leading-[1.15] tracking-[-0.01em] text-ink">{t.name}</p>
      <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">{t.description}</p>
      <p className="mt-3 hidden text-[15px] leading-relaxed text-ink-soft lg:block">
        <span className="font-semibold text-ink">Helps with: </span>
        {t.forWhom}
      </p>
      <div className="mt-auto flex flex-wrap gap-2 pt-4 lg:pt-5">
        <a href={treatmentHref(t.slug)} className="btn btn-sm btn-secondary lg:flex-1">
          Read more
        </a>
        <a
          href={buildWaLink(messages.treatment(t))}
          target="_blank"
          rel="noopener"
          data-track="whatsapp_click"
          data-source={`treatments:${t.slug}`}
          className="btn btn-sm btn-primary lg:flex-1"
        >
          <ChatIcon size={18} />
          Ask about this
        </a>
        <p className="mt-3 hidden text-center text-[13px] text-muted lg:block">The right treatment is decided after an examination.</p>
      </div>
    </div>
  );
}

/** Phone: a native <details> sheet with the treatments as an accordion. */
function MobileMenu() {
  return (
    <details data-mobile-menu className="mobile-menu md:hidden">
      <summary
        aria-label="Menu"
        className="grid size-12 cursor-pointer place-items-center rounded-full border border-ink/15 bg-white/70 text-ink"
      >
        <MenuIcon size={22} className="mobile-menu-open" />
        <CloseIcon size={22} className="mobile-menu-close" />
      </summary>
      <div
        data-lenis-prevent
        // The header's backdrop blur makes it the containing block for `fixed`,
        // so the sheet is placed under the header and sized to the viewport.
        className="fixed inset-x-0 top-full z-50 h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-t border-ink/10 bg-paper px-6 pt-6 pb-[calc(32px+env(safe-area-inset-bottom))]"
      >
        <a href="/treatments" className="eyebrow inline-flex min-h-[44px] items-center gap-2 text-[13px] text-leaf-ink">
          Treatments <ArrowIcon size={14} />
        </a>
        {site.treatments.map((group) => (
          <div key={group.id} className="mt-5">
            <p className="font-display text-[24px] font-bold leading-tight text-ink">{group.label}</p>
            <ul className="mt-2 border-t border-ink/12">
              {group.treatments.map((t) => (
                <li key={t.slug}>
                  <details className="group border-b border-ink/12">
                    <summary className="flex min-h-[52px] cursor-pointer items-center justify-between gap-4 py-3 text-[17px] font-semibold text-ink">
                      {t.name}
                      <span className="faq-icon grid size-8 shrink-0 place-items-center rounded-full border border-ink/15 text-brand group-open:bg-brand group-open:text-paper">
                        <PlusIcon size={16} />
                      </span>
                    </summary>
                    <div className="pb-5">
                      <p className="text-[16px] leading-relaxed text-ink-soft">{t.description}</p>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                        <span className="font-semibold text-ink">Helps with: </span>
                        {t.forWhom}
                      </p>
                      <a
                        href={buildWaLink(messages.treatment(t))}
                        target="_blank"
                        rel="noopener"
                        data-track="whatsapp_click"
                        data-source={`treatments:${t.slug}`}
                        className="mt-3 inline-flex min-h-[44px] items-center gap-2 font-semibold text-brand"
                      >
                        <ChatIcon size={18} /> Ask about this on WhatsApp
                      </a>
                      <a href={treatmentHref(t.slug)} className="ml-5 inline-flex min-h-[44px] items-center gap-2 font-semibold text-brand">
                        Read more <ArrowIcon size={16} />
                      </a>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <ul className="mt-8 space-y-1 border-t border-ink/12 pt-4">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="flex min-h-[52px] items-center justify-between text-[19px] font-semibold text-ink">
                {l.label} <ArrowIcon size={18} className="text-brand" />
              </a>
            </li>
          ))}
        </ul>
        <a
          href={buildWaLink(messages.general())}
          target="_blank"
          rel="noopener"
          data-track="whatsapp_click"
          data-source="mobile-menu"
          className="btn btn-primary mt-6 w-full"
        >
          <ChatIcon size={20} /> Book on WhatsApp
        </a>
      </div>
    </details>
  );
}
