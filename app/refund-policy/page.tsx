import React from "react";

export const metadata = {
  title: "Refund & Lifetime Exchange Policy | Handa Jeweller",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 text-neutral-700 text-xs sm:text-sm leading-relaxed">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight pb-4 border-b border-neutral-200">
          Refund & Lifetime Exchange Policy
        </h1>
        <p>Last updated: September 2026</p>

        <h2 className="font-serif text-xl font-bold text-neutral-900 pt-4">1. 15-Day Hassle-Free Returns</h2>
        <p>
          We offer a 15-day inspection window on all standard catalog jewelry orders. If for any reason you are not completely enchanted by your jewel, you may request a return or exchange within 15 calendar days of receipt, provided the item is unworn with security tags intact.
        </p>

        <h2 className="font-serif text-xl font-bold text-neutral-900 pt-4">2. Lifetime Exchange & Buyback</h2>
        <p>
          Handa Jeweller offers guaranteed lifetime exchange and buyback on all certified gold and natural diamond jewelry across our physical ateliers. Valuation is determined according to the prevailing daily gold market rate and diamond appraisal values.
        </p>

        <h2 className="font-serif text-xl font-bold text-neutral-900 pt-4">3. Custom & Bespoke Commissions</h2>
        <p>
          Personalized engravings or custom commissioned bespoke solitaire mounts are crafted exclusively to your measurements and cannot be returned for a cash refund, but remain eligible for lifetime exchange.
        </p>
      </div>
    </div>
  );
}
