import { showPending } from "@/lib/pending";

/**
 * A visible "To add" box for content the clinic still has to supply.
 * Renders nothing when NEXT_PUBLIC_HIDE_PENDING=1 (see src/lib/pending.ts).
 */
export function Pending({ children, dark = false, className = "" }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  if (!showPending) return null;
  return (
    <div
      data-pending
      className={`rounded-2xl border-2 border-dashed px-5 py-4 text-[15px] leading-relaxed ${
        dark ? "border-paper/30 text-on-dark" : "border-ink/20 bg-white/60 text-muted"
      } ${className}`}
    >
      <span className={`eyebrow mr-2 text-[12px] ${dark ? "text-accent" : "text-leaf-ink"}`}>To add</span>
      {children}
    </div>
  );
}
