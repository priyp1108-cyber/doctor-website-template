import type { Metadata } from "next";
import { site } from "@/content/site";

/** Title, description, canonical and link-preview fields for an inner page. */
export function pageMetadata({ title, description, path, type = "website" }: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, locale: "en_IN", url: path, siteName: site.name, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}
