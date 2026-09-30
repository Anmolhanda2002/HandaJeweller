"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Gem, ArrowRight } from "lucide-react";
import ProductCard from "../products/ProductCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FeaturedSection({ products = [] }: { products: any[] }) {
  const [activeTab, setActiveTab] = useState<"featured" | "trending" | "new">("featured");

  const filteredProducts = products.filter((p) => {
    if (activeTab === "featured") return p.isFeatured;
    if (activeTab === "trending") return p.isTrending;
    if (activeTab === "new") return p.isNewArrival;
    return true;
  });

  const displayProducts =
    filteredProducts.length > 0 ? filteredProducts.slice(0, 8) : products.slice(0, 8);

  return (
    <section className="py-20 bg-[#FAF8F5] border-b border-[#EAE2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4A0E17]/10 text-[#4A0E17] text-xs font-bold uppercase tracking-widest mb-3 border border-[#4A0E17]/20">
              <Gem className="w-3.5 h-3.5 text-[#C5A059]" /> Iconic Masterpieces
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1615] tracking-tight">
              Curated Royal Showcase
            </h2>
            <p className="text-xs sm:text-sm text-[#5A524C] mt-2">
              Hallmarked pure gold creations, laser-inscribed natural solitaires, and royal polki jewels.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-white border border-[#D9CEBF] p-1.5 rounded-full self-start md:self-auto shadow-xs">
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-5 py-2 text-xs font-bold rounded-full uppercase tracking-wider transition ${
                activeTab === "featured"
                  ? "bg-[#4A0E17] text-white shadow-sm"
                  : "text-[#5A524C] hover:text-[#1A1615]"
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`px-5 py-2 text-xs font-bold rounded-full uppercase tracking-wider transition ${
                activeTab === "trending"
                  ? "bg-[#4A0E17] text-white shadow-sm"
                  : "text-[#5A524C] hover:text-[#1A1615]"
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-5 py-2 text-xs font-bold rounded-full uppercase tracking-wider transition ${
                activeTab === "new"
                  ? "bg-[#4A0E17] text-white shadow-sm"
                  : "text-[#5A524C] hover:text-[#1A1615]"
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#4A0E17] hover:bg-[#2D080E] text-white text-xs font-bold uppercase tracking-widest transition shadow-lg border border-[#C5A059]/40"
          >
            Explore Complete Treasury <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
