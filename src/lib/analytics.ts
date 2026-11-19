/**
 * Optional, cookieless analytics. Off unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set
 * (Plausible). Never send names or phone numbers.
 */
export type TrackEvent = "whatsapp_click" | "call_click" | "map_click" | "concern_select";

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
  }
}

export function track(event: TrackEvent, props?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  window.plausible?.(event, props ? { props } : undefined);
}
