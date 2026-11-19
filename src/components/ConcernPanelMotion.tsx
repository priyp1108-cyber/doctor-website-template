"use client";

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/** Crossfades the concern panel: out, then in (opacity, y 14→0, scale 0.985→1, 0.55s). */
export default function ConcernPanelMotion({ id, className, children }: { id: string; className: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence mode="wait" initial={false}>
        <m.article
          key={id}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.995 }}
          transition={{ duration: reduce ? 0.01 : 0.55, ease: EASE }}
          className={className}
        >
          {children}
        </m.article>
      </AnimatePresence>
    </LazyMotion>
  );
}
