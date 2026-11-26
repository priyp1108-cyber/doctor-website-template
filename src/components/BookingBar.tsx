"use client";

import { useEffect, useState } from "react";
import { buildWaLink, messages } from "@/lib/whatsapp";
import { mapsLink, telLink } from "@/lib/links";
import { ChatIcon, PhoneIcon, PinIcon } from "./icons";

/**
 * Bottom booking bar for phones (desktop has the header button). Hidden while
 * the hero's or the visit panel's own WhatsApp button is on screen, so the
 * same action never shows twice.
 */
export function BookingBar() {
  // null = not measured yet: with JS the bar waits (no flash over the hero); without JS it simply shows.
  const [hidden, setHidden] = useState<boolean | null>(null);

  useEffect(() => {
    const targets = ["hero-whatsapp", "visit-whatsapp"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    // Inner pages have no hero/visit button: show the bar straight away.
    if (targets.length === 0) return setHidden(false);
    const onScreen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) onScreen.add(e.target);
          else onScreen.delete(e.target);
        }
        setHidden(onScreen.size > 0);
      },
      { threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const wa = buildWaLink(messages.general());
  const state =
    hidden === null
      ? "[.js_&]:pointer-events-none [.js_&]:opacity-0"
      : hidden
        ? "pointer-events-none opacity-0 translate-y-4"
        : "opacity-100 translate-y-0";

  return (
    <div data-booking-bar data-hidden={hidden || undefined} inert={hidden || undefined}>
      <nav
        aria-label="Book a visit"
        data-mobile-bar
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/85 px-3 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-[14px] transition-[opacity,transform] duration-300 md:hidden ${state}`}
      >
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-2">
          <a href={wa} target="_blank" rel="noopener" data-track="whatsapp_click" data-source="bar" className="btn btn-sm btn-primary gap-2 px-3">
            <ChatIcon /> WhatsApp
          </a>
          <a href={telLink()} data-track="call_click" data-source="bar" className="btn btn-sm btn-secondary gap-1.5 px-2">
            <PhoneIcon size={18} /> Call
          </a>
          <a href={mapsLink()} target="_blank" rel="noopener" data-track="map_click" data-source="bar" className="btn btn-sm btn-secondary gap-1.5 px-2">
            <PinIcon size={18} /> Map
          </a>
        </div>
      </nav>
    </div>
  );
}
