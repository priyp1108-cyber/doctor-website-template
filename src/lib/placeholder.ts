/** True for values the owner still has to fill in. */
export function isPlaceholder(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return value.includes("[CONFIRM") || /X{6,}/.test(value) || value.trim() === "";
}

/** The value, or undefined while it is still a placeholder. */
export function filled(value: string): string | undefined {
  return isPlaceholder(value) ? undefined : value;
}

/** Only the questions whose answer has been confirmed (page and structured data). */
export function answeredFaqs<T extends { answer: string }>(faqs: readonly T[]): T[] {
  return faqs.filter((f) => !isPlaceholder(f.answer));
}

/** Dotted paths of every string in `obj` that still starts with "[CONFIRM]". */
export function findConfirmValues(obj: unknown, path = ""): string[] {
  if (typeof obj === "string") return obj.includes("[CONFIRM") ? [path || "(root)"] : [];
  if (Array.isArray(obj)) return obj.flatMap((v, i) => findConfirmValues(v, `${path}[${i}]`));
  if (obj && typeof obj === "object") {
    return Object.entries(obj).flatMap(([k, v]) => findConfirmValues(v, path ? `${path}.${k}` : k));
  }
  return [];
}
