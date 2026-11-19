import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import Script from "next/script";
import { site } from "@/content/site";
import { filled } from "@/lib/placeholder";
import { siteUrl } from "@/lib/links";
import { buildJsonLd, jsonLdString } from "@/lib/schema";
import { RevealObserver } from "@/components/RevealObserver";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TrackClicks } from "@/components/TrackClicks";
import { ConfirmWarning } from "@/components/ConfirmWarning";
import "./globals.css";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
});
const sans = Manrope({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

// The full name (clinic + doctor) leads the title so searches for either
// "SA Skincure" or "Dr. Anil Kumar Panda" match it.
const title = `${site.name} | Dermatologist in ${site.clinic.city}`;
const area = filled(site.clinic.area);
const description = `${site.name}: ${site.doctor.name}'s dermatology clinic in ${
  area ? `${area}, ` : ""
}${site.clinic.city} for acne, pigmentation, hair fall, fungal infections, eczema and psoriasis. Book on WhatsApp.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title,
  description,
  applicationName: site.name,
  authors: [{ name: site.doctor.name }],
  keywords: [site.name, site.clinic.shortName, site.doctor.name, `dermatologist ${site.clinic.city}`],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#F7F8FC",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before first paint: enables the JS-only hidden start states.
// If the app never hydrates, a fallback class reveals everything after 4s.
const jsFlag = `document.documentElement.classList.add('js');setTimeout(function(){if(!window.__revealReady)document.documentElement.classList.add('reveal-fallback')},4000);`;

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(buildJsonLd()) }} />
      </head>
      <body>
        {children}
        <RevealObserver />
        <SmoothScroll />
        <TrackClicks />
        <ConfirmWarning />
        {plausibleDomain && (
          <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
