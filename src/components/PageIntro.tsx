import type { ReactNode } from "react";
import { siteUrl } from "@/lib/links";
import { jsonLdString } from "@/lib/schema";

export type Crumb = { href: string; label: string };

/**
 * Top of an inner page: breadcrumbs (with BreadcrumbList JSON-LD), eyebrow,
 * the page's single H1 and a lede. The last crumb is the current page.
 */
export function PageIntro({
  crumbs,
  eyebrow,
  title,
  lede,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  const trail = [{ href: "/", label: "Home" }, ...crumbs];
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${siteUrl()}${c.href}`,
    })),
  };
  return (
    <section className="pt-8 pb-10 md:pt-12 md:pb-14" aria-labelledby="page-title">
      <div className="wrap">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-muted">
            {trail.map((c, i) => (
              <li key={c.href} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i === trail.length - 1 ? (
                  <span aria-current="page" className="font-semibold text-ink-soft">
                    {c.label}
                  </span>
                ) : (
                  <a href={c.href} className="underline decoration-1 underline-offset-4 hover:text-ink">
                    {c.label}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="eyebrow mt-8 text-leaf-ink">{eyebrow}</p>}
        <h1 id="page-title" className={`text-h1 max-w-[22ch] text-ink ${eyebrow ? "mt-4" : "mt-8"}`}>
          {title}
        </h1>
        {lede && <p className="text-body mt-5 max-w-[62ch] text-ink-soft">{lede}</p>}
        {children}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }} />
    </section>
  );
}
