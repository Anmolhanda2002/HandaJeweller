import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Crown,
  Sparkles,
  Calendar,
  MessageCircle,
  CheckCircle2,
  Navigation,
} from "lucide-react";
import { BreadcrumbSchema, FAQPageSchema } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Handmade 22K Hallmarked Gold Jewellery in Amritsar & Punjab | Handa Jeweller",
  description:
    "Visit Handa Jeweller boutique in Amritsar & Talwara, Punjab. Discover certified BIS 916 hallmarked 22K gold, GIA solitaires, and royal Punjabi bridal polki trousseau.",
  alternates: {
    canonical: "https://handajeweller.com/locations/amritsar",
  },
  openGraph: {
    title: "Handa Jeweller Flagship Boutiques | Amritsar & Talwara, Punjab",
    description: "Four decades of Punjabi goldsmith heritage. Certified pure gold, diamond solitaires, and bespoke bridal suites.",
    url: "https://handajeweller.com/locations/amritsar",
  },
};

const LOCAL_FAQS = [
  {
    question: "Where is Handa Jeweller located in Punjab?",
    answer:
      "Handa Jeweller operates its heritage flagship boutiques in Main Market, Talwara (District Hoshiarpur, PIN 144216) and our Amritsar Heritage Hub serving patrons across the Golden Temple corridor, Jalandhar, Ludhiana, and Chandigarh Tricity.",
  },
  {
    question: "Does Handa Jeweller provide 100% BIS hallmarked 22K gold?",
    answer:
      "Yes, 100% of our gold ornaments are hallmarked with the Bureau of Indian Standards (BIS) triangular logo, the 22K916 fineness stamp, and an individual 6-digit laser HUID verifiable via the official BIS Care App.",
  },
  {
    question: "Can I book a private bridal jewellery consultation in Amritsar?",
    answer:
      "Yes, brides and families can schedule private VIP trousseau appointments with master goldsmith Anmol Handa via WhatsApp (+91 77175 95732) for bespoke necklace fittings, carat customization, and bridal preview viewings.",
  },
  {
    question: "Do you offer insured delivery to other cities in Punjab and India?",
    answer:
      "Yes, we provide 100% insured armored courier delivery (via Sequel Logistics & BVC) across all 28 Indian States, including same-day or next-day expedited despatch to Amritsar, Ludhiana, Jalandhar, Mohali, and Chandigarh.",
  },
];

