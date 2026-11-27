import Markdoc, { type Config, type ValidateError } from "@markdoc/markdoc";

/**
 * Markdoc setup for Journal articles. Matches the editor options in
 * keystatic.config.ts: headings, lists, links, bold/italic, images and the
 * {% pending %} "To add" note.
 */
export const markdocConfig: Config = {
  // The page already has its own <article>; render the document as a fragment.
  nodes: { document: { ...Markdoc.nodes.document, render: undefined } },
  tags: {
    pending: { render: "Pending", children: ["paragraph", "list", "inline"] },
  },
};

export function parseBody(source: string) {
  return Markdoc.parse(source);
}

/** Errors in an article body (unknown tags, unclosed tags). Empty when it is fine. */
export function validateBody(source: string): ValidateError[] {
  return Markdoc.validate(parseBody(source), markdocConfig).filter((e) => e.error.level !== "debug" && e.error.level !== "info");
}
