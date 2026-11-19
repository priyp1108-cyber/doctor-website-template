/**
 * Accepts a 10-digit Indian mobile number (starting 6–9), optionally
 * prefixed with +91 / 91 / 0, with spaces or dashes anywhere.
 * Returns the normalised "+91XXXXXXXXXX" form, or null if invalid.
 */
export function normaliseIndianMobile(input: string): string | null {
  const compact = input.replace(/[\s\-().]/g, "");
  const m = /^(?:\+91|91|0)?([6-9]\d{9})$/.exec(compact);
  return m ? `+91${m[1]}` : null;
}
