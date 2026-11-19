"use client";

import { useEffect } from "react";
import { track, type TrackEvent } from "@/lib/analytics";

/** One delegated listener for every element with data-track / data-source. */
export function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("a[data-track]");
      if (!el) return;
      const source = el.dataset.source;
      track(el.dataset.track as TrackEvent, source ? { source } : undefined);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
