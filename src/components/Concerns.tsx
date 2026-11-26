"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";
import { filled } from "@/lib/placeholder";
import { buildWaLink, messages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { useIdleModule } from "@/lib/useIdleModule";
import { Reveal } from "./Reveal";
import { ChatIcon } from "./icons";

const loadPanelMotion = () => import("./ConcernPanelMotion").then((m) => m.default);

const PANEL = "grid overflow-hidden rounded-[32px] bg-white shadow-soft";
/** Two columns only when the concern has a photo. */
const panelClass = (hasImage: boolean) => (hasImage ? `${PANEL} md:grid-cols-[0.95fr_1.05fr]` : PANEL);

export function Concerns() {
  const concerns = site.concerns;
  const [active, setActive] = useState(concerns[0]!.slug);
  const PanelMotion = useIdleModule(loadPanelMotion);
  const concern = concerns.find((c) => c.slug === active) ?? concerns[0]!;

  const content = (
    <>
      <div
        className="relative min-h-[260px] md:min-h-[420px]"
        style={{ backgroundColor: `var(--color-tint-${concern.tint})` }}
        hidden={!concern.image}
      >
        {concern.image && (
          <Image
            src={concern.image}
            alt={concern.imageAlt ?? ""}
            fill
            sizes="(min-width: 720px) 560px, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14">
        <h3 className="text-h3 text-ink">{concern.title}</h3>
        <p className="text-body mt-4 text-ink-soft">{concern.blurb}</p>
        {filled(concern.approach) && (
          <p className="mt-6 border-l-2 border-accent pl-4 text-[16px] leading-relaxed text-ink-soft">
            <span className="block text-[13px] font-bold tracking-[0.08em] text-muted uppercase">
              How {site.doctor.shortName} approaches it
            </span>
            {concern.approach}
          </p>
        )}
        <div className="mt-8">
          <a
            href={buildWaLink(messages.concern(concern))}
            target="_blank"
            rel="noopener"
            data-track="whatsapp_click"
            data-source={`concern:${concern.slug}`}
            className="btn btn-primary"
          >
            <ChatIcon /> {concern.button}
          </a>
        </div>
      </div>
    </>
  );

  return (
    <section id="concerns" className="section-y" aria-labelledby="concerns-title">
      <div className="wrap">
        <Reveal as="p" className="eyebrow text-brand">Start here</Reveal>
        <Reveal as="h2" index={1} id="concerns-title" className="text-h2 mt-4 text-ink">
          What&rsquo;s bothering you?
        </Reveal>

        <Reveal index={2} className="mt-10">
          <div role="group" aria-label="Choose a concern" className="flex flex-wrap gap-2.5">
            {concerns.map((c) => {
              const selected = c.slug === active;
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={selected}
                  aria-controls="concern-panel"
                  onClick={() => {
                    if (c.slug === active) return;
                    setActive(c.slug);
                    track("concern_select", { concern: c.slug });
                  }}
                  className={`min-h-[48px] cursor-pointer rounded-full border px-5 text-[16px] font-semibold transition-[background-color,color,border-color,transform] duration-200 ${
                    selected
                      ? "border-brand bg-brand text-paper"
                      : "border-ink/15 bg-white text-ink hover:border-ink/35"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal index={3} className="mt-8">
          <div id="concern-panel" aria-live="polite">
            {PanelMotion ? (
              <PanelMotion id={concern.slug} className={panelClass(!!concern.image)}>
                {content}
              </PanelMotion>
            ) : (
              <article className={panelClass(!!concern.image)}>{content}</article>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
