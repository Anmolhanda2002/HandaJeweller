"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  Sparkles,
  RotateCcw,
  LayoutGrid,
  List,
  ShieldCheck,
  Crown,
  Gem,
} from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

interface Category {
  _id: string;
  name: string;
  slug: string;
  categoryType?: "fine" | "artificial";
  productCount?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter states
  const categoryParam = searchParams.get("category") || "";
  const typeParam = searchParams.get("type") || searchParams.get("jewelryType") || "";
  const sortParam = searchParams.get("sort") || "newest";
  const searchParam = searchParams.get("q") || searchParams.get("search") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";

  // Fetch Categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch Products based on searchParams
  useEffect(() => {
    setIsLoading(true);
    const query = new URLSearchParams();
    if (categoryParam) query.set("category", categoryParam);
    if (typeParam) query.set("type", typeParam);
    if (sortParam) query.set("sort", sortParam);
    if (searchParam) query.set("search", searchParam);
    if (minPriceParam) query.set("minPrice", minPriceParam);
    if (maxPriceParam) query.set("maxPrice", maxPriceParam);

    fetch(`/api/products?${query.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.products) {
          setProducts(json.data.products);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [categoryParam, typeParam, sortParam, searchParam, minPriceParam, maxPriceParam]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/shop");
  };

  const hasActiveFilters = Boolean(
    categoryParam || typeParam || searchParam || minPriceParam || maxPriceParam || (sortParam && sortParam !== "newest")
  );

  // Filtered categories based on selected line if desired
  const displayedCategories = typeParam
    ? categories.filter((c) => !c.categoryType || c.categoryType === typeParam)
    : categories;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#4A0E17] font-semibold">Jewellery Catalog</span>
            {typeParam && (
              <>
                <span>/</span>
                <span className="capitalize text-neutral-800 font-medium">
                  {typeParam === "fine" ? "Fine Gold & Solitaires" : "Artificial & Fashion Jewellery"}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1615] tracking-tight">
                {typeParam === "fine"
                  ? "Fine Certified Gold & Solitaires"
                  : typeParam === "artificial"
                  ? "Royal Fashion & Artificial Jewellery"
                  : "All Jewellery & Certified Masterpieces"}
              </h1>
              <p className="text-[#5A524C] text-xs sm:text-sm mt-1">
                Showing {products.length} certified creations with insured door delivery
              </p>
            </div>

            {/* Mobile Filter Trigger & View Toggles */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-[#E7DFD3] rounded-xl text-xs font-semibold text-neutral-800 shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#8C6D23]" /> Filters
              </button>

              <div className="hidden sm:flex items-center border border-[#E7DFD3] rounded-xl bg-white p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-[#FAF8F5] text-[#4A0E17] font-bold"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-[#FAF8F5] text-[#4A0E17] font-bold"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sorting Select */}
              <div className="relative">
                <select
                  value={sortParam}
                  onChange={(e) => updateFilter("sort", e.target.value)}
                  className="bg-white border border-[#E7DFD3] text-neutral-800 text-xs font-medium rounded-xl px-3.5 py-2 pr-8 focus:outline-none focus:border-[#C5A059] shadow-sm appearance-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#EAE2D5]">
              <span className="text-xs text-neutral-500 font-medium">Active filters:</span>
              {typeParam && (
                <span className="inline-flex items-center gap-1.5 bg-[#4A0E17]/10 text-[#4A0E17] border border-[#4A0E17]/20 text-xs px-2.5 py-1 rounded-full font-medium">
                  Line: {typeParam === "fine" ? "Fine Jewellery" : "Artificial Jewellery"}
                  <button onClick={() => updateFilter("type", "")} aria-label="Remove Line Filter">
                    <X className="w-3 h-3 hover:text-rose-600" />
                  </button>
                </span>
              )}
              {categoryParam && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-medium">
                  Category: {categoryParam}
                  <button onClick={() => updateFilter("category", "")} aria-label="Remove Category Filter">
                    <X className="w-3 h-3 hover:text-rose-600" />
                  </button>
                </span>
              )}
              {searchParam && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-medium">
                  Search: &ldquo;{searchParam}&rdquo;
                  <button onClick={() => updateFilter("q", "")} aria-label="Remove Search Filter">
                    <X className="w-3 h-3 hover:text-rose-600" />
                  </button>
                </span>
              )}
              {minPriceParam && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-medium">
                  Min ₹{Number(minPriceParam).toLocaleString("en-IN")}
                  <button onClick={() => updateFilter("minPrice", "")} aria-label="Remove Min Price">
                    <X className="w-3 h-3 hover:text-rose-600" />
                  </button>
                </span>
              )}
              {maxPriceParam && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-medium">
                  Max ₹{Number(maxPriceParam).toLocaleString("en-IN")}
                  <button onClick={() => updateFilter("maxPrice", "")} aria-label="Remove Max Price">
                    <X className="w-3 h-3 hover:text-rose-600" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium ml-2 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear all
              </button>
            </div>
          )}
        </div>

        {/* Main Grid: Sidebar Filters + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Sidebar Filters - Sticky and locked; ONLY products scroll */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-24 self-start">
            <div className="bg-white p-5 rounded-2xl border border-[#E7DFD3] shadow-sm space-y-5 max-h-[calc(100vh-7.5rem)] overflow-y-auto no-scrollbar">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C6D23]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1A1615]">
                    Filters
                  </span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] font-semibold text-rose-600 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Jewellery Line Filter */}
              <div>
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5">
                  Jewellery Line
                </h3>
                <div className="grid grid-cols-3 gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#EAE2D5]">
                  <button
                    onClick={() => updateFilter("type", "")}
                    className={`text-[11px] font-semibold py-1.5 px-1 rounded-lg transition text-center truncate ${
                      !typeParam
                        ? "bg-[#4A0E17] text-white shadow-sm"
                        : "text-[#5A524C] hover:text-[#1A1615]"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => updateFilter("type", "fine")}
                    className={`text-[11px] font-semibold py-1.5 px-1 rounded-lg transition text-center truncate flex items-center justify-center gap-1 ${
                      typeParam === "fine"
                        ? "bg-[#4A0E17] text-white shadow-sm"
                        : "text-[#5A524C] hover:text-[#1A1615]"
                    }`}
                  >
                    <Crown className="w-3 h-3 text-[#C5A059]" /> Fine
                  </button>
                  <button
                    onClick={() => updateFilter("type", "artificial")}
                    className={`text-[11px] font-semibold py-1.5 px-1 rounded-lg transition text-center truncate flex items-center justify-center gap-1 ${
                      typeParam === "artificial"
                        ? "bg-[#4A0E17] text-white shadow-sm"
                        : "text-[#5A524C] hover:text-[#1A1615]"
                    }`}
                  >
                    <Gem className="w-3 h-3 text-[#C5A059]" /> Fashion
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Categories
                  </h3>
                  {categoryParam && (
                    <button
                      onClick={() => updateFilter("category", "")}
                      className="text-[10px] text-rose-600 hover:underline"
                    >
                      All
                    </button>
                  )}
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto no-scrollbar pr-1">
                  <button
                    onClick={() => updateFilter("category", "")}
                    className={`w-full flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg transition ${
                      !categoryParam
                        ? "bg-[#4A0E17] text-white font-semibold shadow-sm"
                        : "text-neutral-600 hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <span>All Categories</span>
                  </button>
                  {displayedCategories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => updateFilter("category", cat.slug)}
                      className={`w-full flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg transition ${
                        categoryParam === cat.slug
                          ? "bg-[#4A0E17] text-white font-semibold shadow-sm"
                          : "text-neutral-600 hover:bg-[#FAF8F5]"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span
                        className={`text-[11px] ml-1 flex-shrink-0 ${
                          categoryParam === cat.slug ? "text-amber-200" : "text-neutral-400"
                        }`}
                      >
                        ({cat.productCount ?? 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-3 border-t border-[#F0EAE1]">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2.5">
                  Price Range (₹)
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min ₹"
                      value={minPriceParam}
                      onChange={(e) => updateFilter("minPrice", e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E7DFD3] rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-[#C5A059]"
                    />
                    <span className="text-neutral-400 text-xs">to</span>
                    <input
                      type="number"
                      placeholder="Max ₹"
                      value={maxPriceParam}
                      onChange={(e) => updateFilter("maxPrice", e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E7DFD3] rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  {/* Preset Price Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        updateFilter("minPrice", "0");
                        updateFilter("maxPrice", "50000");
                      }}
                      className="text-[11px] bg-[#FAF8F5] hover:bg-amber-50 text-neutral-700 hover:text-amber-900 py-1 px-2 rounded-lg border border-[#E7DFD3] transition font-medium text-center"
                    >
                      Under ₹50K
                    </button>
                    <button
                      onClick={() => {
                        updateFilter("minPrice", "50000");
                        updateFilter("maxPrice", "150000");
                      }}
                      className="text-[11px] bg-[#FAF8F5] hover:bg-amber-50 text-neutral-700 hover:text-amber-900 py-1 px-2 rounded-lg border border-[#E7DFD3] transition font-medium text-center"
                    >
                      ₹50K - ₹1.5L
                    </button>
                    <button
                      onClick={() => {
                        updateFilter("minPrice", "150000");
                        updateFilter("maxPrice", "300000");
                      }}
                      className="text-[11px] bg-[#FAF8F5] hover:bg-amber-50 text-neutral-700 hover:text-amber-900 py-1 px-2 rounded-lg border border-[#E7DFD3] transition font-medium text-center"
                    >
                      ₹1.5L - ₹3L
                    </button>
                    <button
                      onClick={() => {
                        updateFilter("minPrice", "300000");
                        updateFilter("maxPrice", "");
                      }}
                      className="text-[11px] bg-[#FAF8F5] hover:bg-amber-50 text-neutral-700 hover:text-amber-900 py-1 px-2 rounded-lg border border-[#E7DFD3] transition font-medium text-center"
                    >
                      Above ₹3L
                    </button>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="pt-3 border-t border-[#F0EAE1] text-xs text-[#5A524C] space-y-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE2D5]">
                <div className="flex items-center gap-1.5 text-[#4A0E17] font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Certified Assurance</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#6E645D]">
                  Every gold creation is BIS 916 Hallmarked. Insured express delivery with tamper-proof security box.
                </p>
              </div>
            </div>
          </aside>

          {/* Product Listing - The only scrolling area on desktop */}
          <div className="lg:col-span-3 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-neutral-100 p-4 space-y-3 animate-pulse"
                  >
                    <div className="aspect-[4/4.5] bg-neutral-200 rounded-xl" />
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-4 bg-neutral-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E7DFD3] p-12 text-center">
                <div className="w-16 h-16 bg-[#FAF8F5] rounded-full flex items-center justify-center text-[#8C6D23] mx-auto mb-4 border border-[#EAE2D5]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-base font-serif font-bold text-neutral-900 mb-1">
                  No jewelry pieces found
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
                  Try adjusting your filters, selecting a different category, or resetting your price range.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#4A0E17] hover:bg-[#380A11] text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full transition shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-base font-serif font-bold text-neutral-900">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Line Filter */}
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Jewellery Line
              </h4>
              <div className="grid grid-cols-3 gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#EAE2D5]">
                <button
                  onClick={() => {
                    updateFilter("type", "");
                    setIsMobileFilterOpen(false);
                  }}
                  className={`text-xs py-1.5 rounded-lg ${!typeParam ? "bg-[#4A0E17] text-white font-bold" : "text-neutral-600"}`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    updateFilter("type", "fine");
                    setIsMobileFilterOpen(false);
                  }}
                  className={`text-xs py-1.5 rounded-lg ${typeParam === "fine" ? "bg-[#4A0E17] text-white font-bold" : "text-neutral-600"}`}
                >
                  Fine
                </button>
                <button
                  onClick={() => {
                    updateFilter("type", "artificial");
                    setIsMobileFilterOpen(false);
                  }}
                  className={`text-xs py-1.5 rounded-lg ${typeParam === "artificial" ? "bg-[#4A0E17] text-white font-bold" : "text-neutral-600"}`}
                >
                  Fashion
                </button>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Categories
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    updateFilter("category", "");
                    setIsMobileFilterOpen(false);
                  }}
                  className="block w-full text-left text-xs py-1.5 text-neutral-700 font-medium"
                >
                  All Categories
                </button>
                {displayedCategories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      updateFilter("category", cat.slug);
                      setIsMobileFilterOpen(false);
                    }}
                    className="block w-full text-left text-xs py-1.5 text-neutral-700"
                  >
                    {cat.name} ({cat.productCount ?? 0})
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                clearAllFilters();
                setIsMobileFilterOpen(false);
              }}
              className="w-full py-2.5 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading fine jewelry collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}
