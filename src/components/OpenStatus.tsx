"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { getOpenStatus, type OpenStatus as Status } from "@/lib/hours";

/** Live open/closed pill. Renders nothing on the server to avoid a wrong state. */
export function OpenStatus() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus(site.clinic.hours, new Date()));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="min-h-[40px]" aria-live="polite">
      {status && (
        <p className="hero-fade-in inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-[15px] font-semibold text-ink shadow-card">
          {status.state === "open" ? (
            <span className="pulse-dot" aria-hidden="true" />
          ) : (
            <span className="inline-block size-[9px] rounded-full border-[1.5px] border-muted" aria-hidden="true" />
          )}
          {status.label}
        </p>
      )}
    </div>
  );
}
