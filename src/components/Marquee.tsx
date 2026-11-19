import { site } from "@/content/site";

function items(): string[] {
  const d = site.doctor;
  return [
    d.qualifications,
    d.registration,
    d.yearsInPractice ? `${d.yearsInPractice} years in practice` : "",
    d.languages.length ? `Consults in ${d.languages.join(", ")}` : "",
    ...d.memberships.map((m) => `Member, ${m}`),
  ].filter(Boolean);
}

function Row({ list, real, duplicate = false }: { list: string[]; real: number; duplicate?: boolean }) {
  return (
    <ul className={`flex shrink-0 items-center ${duplicate ? "marquee-dup" : ""}`} aria-hidden={duplicate || undefined}>
      {list.map((text, i) => (
        <li key={i} className="flex items-center whitespace-nowrap" aria-hidden={(!duplicate && i >= real) || undefined}>
          <span className="px-7">{text}</span>
          <span className="text-[18px] text-accent" aria-hidden="true">✦</span>
        </li>
      ))}
    </ul>
  );
}

export function Marquee() {
  const list = items();
  // Repeat short lists so one copy is always wider than the screen.
  const filledList = list.length < 6 ? [...list, ...list] : list;
  return (
    <section aria-label="Credentials" className="marquee on-dark overflow-hidden bg-ink py-6 font-serif text-[26px] text-paper">
      <div className="marquee-track">
        <Row list={filledList} real={list.length} />
        <Row list={filledList} real={list.length} duplicate />
      </div>
    </section>
  );
}
