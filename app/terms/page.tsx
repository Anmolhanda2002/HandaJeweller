import React from "react";

export const metadata = {
  title: "Terms & Conditions | Handa Jeweller",
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 text-neutral-700 text-xs sm:text-sm leading-relaxed">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight pb-4 border-b border-neutral-200">
          Terms & Conditions of Sale
        </h1>
        <p>Last updated: September 2026</p>

        <h2 className="font-serif text-xl font-bold text-neutral-900 pt-4">1. Purity & Hallmarking Guarantee</h2>
        <p>
          Every gold item sold on Handa Jeweller complies with Bureau of Indian Standards (BIS) Hallmarking regulations. Diamond jewelry is accompanied by authentic grading reports from internationally accredited gemological laboratories (GIA/IGI).
        </p>

        <h2 className="font-serif text-xl font-bold text-neutral-900 pt-4">2. Pricing & Order Confirmation</h2>
        <p>
          Precious metal prices fluctuate in accordance with bullion spot market rates. The final purchase price displayed at verified server checkout is binding upon order confirmation.
        </p>

        <h2 className="font-serif text-xl font-bold text-neutral-900 pt-4">3. Insured Transit Security</h2>
        <p>
          All orders are dispatched via tamper-proof, armored or secure air courier services with 100% transit insurance. The risk of loss transfers to the recipient only upon signed physical receipt.
        </p>
      </div>
    </div>
  );
}
