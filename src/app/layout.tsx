import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "OVERWORLD — Your Personal Soundtrack for Reality",
    description:
      "A music app that matches soundtracks to the world around you.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
