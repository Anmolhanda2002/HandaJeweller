"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
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
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Iconic Masterpieces
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
              Curated Royal Showcase
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-full self-start md:self-auto">
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition ${
                activeTab === "featured"
                  ? "bg-white text-neutral-900 shadow-sm font-semibold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition ${
                activeTab === "trending"
                  ? "bg-white text-neutral-900 shadow-sm font-semibold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition ${
                activeTab === "new"
                  ? "bg-white text-neutral-900 shadow-sm font-semibold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-neutral-300 hover:border-amber-700 text-neutral-900 hover:text-amber-800 text-xs font-semibold uppercase tracking-widest transition"
          >
            View Complete Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
