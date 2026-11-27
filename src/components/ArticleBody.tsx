import React from "react";
import Markdoc from "@markdoc/markdoc";
import { markdocConfig, parseBody } from "@/lib/markdoc";
import { Pending } from "./Pending";

/**
 * Renders an article's Markdoc body. Styles are set on the wrapper so the
 * editor output (plain h2/p/ul/img) needs no classes of its own.
 */
export function ArticleBody({ source }: { source: string }) {
  const content = Markdoc.transform(parseBody(source), markdocConfig);
  return (
    <div className="article-body space-y-5">
      {Markdoc.renderers.react(content, React, { components: { Pending } })}
    </div>
  );
}
