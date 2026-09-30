import React from "react";
import Link from "next/link";
import { Crown, Sparkles, ArrowRight, MessageCircle, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-[#FAF8F5] min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-[#E7DFD3] shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#4A0E17]/10 text-[#4A0E17] flex items-center justify-center mx-auto border border-[#4A0E17]/20">
          <Crown className="w-8 h-8 text-[#C5A059]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D23]">
            Error 404 &bull; Page Not Found
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1615]">
            This Jewellery Piece Has Moved
          </h1>
          <p className="text-xs sm:text-sm text-[#5A524C] leading-relaxed max-w-md mx-auto">
            The design or page you are seeking may have been placed in the vault, renamed, or relocated within our catalog.
          </p>
        </div>

        {/* Quick Recovery Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-[#4A0E17] hover:bg-[#380A11] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition"
          >
            <Home className="w-3.5 h-3.5" /> Return Home
          </Link>
          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-full bg-white border border-[#E7DFD3] text-[#1A1615] hover:text-[#4A0E17] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
          >
            <Search className="w-3.5 h-3.5 text-[#C5A059]" /> View All Jewelry
          </Link>
        </div>

        {/* Recommended Collections */}
        <div className="pt-6 border-t border-neutral-100 space-y-3">
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            Popular Royal Collections
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/category/diamond-rings"
              className="text-xs bg-[#FAF8F5] hover:bg-amber-50 text-neutral-700 hover:text-amber-900 px-3 py-1.5 rounded-full border border-[#EAE2D5] transition"
            >
              Solitaire Rings
            </Link>
            <Link
              href="/category/gold-necklaces"
              className="text-xs bg-[#FAF8F5] hover:bg-amber-50 text-neutral-700 hover:text-amber-900 px-3 py-1.5 rounded-full border border-[#EAE2D5] transition"
            >
              22K Gold Haars
            </Link>
            <Link
              href="/category/bridal-sets"
              className="text-xs bg-[#FAF8F5] hover:bg-amber-50 text-neutral-700 hover:text-amber-900 px-3 py-1.5 rounded-full border border-[#EAE2D5] transition"
            >
              Bridal Polki
            </Link>
            <Link
              href="/try-on"
              className="text-xs bg-[#FAF8F5] hover:bg-amber-50 text-neutral-700 hover:text-amber-900 px-3 py-1.5 rounded-full border border-[#EAE2D5] transition"
            >
              Virtual Try-On
            </Link>
          </div>
        </div>

        {/* Concierge Contact */}
        <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-500">
          <span>Need help finding a specific jewel? </span>
          <a
            href="https://wa.me/917717595732?text=Namaste%2C%20I%20could%20not%20find%20a%20jewellery%20piece%20on%20your%20website%20and%20need%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Our Concierge
          </a>
        </div>
      </div>
    </div>
  );
}
