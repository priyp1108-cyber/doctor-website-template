import { describe, expect, it } from "vitest";
import type { WeekHours } from "@/content/site";
import { formatHours, formatTime, getOpenStatus, kolkataNow, openingHoursSpecification } from "@/lib/hours";

const hours: WeekHours = {
  mon: [["10:00", "13:00"], ["17:00", "20:00"]],
  tue: [["10:00", "13:00"], ["17:00", "20:00"]],
  wed: [["10:00", "13:00"], ["17:00", "20:00"]],
  thu: [["10:00", "13:00"], ["17:00", "20:00"]],
  fri: [["10:00", "13:00"], ["17:00", "20:00"]],
  sat: [["10:00", "13:00"], ["17:00", "20:00"]],
  sun: [],
};

/** An instant given as wall-clock time in India (Asia/Kolkata). 2026-11-16 is a Monday. */
const ist = (local: string) => new Date(`${local}:00+05:30`);

describe("kolkataNow", () => {
  it("reads the day and time in Asia/Kolkata regardless of the machine zone", () => {
    // 2026-11-16 20:00 UTC = Tue 01:30 IST
    expect(kolkataNow(new Date("2026-11-16T20:00:00Z"))).toEqual({ day: "tue", minutes: 90 });
  });
});

describe("getOpenStatus", () => {
  it("is open during a session", () => {
    const s = getOpenStatus(hours, ist("2026-11-16T11:15"));
    expect(s).toMatchObject({ state: "open", closesAt: "13:00", label: "Open now · closes 1:00 pm" });
  });

  it("is open in the evening session and closes at 8 pm", () => {
    expect(getOpenStatus(hours, ist("2026-11-16T19:59")).label).toBe("Open now · closes 8:00 pm");
  });

  it("opens later today between sessions", () => {
    const s = getOpenStatus(hours, ist("2026-11-16T14:30"));
    expect(s).toMatchObject({ state: "opens-later-today", opensAt: "17:00", label: "Opens today at 5:00 pm" });
  });

  it("opens later today before the first session", () => {
    expect(getOpenStatus(hours, ist("2026-11-16T08:00")).label).toBe("Opens today at 10:00 am");
  });

  it("treats closing time as closed (end is exclusive)", () => {
    expect(getOpenStatus(hours, ist("2026-11-16T13:00")).state).toBe("opens-later-today");
  });

  it("is closed on a closed day and names the next open day", () => {
    const s = getOpenStatus(hours, ist("2026-11-15T11:00")); // Sunday
    expect(s).toMatchObject({ state: "closed", nextDay: "mon", label: "Closed today · opens tomorrow 10:00 am" });
  });

  it("is closed after the last session and opens tomorrow", () => {
    expect(getOpenStatus(hours, ist("2026-11-16T20:00")).label).toBe("Closed now · opens tomorrow 10:00 am");
  });

  it("skips the closed Sunday after Saturday close", () => {
    expect(getOpenStatus(hours, ist("2026-11-21T21:00")).label).toBe("Closed now · opens Mon 10:00 am");
  });

  it("handles midnight: just after 00:00 Monday it opens later today", () => {
    expect(getOpenStatus(hours, ist("2026-11-16T00:00")).label).toBe("Opens today at 10:00 am");
  });

  it("handles midnight: 23:59 Sunday is still Sunday", () => {
    expect(getOpenStatus(hours, ist("2026-11-15T23:59")).label).toBe("Closed today · opens tomorrow 10:00 am");
  });

  it("handles a session that runs to midnight and continues past it", () => {
    const late: WeekHours = { ...hours, fri: [["18:00", "24:00"]], sat: [["00:00", "02:00"], ["10:00", "13:00"]] };
    expect(getOpenStatus(late, ist("2026-11-20T23:30")).label).toBe("Open now · closes 2:00 am");
    expect(getOpenStatus(late, ist("2026-11-21T01:00")).label).toBe("Open now · closes 2:00 am");
  });

  it("copes with a week that has no hours", () => {
    const none = Object.fromEntries(Object.keys(hours).map((d) => [d, []])) as unknown as WeekHours;
    expect(getOpenStatus(none, ist("2026-11-16T11:00"))).toMatchObject({ state: "closed", label: "Closed" });
  });
});

describe("formatting", () => {
  it("formats 12-hour times", () => {
    expect(formatTime("00:00")).toBe("12:00 am");
    expect(formatTime("12:30")).toBe("12:30 pm");
    expect(formatTime("17:05")).toBe("5:05 pm");
    expect(formatTime("24:00")).toBe("12:00 am");
  });

  it("groups consecutive identical days", () => {
    expect(formatHours(hours)).toEqual([
      { days: "Mon – Sat", times: "10:00 am – 1:00 pm, 5:00 pm – 8:00 pm" },
      { days: "Sun", times: "Closed" },
    ]);
  });

  it("builds schema.org opening hours", () => {
    const spec = openingHoursSpecification(hours);
    expect(spec).toHaveLength(2);
    expect(spec[0]).toMatchObject({ opens: "10:00", closes: "13:00" });
    expect(spec[0]!.dayOfWeek).toEqual(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
  });
});
