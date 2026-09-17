import React from "react";
import { Sparkles, ShieldCheck, Truck } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-neutral-900 text-amber-200/90 text-xs py-2 px-4 border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="font-medium tracking-wide">
            ROYAL SUMMER COLLECTION 2026: Complimentary Insured Express Shipping above ₹15,000
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-neutral-400 text-[11px] tracking-wider uppercase">
          <span className="flex items-center gap-1.5 text-amber-300/80">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% BIS Hallmarked & Certified
          </span>
          <span className="flex items-center gap-1.5 text-amber-300/80">
            <Truck className="w-3.5 h-3.5" /> Tamper-Proof Insured Delivery
          </span>
          <span className="text-neutral-300">Call Concierge: +91 98765 43210</span>
        </div>
      </div>
    </div>
  );
}
