import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Gem, ShieldCheck } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-amber-900/30">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop"
              alt="Handa Jeweller Royal Trousseau"
              fill
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
          </div>

          <div className="relative max-w-2xl p-8 sm:p-14 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold uppercase tracking-widest border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Bespoke Royal Concierge
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Design Your Custom Heirloom Solitaire
            </h2>

            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-lg">
              Collaborate directly with our master gemologists and artisans in New Delhi to create a bespoke engagement ring or bridal jewelry suite certified by GIA.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-amber-200">
                <Gem className="w-4 h-4 text-amber-400" /> Conflict-Free Natural Diamonds
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-200">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> BIS 916 Hallmarked Gold
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-semibold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition shadow-lg"
              >
                Schedule Private Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
