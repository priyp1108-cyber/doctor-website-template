"use client";

import { useEffect } from "react";

/** Mount once (in the layout). Adds `is-in` when ~12% of an element is visible. */
export function RevealObserver() {
  useEffect(() => {
    (window as unknown as { __revealReady?: boolean }).__revealReady = true;
    document.documentElement.classList.remove("reveal-fallback");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target); // reveal once
        }
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    const stop = () => io.disconnect();

    // Start decorative CSS loops (blobs, float, pulse) once the page
    // has loaded and the main thread is idle.
    const root = document.documentElement;
    let idle = 0;
    const startLoops = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
      idle = ric(() => root.classList.add("loops"), { timeout: 3000 } as IdleRequestOptions);
    };
    if (document.readyState === "complete") startLoops();
    else window.addEventListener("load", startLoops, { once: true });

    return () => {
      stop();
      window.removeEventListener("load", startLoops);
      window.cancelIdleCallback?.(idle);
    };
  }, []);
  return null;
}
