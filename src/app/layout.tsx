import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";
import { site } from "@/content/site";
import { filled } from "@/lib/placeholder";
import { siteUrl } from "@/lib/links";
import { RevealObserver } from "@/components/RevealObserver";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TrackClicks } from "@/components/TrackClicks";
import { ConfirmWarning } from "@/components/ConfirmWarning";
import "./globals.css";

const figtree = Figtree({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
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
  // Inner pages set their own title; the template adds the site name.
  title: { default: title, template: `%s | ${site.name}` },
  description,
  applicationName: site.name,
  authors: [{ name: site.doctor.name }],
  keywords: [site.name, site.clinic.shortName, site.doctor.name, `dermatologist ${site.clinic.city}`],
  alternates: { canonical: "/", types: { "application/rss+xml": [{ url: "/journal/rss.xml", title: `${site.clinic.shortName} Journal` }] } },
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
  themeColor: "#F6F9FC",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before first paint: enables the JS-only hero entrance.
const jsFlag = `document.documentElement.classList.add('js');`;

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={figtree.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
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
