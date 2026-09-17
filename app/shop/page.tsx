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
} from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

interface Category {
  _id: string;
  name: string;
  slug: string;
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
  }, [categoryParam, sortParam, searchParam, minPriceParam, maxPriceParam]);

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
    categoryParam || searchParam || minPriceParam || maxPriceParam || (sortParam && sortParam !== "newest")
  );

  return (
    <div className="bg-neutral-50/50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-neutral-900 font-medium">Fine Jewelry Catalog</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                All Jewelry & Solitaires
              </h1>
              <p className="text-neutral-500 text-xs sm:text-sm mt-1">
                Showing {products.length} certified masterpieces
              </p>
            </div>

            {/* Mobile Filter Trigger & View Toggles */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-700" /> Filters
              </button>

              <div className="hidden sm:flex items-center border border-neutral-200 rounded-xl bg-white p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-neutral-100 text-neutral-900"
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
                      ? "bg-neutral-100 text-neutral-900"
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
                  className="bg-white border border-neutral-200 text-neutral-800 text-xs font-medium rounded-xl px-3.5 py-2 pr-8 focus:outline-none focus:border-amber-600 shadow-sm appearance-none cursor-pointer"
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
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-neutral-200/60">
              <span className="text-xs text-neutral-500 font-medium">Active filters:</span>
              {categoryParam && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-full">
                  Category: {categoryParam}
                  <button onClick={() => updateFilter("category", "")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchParam && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-full">
                  Search: &ldquo;{searchParam}&rdquo;
                  <button onClick={() => updateFilter("q", "")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {minPriceParam && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-full">
                  Min ₹{Number(minPriceParam).toLocaleString("en-IN")}
                  <button onClick={() => updateFilter("minPrice", "")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {maxPriceParam && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-full">
                  Max ₹{Number(maxPriceParam).toLocaleString("en-IN")}
                  <button onClick={() => updateFilter("maxPrice", "")}>
                    <X className="w-3 h-3" />
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => updateFilter("category", "")}
                    className={`w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition ${
                      !categoryParam
                        ? "bg-amber-50 text-amber-900 font-semibold"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <span>All Jewelry</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => updateFilter("category", cat.slug)}
                      className={`w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition ${
                        categoryParam === cat.slug
                          ? "bg-amber-50 text-amber-900 font-semibold"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[11px] text-neutral-400">
                        ({cat.productCount ?? 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-4 border-t border-neutral-100">
                <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">
                  Price Range (₹)
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPriceParam}
                      onChange={(e) => updateFilter("minPrice", e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-600"
                    />
                    <span className="text-neutral-400 text-xs">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPriceParam}
                      onChange={(e) => updateFilter("maxPrice", e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  {/* Preset Price Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2">
                    <button
                      onClick={() => {
                        updateFilter("minPrice", "0");
                        updateFilter("maxPrice", "50000");
                      }}
                      className="text-[11px] bg-neutral-50 hover:bg-amber-50 text-neutral-600 hover:text-amber-900 py-1 px-2 rounded border border-neutral-100 transition"
                    >
                      Under ₹50K
                    </button>
                    <button
                      onClick={() => {
                        updateFilter("minPrice", "50000");
                        updateFilter("maxPrice", "150000");
                      }}
                      className="text-[11px] bg-neutral-50 hover:bg-amber-50 text-neutral-600 hover:text-amber-900 py-1 px-2 rounded border border-neutral-100 transition"
                    >
                      ₹50K - ₹1.5L
                    </button>
                    <button
                      onClick={() => {
                        updateFilter("minPrice", "150000");
                        updateFilter("maxPrice", "300000");
                      }}
                      className="text-[11px] bg-neutral-50 hover:bg-amber-50 text-neutral-600 hover:text-amber-900 py-1 px-2 rounded border border-neutral-100 transition"
                    >
                      ₹1.5L - ₹3L
                    </button>
                    <button
                      onClick={() => {
                        updateFilter("minPrice", "300000");
                        updateFilter("maxPrice", "");
                      }}
                      className="text-[11px] bg-neutral-50 hover:bg-amber-50 text-neutral-600 hover:text-amber-900 py-1 px-2 rounded border border-neutral-100 transition"
                    >
                      Above ₹3L
                    </button>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-500 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 100% Certified Assurance
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every jewel is hallmarked with BIS standards and delivered with insured transit security.
                </p>
              </div>
            </div>
          </aside>

          {/* Product Listing */}
          <div className="lg:col-span-3">
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
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mx-auto mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-1">
                  No jewelry pieces found
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
                  Try adjusting your filters, selecting a different category, or resetting your price range.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-neutral-900 hover:bg-amber-800 text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full transition"
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
              <h3 className="text-base font-semibold text-neutral-900">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-2">
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
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      updateFilter("category", cat.slug);
                      setIsMobileFilterOpen(false);
                    }}
                    className="block w-full text-left text-xs py-1.5 text-neutral-700"
                  >
                    {cat.name}
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
