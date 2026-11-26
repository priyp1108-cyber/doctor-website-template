import { site } from "@/content/site";
import { formatHours } from "@/lib/hours";
import { fullAddress, telLink } from "@/lib/links";
import { filled } from "@/lib/placeholder";

const pages = [
  { href: "/treatments", label: "Treatments" },
  { href: "/#doctor", label: "The doctor" },
  { href: "/journal", label: "Journal" },
  { href: "/for-doctors", label: "For doctors" },
  { href: "/#visit", label: "Visit" },
];

export function Footer() {
  const { doctor, clinic } = site;
  return (
    <footer className="border-t border-ink/10 pt-14 pb-10">
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr] md:gap-12">
          <div>
            <p className="font-display text-[28px] font-bold leading-tight tracking-[-0.01em] text-ink">{site.name}</p>
            <p className="mt-1 text-[15px] font-semibold text-muted">
              {doctor.name}, {doctor.qualifications}
            </p>
            <div className="mt-6 space-y-1.5 text-[16px] text-ink-soft">
              <p>{fullAddress()}</p>
              <p>
                <a href={telLink()} data-track="call_click" data-source="footer" className="-my-2.5 inline-block py-2.5 underline underline-offset-4">
                  {clinic.phone}
                </a>
                {filled(doctor.registration) && <>{" · "}Registration: {doctor.registration}</>}
              </p>
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="text-[16px] font-bold text-ink">Pages</p>
            <ul className="mt-2 text-[16px] text-ink-soft">
              {pages.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-flex min-h-[44px] items-center underline-offset-4 hover:text-ink hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[16px] font-bold text-ink">Clinic hours</p>
            <dl className="mt-4 space-y-2 text-[16px] text-ink-soft">
              {formatHours(clinic.hours).map((h) => (
                <div key={h.days} className="flex gap-4">
                  <dt className="w-[5.5rem] shrink-0 font-semibold text-ink">{h.days}</dt>
                  <dd>{h.times}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <p className="mt-10 max-w-[70ch] border-t border-ink/10 pt-6 text-[14px] text-muted">
          Information on this site is for general awareness and is not a substitute for a consultation.
        </p>
        <p className="mt-3 text-[14px] text-muted">© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
