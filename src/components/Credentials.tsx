import type { ReactNode } from "react";
import { site } from "@/content/site";
import { formatHours } from "@/lib/hours";
import { isPlaceholder } from "@/lib/placeholder";
import { BuildingIcon, CapIcon, ClockIcon, LanguageIcon } from "./icons";

type Item = { icon: ReactNode; title: string; detail: string };

/**
 * One line of verifiable facts under the hero: training, teaching post,
 * languages, hours. No counters, ratings or badges (NMC).
 */
export function Credentials() {
  const d = site.doctor;
  const open = formatHours(site.clinic.hours).find((h) => h.times !== "Closed");
  const items: Item[] = [
    { icon: <CapIcon />, title: d.qualifications, detail: "Dermatology, Venereology & Leprosy" },
    { icon: <BuildingIcon />, title: "Assistant Professor", detail: "Dept. of Skin & VD, IMS & SUM Hospital" },
    { icon: <LanguageIcon />, title: "Consults in", detail: d.languages.join(", ") },
    ...(open ? [{ icon: <ClockIcon />, title: "Evening clinic", detail: `${open.days}, ${open.times}` }] : []),
    ...d.memberships.map((m) => ({ icon: <CapIcon />, title: "Member", detail: m })),
  ].filter((i) => !isPlaceholder(i.title) && !isPlaceholder(i.detail));

  return (
    <section aria-label={`About ${d.shortName} at a glance`} className="pb-4">
      <div className="wrap">
        <ul className="grid gap-px overflow-hidden rounded-[20px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <li key={i.title + i.detail} className="flex items-start gap-3.5 bg-white px-5 py-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-tint-sky text-brand">{i.icon}</span>
              <span className="min-w-0">
                <span className="block text-[16px] font-bold text-ink">{i.title}</span>
                <span className="block text-[15px] leading-snug text-ink-soft">{i.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
