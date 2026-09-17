"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  ctaText?: string;
  ctaUrl?: string;
}

export default function HeroSlider({ initialBanners = [] }: { initialBanners?: Banner[] }) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (initialBanners.length === 0) {
      fetch("/api/banners")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data?.length > 0) {
            setBanners(json.data);
          }
        })
        .catch(console.error);
    }
  }, [initialBanners]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="relative h-[550px] sm:h-[650px] w-full bg-neutral-900 flex items-center justify-center text-center px-4">
        <div className="max-w-2xl text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-widest border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Royal Fine Jewelry 2026
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Discover Treasures of Timeless Brilliance
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base max-w-lg mx-auto">
            100% Certified Hallmarked Gold & GIA Natural Solitaires, handcrafted with three generations of royal heritage.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              href="/shop"
              className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-semibold px-7 py-3 rounded-full text-xs uppercase tracking-widest transition shadow-lg"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative h-[520px] sm:h-[650px] w-full overflow-hidden bg-neutral-950">
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0">
        <Image
          src={currentBanner.image}
          alt={currentBanner.title}
          fill
          priority
          className="object-cover object-center opacity-70 transition-all duration-1000 transform scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-neutral-950/40" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-6 sm:px-12 flex flex-col justify-center">
        <div className="max-w-xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold uppercase tracking-widest border border-amber-500/30 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" /> High Jewelry Maison
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            {currentBanner.title}
          </h1>

          {currentBanner.subtitle && (
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed line-clamp-3">
              {currentBanner.subtitle}
            </p>
          )}

          <div className="pt-2 flex items-center gap-4">
            <Link
              href={currentBanner.ctaUrl || "/shop"}
              className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-semibold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition flex items-center gap-2 shadow-xl shadow-amber-900/30"
            >
              {currentBanner.ctaText || "Explore Catalog"}
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/category/bridal-sets"
              className="hidden sm:inline-flex bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-full text-xs uppercase tracking-widest transition border border-white/20 backdrop-blur-sm"
            >
              Bridal Trousseau
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-neutral-900/60 hover:bg-neutral-900 text-white backdrop-blur-sm transition border border-neutral-700/50"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-neutral-900/60 hover:bg-neutral-900 text-white backdrop-blur-sm transition border border-neutral-700/50"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-8 bg-amber-500" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
