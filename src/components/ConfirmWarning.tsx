"use client";

import { useEffect } from "react";
import { site } from "@/content/site";
import { findConfirmValues } from "@/lib/placeholder";

let warned = false;

/** Dev only: lists every value in site.ts still marked "[CONFIRM]". */
export function ConfirmWarning() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || warned) return;
    warned = true;
    const left = findConfirmValues(site);
    const extra: string[] = [];
    if (/X{6,}/.test(site.clinic.phone)) extra.push("clinic.phone");
    if (/X{6,}/.test(site.clinic.whatsapp)) extra.push("clinic.whatsapp");
    if (!site.clinic.geo.lat || !site.clinic.geo.lng) extra.push("clinic.geo");
    const all = [...left, ...extra];
    if (all.length) {
      console.warn(
        `[site.ts] ${all.length} placeholder value(s) still to confirm before launch:\n  • ${all.join("\n  • ")}`,
      );
    }
  }, []);
  return null;
}
