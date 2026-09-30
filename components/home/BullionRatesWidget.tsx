"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Crown,
  Gem,
  TrendingUp,
  Clock,
  ShieldCheck,
  Phone,
  ArrowRight,
} from "lucide-react";

interface BullionData {
  gold24k: {
    karat: string;
    perGram: number;
    per10Gram: number;
    purity: string;
    hallmark: string;
    change: string;
  };
  gold22k: {
    karat: string;
    perGram: number;
    per10Gram: number;
    purity: string;
    hallmark: string;
    change: string;
  };
  gold18k: {
    karat: string;
    perGram: number;
    per10Gram: number;
    purity: string;
    hallmark: string;
    change: string;
  };
  silver999: {
    metal: string;
    perGram: number;
    perKg: number;
    purity: string;
    hallmark: string;
    change: string;
  };
  ratesLastUpdated: string;
  benchmark: string;
}

export default function BullionRatesWidget() {
  const [data, setData] = useState<BullionData>({
    gold24k: {
      karat: "24K",
      perGram: 7680,
      per10Gram: 76800,
      purity: "99.9% Pure Investment Bullion",
      hallmark: "BIS Standard Bullion",
      change: "+₹35/g",
    },
    gold22k: {
      karat: "22K",
      perGram: 7040,
      per10Gram: 70400,
      purity: "91.6% Pure Ornaments (BIS 916)",
      hallmark: "100% BIS Hallmarked with HUID",
      change: "+₹30/g",
    },
    gold18k: {
      karat: "18K",
      perGram: 5760,
      per10Gram: 57600,
      purity: "75.0% Fine Diamond Jewelry",
      hallmark: "BIS Hallmarked 750",
      change: "+₹25/g",
    },
    silver999: {
      metal: "Silver 999",
      perGram: 93,
      perKg: 93000,
      purity: "99.9% Pure Chandi Bars & Coins",
      hallmark: "Certified 999 Purity",
      change: "+₹0.80/g",
    },
    ratesLastUpdated: new Date().toISOString(),
    benchmark: "North India (Punjab) / MCX Daily Spot Rate",
  });

  useEffect(() => {
    fetch("/api/bullion-rates")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
      })
      .catch((err) => console.warn("Failed to load live bullion rates:", err));
  }, []);

  const formattedDate = new Date(data.ratesLastUpdated).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="py-14 bg-[#FAF6F0] border-y border-[#EAE2D5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Live Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A0E17]/10 text-[#4A0E17] text-xs font-bold uppercase tracking-wider mb-2 border border-[#4A0E17]/20">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Bullion Treasury Benchmark
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1615] tracking-tight">
              Today&apos;s Gold &amp; Silver Benchmark Rates
            </h2>
            <p className="text-xs sm:text-sm text-[#5A524C] mt-1 font-medium">
              Official Spot Benchmark &bull; Direct From Handa Jeweller Treasury &bull; BIS 916 Guaranteed
            </p>
          </div>

          {/* Timestamp & Benchmark Note */}
          <div className="flex items-center gap-3 text-xs text-[#5A524C] bg-white px-4 py-2.5 rounded-2xl border border-[#D9CEBF] shadow-xs">
            <Clock className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
            <div>
              <span className="font-bold text-[#1A1615] block">
                Benchmark Date: {formattedDate}
              </span>
              <span className="text-[11px] text-[#786E65] block">
                {data.benchmark}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Rates Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: 24K Gold */}
          <div className="bg-white rounded-3xl p-5 border border-[#E7DFD3] shadow-xs hover:border-[#C5A059] hover:shadow-lg transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-amber-100/90 text-amber-900 flex items-center justify-center border border-amber-200">
                    <Crown className="w-4 h-4 text-[#8C6D23]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#1A1615] text-sm">
                      Gold 24 Karat
                    </h3>
                    <span className="text-[10px] text-[#786E65] font-semibold">
                      99.9% Pure Sovereign
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <TrendingUp className="w-3 h-3 text-emerald-600" /> {data.gold24k.change}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F2ECE3]">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#5A524C] font-semibold">Per 1 Gram:</span>
                  <span className="font-serif text-2xl font-bold text-[#1A1615]">
                    ₹{data.gold24k.perGram.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1 text-xs text-[#5A524C]">
                  <span className="font-medium">Per 10 Grams:</span>
                  <span className="font-mono font-bold text-[#1A1615]">
                    ₹{data.gold24k.per10Gram.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-[#EAE2D5] text-[11px] text-[#5A524C] flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
              <span>Investment Minted Bars &amp; Coins</span>
            </div>
          </div>

          {/* Card 2: 22K Gold (BIS 916) */}
          <div className="bg-white rounded-3xl p-5 border-2 border-[#C5A059] bg-gradient-to-b from-amber-50/30 via-white to-white shadow-md hover:shadow-xl transition-all group flex flex-col justify-between relative overflow-hidden">
            <span className="absolute -top-6 -right-6 w-16 h-16 bg-[#C5A059]/15 rounded-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center font-bold text-xs shadow-xs">
                    <Gem className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#1A1615] text-sm flex items-center gap-1.5">
                      Gold 22 Karat
                      <span className="text-[9px] bg-[#4A0E17] text-[#D4AF37] font-bold px-2 py-0.5 rounded-full uppercase border border-[#C5A059]/40">
                        BIS 916
                      </span>
                    </h3>
                    <span className="text-[10px] text-[#8C6D23] font-bold">
                      Standard Fine Ornaments
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <TrendingUp className="w-3 h-3 text-emerald-600" /> {data.gold22k.change}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F2ECE3]">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#5A524C] font-semibold">Per 1 Gram:</span>
                  <span className="font-serif text-2xl font-bold text-[#4A0E17]">
                    ₹{data.gold22k.perGram.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1 text-xs text-[#5A524C]">
                  <span className="font-medium">Per 10 Grams:</span>
                  <span className="font-mono font-bold text-[#1A1615]">
                    ₹{data.gold22k.per10Gram.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-[#C5A059]/40 text-[11px] text-[#4A0E17] flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>100% BIS Hallmarked with HUID</span>
            </div>
          </div>

          {/* Card 3: 18K Gold */}
          <div className="bg-white rounded-3xl p-5 border border-[#E7DFD3] shadow-xs hover:border-[#C5A059] hover:shadow-lg transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-xs border border-stone-200">
                    18K
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#1A1615] text-sm">
                      Gold 18 Karat
                    </h3>
                    <span className="text-[10px] text-[#786E65] font-semibold">
                      75.0% Purity (BIS 750)
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <TrendingUp className="w-3 h-3 text-emerald-600" /> {data.gold18k.change}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F2ECE3]">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#5A524C] font-semibold">Per 1 Gram:</span>
                  <span className="font-serif text-2xl font-bold text-[#1A1615]">
                    ₹{data.gold18k.perGram.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1 text-xs text-[#5A524C]">
                  <span className="font-medium">Per 10 Grams:</span>
                  <span className="font-mono font-bold text-[#1A1615]">
                    ₹{data.gold18k.per10Gram.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-[#EAE2D5] text-[11px] text-[#5A524C] flex items-center gap-1.5 font-medium">
              <Gem className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
              <span>Natural Solitaires &amp; Diamond Rings</span>
            </div>
          </div>

          {/* Card 4: Silver 999 */}
          <div className="bg-white rounded-3xl p-5 border border-[#E7DFD3] shadow-xs hover:border-[#C5A059] hover:shadow-lg transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                    AG
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#1A1615] text-sm">
                      Fine Silver 999
                    </h3>
                    <span className="text-[10px] text-[#786E65] font-semibold">
                      99.9% Pure Chandi
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <TrendingUp className="w-3 h-3 text-emerald-600" /> {data.silver999.change}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F2ECE3]">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#5A524C] font-semibold">Per 1 Gram:</span>
                  <span className="font-serif text-2xl font-bold text-[#1A1615]">
                    ₹{data.silver999.perGram.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1 text-xs text-[#5A524C]">
                  <span className="font-medium">Per 1 Kilogram:</span>
                  <span className="font-mono font-bold text-[#1A1615]">
                    ₹{data.silver999.perKg.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-[#EAE2D5] text-[11px] text-[#5A524C] flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span>Chandi Utensils, Coins &amp; Payals</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Row: Inquire or Lock In on WhatsApp */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white border border-[#E7DFD3] text-xs shadow-xs">
          <div className="flex items-center gap-2 text-[#5A524C]">
            <span className="font-bold text-[#1A1615]">Transparent Bullion Standard:</span>
            <span>All jewelry purchases carry individual hallmark certificates, net gold weights, and live spot rate conversions.</span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href={`https://wa.me/917717595732?text=${encodeURIComponent(
                `Namaste Handa Jeweller! I want to inquire about today's 22K/24K gold rates and lock in an order.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" /> Lock Rate on WhatsApp
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#4A0E17] hover:bg-[#2D080E] text-white font-bold transition shadow-sm"
            >
              Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
