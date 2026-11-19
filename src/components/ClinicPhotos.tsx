"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { filled } from "@/lib/placeholder";
import { useIdleModule } from "@/lib/useIdleModule";
import { Reveal } from "./Reveal";

const loadParallax = () => import("./ParallaxMotion").then((m) => m.default);

export function ClinicPhotos() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const wide = useWide();
  const Parallax = useIdleModule(loadParallax);

  const clinicName = filled(site.clinic.shortName) ?? "the clinic";
  const city = site.clinic.city;
  const p = site.clinic.photos;
  const photos = [
    { src: p.reception, alt: `Reception at ${clinicName}, ${city}`, h: "md:h-[440px]", y: 40 },
    { src: p.treatment, alt: `Treatment room at ${clinicName}, ${city}`, h: "md:h-[520px]", y: -40 },
  ];

  return (
    <section className="section-y overflow-hidden pt-0" aria-labelledby="photos-title">
      <div className="wrap">
        <Reveal as="h2" id="photos-title" className="text-h2 text-ink">
          Inside the <em>clinic</em>
        </Reveal>
        <div ref={ref} className="mt-12 grid items-center gap-5 md:grid-cols-2 md:gap-6">
          {photos.map((ph, i) => (
            <Reveal key={ph.src} index={i}>
              {(() => {
                const cls = `relative h-[300px] overflow-hidden rounded-[28px] bg-tint-mist ${ph.h}`;
                const img = <Image src={ph.src} alt={ph.alt} fill sizes="(min-width: 720px) 600px, 100vw" className="object-cover" />;
                return Parallax && ph.y && wide && !reduce ? (
                  <Parallax target={ref} distance={ph.y} className={cls}>{img}</Parallax>
                ) : (
                  <div className={cls}>{img}</div>
                );
              })()}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Parallax only when the photos sit side by side (≥720px). */
function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 720px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
}

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}
