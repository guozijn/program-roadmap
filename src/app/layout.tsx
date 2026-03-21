import type { Metadata } from "next";
import { Roboto_Serif, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-serif",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: {
    default: "Program Roadmap | Adelaide University",
    template: "%s | Program Roadmap",
  },
  description:
    "Explore your academic journey, discover career pathways, and connect with industry. Your program roadmap starts here.",
  keywords: ["university", "programs", "roadmap", "careers", "alumni", "industry"],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Program Roadmap",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${robotoSerif.variable} ${barlowCondensed.variable}`}>
      <body className={robotoSerif.className}>{children}</body>
    </html>
  );
}
