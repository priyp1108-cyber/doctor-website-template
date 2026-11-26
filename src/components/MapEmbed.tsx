"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";
import { mapsEmbedUrl } from "@/lib/links";

/** Static map image (OpenStreetMap, built by scripts/make-map.mjs); the interactive Google Maps embed loads only on tap. */
export function MapEmbed() {
  const [live, setLive] = useState(false);
  return (
    <div className="relative h-[240px] overflow-hidden rounded-3xl bg-ink-deep">
      {live ? (
        <iframe
          title={`Map to ${site.doctor.name}'s clinic`}
          src={mapsEmbedUrl()}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLive(true)}
          className="group absolute inset-0 size-full cursor-pointer"
          aria-label="Load the interactive map"
        >
          <Image src={site.clinic.mapImage} alt="" fill sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
          <span className="absolute bottom-4 left-4 rounded-full bg-paper px-4 py-2 text-[15px] font-semibold text-ink shadow-card transition-transform group-hover:-translate-y-0.5">
            Tap to load the map
          </span>
        </button>
      )}
      {!live && (
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener"
          className="absolute right-2 bottom-2 rounded bg-paper/85 px-1.5 py-0.5 text-[11px] text-ink-soft"
        >
          © OpenStreetMap contributors
        </a>
      )}
    </div>
  );
}
