import { describe, expect, it } from "vitest";
import { normaliseIndianMobile as n } from "@/lib/phone";

describe("normaliseIndianMobile", () => {
  it.each([
    ["9876543210", "+919876543210"],
    ["+91 98765 43210", "+919876543210"],
    ["91-98765-43210", "+919876543210"],
    ["09876543210", "+919876543210"],
    ["6000000000", "+916000000000"],
  ])("accepts %s", (input, out) => expect(n(input)).toBe(out));

  it.each(["", "12345", "5876543210", "98765432101", "+1 9876543210", "abcdefghij"])("rejects %s", (input) =>
    expect(n(input)).toBeNull(),
  );
});
