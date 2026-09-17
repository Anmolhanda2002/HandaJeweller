"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Tag,
  Lock,
  ArrowRight,
  Truck,
  CreditCard,
  Banknote,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  // Address State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "Delhi",
    postalCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "upi">("cod");

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountValue: number;
    calculatedDiscount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Submission State
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      const defaultAddr =
        user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
      setShippingAddress((prev) => ({
        ...prev,
        fullName: defaultAddr?.fullName || user.name || "",
        phone: defaultAddr?.phone || user.phone || "",
        street: defaultAddr?.street || "",
        city: defaultAddr?.city || "",
        state: defaultAddr?.state || "Delhi",
        postalCode: defaultAddr?.postalCode || "",
      }));
    }
  }, [user]);

  // Pricing Calculations
  const discount = appliedCoupon?.calculatedDiscount || 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const estimatedTax = Math.round(discountedSubtotal * 0.03); // 3% GST
  const freeShipping = discountedSubtotal >= 15000;
  const shippingFee = freeShipping ? 0 : 250;
  const grandTotal = discountedSubtotal + estimatedTax + shippingFee;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidatingCoupon(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponInput.trim(),
          subtotal,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAppliedCoupon(data.data);
      } else {
        setCouponError(data.message || "Invalid coupon");
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      setOrderError("Please complete all shipping address fields.");
      return;
    }

    if (items.length === 0) {
      setOrderError("Your shopping bag is empty.");
      return;
    }

    setIsPlacingOrder(true);
    setOrderError("");

    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          selectedVariant: item.variant,
        })),
        shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod,
        couponCode: appliedCoupon?.code || "",
        customerEmail: user ? user.email : "",
        customerPhone: shippingAddress.phone,
        customerName: shippingAddress.fullName,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success && json.data) {
        clearCart();
        const orderId = json.data.orderId;
        router.push(`/order-success?orderId=${encodeURIComponent(orderId)}`);
      } else {
        setOrderError(json.message || "Failed to create order. Please check stock availability.");
      }
    } catch {
      setOrderError("A network error occurred while creating your order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0 && !isPlacingOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
          Your shopping bag is empty
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Add items to your bag before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="bg-neutral-900 text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50/50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            Checkout & Order Verification
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Certified Royal Delivery • Insured Express Transit
          </p>
        </div>

        {orderError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {orderError}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Columns: Address & Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
                <MapPin className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-semibold text-neutral-900">
                  1. Insured Shipping Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                    }
                    placeholder="e.g. Ananya Sharma"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, phone: e.target.value })
                    }
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-neutral-700 mb-1">
                    Street Address & Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, street: e.target.value })
                    }
                    placeholder="e.g. House No. 42, Defence Colony, Near Market"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, city: e.target.value })
                    }
                    placeholder="e.g. New Delhi"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    State *
                  </label>
                  <select
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, state: e.target.value })
                    }
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-600"
                  >
                    <option value="Delhi">Delhi</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    PIN Code (Postal Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                    }
                    placeholder="e.g. 110024"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value="India"
                    className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
                <CreditCard className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-semibold text-neutral-900">
                  2. Select Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-amber-700 bg-amber-50/40"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className="w-5 h-5 text-amber-700" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-amber-700"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Cash on Delivery</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Pay upon delivery verification</p>
                  </div>
                </label>

                {/* Credit / Debit Card */}
                <label
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition ${
                    paymentMethod === "card"
                      ? "border-amber-700 bg-amber-50/40"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-5 h-5 text-amber-700" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="accent-amber-700"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Credit / Debit Card</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Visa, MasterCard, Amex</p>
                  </div>
                </label>

                {/* UPI / NetBanking */}
                <label
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-4 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition ${
                    paymentMethod === "upi"
                      ? "border-amber-700 bg-amber-50/40"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Sparkles className="w-5 h-5 text-amber-700" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="accent-amber-700"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Instant UPI</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">GPay, PhonePe, Paytm</p>
                  </div>
                </label>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl text-[11px] text-neutral-500 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>All transactions are 256-bit encrypted. Ready for future live Razorpay/Stripe gateways.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review, Coupon & Submit */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
              <h3 className="font-serif text-lg font-bold text-neutral-900">
                Order Review ({items.length})
              </h3>

              {/* Items preview */}
              <div className="max-h-56 overflow-y-auto divide-y divide-neutral-100 pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.product._id}-${item.variant}`}
                    className="py-3 first:pt-0 flex gap-3 items-center"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      <Image
                        src={item.product.images[0] || "/placeholder.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-neutral-900 truncate">
                        {item.product.name}
                      </h5>
                      <p className="text-[11px] text-neutral-500">
                        Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ""}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Box */}
              <div className="pt-4 border-t border-neutral-100">
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-700" /> Apply Coupon Code
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-amber-900">{appliedCoupon.code}</span>
                      <p className="text-[11px] text-amber-700">
                        Saved {formatPrice(appliedCoupon.calculatedDiscount)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10, ROYAL5000"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs uppercase focus:outline-none focus:border-amber-600"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponInput.trim()}
                      className="bg-neutral-900 hover:bg-amber-900 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                    >
                      {isValidatingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-amber-800 font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>- {formatPrice(appliedCoupon.calculatedDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>3% GST (Hallmark Tax)</span>
                  <span className="font-medium text-neutral-900">{formatPrice(estimatedTax)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Insured Express Shipping</span>
                  <span className="font-medium text-neutral-900">
                    {freeShipping ? (
                      <span className="text-emerald-700">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-neutral-200 flex justify-between text-base font-bold text-neutral-900">
                  <span>Grand Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-neutral-300 text-neutral-950 font-semibold py-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 transition"
              >
                {isPlacingOrder ? "Verifying & Placing Order..." : "Confirm & Place Order"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-neutral-400 space-y-1">
                <p>By confirming, you agree to Handa Jeweller Terms of Sale.</p>
                <div className="flex items-center justify-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Insured Delivery Guaranteed
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
