import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppWidget from "@/components/layout/WhatsAppWidget";
import JewelryChatbot from "@/components/layout/JewelryChatbot";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/JsonLd";

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
  metadataBase: new URL("https://handajeweller.com"),
  title: {
    default: "Handa Jeweller | Certified Fine Jewelry, Solitaires & Royal Bridal Polki",
    template: "%s | Handa Jeweller",
  },
  description:
    "Discover certified diamond solitaires, 100% BIS 916 hallmarked 22K pure gold necklaces, and heirloom bridal polki sets handcrafted by master Punjabi goldsmiths since 1982. Insured express delivery across India and UAE.",
  keywords: [
    "Handa Jeweller",
    "handmade jewellery India",
    "buy 22k gold necklace online",
    "certified diamond solitaire ring",
    "BIS 916 hallmarked gold jewellery",
    "royal bridal polki trousseau",
    "kundan jewellery Amritsar",
    "jewellery shops in Punjab",
    "virtual try on jewellery online",
    "gold rate today Punjab",
  ],
  alternates: {
    canonical: "https://handajeweller.com",
  },
  openGraph: {
    title: "Handa Jeweller | Royal Indian Fine Jewelry Atelier Since 1982",
    description:
      "Iconic heirloom fine jewelry, certified solitaires, and 100% BIS hallmarked gold handcrafted by four-decade master goldsmiths.",
    url: "https://handajeweller.com",
    siteName: "Handa Jeweller",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Handa Jeweller Certified Fine Jewelry Masterpieces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Handa Jeweller | Certified Fine Jewelry & Royal Polki",
    description: "Discover certified diamond solitaires and 100% BIS hallmarked 22K gold.",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-white text-neutral-900 selection:bg-amber-200 selection:text-neutral-900">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppWidget />
          <JewelryChatbot />
        </Providers>
      </body>
    </html>
  );
}
