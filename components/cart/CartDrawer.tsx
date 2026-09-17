"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 15000;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              <h2 className="text-lg font-semibold text-neutral-900">
                Shopping Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-amber-50/70 px-5 py-3 border-b border-amber-100">
            <div className="flex items-center gap-2 text-xs text-amber-900 font-medium mb-1.5">
              <Truck className="w-4 h-4 text-amber-700" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-amber-800">{formatPrice(remainingForFreeShipping)}</strong> more for FREE Insured Express Delivery!
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold">
                  🎉 Congratulations! You qualify for Free Insured Express Delivery!
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-neutral-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-medium text-neutral-900 mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mb-6">
                  Explore our handcrafted diamond & gold collections to discover timeless royal treasures.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="bg-neutral-900 text-white text-xs tracking-wider uppercase px-6 py-2.5 rounded-full font-medium hover:bg-amber-800 transition"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.product._id}-${item.variant}`} className="pt-4 first:pt-0 flex gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100 flex-shrink-0">
                    <Image
                      src={item.product.images[0] || "/placeholder.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="text-sm font-medium text-neutral-900 hover:text-amber-800 line-clamp-1 transition"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product._id, item.variant)}
                          className="text-neutral-400 hover:text-rose-600 transition p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.variant && (
                        <span className="inline-block text-[11px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md mt-1">
                          {item.variant}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.variant, item.quantity - 1)}
                          className="p-1 hover:bg-white text-neutral-600 rounded-l-md transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-semibold px-2 text-neutral-900 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.variant, item.quantity + 1)}
                          className="p-1 hover:bg-white text-neutral-600 rounded-r-md transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-neutral-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-semibold text-neutral-900 text-base">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Taxes, insurance and coupons calculated during checkout.
              </p>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full bg-neutral-900 hover:bg-amber-900 text-white py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition duration-200"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center transition"
                >
                  View Full Bag
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
