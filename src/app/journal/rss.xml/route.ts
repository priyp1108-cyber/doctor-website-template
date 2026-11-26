import { site } from "@/content/site";
import { audiences } from "@/content/journal";
import { articleHref, journalArticles } from "@/lib/pages";
import { siteUrl } from "@/lib/links";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 feed of the Journal (/journal/rss.xml). */
export function GET() {
  const base = siteUrl();
  const items = journalArticles()
    .map((a) => {
      const link = `${base}${articleHref(a.slug)}`;
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${esc(a.summary)}</description>
      <category>${esc(audiences[a.audience].label)}</category>
      <pubDate>${new Date(`${a.date}T09:00:00+05:30`).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${site.clinic.shortName} Journal`)}</title>
    <link>${base}/journal</link>
    <atom:link href="${base}/journal/rss.xml" rel="self" type="application/rss+xml" />
    <description>${esc(`Articles by ${site.doctor.name} for patients and clinicians.`)}</description>
    <language>en-IN</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
