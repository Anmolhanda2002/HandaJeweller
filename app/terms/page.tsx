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

        <h2 className="font-serif text-xl font-bold text-amber-900 pt-4">4. Cash on Delivery (50% Advance) &amp; Non-Cancellation Policy</h2>
        <p>
          To safeguard against fraudulent orders of high-value precious bullion and certified solitaires, all Cash on Delivery (COD) orders require a <strong>50% advance booking deposit</strong> paid online via Razorpay (UPI, Card, or NetBanking). The remaining 50% balance is collected in cash at the time of doorstep delivery.
        </p>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 font-medium">
          <strong>Strict Non-Cancellation Clause:</strong> Due to individual hallmark registration, size customization, and high-security vault reservation, Cash on Delivery orders with 50% advance payment <strong>CANNOT be cancelled</strong> once confirmed and prepared for dispatch. The 50% booking deposit is non-refundable.
        </div>

        <h2 className="font-serif text-xl font-bold text-neutral-900 pt-4">5. WhatsApp Notifications &amp; Customer Concierge</h2>
        <p>
          Customers opting in to WhatsApp notifications will receive automated dispatch tracking, courier docket numbers, and delivery time windows directly on their verified Indian mobile number (+91 77175 95732). Customers may also request private salon previews and bespoke bridal trousseau consultations via WhatsApp.
        </p>
      </div>
    </div>
  );
}
