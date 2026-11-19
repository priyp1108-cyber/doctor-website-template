"use client";

import { LazyMotion, domAnimation, m, useScroll, useTransform } from "motion/react";
import type { ReactNode, RefObject } from "react";

/** Moves its child ±distance against scroll while `target` crosses the viewport. */
export default function ParallaxMotion({
  target,
  distance,
  className,
  children,
}: {
  target: RefObject<HTMLElement | null>;
  distance: number;
  className: string;
  children: ReactNode;
}) {
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div style={{ y }} className={className}>
        {children}
      </m.div>
    </LazyMotion>
  );
}
