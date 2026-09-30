"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Crown, ShieldCheck, Award, RefreshCw, Mail, Phone, MapPin, Send, Truck } from "lucide-react";

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
    <footer className="bg-[#120B0E] text-[#D1C7BD] pt-16 pb-8 border-t border-[#C5A059]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-white/10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center mb-3 border border-[#C5A059]/40 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-white text-sm font-bold tracking-wide">100% BIS 916 Hallmarked</h4>
            <p className="text-neutral-400 text-xs mt-1">Unique 6-digit laser HUID certified purity</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center mb-3 border border-[#C5A059]/40 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-white text-sm font-bold tracking-wide">GIA &amp; IGI Certified</h4>
            <p className="text-neutral-400 text-xs mt-1">Internationally graded natural solitaires</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center mb-3 border border-[#C5A059]/40 shadow-sm">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-white text-sm font-bold tracking-wide">Lifetime Buyback</h4>
            <p className="text-neutral-400 text-xs mt-1">100% gold benchmark exchange guarantee</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center mb-3 border border-[#C5A059]/40 shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-white text-sm font-bold tracking-wide">India &amp; UAE Transit</h4>
            <p className="text-neutral-400 text-xs mt-1">Insured doorstep delivery across India &amp; Dubai</p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-[#D4AF37]" />
              <span className="font-serif text-2xl font-bold tracking-[0.22em] text-white">
                HANDA
              </span>
              <span className="text-xs text-[#D4AF37] tracking-[0.35em] font-bold -ml-1">
                JEWELLERS
              </span>
            </div>
            <p className="text-neutral-300 text-xs leading-relaxed max-w-sm">
              Since 1982, Handa Jeweller has stood as a beacon of uncompromising gold hallmark purity, certified solitaires, and royal bridal adornments. Master craftsmen creating timeless heirlooms for generations across India and the UAE.
            </p>
            <div className="space-y-2 text-xs text-neutral-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>Punjab Atelier &amp; Showroom: Datarpur, Talwara Main Market, Punjab 144216</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>UAE Despatch Desk: Direct insured express courier to Dubai &amp; Abu Dhabi</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+91 77175 95732 (Official WhatsApp Concierge)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>handaanmol073@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Fine Collections */}
          <div>
            <h5 className="text-white text-xs font-bold tracking-widest uppercase mb-4 text-[#D4AF37]">
              Fine Collections (22K &amp; Solitaires)
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li>
                <Link href="/category/diamond-rings" className="hover:text-[#D4AF37] transition">
                  Solitaire Diamond Rings
                </Link>
              </li>
              <li>
                <Link href="/category/gold-necklaces" className="hover:text-[#D4AF37] transition">
                  22K Gold Necklaces &amp; Haars
                </Link>
              </li>
              <li>
                <Link href="/category/bridal-sets" className="hover:text-[#D4AF37] transition">
                  Royal Bridal Polki Trousseau
                </Link>
              </li>
              <li>
                <Link href="/category/bangles-bracelets" className="hover:text-[#D4AF37] transition">
                  22K Gold Kadas &amp; Tennis Bracelets
                </Link>
              </li>
              <li>
                <Link href="/category/earrings" className="hover:text-[#D4AF37] transition">
                  Antique Filigree Jhumkis
                </Link>
              </li>
              <li>
                <Link href="/category/solitaire-collection" className="hover:text-[#D4AF37] transition">
                  GIA / IGI Natural Solitaires
                </Link>
              </li>
              <li>
                <Link href="/try-on" className="text-amber-200/90 hover:text-white transition flex items-center gap-1 font-semibold">
                  <span>Virtual Try-On AR</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Artificial & Destination Jewelry */}
          <div>
            <h5 className="text-white text-xs font-bold tracking-widest uppercase mb-4 text-[#D4AF37]">
              Artificial &amp; Destination
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li>
                <Link href="/category/artificial-kundan-polki" className="hover:text-[#D4AF37] transition">
                  Kundan &amp; Polki Choker Sets
                </Link>
              </li>
              <li>
                <Link href="/category/artificial-american-diamond" className="hover:text-[#D4AF37] transition">
                  American Diamond (AD) Sets
                </Link>
              </li>
              <li>
                <Link href="/category/artificial-temple-jewellery" className="hover:text-[#D4AF37] transition">
                  Antique Temple Matte Gold
                </Link>
              </li>
              <li>
                <Link href="/category/artificial-earrings" className="hover:text-[#D4AF37] transition">
                  Jaipur Chandbalis &amp; Jhumkas
                </Link>
              </li>
              <li>
                <Link href="/shop?type=artificial" className="text-[#D4AF37] hover:underline transition font-semibold">
                  View All Artificial Designs →
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/917717595732?text=Namaste!%20I%20am%20looking%20for%20bulk%20artificial%20jewellery%20or%20bridal%20matching."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition"
                >
                  Destination Wedding Inquiries
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp & Client Support */}
          <div>
            <h5 className="text-white text-xs font-bold tracking-widest uppercase mb-4 text-[#D4AF37]">
              Customer Care &amp; Trust
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li>
                <Link href="/blog" className="text-amber-300 hover:text-white transition font-medium flex items-center gap-1">
                  <span>Jewellery Knowledge Hub (Blog)</span>
                </Link>
              </li>
              <li>
                <Link href="/locations/amritsar" className="hover:text-[#D4AF37] transition">
                  Amritsar &amp; Punjab Flagship
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition">
                  Atelier Heritage (Est. 1982)
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#D4AF37] transition">
                  Track Your Order
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/917717595732?text=Hello%20Handa%20Jeweller%2C%20please%20send%20me%20live%20delivery%20updates%20for%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 font-semibold"
                >
                  WhatsApp Delivery Updates
                </a>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#D4AF37] transition">
                  15-Day Hassle-Free Returns
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#D4AF37] transition">
                  Terms &amp; 50% Advance Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#D4AF37] transition">
                  Privacy &amp; Security Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] transition">
                  Book Showroom Consultation
                </Link>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-white/10">
              <span className="text-[10px] text-neutral-400 block uppercase tracking-wider mb-1">
                Newsletter &amp; Private Previews
              </span>
              {isSubscribed ? (
                <div className="bg-[#4A0E17]/60 border border-[#C5A059]/40 text-[#F6E7B9] text-xs p-2.5 rounded-xl">
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
                      placeholder="Enter email address"
                      className="w-full bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#C5A059] placeholder-neutral-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#D4AF37] hover:bg-[#C5A059] text-[#1A1615] text-xs font-bold rounded-lg flex items-center transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© 2026 Handa Jeweller. All Rights Reserved. 100% BIS 916 Hallmarked Gold &amp; Certified Solitaires.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms of Sale
            </Link>
            <Link href="/refund-policy" className="hover:text-white transition">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
