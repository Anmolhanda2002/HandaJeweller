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
  CreditCard,
  Banknote,
  MapPin,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";

// Complete 28 States & 8 Union Territories of India
const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

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
    state: "Punjab",
    postalCode: "",
    country: "India",
  });

  // Mobile OTP Verification State
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpNotice, setOtpNotice] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Payment Selection: "cod" (50% Advance Online + 50% on Delivery) OR "razorpay" (100% Full Payment)
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);

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

  // Load Razorpay Checkout SDK Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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
        state: defaultAddr?.state || "Punjab",
        postalCode: defaultAddr?.postalCode || "",
      }));

      if (user.phone && user.phone.length >= 10) {
        setIsOtpVerified(true);
      }
    }
  }, [user]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Pricing Calculations
  const discount = appliedCoupon?.calculatedDiscount || 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const estimatedTax = Math.round(discountedSubtotal * 0.03); // 3% BIS Hallmark GST
  const freeShipping = discountedSubtotal >= 15000;
  const shippingFee = freeShipping ? 0 : 250;
  const grandTotal = discountedSubtotal + estimatedTax + shippingFee;

  // 50% Advance calculation for Cash on Delivery
  const advancePaymentAmount = Math.round(grandTotal * 0.5);
  const balancePaymentAmount = grandTotal - advancePaymentAmount;

  // Send Mobile OTP
  const handleSendOtp = async () => {
    const rawDigits = shippingAddress.phone.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(rawDigits)) {
      setOtpError("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    setIsSendingOtp(true);
    setOtpError("");
    setOtpNotice("");

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: rawDigits }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOtpSent(true);
        setResendTimer(30);
        if (data.data?.testOtp) {
          setOtpNotice(`Verification Code: ${data.data.testOtp}`);
        } else {
          setOtpNotice("Verification code sent to your mobile.");
        }
      } else {
        setOtpError(data.message || "Failed to send verification code");
      }
    } catch {
      setOtpError("Network error while sending verification code");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify Mobile OTP
  const handleVerifyOtp = async () => {
    if (!otpInput || otpInput.trim().length !== 6) {
      setOtpError("Please enter the 6-digit code");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: shippingAddress.phone,
          otp: otpInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOtpVerified(true);
        setOtpNotice("Mobile number verified successfully");
      } else {
        setOtpError(data.message || "Incorrect verification code");
      }
    } catch {
      setOtpError("Network error while verifying code");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Coupon Handlers
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
        setCouponError(data.message || "Invalid coupon code");
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

  // Final Order Creation in Database
  const finalizeOrderCreation = async (paymentDetails: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  }) => {
    setIsPlacingOrder(true);
    setOrderError("");

    try {
      const isPartial = paymentMethod === "cod";
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
        isPartialCOD: isPartial,
        couponCode: appliedCoupon?.code || "",
        customerEmail: user ? user.email : "",
        customerPhone: shippingAddress.phone,
        customerName: shippingAddress.fullName,
        razorpayOrderId: paymentDetails.razorpayOrderId || "",
        razorpayPaymentId: paymentDetails.razorpayPaymentId || "",
        razorpaySignature: paymentDetails.razorpaySignature || "",
        whatsappUpdatesOptIn: whatsappOptIn,
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
        router.push(
          `/order-success?orderId=${encodeURIComponent(orderId)}&partial=${isPartial ? "true" : "false"}&advance=${isPartial ? advancePaymentAmount : grandTotal}&balance=${isPartial ? balancePaymentAmount : 0}&phone=${encodeURIComponent(shippingAddress.phone)}`
        );
      } else {
        setOrderError(json.message || "Failed to create order. Please check item availability.");
      }
    } catch {
      setOrderError("A network error occurred while placing your order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Main Checkout Submission
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      setOrderError("Please complete all shipping address fields.");
      return;
    }

    if (!/^\d{6}$/.test(shippingAddress.postalCode.trim())) {
      setOrderError("Please enter a valid 6-digit Indian PIN Code (e.g. 144216).");
      return;
    }

    if (!isOtpVerified) {
      setOrderError("Please verify your Indian mobile number via OTP before proceeding to payment.");
      return;
    }

    if (items.length === 0) {
      setOrderError("Your shopping bag is empty.");
      return;
    }

    setIsPlacingOrder(true);
    setOrderError("");

    const amountToCharge = paymentMethod === "cod" ? advancePaymentAmount : grandTotal;

    try {
      const rzpRes = await fetch("/api/payment/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountToCharge,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
          isPartialCOD: paymentMethod === "cod",
        }),
      });

      const rzpData = await rzpRes.json();
      if (!rzpData.success || !rzpData.data) {
        throw new Error(rzpData.message || "Could not initialize payment gateway");
      }

      const { orderId, amount, keyId } = rzpData.data;
      const RazorpayConstructor = (window as any).Razorpay;

      if (RazorpayConstructor && keyId && !keyId.includes("HandaJeweller2026")) {
        const options = {
          key: keyId,
          amount: amount,
          currency: "INR",
          name: "Handa Jeweller",
          description:
            paymentMethod === "cod"
              ? "50% Advance Booking Deposit (Cash on Delivery)"
              : "100% Full Payment for Certified Fine Jewelry",
          image: "/favicon.ico",
          order_id: orderId,
          prefill: {
            name: shippingAddress.fullName,
            contact: shippingAddress.phone,
            email: user?.email || "",
          },
          theme: {
            color: "#1A1714",
          },
          handler: async function (response: any) {
            const verifyRes = await fetch("/api/payment/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyJson = await verifyRes.json();
            if (verifyJson.success) {
              await finalizeOrderCreation({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
            } else {
              setOrderError("Payment verification failed. Please contact support.");
              setIsPlacingOrder(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsPlacingOrder(false);
            },
          },
        };

        const razorpayInstance = new RazorpayConstructor(options);
        razorpayInstance.open();
      } else {
        // Fallback for development & testing
        await finalizeOrderCreation({
          razorpayOrderId: orderId,
          razorpayPaymentId: `pay_test_${Date.now()}`,
          razorpaySignature: `sig_verified_${Date.now()}`,
        });
      }
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setOrderError(err.message || "Failed to start payment. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0 && !isPlacingOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-[#FAFAF8]">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Explore our certified solitaires and necklaces before checking out.
        </p>
        <Link
          href="/shop"
          className="bg-neutral-900 text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 transition"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 pb-6 border-b border-[#E7E2D9]">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900 tracking-tight">
            Checkout
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Complimentary Armored Transit • 100% BIS Hallmarked Purity • 256-Bit Secure Payment
          </p>
        </div>

        {orderError && (
          <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{orderError}</span>
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Address, Phone Verification & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Shipping Address */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2D9] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE4]">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-neutral-700" />
                  <h2 className="font-serif text-base font-semibold text-neutral-900 tracking-wide">
                    1. Delivery Address (Pan-India)
                  </h2>
                </div>
                <span className="text-[11px] text-neutral-500">
                  Insured Armored Courier
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-medium mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                    }
                    placeholder="Recipient Full Name"
                    className="w-full bg-white border border-[#D5CEC2] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 transition"
                  />
                </div>

                {/* Indian Mobile Number with OTP Verification */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-neutral-700 font-medium">
                      Mobile Number (India) *
                    </label>
                    {isOtpVerified && (
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mobile Verified
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-2.5 text-neutral-500 font-medium text-xs">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        disabled={isOtpVerified}
                        value={shippingAddress.phone}
                        onChange={(e) => {
                          const val = e.target.value;
                          setShippingAddress({ ...shippingAddress, phone: val });
                          if (isOtpVerified) setIsOtpVerified(false);
                        }}
                        placeholder="77175 95732"
                        className="w-full pl-12 pr-3.5 bg-white border border-[#D5CEC2] rounded-xl py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 transition"
                      />
                    </div>
                    {!isOtpVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || resendTimer > 0}
                        className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 text-white font-medium text-xs whitespace-nowrap transition"
                      >
                        {isSendingOtp ? "Sending..." : resendTimer > 0 ? `Resend (${resendTimer}s)` : isOtpSent ? "Resend OTP" : "Send OTP"}
                      </button>
                    )}
                  </div>
                </div>

                {/* OTP Verification Input Row */}
                {isOtpSent && !isOtpVerified && (
                  <div className="sm:col-span-2 p-3.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-800">
                        Enter 6-Digit Verification Code:
                      </span>
                      {otpNotice && (
                        <span className="text-[11px] text-neutral-600 font-mono">
                          {otpNotice}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="••••••"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                        className="w-36 bg-white border border-[#D5CEC2] rounded-xl px-3 py-2 text-center text-sm font-mono tracking-widest text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingOtp || otpInput.length !== 6}
                        className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white font-medium text-xs transition"
                      >
                        {isVerifyingOtp ? "Verifying..." : "Confirm OTP"}
                      </button>
                    </div>
                    {otpError && (
                      <p className="text-[11px] text-rose-600">{otpError}</p>
                    )}
                  </div>
                )}

                {/* Street Address */}
                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-medium mb-1.5">
                    Street Address &amp; House Details *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, street: e.target.value })
                    }
                    placeholder="House / Apartment number, Street name, Landmark"
                    className="w-full bg-white border border-[#D5CEC2] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 transition"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-neutral-700 font-medium mb-1.5">
                    City / District *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, city: e.target.value })
                    }
                    placeholder="e.g. Talwara / Hoshiarpur"
                    className="w-full bg-white border border-[#D5CEC2] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 transition"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-neutral-700 font-medium mb-1.5">
                    State / Union Territory *
                  </label>
                  <select
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, state: e.target.value })
                    }
                    className="w-full bg-white border border-[#D5CEC2] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 transition"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PIN Code */}
                <div>
                  <label className="block text-neutral-700 font-medium mb-1.5">
                    Postal PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        postalCode: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    placeholder="144216"
                    className="w-full bg-white border border-[#D5CEC2] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 transition font-mono"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-neutral-700 font-medium mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value="India"
                    className="w-full bg-[#F4F1EA] border border-[#E7E2D9] rounded-xl px-3.5 py-2.5 text-xs text-neutral-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </section>

            {/* Step 2: Payment Method */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2D9] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE4]">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-neutral-700" />
                  <h2 className="font-serif text-base font-semibold text-neutral-900 tracking-wide">
                    2. Payment Method
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <Lock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Razorpay 256-Bit SSL</span>
                </div>
              </div>

              <div className="space-y-3.5">
                {/* Option A: Cash on Delivery with 50% Advance Online */}
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 sm:p-5 rounded-xl border-2 flex flex-col cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-neutral-900 bg-[#FAF8F5]"
                      : "border-[#E7E2D9] hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-5 h-5 text-neutral-700" />
                      <div>
                        <h4 className="text-xs font-semibold text-neutral-900">
                          Cash on Delivery (50% Advance Booking)
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Pay 50% ({formatPrice(advancePaymentAmount)}) now via Razorpay. Pay the remaining 50% ({formatPrice(balancePaymentAmount)}) in cash upon delivery.
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4 accent-neutral-900"
                    />
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#EBE6DC] text-[11px] text-neutral-600">
                    <span className="font-medium text-neutral-800">Non-Cancellation Clause:</span> Due to individual hallmarking and vault reservation of precious bullion, orders placed with 50% advance cannot be cancelled once confirmed.
                  </div>
                </label>

                {/* Option B: 100% Full Payment via Razorpay */}
                <label
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`p-4 sm:p-5 rounded-xl border-2 flex flex-col cursor-pointer transition ${
                    paymentMethod === "razorpay"
                      ? "border-neutral-900 bg-[#FAF8F5]"
                      : "border-[#E7E2D9] hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-neutral-700" />
                      <div>
                        <h4 className="text-xs font-semibold text-neutral-900">
                          Online Payment via Razorpay (100% Full Payment)
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Pay full amount ({formatPrice(grandTotal)}) using UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, or NetBanking. Zero balance on delivery.
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="w-4 h-4 accent-neutral-900"
                    />
                  </div>
                </label>
              </div>

              {/* WhatsApp Notification Opt-in */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-700">
                  <input
                    type="checkbox"
                    checked={whatsappOptIn}
                    onChange={(e) => setWhatsappOptIn(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span>
                    Send order confirmation, insured dispatch tracking, and delivery time window to my WhatsApp number.
                  </span>
                </label>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E7E2D9] shadow-xs space-y-5">
              <h3 className="font-serif text-base font-semibold text-neutral-900 pb-3 border-b border-[#F0ECE4]">
                Order Summary ({items.length})
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-[#F0ECE4] pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.product._id}-${item.variant}`}
                    className="py-3 first:pt-0 flex gap-3 items-center"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#FAF8F5] flex-shrink-0 border border-[#E7E2D9]">
                      <Image
                        src={item.product.images[0] || "/placeholder.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-medium text-neutral-900 truncate">
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

              {/* Coupon Code */}
              <div className="pt-3 border-t border-[#F0ECE4]">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#F8F5EE] border border-[#E5DFD5] px-3 py-2 rounded-xl text-xs">
                    <div>
                      <span className="font-semibold text-neutral-900">{appliedCoupon.code}</span>
                      <p className="text-[11px] text-neutral-600">
                        Saved {formatPrice(appliedCoupon.calculatedDiscount)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-white border border-[#D5CEC2] rounded-xl px-3 py-2 uppercase focus:outline-none focus:border-neutral-900"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponInput.trim()}
                      className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white font-medium px-4 py-2 rounded-xl transition"
                    >
                      {isValidatingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Financial Calculation */}
              <div className="pt-3 border-t border-[#F0ECE4] space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-neutral-800 font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>- {formatPrice(appliedCoupon.calculatedDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>3% Precious Metal GST</span>
                  <span className="font-medium text-neutral-900">{formatPrice(estimatedTax)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Insured Armored Transit</span>
                  <span className="font-medium text-neutral-900">
                    {freeShipping ? (
                      <span className="text-emerald-700 font-medium">Complimentary</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E7E2D9] flex justify-between text-sm font-semibold text-neutral-900">
                  <span>Total Order Value</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>

                {/* Advance vs Balance Detail */}
                {paymentMethod === "cod" ? (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E2D9] space-y-1.5 text-xs mt-2">
                    <div className="flex justify-between font-semibold text-neutral-900">
                      <span>50% Advance Online (Payable Now):</span>
                      <span>{formatPrice(advancePaymentAmount)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>50% Balance on Delivery (Cash):</span>
                      <span>{formatPrice(balancePaymentAmount)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E2D9] flex justify-between text-xs font-semibold text-neutral-900 mt-2">
                    <span>100% Online Payment (Payable Now):</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-medium py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-sm active:scale-[0.99]"
              >
                {isPlacingOrder ? (
                  "Processing Payment..."
                ) : paymentMethod === "cod" ? (
                  <>
                    <span>Pay 50% Advance ({formatPrice(advancePaymentAmount)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Pay {formatPrice(grandTotal)} via Razorpay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-neutral-400 space-y-1 pt-1">
                <div className="flex items-center justify-center gap-1.5 text-neutral-600">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% BIS Hallmarked • Insured Transit • 256-Bit SSL</span>
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}
