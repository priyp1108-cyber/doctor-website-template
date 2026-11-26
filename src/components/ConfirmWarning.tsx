"use client";

import { useEffect } from "react";
import { site } from "@/content/site";
import { findConfirmValues } from "@/lib/placeholder";
import { articles } from "@/content/journal";

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
    if (!site.treatmentsConfirmed) extra.push("treatments (whole list: confirm with the clinic, then set treatmentsConfirmed)");
    const noDetails = site.treatments.flatMap((g) => g.treatments).filter((t) => !t.details).length;
    if (noDetails) extra.push(`treatments[].details: ${noDetails} treatment page(s) without visit steps, sessions, aftercare or FAQs`);
    const drafts = articles.filter((a) => a.draft).length;
    if (drafts) extra.push(`journal: ${drafts} draft article(s) waiting for Dr. Panda's review (src/content/journal.ts)`);
    if (!site.forDoctors.publications.length) extra.push("forDoctors.publications (empty)");
    if (!site.forDoctors.talks.length) extra.push("forDoctors.talks (empty)");
    if (!site.forDoctors.interests.length) extra.push("forDoctors.interests (empty)");
    const all = [...left, ...extra];
    if (all.length) {
      console.warn(
        `[site.ts] ${all.length} placeholder value(s) still to confirm before launch:\n  • ${all.join("\n  • ")}`,
      );
    }
  }, []);
  return null;
}
