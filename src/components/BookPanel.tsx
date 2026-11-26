import { site } from "@/content/site";
import { formatHours } from "@/lib/hours";
import { fullAddress, telLink } from "@/lib/links";
import { buildWaLink } from "@/lib/whatsapp";
import { ChatIcon, PhoneIcon } from "./icons";

/** Dark booking panel at the end of inner pages: WhatsApp, call, hours, address. */
export function BookPanel({ title, message, source }: { title: string; message: string; source: string }) {
  const hours = formatHours(site.clinic.hours);
  return (
    <section className="section-y pt-0" aria-labelledby="book-title">
      <div className="wrap">
        <div className="on-dark grid gap-8 rounded-[var(--radius-card)] bg-ink p-8 text-paper md:grid-cols-[1.3fr_1fr] md:p-12">
          <div>
            <h2 id="book-title" className="text-h2 text-paper">
              {title}
            </h2>
            <p className="text-body mt-4 max-w-[48ch] text-on-dark">
              Message the clinic on WhatsApp or call. The right treatment is decided after an examination.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={buildWaLink(message)}
                target="_blank"
                rel="noopener"
                data-track="whatsapp_click"
                data-source={source}
                className="btn btn-on-dark"
              >
                <ChatIcon /> Book on WhatsApp
              </a>
              <a href={telLink()} data-track="call_click" data-source={source} className="btn border-paper/40 text-paper hover:border-paper">
                <PhoneIcon size={18} /> {site.clinic.phone}
              </a>
            </div>
          </div>
          <dl className="space-y-4 text-[16px] text-on-dark md:border-l md:border-paper/15 md:pl-8">
            <div>
              <dt className="eyebrow text-[12px] text-on-dark-muted">Hours</dt>
              {hours.map((h) => (
                <dd key={h.days} className="mt-1">
                  {h.days}: {h.times}
                </dd>
              ))}
            </div>
            <div>
              <dt className="eyebrow text-[12px] text-on-dark-muted">Address</dt>
              <dd className="mt-1">{fullAddress()}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
