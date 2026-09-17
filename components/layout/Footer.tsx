"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Award, RefreshCw, Mail, Phone, MapPin, Send } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#0B0F17] text-neutral-300 pt-16 pb-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-neutral-800/80 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-950/40 text-amber-400 flex items-center justify-center mb-3 border border-amber-800/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-white text-sm font-semibold tracking-wide">100% BIS Hallmarked</h4>
            <p className="text-neutral-400 text-xs mt-1">Certified purity on all gold ornaments</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-950/40 text-amber-400 flex items-center justify-center mb-3 border border-amber-800/30">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-white text-sm font-semibold tracking-wide">GIA & IGI Certified</h4>
            <p className="text-neutral-400 text-xs mt-1">Internationally graded natural diamonds</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-950/40 text-amber-400 flex items-center justify-center mb-3 border border-amber-800/30">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-white text-sm font-semibold tracking-wide">Lifetime Exchange</h4>
            <p className="text-neutral-400 text-xs mt-1">Guaranteed buyback & upgrade policy</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-950/40 text-amber-400 flex items-center justify-center mb-3 border border-amber-800/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-white text-sm font-semibold tracking-wide">Handcrafted Heritage</h4>
            <p className="text-neutral-400 text-xs mt-1">Master artisans crafting since 1985</p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white">
                HANDA
              </span>
              <span className="text-xs text-amber-400 tracking-[0.3em] font-semibold -ml-1">
                JEWELLERS
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              For four decades, Handa Jeweller has been synonymous with exquisite craftsmanship, unmatched gold purity, and certified solitaires. Each jewel is a testament to eternal royal elegance.
            </p>
            <div className="space-y-2 text-xs text-neutral-400 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Handa Heritage Mansion, South Extension, New Delhi 110049</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>+91 98765 43210 / 011-41234567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>concierge@handajeweller.com</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-white text-xs font-semibold tracking-wider uppercase mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/category/diamond-rings" className="hover:text-amber-300 transition">
                  Solitaire Diamond Rings
                </Link>
              </li>
              <li>
                <Link href="/category/gold-necklaces" className="hover:text-amber-300 transition">
                  Polki & Gold Necklaces
                </Link>
              </li>
              <li>
                <Link href="/category/bangles-bracelets" className="hover:text-amber-300 transition">
                  Diamond Tennis Bracelets
                </Link>
              </li>
              <li>
                <Link href="/category/earrings" className="hover:text-amber-300 transition">
                  Earrings & Chandeliers
                </Link>
              </li>
              <li>
                <Link href="/category/bridal-sets" className="hover:text-amber-300 transition">
                  Royal Bridal Trousseau
                </Link>
              </li>
              <li>
                <Link href="/category/mens-jewelry" className="hover:text-amber-300 transition">
                  Men&apos;s Fine Jewelry
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-white text-xs font-semibold tracking-wider uppercase mb-4">
              Customer Concierge
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/account/orders" className="hover:text-amber-300 transition">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-amber-300 transition">
                  15-Day Hassle-Free Returns
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-300 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-300 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-300 transition">
                  Book a Showroom Visit
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-300 transition">
                  Our Heritage & Craft
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-white text-xs font-semibold tracking-wider uppercase mb-4">
              The Royal Newsletter
            </h5>
            <p className="text-neutral-400 text-xs mb-3 leading-relaxed">
              Subscribe to receive exclusive invitations to high jewelry previews and private festive collections.
            </p>
            {isSubscribed ? (
              <div className="bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs p-3 rounded-lg">
                Thank you for subscribing to our private salon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 placeholder-neutral-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-neutral-950 text-xs font-semibold rounded-md flex items-center transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 Handa Jeweller. All Rights Reserved. Master Craftsmen of Fine Jewelry.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-neutral-400 transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-400 transition">
              Terms of Sale
            </Link>
            <Link href="/refund-policy" className="hover:text-neutral-400 transition">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
