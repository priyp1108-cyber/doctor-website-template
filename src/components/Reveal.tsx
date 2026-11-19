import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  /** Position among siblings; each step adds 0.08s of delay. */
  index?: number;
  /** "line" = scaleY 0→1 from the top (timeline). */
  variant?: "fade" | "line";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<string, unknown>;

/**
 * Scroll-reveal wrapper. Renders fully visible on the server; the hidden
 * start state comes from CSS under `.js` (see globals.css), and the
 * RevealObserver (RevealObserver.tsx) adds `is-in` once ~12% of the element is visible.
 */
export function Reveal({ as: Tag = "div", index = 0, variant = "fade", className, style, children, ...rest }: RevealProps) {
  return (
    <Tag
      data-reveal={variant === "line" ? "line" : ""}
      className={className}
      style={{ ...style, ["--i" as string]: index }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
