import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BookingBar } from "./BookingBar";

/** Skip link, header, main, footer and the phone booking bar: shared by every page. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <BookingBar />
    </>
  );
}
