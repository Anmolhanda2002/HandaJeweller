"use client";

import React from "react";
import { ShieldCheck, Award, RefreshCw, Truck, Scale, Star, MapPin } from "lucide-react";

const PROMISE_PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% BIS 916 Hallmarked",
    badge: "Govt. of India Certified",
    description: "Every gold piece is certified by Bureau of Indian Standards with unique 6-digit laser HUID verification.",
  },
  {
    icon: Award,
    title: "GIA & IGI Certified Diamonds",
    badge: "Natural Solitaires",
    description: "Laser inscribed solitaires strictly graded across the 4Cs with international authenticity certificates.",
  },
  {
    icon: Scale,
    title: "Net Gold Weight Transparency",
    badge: "Zero Hidden Charges",
    description: "You only pay for the exact net gold weight. Stone weight is meticulously weighed and deducted separately.",
  },
  {
    icon: RefreshCw,
    title: "100% Lifetime Gold Buyback",
    badge: "Transparent Exchange",
    description: "Guaranteed lifetime buyback and exchange at prevailing daily bullion market benchmark rates.",
  },
  {
    icon: Truck,
    title: "Insured Transit: India & UAE",
    badge: "Armored Despatch",
    description: "Tamper-proof sealed security packaging with 100% transit insurance across all 28 Indian States & UAE (Dubai & Abu Dhabi).",
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    quote: "We ordered my daughter's wedding polki choker suite from Handa Jeweller. The BIS 916 HUID verification was authentic, and the finish is comparable to the finest royal houses of Amritsar and Jaipur.",
    author: "Harpreet & Jasleen Kaur",
    location: "Amritsar, Punjab",
    purchased: "Royal Polki Bridal Suite",
  },
  {
    id: 2,
    quote: "Living in Dubai, finding authentic hallmarked 22K Punjabi gold jewelry was challenging. Handa Jeweller delivered my bridal kada set straight to Abu Dhabi within 4 days. Flawless craftsmanship and certified hallmarking!",
    author: "Rohit & Meera Sharma",
    location: "Abu Dhabi / Dubai, UAE",
    purchased: "22K Traditional Kadas",
  },
  {
    id: 3,
    quote: "Their transparency in gold weighing and making charges is the best in North India. I verified the GIA diamond certificate online immediately. Extraordinary brilliance and trustworthy heritage.",
    author: "Dr. Vikramaditya Verma",
    location: "New Delhi (South Ex)",
    purchased: "Solitaire Engagement Ring",
  },
];

export default function RoyalHeritagePromise() {
  return (
    <section className="py-20 bg-[#FAF8F5] border-t border-[#EAE4D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4A0E17]/10 text-[#4A0E17] text-xs font-bold uppercase tracking-widest mb-3 border border-[#4A0E17]/20">
            Heritage Since 1982
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1615] tracking-tight leading-tight">
            The Handa Royal Assurance
          </h2>
          <p className="text-[#5A524C] text-sm sm:text-base mt-3 leading-relaxed">
            Four decades of sacred trust, uncompromised hallmark purity, and master Punjabi craftsmanship.
          </p>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-20">
          {PROMISE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#E7DFD3] shadow-xs hover:shadow-lg hover:border-[#C5A059] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#4A0E17]/10 text-[#4A0E17] flex items-center justify-center mb-4 group-hover:bg-[#4A0E17] group-hover:text-[#D4AF37] transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-[#8C6D23] uppercase tracking-wider block mb-1">
                    {pillar.badge}
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#1A1615] leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#5A524C] mt-2 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indian & UAE Customer Testimonials */}
        <div className="border-t border-[#EAE2D5] pt-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#8C6D23] uppercase tracking-widest block mb-1">
              Patrons Across India &amp; UAE
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1615]">
              Words of Trust from Our Families
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-6 border border-[#E7DFD3] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#423C37] leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F2ECE3] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#1A1615]">
                      {t.author}
                    </h4>
                    <span className="text-[11px] text-[#8C6D23] font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#C5A059]" /> {t.location}
                    </span>
                  </div>
                  <span className="text-[10px] bg-neutral-100 text-neutral-700 font-medium px-2 py-1 rounded-md">
                    {t.purchased}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
