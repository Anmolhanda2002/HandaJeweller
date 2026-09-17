"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart, CartProduct } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToBag = (product: CartProduct) => {
    addToCart(product, "", 1);
    toggleWishlist(product);
  };

  return (
    <div className="bg-neutral-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 mb-8 border-b border-neutral-200">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            My Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Your saved fine jewelry treasures & bespoke aspirations
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 sm:p-16 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-neutral-500 mb-8 leading-relaxed">
              Save your favorite diamond solitaires, gold bangles, and bridal polki necklaces to view or purchase later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-amber-900 text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition shadow-lg"
            >
              Explore Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-neutral-50">
                    <Image
                      src={item.images[0] || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow-sm hover:bg-white transition"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-semibold text-neutral-900 hover:text-amber-800 line-clamp-2 leading-snug"
                    >
                      {item.name}
                    </Link>
                    <div className="text-base font-bold text-neutral-900">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleMoveToBag(item as unknown as CartProduct)}
                    className="w-full bg-neutral-900 hover:bg-amber-900 text-white py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
