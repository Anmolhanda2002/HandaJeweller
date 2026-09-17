import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Handa Jeweller | Certified Fine Jewelry, Solitaires & Bridal Polki",
    template: "%s | Handa Jeweller",
  },
  description:
    "Discover certified diamond solitaires, BIS hallmarked 22K gold necklaces, and heirloom bridal polki sets handcrafted by master artisans since 1985.",
  keywords: [
    "Handa Jeweller",
    "diamond rings",
    "solitaire rings",
    "gold necklace",
    "polki bridal sets",
    "tennis bracelet",
    "hallmarked gold jewelry",
    "certified diamonds India",
  ],
  openGraph: {
    title: "Handa Jeweller | Royal Certified Fine Jewelry",
    description: "Iconic heirloom jewelry, certified solitaires, and hallmarked pure gold.",
    url: "http://localhost:3000",
    siteName: "Handa Jeweller",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans bg-white text-neutral-900 selection:bg-amber-200 selection:text-neutral-900">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
