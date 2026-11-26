/**
 * "Pending" content: sections of the inner pages (treatments, Journal, For
 * doctors) that still need the clinic's facts. Until launch they show as a
 * dashed "To add" box so the clinic can see what is missing in a preview.
 *
 * Set NEXT_PUBLIC_HIDE_PENDING=1 for the launch build: the boxes and the
 * draft Journal articles then disappear, and each section only renders once
 * its content is filled in.
 */
export const showPending = process.env.NEXT_PUBLIC_HIDE_PENDING !== "1";
