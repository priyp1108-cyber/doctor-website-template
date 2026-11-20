import Image from "next/image";
import { site } from "@/content/site";
import { buildWaLink, messages } from "@/lib/whatsapp";
import { telLink } from "@/lib/links";
import { OpenStatus } from "./OpenStatus";
import { CalendarIcon, ChatIcon, PhoneIcon } from "./icons";

/** Hero headline (from site.specialty.headline), word by word; each word rises in.
 *  Wrap a word in *asterisks* there to set it in italics. */
const headline: { text: string; italic?: boolean }[] = site.specialty.headline
  .split(" ")
  .map((w) => (/^\*.+\*[.,]?$/.test(w) ? { text: w.replace(/\*/g, ""), italic: true } : { text: w }));

export function Hero() {
  const { doctor, clinic } = site;
  const facts = [
    doctor.qualifications,
    doctor.yearsInPractice ? `${doctor.yearsInPractice} years in practice` : null,
  ].filter(Boolean);

  return (
    <section id="top" className="relative overflow-hidden" aria-labelledby="hero-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob blob-1 -top-24 -left-24 size-[460px] [--blob:var(--color-accent)] opacity-45" />
        <div className="blob blob-2 top-10 right-[-10%] size-[520px] [--blob:var(--color-tint-sky)]" />
        <div className="blob blob-3 bottom-[-160px] left-[30%] size-[480px] [--blob:var(--color-tint-periwinkle)]" />
      </div>

      <div className="wrap grid items-center gap-14 pt-10 pb-20 md:pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pb-28">
        <div>
          <OpenStatus />
          <h1 id="hero-title" className="text-h1 mt-6 max-w-[12ch] text-ink">
            {headline.map((w, i) => (
              <span key={i}>
                <span className="word-mask">
                  <span className={`word ${w.italic ? "italic" : ""}`} style={{ ["--i" as string]: i }}>
                    {w.text}
                  </span>
                </span>
                {i < headline.length - 1 && " "}
              </span>
            ))}
          </h1>
          {facts.length > 0 && (
            <div className="hero-fade" style={{ ["--delay" as string]: "0.9s" }}>
              <p className="mt-6 text-[18px] font-semibold tracking-[0.02em] text-ink-soft">{facts.join(" · ")}</p>
            </div>
          )}
          <div className="hero-fade mt-9 flex flex-wrap gap-3" style={{ ["--delay" as string]: "1s" }}>
            <a
              href={buildWaLink(messages.general())}
              target="_blank"
              rel="noopener"
              data-track="whatsapp_click"
              data-source="hero"
              className="btn lens lens-brand"
            >
              <ChatIcon /> Book on WhatsApp
            </a>
            <a
              href={telLink()}
              data-track="call_click"
              data-source="hero"
              className="btn lens lens-clear"
            >
              <PhoneIcon /> Call the clinic
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[480px] lg:mr-0">
          <div className="hero-portrait-in" style={{ ["--delay" as string]: "0.4s" }}>
            <div className="float-big">
              <div className="relative h-[440px] overflow-hidden rounded-[240px_240px_32px_32px] bg-tint-sky shadow-soft sm:h-[520px] lg:h-[560px]">
                <Image
                  src={doctor.portrait}
                  alt={doctor.portraitAlt}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 480px, (min-width: 520px) 480px, 92vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
          {clinic.nextAvailable && (
            <div className="hero-fade-in absolute -bottom-6 -left-2 sm:-left-10" style={{ ["--delay" as string]: "1s" }}>
              <div className="float-late flex items-center gap-3 rounded-3xl bg-white px-5 py-4 shadow-soft">
                <span className="grid size-11 place-items-center rounded-full bg-tint-sky text-brand">
                  <CalendarIcon />
                </span>
                <span>
                  <span className="block text-[13px] font-bold tracking-[0.08em] text-muted uppercase">Next available</span>
                  <span className="block text-[17px] font-semibold text-ink">{clinic.nextAvailable}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
