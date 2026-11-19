import type { DayKey, Session, WeekHours } from "@/content/site";

export const TIME_ZONE = "Asia/Kolkata";
export const DAYS: readonly DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const SHORT: Record<DayKey, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};
const SCHEMA_DAY: Record<DayKey, string> = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
  fri: "Friday", sat: "Saturday", sun: "Sunday",
};

/** "17:30" → 1050 */
export function toMinutes(hhmm: string): number {
  const [h = "0", m = "0"] = hhmm.split(":");
  return Number(h) * 60 + Number(m);
}

/** "17:00" → "5:00 pm", "00:00"/"24:00" → "12:00 am" */
export function formatTime(hhmm: string): string {
  const total = toMinutes(hhmm) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

/** Day and minutes-since-midnight of `date` in Asia/Kolkata. */
export function kolkataNow(date: Date): { day: DayKey; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = get("weekday").toLowerCase().slice(0, 3) as DayKey;
  return { day, minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
}

export type OpenStatus =
  | { state: "open"; closesAt: string; label: string }
  | { state: "opens-later-today"; opensAt: string; label: string }
  | { state: "closed"; nextDay: DayKey | null; opensAt: string | null; label: string };

function sorted(sessions: readonly Session[]): Session[] {
  return [...sessions].sort((a, b) => toMinutes(a[0]) - toMinutes(b[0]));
}

/**
 * Open / closed status for `date` (any instant), evaluated in Asia/Kolkata.
 * Labels:
 *   "Open now · closes 8:00 pm"
 *   "Opens today at 5:00 pm"
 *   "Closed today · opens Mon 10:00 am"   (no sessions today)
 *   "Closed now · opens tomorrow 10:00 am" (after the last session)
 */
export function getOpenStatus(hours: WeekHours, date: Date): OpenStatus {
  const { day, minutes } = kolkataNow(date);
  const today = sorted(hours[day] ?? []);

  for (const [open, close] of today) {
    const o = toMinutes(open);
    const c = toMinutes(close);
    if (minutes >= o && minutes < c) {
      // A session ending at 24:00 that continues at 00:00 the next day stays "open".
      let closesAt = close;
      if (c >= 24 * 60) {
        const next = nextDayKey(day);
        const first = sorted(hours[next] ?? [])[0];
        if (first && toMinutes(first[0]) === 0) closesAt = first[1];
      }
      return { state: "open", closesAt, label: `Open now · closes ${formatTime(closesAt)}` };
    }
    if (minutes < o) {
      return { state: "opens-later-today", opensAt: open, label: `Opens today at ${formatTime(open)}` };
    }
  }

  // Nothing left today: find the next day with a session.
  const prefix = today.length === 0 ? "Closed today" : "Closed now";
  let d = day;
  for (let i = 1; i <= 7; i++) {
    d = nextDayKey(d);
    const first = sorted(hours[d] ?? [])[0];
    if (first) {
      const when = i === 1 ? "tomorrow" : SHORT[d];
      return {
        state: "closed",
        nextDay: d,
        opensAt: first[0],
        label: `${prefix} · opens ${when} ${formatTime(first[0])}`,
      };
    }
  }
  return { state: "closed", nextDay: null, opensAt: null, label: "Closed" };
}

function nextDayKey(day: DayKey): DayKey {
  return DAYS[(DAYS.indexOf(day) + 1) % 7]!;
}

const sessionsKey = (s: readonly Session[]) => s.map(([a, b]) => `${a}-${b}`).join(",");

/** Consecutive days with identical sessions, e.g. Mon–Sat. */
export function groupHours(hours: WeekHours): { days: DayKey[]; sessions: readonly Session[] }[] {
  const groups: { days: DayKey[]; sessions: readonly Session[] }[] = [];
  for (const day of DAYS) {
    const sessions = sorted(hours[day] ?? []);
    const last = groups[groups.length - 1];
    if (last && sessionsKey(last.sessions) === sessionsKey(sessions)) last.days.push(day);
    else groups.push({ days: [day], sessions });
  }
  return groups;
}

/** Human lines for display: [{ days: "Mon – Sat", times: "10:00 am – 1:00 pm, 5:00 pm – 8:00 pm" }] */
export function formatHours(hours: WeekHours): { days: string; times: string }[] {
  return groupHours(hours).map(({ days, sessions }) => ({
    days: days.length > 1 ? `${SHORT[days[0]!]} – ${SHORT[days[days.length - 1]!]}` : SHORT[days[0]!],
    times: sessions.length
      ? sessions.map(([a, b]) => `${formatTime(a)} – ${formatTime(b)}`).join(", ")
      : "Closed",
  }));
}

/** schema.org OpeningHoursSpecification entries. */
export function openingHoursSpecification(hours: WeekHours) {
  return groupHours(hours).flatMap(({ days, sessions }) =>
    sessions.map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days.map((d) => SCHEMA_DAY[d]),
      opens,
      closes: closes === "24:00" ? "23:59" : closes,
    })),
  );
}
