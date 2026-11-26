import { Hero } from "@/components/Hero";
import { TreatmentsOverview } from "@/components/TreatmentsOverview";
import { Doctor } from "@/components/Doctor";
import { VisitSteps } from "@/components/VisitSteps";
import { ClinicPhotos } from "@/components/ClinicPhotos";
import { Recognition } from "@/components/Recognition";
import { JournalStrip } from "@/components/JournalStrip";
import { Faq } from "@/components/Faq";
import { VisitPanel } from "@/components/VisitPanel";
import { PageShell } from "@/components/PageShell";
import { buildJsonLd, jsonLdString } from "@/lib/schema";

export default function Home() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(buildJsonLd()) }} />
      <Hero />
      <TreatmentsOverview />
      <Doctor />
      <VisitSteps />
      <ClinicPhotos />
      <Recognition />
      <JournalStrip />
      <Faq />
      <VisitPanel />
    </PageShell>
  );
}
