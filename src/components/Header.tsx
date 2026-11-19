import { site } from "@/content/site";
import { buildWaLink, messages } from "@/lib/whatsapp";

const links = [
  { href: "#concerns", label: "Concerns" },
  { href: "#doctor", label: "The doctor" },
  { href: "#visit", label: "Visit" },
];

/* eslint-disable @next/next/no-img-element -- tiny fixed-size logo; plain <img> keeps it out of the image optimiser and inlines cleanly in the static export */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/78 backdrop-blur-[14px]">
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        {/* Logo + doctor's name; the alt text carries the full site name. */}
        <a href="#top" className="flex min-w-0 items-center gap-4 text-ink">
          <img
            src={site.clinic.logo.src}
            width={site.clinic.logo.width}
            height={site.clinic.logo.height}
            alt={site.name}
            className="h-[34px] w-auto shrink-0 sm:h-[40px]"
          />
          <span
            aria-hidden="true"
            className="hidden border-l border-ink/15 pl-4 text-[13px] leading-tight font-semibold tracking-[0.06em] whitespace-nowrap text-muted uppercase lg:block"
          >
            {site.doctor.name}
          </span>
        </a>
        <nav aria-label="Main" className="flex items-center gap-7">
          <ul className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <li key={l.href}>
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
            className="btn btn-sm lens lens-brand max-[400px]:px-4 max-[400px]:text-[15px]"
          >
            Book a visit
          </a>
        </nav>
      </div>
    </header>
  );
}
