"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, ArrowRight, ShieldCheck, PhoneCall } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-RECENT";

  return (
    <div className="bg-neutral-50/50 min-h-[75vh] py-16 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-4 text-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest">
              Order Confirmed
            </span>
            <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight mt-1">
              Thank You For Your Order
            </h1>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Your treasure is now being carefully prepared and packaged in our high-security New Delhi atelier.
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-left space-y-1">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
              Order Identifier
            </span>
            <span className="font-mono text-base font-bold text-neutral-900 block">
              {orderId}
            </span>
            <p className="text-[11px] text-neutral-500 pt-1">
              A confirmation email & SMS notification have been sent to your contact details.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href={`/account/orders/${encodeURIComponent(orderId)}`}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition"
            >
              <Package className="w-4 h-4" /> Track Order Status
            </Link>

            <Link
              href="/shop"
              className="w-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5 transition"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-center gap-4 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" /> Insured Delivery
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" /> Concierge: +91 98765 43210
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
