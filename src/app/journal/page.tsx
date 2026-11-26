import { site } from "@/content/site";
import { JournalList } from "@/components/JournalList";
import { pageMetadata } from "@/lib/meta";

export const metadata = pageMetadata({
  title: "Journal",
  description: `Articles by ${site.doctor.name} on skin, hair and nail problems, for patients and for clinicians.`,
  path: "/journal",
});

export default function JournalPage() {
  return <JournalList />;
}
