import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { audiences, type Audience } from "@/content/journal";
import { JournalList } from "@/components/JournalList";
import { pageMetadata } from "@/lib/meta";
import { audienceHref } from "@/lib/pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(audiences).map((audience) => ({ audience }));
}

type Props = { params: Promise<{ audience: string }> };

const isAudience = (a: string): a is Audience => a in audiences;

export async function generateMetadata({ params }: Props) {
  const { audience } = await params;
  if (!isAudience(audience)) return {};
  return pageMetadata({
    title: `Journal: ${audiences[audience].label.toLowerCase()}`,
    description: `${audiences[audience].intro} By ${site.doctor.name}.`,
    path: audienceHref(audience),
  });
}

export default async function AudiencePage({ params }: Props) {
  const { audience } = await params;
  if (!isAudience(audience)) notFound();
  return <JournalList audience={audience} />;
}
