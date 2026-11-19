"use client";

import { useEffect } from "react";

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

/**
 * Layers a smooth height animation on the native <details> accordion.
 * Without JS (or with reduced motion) the details element works as normal.
 */
export function FaqEnhancer() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-faq]");
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onClick = (e: MouseEvent) => {
      const summary = (e.target as HTMLElement).closest("summary");
      if (!summary || reduce.matches) return;
      const details = summary.parentElement as HTMLDetailsElement;
      const body = details.querySelector<HTMLElement>("[data-faq-body]");
      if (!body) return;
      e.preventDefault();

      if (details.open) {
        const anim = body.animate(
          [{ height: `${body.scrollHeight}px`, opacity: 1 }, { height: "0px", opacity: 0 }],
          { duration: 320, easing: EASE },
        );
        anim.onfinish = () => (details.open = false);
      } else {
        details.open = true;
        body.animate(
          [{ height: "0px", opacity: 0 }, { height: `${body.scrollHeight}px`, opacity: 1 }],
          { duration: 380, easing: EASE },
        );
      }
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);
  return null;
}
