"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Crown, Sparkles, ArrowRight, ShieldCheck, Gem } from "lucide-react";

interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  purity: string;
  description: string;
  image: string;
  link: string;
  priceNote: string;
  tag: string;
}

const BRIDAL_FINE_ITEMS: ShowcaseItem[] = [
  {
    id: "fine-1",
    title: "Rajputana Royal Polki & Emerald Choker Suite",
    category: "Bridal Heirloom",
    purity: "22K BIS 916 Hallmarked",
    description: "Handcrafted with syndicate uncut polki diamonds, Zambian emerald beads, and hand-painted meenakari.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    link: "/category/bridal-sets",
    priceNote: "Starting from ₹3,85,000",
    tag: "Heirloom Masterpiece",
  },
  {
    id: "fine-2",
    title: "Nizam Solitaire Diamond Tennis Haar",
    category: "Solitaire Collection",
    purity: "18K Gold • IGI Certified",
    description: "Continuous cascade of round brilliant cut diamonds (VVS-VS clarity, E-F color) with hidden royal clasp.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
    link: "/category/solitaire-collection",
    priceNote: "Starting from ₹4,50,000",
    tag: "Certified Solitaire",
  },
  {
    id: "fine-3",
    title: "Heritage Matte Gold Temple Lakshmi Haar",
    category: "Temple Jewellery",
    purity: "22K Pure Hallmarked Gold",
    description: "Auspicious Goddess Lakshmi central medallion flanked by intricately carved nakshi peacocks.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    link: "/category/gold-necklaces",
    priceNote: "Starting from ₹2,60,000",
    tag: "Temple Gold",
  },
];

const ARTIFICIAL_DESTINATION_ITEMS: ShowcaseItem[] = [
  {
    id: "art-1",
    title: "Sabyasachi-Inspired Royal Kundan Choker Set",
    category: "Artificial Bridal",
    purity: "24K Micro Gold Plated Brass",
    description: "High-grade faux polki stones, deep bottle-green enameled meenakari, and matching chandbalis & maang tikka.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    link: "/category/artificial-kundan-polki",
    priceNote: "₹8,499 (Destination Bridal)",
    tag: "Destination Wedding",
  },
  {
    id: "art-2",
    title: "Cannes American Diamond Waterfall Necklace",
    category: "Artificial AD Glamour",
    purity: "Rhodium Silver Polish • 5A CZ",
    description: "Dazzling multi-row European cut cubic zirconia designed for evening sangeet and cocktail galas.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
    link: "/category/artificial-american-diamond",
    priceNote: "₹6,999 (Cocktail Special)",
    tag: "High Glamour",
  },
  {
    id: "art-3",
    title: "Antique Temple Nakshi Matte Choker Set",
    category: "Artificial Temple",
    purity: "Matte Antique Gold Plated",
    description: "Lightweight imitation temple jewellery with ruby-red stones and clustered pearl hangings.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    link: "/category/artificial-temple-jewellery",
    priceNote: "₹5,499 (Festive Wear)",
    tag: "Lightweight Elegance",
  },
];

export default function BridalAndFestiveShowcase() {
  const [activeTab, setActiveTab] = useState<"fine" | "artificial">("fine");

  const items = activeTab === "fine" ? BRIDAL_FINE_ITEMS : ARTIFICIAL_DESTINATION_ITEMS;

  return (
    <section className="py-20 bg-[#FAF6F0] border-y border-[#EAE2D5] relative overflow-hidden">
      {/* Decorative Gold Filigree Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-200/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4A0E17]/10 text-[#4A0E17] text-xs font-bold uppercase tracking-widest mb-3 border border-[#4A0E17]/20">
            <Crown className="w-3.5 h-3.5 text-[#C5A059]" /> Shubh Vivah &amp; Festive Trousseau
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1615] tracking-tight leading-tight">
            Treasures of the Indian Bride
          </h2>
          <p className="text-[#5A524C] text-sm sm:text-base mt-3 leading-relaxed">
            From certified 22K hallmarked gold &amp; polki heirlooms to destination-wedding artificial jewellery, experience royal grandeur curated for every sacred celebration.
          </p>

          {/* Toggle Switch */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-white border border-[#D9CEBF] shadow-xs">
            <button
              onClick={() => setActiveTab("fine")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "fine"
                  ? "bg-[#4A0E17] text-white shadow-md"
                  : "text-[#5A524C] hover:text-[#1A1615]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              22K Fine Gold &amp; Polki
            </button>
            <button
              onClick={() => setActiveTab("artificial")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "artificial"
                  ? "bg-[#4A0E17] text-white shadow-md"
                  : "text-[#5A524C] hover:text-[#1A1615]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Destination Artificial
            </button>
          </div>
        </div>

        {/* 3 Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E7DFD3] shadow-sm hover:shadow-xl hover:border-[#C5A059] transition-all duration-300 flex flex-col group"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3.8] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1615]/80 via-transparent to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#4A0E17] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-[#C5A059]/40">
                    {item.tag}
                  </span>
                </div>

                {/* Bottom Purity Tag inside image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider mb-0.5">
                    {item.purity}
                  </span>
                  <p className="font-mono text-xs font-bold text-amber-100">
                    {item.priceNote}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-[#8C6D23] font-bold uppercase tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#1A1615] group-hover:text-[#4A0E17] transition leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5A524C] mt-2 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F0EAE1] flex items-center justify-between">
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A0E17] group-hover:text-[#C5A059] uppercase tracking-wider transition"
                  >
                    Explore Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={`https://wa.me/917717595732?text=${encodeURIComponent(
                      `Namaste Handa Jeweller! I am interested in custom bridal ordering for "${item.title}". Please share details and consultation slots.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-200 transition"
                  >
                    Bridal Inquiry
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shubh Vivah Consultation Callout Banner */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#4A0E17] to-[#2D080E] text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#C5A059]/40 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center justify-center md:justify-start gap-1.5">
              <Crown className="w-4 h-4 text-[#D4AF37]" /> The Handa Bridal Salon Experience
            </span>
            <h4 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
              Planning Your Wedding Trousseau?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
              Book a private virtual or showroom consultation with our third-generation master jewelers. Custom weight matching, hallmark testing, and complimentary trousseau styling.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 w-full md:w-auto">
            <a
              href="https://wa.me/917717595732?text=Namaste!%20I%20would%20like%20to%20book%20a%20Private%20Bridal%20Consultation%20with%20Handa%20Jeweller."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#C5A059] text-[#1A1615] text-xs font-bold uppercase tracking-wider text-center transition shadow-lg"
            >
              Book Bridal Consultation
            </a>
            <Link
              href="/category/bridal-sets"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider text-center transition border border-white/20"
            >
              View All Bridal Suites
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
