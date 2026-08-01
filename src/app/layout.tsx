import type { Metadata } from "next";
import { Bitter, Source_Sans_3 } from "next/font/google";
import "./globals.css";

import { siteConfig } from "@/config/site";
import { JsonLd, organizationJsonLd } from "@/lib/jsonld";
import { CallBar } from "@/components/site/call-bar";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

const bitter = Bitter({ subsets: ["latin"], variable: "--font-bitter" });
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Charter bus, mini bus, and sprinter van rentals for groups of every size, serving all 50 states. Request a free quote or call to plan your trip.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bitter.variable} ${sourceSans.variable}`}>
      <body className="flex min-h-svh flex-col pb-24 antialiased md:pb-0">
        <JsonLd data={organizationJsonLd} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-5 focus:py-3 focus:font-semibold focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <CallBar />
      </body>
    </html>
  );
}
