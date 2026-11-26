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
 * Layout wrapper kept from the old scroll reveal. Sections no longer animate
 * in on scroll, so this only renders the element; `data-reveal` and `--i`
 * stay as hooks in case a single entrance is wanted again.
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
