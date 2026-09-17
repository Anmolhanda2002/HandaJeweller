"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Camera,
  ShieldCheck,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import VirtualTryOnModal from "@/components/virtual-try-on/VirtualTryOnModal";
import { JewelleryProduct, TryOnCategory } from "@/components/virtual-try-on/types";

export default function TryOnSalonPage() {
  const [products, setProducts] = useState<JewelleryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<JewelleryProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadTryOnProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/products?limit=50");
        const json = await res.json();
        if (json.success && Array.isArray(json.data.products)) {
          // Filter items that have tryOnEnabled or tryOn assetUrl
          const items: JewelleryProduct[] = json.data.products
            .filter((p: any) => p.tryOnEnabled || p.tryOn?.assetUrl)
            .map((p: any) => ({
              _id: p._id,
              name: p.name,
              slug: p.slug,
              price: p.price,
              compareAtPrice: p.compareAtPrice,
              images: p.images || [],
              category: p.category,
              tryOnEnabled: p.tryOnEnabled,
              tryOn: p.tryOn,
            }));
          setProducts(items);
          if (items.length > 0 && !selectedProduct) {
            setSelectedProduct(items[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch try-on items:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTryOnProducts();
  }, []);

  const categories = [
    { id: "all", label: "All Masterpieces", icon: "✨" },
    { id: "ring", label: "Solitaires & Rings", icon: "💍" },
    { id: "necklace", label: "Necklaces & Chokers", icon: "👑" },
    { id: "earring", label: "Earrings & Jhumkis", icon: "💎" },
    { id: "bangle", label: "Bangles & Bracelets", icon: "🌟" },
    { id: "maang-tikka", label: "Maang Tikka & Headwear", icon: "🪞" },
  ];

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.tryOn?.category === activeCategory);

  const handleLaunchTryOn = (prod: JewelleryProduct) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  const getTrackingLabel = (category?: string) => {
    switch (category) {
      case "ring":
        return "Hand & Ring-Finger Vision";
      case "necklace":
        return "Neck Curve & Chest Tracking";
      case "bangle":
      case "bracelet":
        return "Wrist Contour Tracking";
      case "earring":
        return "Dual-Earlobe 3D Estimation";
      case "maang-tikka":
        return "Forehead & Hairline Anchor";
      default:
        return "Facial Landmark Vision";
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-stone-100 font-sans selection:bg-amber-600/30 selection:text-amber-200">
      {/* 1. Hero Atelier Section */}
      <section className="relative overflow-hidden border-b border-stone-800/80 pt-16 pb-20 md:py-24">
        {/* Ambient golden glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-amber-600/15 via-amber-900/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 border border-amber-600/30 text-amber-300 text-xs font-serif uppercase tracking-widest mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Next-Gen Computer Vision Atelier</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 leading-tight">
            Handa Jeweller <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">Virtual Atelier</span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-stone-400 leading-relaxed font-light">
            Experience our certified solitaires, royal chokers, polki earrings, and handcrafted bangles in real time through your camera. Zero downloads, completely private, and powered by precision AI vision.
          </p>

          {/* Quick Stats / Highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-stone-400 border-t border-stone-800/60 pt-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>100% Client-Side Privacy (No video saved)</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Live Dual-Camera Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Free AI First + Seamless AR Fallback</span>
            </div>
          </div>

          {/* Featured Instant Launch Button */}
          {selectedProduct && (
            <div className="mt-10">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-serif text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-neutral-950 hover:brightness-110 shadow-xl shadow-amber-950/40 transition-all duration-300 active:scale-95"
              >
                <Camera className="w-5 h-5 text-neutral-950 transition-transform group-hover:scale-110" />
                <span>Launch Live Try-On Studio</span>
                <span className="text-xs opacity-75 font-sans font-medium">({filteredProducts.length} Pieces Ready)</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. Category Filter Bar */}
      <section className="sticky top-16 z-30 bg-[#0E0C0A]/95 backdrop-blur-md border-b border-stone-800/80 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-amber-600 text-neutral-950 font-bold shadow-md shadow-amber-900/30"
                      : "bg-stone-900/70 text-stone-400 hover:text-stone-200 hover:bg-stone-800/80 border border-stone-800"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Products Catalog Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-800">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
              {categories.find((c) => c.id === activeCategory)?.label || "Masterpieces"}
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Select any piece below to instantly mirror it onto your camera.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400/80 bg-stone-900 border border-stone-800 px-3 py-1 rounded-lg">
            {filteredProducts.length} {filteredProducts.length === 1 ? "Piece" : "Pieces"}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-stone-900/40 rounded-2xl border border-stone-800 h-96 animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-stone-900/30 rounded-3xl border border-stone-800/80 p-8">
            <Sparkles className="w-12 h-12 text-stone-600 mx-auto mb-4" />
            <h3 className="font-serif text-lg text-stone-300 font-semibold">
              No products found in this category
            </h3>
            <p className="text-xs text-stone-500 mt-2 max-w-sm mx-auto">
              Try choosing another collection above or explore all fine jewelry masterpieces.
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="mt-6 px-4 py-2 rounded-xl bg-amber-600 text-neutral-950 text-xs font-bold"
            >
              Show All Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <div
                key={prod._id}
                className="group relative bg-stone-900/60 rounded-2xl border border-stone-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-amber-950/20"
              >
                {/* Product Image Frame */}
                <div className="relative aspect-[4/4.5] w-full bg-stone-950 overflow-hidden">
                  <Image
                    src={prod.images[0] || "/placeholder.png"}
                    alt={prod.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-60" />

                  {/* Tracking Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-stone-950/85 backdrop-blur-md border border-amber-600/30 text-amber-300">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {getTrackingLabel(prod.tryOn?.category)}
                    </span>
                  </div>

                  {/* Quick Try On Hover Trigger */}
                  <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 gap-3">
                    <button
                      type="button"
                      onClick={() => handleLaunchTryOn(prod)}
                      className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-serif text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Try It On Live</span>
                    </button>
                    <Link
                      href={`/products/${prod.slug}`}
                      className="text-xs text-stone-300 hover:text-white flex items-center gap-1"
                    >
                      <span>View Specifications</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Details Card */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-stone-100 group-hover:text-amber-300 transition line-clamp-1">
                      {prod.name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span className="text-lg font-bold text-stone-100">
                        {formatPrice(prod.price)}
                      </span>
                      {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                        <span className="text-xs text-stone-500 line-through">
                          {formatPrice(prod.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-4 mt-4 border-t border-stone-800/80 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleLaunchTryOn(prod)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-amber-600 hover:text-neutral-950 text-stone-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:text-neutral-950" />
                      <span>AR Try-On</span>
                    </button>
                    <Link
                      href={`/products/${prod.slug}`}
                      className="p-2.5 rounded-xl bg-stone-800/60 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Atelier Architecture & Trust Banner */}
      <section className="border-t border-stone-800/80 bg-stone-950/60 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
              The Handa Virtual Atelier Experience
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-2">
              Combining 40 years of royal heritage with browser-native computer vision algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="bg-stone-900/40 p-6 rounded-2xl border border-stone-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-stone-100 text-base mb-2">1. Select Any Piece</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Browse through certified solitaires, diamond chokers, jhumkis, and bridal kadas crafted to millimeter perfection.
              </p>
            </div>

            <div className="bg-stone-900/40 p-6 rounded-2xl border border-stone-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-stone-100 text-base mb-2">2. Real-Time Vision Tracking</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                478 facial landmarks and 21 hand joints track head yaw, neck contour, and finger positions without sending video feeds to any server.
              </p>
            </div>

            <div className="bg-stone-900/40 p-6 rounded-2xl border border-stone-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-stone-100 text-base mb-2">3. Snap & Order Confidently</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Take high-res portrait snapshots, share with your bridal party or family, and add directly to your shopping bag with 1 click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Active Try-On Modal */}
      <VirtualTryOnModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialProduct={selectedProduct}
      />
    </div>
  );
}
