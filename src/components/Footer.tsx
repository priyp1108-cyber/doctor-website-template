import { site } from "@/content/site";
import { fullAddress, telLink } from "@/lib/links";
import { filled } from "@/lib/placeholder";

export function Footer() {
  const { doctor, clinic } = site;
  return (
    <footer className="border-t border-ink/10 pt-14 pb-10">
      <div className="wrap">
        <p className="font-serif text-[32px] leading-tight text-ink">{site.name}</p>
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
        <p className="mt-8 max-w-[70ch] border-t border-ink/10 pt-6 text-[14px] text-muted">
          Information on this site is for general awareness and is not a substitute for a consultation.
        </p>
        <p className="mt-3 text-[14px] text-muted">© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
