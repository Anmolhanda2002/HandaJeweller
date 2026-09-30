"use client";

import React, { useState, useEffect } from "react";
import { Crown, ShieldCheck, Truck, TrendingUp, Phone, Gem } from "lucide-react";

interface BullionRates {
  gold24k: { perGram: number; per10Gram: number };
  gold22k: { perGram: number; per10Gram: number };
  silver999: { perGram: number; perKg: number };
}

export default function AnnouncementBar() {
  const [rates, setRates] = useState<BullionRates>({
    gold24k: { perGram: 7680, per10Gram: 76800 },
    gold22k: { perGram: 7040, per10Gram: 70400 },
    silver999: { perGram: 93, perKg: 93000 },
  });

  useEffect(() => {
    fetch("/api/bullion-rates")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setRates({
            gold24k: json.data.gold24k,
            gold22k: json.data.gold22k,
            silver999: json.data.silver999,
          });
        }
      })
      .catch((err) => console.warn("Using offline bullion rates:", err));
  }, []);

  const tickerItems = (
    <>
      <div className="flex items-center gap-6 whitespace-nowrap text-xs font-medium px-4">
        {/* Today's 24K Gold Rate */}
        <span className="inline-flex items-center gap-1.5 text-[#F6E7B9] font-semibold">
          <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[#D4AF37]">Today&apos;s 24K Gold:</span>
          <span className="text-white font-mono font-bold bg-[#4A0E17]/60 px-1.5 py-0.5 rounded border border-[#C5A059]/30">
            ₹{rates.gold24k.perGram.toLocaleString("en-IN")}/g
          </span>
          <span className="text-[10px] text-[#E5D7B5] font-normal">
            (₹{rates.gold24k.per10Gram.toLocaleString("en-IN")}/10g)
          </span>
          <TrendingUp className="w-3 h-3 text-emerald-400 inline" />
        </span>

        <span className="text-[#C5A059] font-bold text-xs">◆</span>

        {/* Today's 22K (916) BIS Hallmark Gold Rate */}
        <span className="inline-flex items-center gap-1.5 text-[#F6E7B9] font-semibold">
          <Gem className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[#D4AF37]">22K BIS 916 Hallmark:</span>
          <span className="text-white font-mono font-bold bg-[#4A0E17]/60 px-1.5 py-0.5 rounded border border-[#C5A059]/30">
            ₹{rates.gold22k.perGram.toLocaleString("en-IN")}/g
          </span>
          <span className="text-[10px] text-[#E5D7B5] font-normal">
            (₹{rates.gold22k.per10Gram.toLocaleString("en-IN")}/10g)
          </span>
          <TrendingUp className="w-3 h-3 text-emerald-400 inline" />
        </span>

        <span className="text-[#C5A059] font-bold text-xs">◆</span>

        {/* Today's Silver 999 Rate */}
        <span className="inline-flex items-center gap-1.5 text-slate-100 font-semibold">
          <span className="text-slate-300">Pure Silver 999:</span>
          <span className="text-white font-mono font-bold bg-neutral-800/80 px-1.5 py-0.5 rounded border border-slate-600/30">
            ₹{rates.silver999.perGram.toLocaleString("en-IN")}/g
          </span>
          <span className="text-[10px] text-slate-300 font-normal">
            (₹{rates.silver999.perKg.toLocaleString("en-IN")}/kg)
          </span>
        </span>

        <span className="text-[#C5A059] font-bold text-xs">◆</span>

        {/* Free Insured Express Delivery */}
        <span className="inline-flex items-center gap-1.5 text-amber-100">
          <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Free Insured Express Delivery Across India &amp; UAE (Dubai &amp; Abu Dhabi)</span>
        </span>

        <span className="text-[#C5A059] font-bold text-xs">◆</span>

        {/* BIS Hallmark Purity */}
        <span className="inline-flex items-center gap-1.5 text-amber-100">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Govt. of India BIS Hallmarked with 6-Digit Laser HUID</span>
        </span>

        <span className="text-[#C5A059] font-bold text-xs">◆</span>

        {/* Cash on Delivery with 50% Advance */}
        <span className="inline-flex items-center gap-1.5 text-amber-100">
          <span>Safe 50% Advance Booking with Cash on Delivery</span>
        </span>

        <span className="text-[#C5A059] font-bold text-xs">◆</span>

        {/* WhatsApp Support Callout */}
        <a
          href="https://wa.me/917717595732"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 font-bold transition underline underline-offset-2"
        >
          <Phone className="w-3 h-3 text-emerald-400" />
          <span>WhatsApp Live Rates: +91 77175 95732</span>
        </a>

        <span className="text-[#C5A059] font-bold text-xs">◆</span>
      </div>
    </>
  );

  return (
    <div className="relative w-full bg-gradient-to-r from-[#200408] via-[#380912] to-[#200408] text-amber-100 py-2 border-b border-[#C5A059]/30 overflow-hidden select-none group shadow-inner">
      {/* Visual Ticker Gradient Fade on Left & Right */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#200408] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#200408] to-transparent z-10 pointer-events-none" />

      {/* Smooth Continuous Moving Marquee Container */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {tickerItems}
        {tickerItems}
      </div>
    </div>
  );
}
