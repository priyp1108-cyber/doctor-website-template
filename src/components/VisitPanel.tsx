import { site } from "@/content/site";
import { formatHours } from "@/lib/hours";
import { fullAddress, mapsLink, telLink } from "@/lib/links";
import { MapEmbed } from "./MapEmbed";
import { RequestForm } from "./RequestForm";
import { Reveal } from "./Reveal";
import { ArrowIcon, ClockIcon, PhoneIcon, PinIcon } from "./icons";

export function VisitPanel() {
  const { clinic } = site;
  return (
    <section id="visit" className="section-y pt-0" aria-labelledby="visit-title">
      <div className="wrap">
        <Reveal className="on-dark relative isolate overflow-hidden rounded-[40px] bg-ink p-7 text-paper sm:p-12 lg:p-16">
          <div
            aria-hidden="true"
            className="blob blob-2 -top-40 -right-40 -z-10 size-[520px] [--blob:var(--color-accent)] opacity-35"
          />
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <h2 id="visit-title" className="text-h2 text-paper">
                Come and <em>see us.</em>
              </h2>
              <address className="mt-8 flex gap-3 text-[17px] text-on-dark not-italic">
                <PinIcon className="mt-1 shrink-0 text-accent" />
                <span>
                  <span className="block font-semibold text-paper">{clinic.name}</span>
                  {fullAddress()}
                </span>
              </address>
              <div className="mt-6 flex gap-3 text-[17px] text-on-dark">
                <ClockIcon className="mt-1 shrink-0 text-accent" />
                <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
                  {formatHours(clinic.hours).map((h) => (
                    <div key={h.days} className="contents">
                      <dt className="font-semibold text-paper">{h.days}</dt>
                      <dd>{h.times}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <p className="mt-6 flex gap-3 text-[17px]">
                <PhoneIcon className="mt-1 shrink-0 text-accent" />
                <a href={telLink()} data-track="call_click" data-source="visit" className="font-semibold text-paper underline decoration-accent underline-offset-4">
                  {clinic.phone}
                </a>
              </p>
              <div className="mt-8">
                <MapEmbed />
                <a
                  href={mapsLink()}
                  target="_blank"
                  rel="noopener"
                  data-track="map_click"
                  data-source="visit"
                  className="mt-4 inline-flex min-h-[48px] items-center gap-2 font-semibold text-accent"
                >
                  Open in Google Maps <ArrowIcon size={18} />
                </a>
              </div>
            </div>
            <RequestForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
