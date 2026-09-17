"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category?: { name: string; slug: string };
}

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        const json = await res.json();
        if (json.success && json.data?.products) {
          setResults(json.data.products);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center p-4 border-b border-neutral-100">
          <Search className="w-5 h-5 text-neutral-400 ml-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search diamond rings, bridal sets, polki necklaces, solitaires..."
            className="w-full pl-4 pr-10 py-2.5 text-base text-neutral-900 placeholder-neutral-400 focus:outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4">
          {isLoading ? (
            <div className="py-8 text-center text-neutral-500 text-sm animate-pulse">
              Searching royal catalog...
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-2">
                Products ({results.length})
              </div>
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-neutral-50 transition border border-transparent hover:border-neutral-200"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      <Image
                        src={product.images[0] || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-neutral-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-neutral-500">
                        {product.category?.name || "Fine Jewelry"}
                      </p>
                      <span className="text-sm font-semibold text-amber-900">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 text-center">
                <button
                  onClick={handleSearchSubmit}
                  className="text-sm font-medium text-amber-700 hover:text-amber-800 flex items-center justify-center gap-1.5 mx-auto"
                >
                  View all results for &ldquo;{query}&rdquo; <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : query.trim() ? (
            <div className="py-8 text-center text-neutral-500 text-sm">
              No jewelry pieces found matching &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="py-4">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Popular Searches
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {["Solitaire Diamond Ring", "Polki Choker", "Tennis Bracelet", "22K Gold Kadas", "Basra Pearls", "Burmese Ruby"].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="text-xs bg-neutral-100 hover:bg-amber-50 hover:text-amber-900 text-neutral-700 px-3 py-1.5 rounded-full transition"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
