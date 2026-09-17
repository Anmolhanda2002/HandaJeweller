import React from "react";

export const metadata = {
  title: "Privacy Policy | Handa Jeweller",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 text-neutral-700 text-xs sm:text-sm leading-relaxed">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight pb-4 border-b border-neutral-200">
          Privacy Policy
        </h1>
        <p>Last updated: September 2026</p>

        <h2 className="font-serif text-xl font-bold text-neutral-900 pt-4">1. Data Confidentiality</h2>
        <p>
          At Handa Jeweller, we treat our patrons&apos; personal and transactional information with the utmost discretion and privacy. We collect customer names, shipping addresses, telephone numbers, and email details exclusively for the lawful purpose of verifying orders, dispatching insured jewelry shipments, and providing customer support.
        </p>

        <h2 className="font-serif text-xl font-bold text-neutral-900 pt-4">2. Secure Payment Processing</h2>
        <p>
          All electronic transactions are processed over high-grade 256-bit TLS encryption. Handa Jeweller does not store raw credit card numbers or private CVV data on our servers.
        </p>

        <h2 className="font-serif text-xl font-bold text-neutral-900 pt-4">3. Contact & Inquiries</h2>
        <p>
          If you have questions regarding your stored patron records or wish to request data erasure, please write to our privacy officer at <a href="mailto:privacy@handajeweller.com" className="text-amber-800 underline">privacy@handajeweller.com</a>.
        </p>
      </div>
    </div>
  );
}
