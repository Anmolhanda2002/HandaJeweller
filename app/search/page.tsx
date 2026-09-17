"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setQuery(initialQuery);
    if (!initialQuery.trim()) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(`/api/products?search=${encodeURIComponent(initialQuery)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.products) {
          setProducts(json.data.products);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="bg-neutral-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header Form */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight mb-4">
            Search Royal Jewels
          </h1>
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by jewelry style, diamond, gold purity, or SKU..."
              className="w-full bg-white border border-neutral-300 rounded-full pl-6 pr-32 py-3.5 text-sm text-neutral-900 focus:outline-none focus:border-amber-600 shadow-md"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-neutral-900 hover:bg-amber-900 text-white px-6 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition"
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>
          </form>

          {initialQuery && (
            <p className="text-xs text-neutral-500 mt-4">
              {isLoading
                ? "Searching catalog..."
                : `Showing ${products.length} results for "${initialQuery}"`}
            </p>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900 mb-1">
              No results found for &ldquo;{initialQuery}&rdquo;
            </h3>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              Check for spelling mistakes, try more general terms such as &ldquo;Ring&rdquo; or &ldquo;Necklace&rdquo;, or explore our curated collections.
            </p>
            <button
              onClick={() => router.push("/shop")}
              className="bg-neutral-900 text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-amber-800 transition"
            >
              Browse All Collections
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
