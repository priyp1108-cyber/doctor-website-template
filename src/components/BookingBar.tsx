"use client";

import { useEffect, useState } from "react";
import { buildWaLink, messages } from "@/lib/whatsapp";
import { mapsLink, telLink } from "@/lib/links";
import { ChatIcon, PhoneIcon, PinIcon } from "./icons";

/**
 * Always-present booking actions: a floating pill on desktop, a bottom bar on
 * mobile. Hidden while the visit panel's own WhatsApp button is on screen.
 */
export function BookingBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("visit-whatsapp");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setHidden(!!entry?.isIntersecting), { threshold: 0 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const wa = buildWaLink(messages.general());
  const state = hidden ? "pointer-events-none opacity-0 translate-y-4" : "opacity-100 translate-y-0";

  return (
    <div data-booking-bar data-hidden={hidden || undefined} inert={hidden || undefined}>
      {/* Desktop pill */}
      <a
        href={wa}
        target="_blank"
        rel="noopener"
        data-track="whatsapp_click"
        data-source="bar"
        className={`btn lens lens-sky fixed right-6 bottom-6 z-40 hidden transition-[opacity,transform] duration-300 md:inline-flex ${state}`}
      >
        <ChatIcon /> Chat with the clinic
      </a>

      {/* Mobile bar */}
      <nav
        aria-label="Book a visit"
        data-mobile-bar
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/85 px-3 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-[14px] transition-[opacity,transform] duration-300 md:hidden ${state}`}
      >
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-2">
          <a href={wa} target="_blank" rel="noopener" data-track="whatsapp_click" data-source="bar" className="btn btn-sm lens lens-brand gap-2 px-3">
            <ChatIcon /> WhatsApp
          </a>
          <a href={telLink()} data-track="call_click" data-source="bar" className="btn btn-sm lens lens-clear gap-1.5 px-2">
            <PhoneIcon size={18} /> Call
          </a>
          <a href={mapsLink()} target="_blank" rel="noopener" data-track="map_click" data-source="bar" className="btn btn-sm lens lens-clear gap-1.5 px-2">
            <PinIcon size={18} /> Map
          </a>
        </div>
      </nav>
    </div>
  );
}