export default function AmritsarLocationPage() {
  const baseUrl = "https://handajeweller.com";

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "Handa Jeweller Amritsar & Punjab Flagship",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200",
    url: `${baseUrl}/locations/amritsar`,
    telephone: "+91 77175 95732",
    priceRange: "₹₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Market, Talwara & Heritage Hub Corridor",
      addressLocality: "Amritsar & Talwara",
      addressRegion: "Punjab",
      postalCode: "144216",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.634,
      longitude: 74.8723,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:30",
        closes: "20:00",
      },
    ],
    sameAs: [
      "https://wa.me/917717595732",
      "https://instagram.com/handajeweller",
    ],
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Flagship Boutiques", url: `${baseUrl}/contact` },
          { name: "Amritsar & Punjab", url: `${baseUrl}/locations/amritsar` },
        ]}
      />
      <FAQPageSchema faqs={LOCAL_FAQS} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#4A0E17]">Home</Link>
          <span>/</span>
          <Link href="/contact" className="hover:text-[#4A0E17]">Locations</Link>
          <span>/</span>
          <span className="text-[#1A1615] font-semibold">Amritsar &amp; Punjab Atelier</span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A0E17]/10 text-[#4A0E17] text-xs font-bold uppercase tracking-wider border border-[#4A0E17]/20">
              <Crown className="w-3.5 h-3.5 text-[#C5A059]" /> Punjabi Goldsmith Heritage Since 1982
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1615] tracking-tight leading-tight">
              Handcrafted 22K Gold &amp; Royal Polki in Amritsar &amp; Punjab
            </h1>
            <p className="text-[#5A524C] text-sm sm:text-base leading-relaxed">
              Step into the world of genuine royal Indian goldsmithing. Handa Jeweller welcomes brides and connoisseurs across Punjab seeking 100% BIS 916 hallmarked pure gold, GIA certified solitaires, and heirloom Jadau Polki trousseau.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://wa.me/917717595732?text=Namaste%2C%20I%20would%20like%20to%20book%20an%20in-store%20consultation%20at%20Handa%20Jeweller%20Punjab."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-[#4A0E17] hover:bg-[#380A11] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" /> Book VIP Appointment
              </a>
              <a
                href="tel:+917717595732"
                className="px-6 py-3 rounded-full bg-white border border-[#E7DFD3] text-[#1A1615] hover:text-[#4A0E17] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition"
              >
                <Phone className="w-4 h-4 text-[#8C6D23]" /> Call Concierge
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[#E7DFD3]">
            <Image
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop"
              alt="Handa Jeweller Amritsar Punjab Boutique"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Boutique Details Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E7DFD3] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#8C6D23] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#1A1615]">Boutique Address</h3>
            <p className="text-xs text-[#5A524C] leading-relaxed">
              Main Market, Talwara &amp; Amritsar Heritage Hub Corridor, Punjab 144216, India.
            </p>
            <div className="text-[11px] text-[#8C6D23] font-semibold flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" /> Ample Valet Parking Available
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E7DFD3] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#8C6D23] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#1A1615]">Visiting Hours</h3>
            <p className="text-xs text-[#5A524C] leading-relaxed">
              Monday to Saturday: 10:30 AM – 8:00 PM<br />
              Sunday: By Prior Appointment Only
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Open Today for Walk-ins
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E7DFD3] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#8C6D23] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#1A1615]">Hallmarking Lab</h3>
            <p className="text-xs text-[#5A524C] leading-relaxed">
              100% 6-digit laser HUID authentication. In-house ultrasonic jewelry spa and diamond testing.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Lifetime Buyback
            </div>
          </div>
        </div>

        {/* Local Services Section */}
        <div className="bg-white rounded-3xl border border-[#E7DFD3] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1615]">
              Atelier Services for Patrons in Punjab
            </h2>
            <p className="text-xs sm:text-sm text-[#5A524C]">
              We offer bespoke luxury services tailored to North Indian families and wedding parties.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-1.5">
              <h4 className="font-serif text-sm font-bold text-[#4A0E17]">Bridal Trousseau Fitting</h4>
              <p className="text-xs text-[#5A524C] leading-relaxed">
                Custom necklace neckband tailoring, neckline contouring, and matching maang tikkas.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-1.5">
              <h4 className="font-serif text-sm font-bold text-[#4A0E17]">Old Gold Exchange</h4>
              <p className="text-xs text-[#5A524C] leading-relaxed">
                100% transparent melt-rate valuation with zero melting loss on BIS hallmarked gold.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-1.5">
              <h4 className="font-serif text-sm font-bold text-[#4A0E17]">Virtual Try-On Guidance</h4>
              <p className="text-xs text-[#5A524C] leading-relaxed">
                Preview your wedding sets on camera or high-res photo prior to boutique arrival.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-1.5">
              <h4 className="font-serif text-sm font-bold text-[#4A0E17]">UAE &amp; NRI Express Transit</h4>
              <p className="text-xs text-[#5A524C] leading-relaxed">
                Seamless delivery to families in Dubai, Abu Dhabi, Canada, and the United Kingdom.
              </p>
            </div>
          </div>
        </div>

        {/* Local FAQ Section */}
        <div className="bg-white rounded-3xl border border-[#E7DFD3] p-8 sm:p-12 shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1A1615]">
            Frequently Asked Questions by Punjab Patrons
          </h2>
          <div className="space-y-4 divide-y divide-neutral-100">
            {LOCAL_FAQS.map((faq, i) => (
              <div key={i} className="pt-4 first:pt-0 space-y-1.5">
                <h3 className="font-serif text-base font-bold text-[#1A1615]">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A524C] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
