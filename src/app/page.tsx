import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Concerns } from "@/components/Concerns";
import { Doctor } from "@/components/Doctor";
import { VisitSteps } from "@/components/VisitSteps";
import { ClinicPhotos } from "@/components/ClinicPhotos";
import { Recognition } from "@/components/Recognition";
import { Faq } from "@/components/Faq";
import { VisitPanel } from "@/components/VisitPanel";
import { Footer } from "@/components/Footer";
import { BookingBar } from "@/components/BookingBar";

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Concerns />
        <Doctor />
        <VisitSteps />
        <ClinicPhotos />
        <Recognition />
        <Faq />
        <VisitPanel />
      </main>
      <Footer />
      <BookingBar />
    </>
  );
}
