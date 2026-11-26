"use client";

import { useEffect } from "react";

/**
 * Mount once (in the layout). Starts the decorative CSS loops (pulse dot)
 * once the page has loaded and the main thread is idle. Sections no longer
 * animate in on scroll; the hero entrance is the only load animation.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    let idle = 0;
    const startLoops = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
      idle = ric(() => root.classList.add("loops"), { timeout: 3000 } as IdleRequestOptions);
    };
    if (document.readyState === "complete") startLoops();
    else window.addEventListener("load", startLoops, { once: true });

    return () => {
      window.removeEventListener("load", startLoops);
      window.cancelIdleCallback?.(idle);
    };
  }, []);
  return null;
}
