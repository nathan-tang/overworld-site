import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "OVERWORLD — Your Personal Soundtrack for Reality",
  description:
    "A music app that knows where you are, what time it is, and what you're doing — then plays the perfect song. No scrolling. No choosing. Just living.",
  metadataBase: new URL("https://overworld.dev"),
  openGraph: {
    title: "OVERWORLD — Your Personal Soundtrack for Reality",
    description:
      "A music app that matches soundtracks to the world around you. Every place has its own theme.",
    url: "https://overworld.dev",
    siteName: "Overworld",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Overworld — Your Personal Soundtrack for Reality",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OVERWORLD — Your Personal Soundtrack for Reality",
    description:
      "A music app that matches soundtracks to the world around you.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Overworld",
    description:
      "A location-aware music app that plays the perfect song for where you are, what time it is, and what you're doing.",
    applicationCategory: "MusicApplication",
    operatingSystem: "iOS",
    url: "https://overworld.dev",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
