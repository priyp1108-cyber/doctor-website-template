"use client";

import { useEffect, useState } from "react";

/**
 * Loads a module after the page has loaded and the main thread is idle, so
 * animation code (Motion) stays off the critical path. Returns null until then.
 */
export function useIdleModule<T>(loader: () => Promise<T>): T | null {
  const [mod, setMod] = useState<T | null>(null);
  useEffect(() => {
    let cancelled = false;
    const run = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
      ric(() => loader().then((m) => !cancelled && setMod(() => m)), { timeout: 3000 } as IdleRequestOptions);
    };
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", run);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return mod;
}
