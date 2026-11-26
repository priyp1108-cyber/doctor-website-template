import Image from "next/image";
import { site } from "@/content/site";
import { buildWaLink, messages } from "@/lib/whatsapp";
import { telLink } from "@/lib/links";
import { HeroSliderEnhancer } from "./HeroSliderEnhancer";
import { OpenStatus } from "./OpenStatus";
import { ChatIcon, PauseIcon, PhoneIcon, PlayIcon } from "./icons";

/**
 * Hero: a crossfading slider of the clinic's own photos with a still text card.
 * Phones: photo on top, card below. Desktop: card floats over the photos.
 */
export function Hero() {
  const { doctor, hero } = site;
  const slides = hero.slides;

  return (
    <section id="top" className="pt-4 pb-6 md:pt-6" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-white shadow-card lg:min-h-[620px] lg:bg-ink">
          {/* Photos */}
          <div
            data-hero-slider
            role="region"
            aria-roledescription="carousel"
            aria-label={`Photos of ${site.clinic.shortName}`}
            className="relative aspect-[4/3] sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto"
          >
            {slides.map((s, i) => (
              <div
                key={s.image}
                data-hero-slide
                data-label={s.label}
                data-active={i === 0 ? "" : undefined}
                aria-hidden={i === 0 ? "false" : "true"}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slides.length}: ${s.label}`}
                className="hero-slide absolute inset-0"
              >
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  priority={i === 0}
                  fetchPriority={i === 0 ? "high" : "low"}
                  sizes="(min-width: 1240px) 1240px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: s.focus ?? "50% 50%" }}
                />
              </div>
            ))}
            {/* Shade under the controls so they stay readable on any photo. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/70 to-transparent"
            />

            {slides.length > 1 && (
              <div className="absolute right-3 bottom-3 left-3 z-10 flex items-center justify-between gap-3 sm:right-5 sm:bottom-4 sm:left-auto sm:justify-end">
                <span data-hero-label aria-hidden="true" className="text-[14px] font-semibold text-white">
                  {slides[0]!.label}
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex items-center" role="group" aria-label="Choose a photo">
                    {slides.map((s, i) => (
                      <button
                        key={s.image}
                        type="button"
                        data-hero-dot
                        aria-label={`Show photo ${i + 1}: ${s.label}`}
                        aria-current={i === 0 ? "true" : "false"}
                        className="grid h-11 cursor-pointer place-items-center px-1"
                      >
                        <span className="hero-dot block" />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    data-hero-toggle
                    aria-label="Pause slideshow"
                    className="grid size-11 cursor-pointer place-items-center rounded-full border border-white/60 bg-ink/45 text-white backdrop-blur-sm"
                  >
                    <PauseIcon size={18} className="icon-pause" />
                    <PlayIcon size={18} className="icon-play" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Text card: below the photo on phones, over it on desktop. */}
          <div className="relative z-10 p-6 sm:p-9 lg:absolute lg:top-1/2 lg:left-8 lg:w-[min(540px,48%)] lg:-translate-y-1/2 lg:rounded-[var(--radius-card)] lg:bg-white lg:p-10 lg:shadow-soft">
            <OpenStatus />
            <h1 id="hero-title" className="text-hero hero-fade mt-5 text-ink">
              {hero.headline}
            </h1>
            <p className="hero-fade mt-5 text-[17px] leading-relaxed text-ink-soft" style={{ ["--delay" as string]: "0.1s" }}>
              <span className="block font-semibold text-ink">
                {doctor.name}, {doctor.qualifications}
              </span>
              {doctor.position}
            </p>
            <div className="hero-fade mt-7 flex flex-wrap gap-3" style={{ ["--delay" as string]: "0.2s" }}>
              <a
                href={buildWaLink(messages.general())}
                target="_blank"
                rel="noopener"
                data-track="whatsapp_click"
                data-source="hero"
                id="hero-whatsapp"
                className="btn btn-primary"
              >
                <ChatIcon /> Book on WhatsApp
              </a>
              <a href={telLink()} data-track="call_click" data-source="hero" className="btn btn-secondary">
                <PhoneIcon /> Call the clinic
              </a>
            </div>
          </div>
        </div>
      </div>
      <HeroSliderEnhancer />
    </section>
  );
}
