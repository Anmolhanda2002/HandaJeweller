"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  MessageCircle,
  AlertTriangle,
  Sparkles,
  Send,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-RECENT";
  const isPartial = searchParams.get("partial") === "true";
  const advance = Number(searchParams.get("advance")) || 0;
  const balance = Number(searchParams.get("balance")) || 0;
  const phone = searchParams.get("phone") || "";

  const [subscribedOffers, setSubscribedOffers] = useState(false);

  const WHATSAPP_PHONE = "917717595732";

  // Pre-filled WhatsApp message for order delivery updates
  const handleSendWhatsAppUpdate = () => {
    let msg = `✨ *HANDA JEWELLER ORDER CONFIRMATION* ✨\n`;
    msg += `Order ID: ${orderId}\n`;
    if (phone) msg += `Customer Phone: +91 ${phone}\n`;
    if (isPartial) {
      msg += `Payment Type: Cash on Delivery with 50% Advance\n`;
      msg += `50% Advance Paid Online: ${formatPrice(advance)}\n`;
      msg += `50% Balance Due on Delivery: ${formatPrice(balance)}\n`;
      msg += `Policy: Non-cancellable order\n`;
    } else {
      msg += `Payment: 100% Full Payment Paid Online via Razorpay\n`;
    }
    msg += `\nNamaste! Please send me real-time dispatch, vault transit, and delivery updates for this order on WhatsApp.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`, "_blank");
  };

  const handleSubscribeWhatsAppOffers = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribedOffers(true);
    const msg = `Namaste Handa Jeweller! Please send me exclusive VIP jewellery offers, festival discounts, and private preview collections on WhatsApp. (Order Ref: ${orderId})`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="bg-neutral-50/50 min-h-[75vh] py-14 flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4 text-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/90 shadow-xl space-y-6">
          {/* Animated Success Badge */}
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest">
              Order Confirmed &amp; Vault Reserved
            </span>
            <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight mt-1">
              Thank You For Your Order
            </h1>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Your heirloom treasure is now scheduled for hallmarking verification and insured transit in our high-security atelier.
            </p>
          </div>

          {/* Order Details & Financial Breakdown Card */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
                  Order Identifier
                </span>
                <span className="font-mono text-base font-bold text-neutral-900 block">
                  {orderId}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Verified
              </span>
            </div>

            {/* 50% COD vs Full Payment Breakdown */}
            {isPartial ? (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Payment Mode:</span>
                  <span className="font-bold text-amber-900">Cash on Delivery (50% Advance)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">50% Advance Paid Online (Razorpay):</span>
                  <span className="font-bold text-emerald-700">{formatPrice(advance)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">50% Balance Due on Delivery (Cash):</span>
                  <span className="font-bold text-neutral-900">{formatPrice(balance)}</span>
                </div>

                {/* Non-cancellable policy notice */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/90 text-amber-950 text-[11px] font-medium flex items-start gap-2 mt-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Non-Cancellable Order:</strong>
                    <span>Per Handa Jeweller policy for custom vault jewellery with 50% advance booking, this order cannot be cancelled once placed.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Payment Status:</span>
                  <span className="font-bold text-emerald-700">100% Paid Online (Razorpay)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Balance on Delivery:</span>
                  <span className="font-bold text-neutral-900">₹0 (Fully Paid)</span>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action 1: WhatsApp Delivery Updates */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300 text-left space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-700 fill-current" />
              <h4 className="text-xs font-bold text-emerald-950">
                Get Instant WhatsApp Delivery Updates
              </h4>
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              Tap below to connect with our WhatsApp desk for live parcel tracking, insured courier dispatch notices, and unboxing guidelines.
            </p>
            <button
              onClick={handleSendWhatsAppUpdate}
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Send Order Updates to My WhatsApp</span>
            </button>
          </div>

          {/* Secondary Action: Track Order & Catalog */}
          <div className="space-y-2.5 pt-1">
            <Link
              href={`/account/orders/${encodeURIComponent(orderId)}`}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition"
            >
              <Package className="w-4 h-4" /> Track Order Status in Dashboard
            </Link>

            <Link
              href="/shop"
              className="w-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition"
            >
              <span>Continue Browsing Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* VIP Offers WhatsApp Opt-in */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> WhatsApp VIP Offers Club
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                Free
              </span>
            </div>
            {subscribedOffers ? (
              <p className="text-[11px] text-emerald-700 font-medium">
                ✓ You have joined the Handa Jeweller VIP WhatsApp list!
              </p>
            ) : (
              <form onSubmit={handleSubscribeWhatsAppOffers} className="flex gap-2">
                <input
                  type="text"
                  disabled
                  value={phone ? `+91 ${phone}` : "VIP WhatsApp List"}
                  className="flex-1 bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-xs text-neutral-600"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Join VIP
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-center gap-4 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Insured Delivery
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" /> Concierge: +91 77175 95732
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
