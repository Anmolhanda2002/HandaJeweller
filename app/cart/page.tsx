"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeFromCart, clearCart } =
    useCart();

  const FREE_SHIPPING_THRESHOLD = 15000;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping ? 0 : 250;
  const estimatedTax = Math.round(subtotal * 0.03); // 3% GST
  const grandTotal = subtotal + estimatedTax + shippingFee;

  return (
    <div className="bg-neutral-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-200">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
              Your Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              {itemCount} certified royal {itemCount === 1 ? "treasure" : "treasures"}
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-neutral-500 hover:text-rose-600 font-medium transition"
            >
              Clear Bag
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 sm:p-16 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs text-neutral-500 mb-8 leading-relaxed">
              Explore our curated selection of BIS hallmarked gold, diamond solitaires, and antique polki bridal jewelry.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-amber-900 text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition shadow-lg"
            >
              Explore Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Bag Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden shadow-sm">
                {items.map((item) => (
                  <div
                    key={`${item.product._id}-${item.variant}`}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100 flex-shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder.png"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-sm sm:text-base font-semibold text-neutral-900 hover:text-amber-800 transition line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        {item.variant && (
                          <p className="text-xs text-neutral-500 bg-neutral-100 inline-block px-2.5 py-0.5 rounded-md">
                            {item.variant}
                          </p>
                        )}
                        <p className="text-xs text-neutral-400">
                          Unit: {formatPrice(item.product.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.variant,
                              item.quantity - 1
                            )
                          }
                          className="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-l-xl"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.variant,
                              item.quantity + 1
                            )
                          }
                          className="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-r-xl"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="text-sm sm:text-base font-bold text-neutral-900 min-w-[100px] text-right">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product._id, item.variant)}
                        className="p-2 text-neutral-400 hover:text-rose-600 transition"
                        title="Remove from bag"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free Shipping Alert Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-900">
                <Truck className="w-5 h-5 text-amber-700 flex-shrink-0" />
                {isFreeShipping ? (
                  <span>
                    <strong>Complimentary Express Insured Delivery</strong> is applied to your order!
                  </span>
                ) : (
                  <span>
                    Add <strong>{formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> more to qualify for Free Insured Express Delivery.
                  </span>
                )}
              </div>
            </div>

            {/* Order Summary Card */}
            <div>
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-5 sticky top-28">
                <h2 className="font-serif text-xl font-bold text-neutral-900">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-neutral-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated 3% GST</span>
                    <span className="font-semibold text-neutral-900">
                      {formatPrice(estimatedTax)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Insured Shipping Fee</span>
                    <span className="font-semibold text-neutral-900">
                      {isFreeShipping ? (
                        <span className="text-emerald-700">FREE</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex justify-between text-base font-bold text-neutral-900">
                    <span>Total Due</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-neutral-900 hover:bg-amber-900 text-white py-4 rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-4 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>100% Certified Hallmarked Gold</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Discreet Tamper-Proof Luxury Packaging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
