import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Crown, Gem, ShieldCheck } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="py-16 bg-[#FAF8F5] border-b border-[#EAE2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#3B0A11] via-[#4A0E17] to-[#1A0508] border-2 border-[#C5A059]/40 shadow-2xl">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop"
              alt="Handa Jeweller Royal Trousseau"
              fill
              className="object-cover opacity-25 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2A050A] via-[#2A050A]/90 to-transparent" />
          </div>

          <div className="relative max-w-2xl p-8 sm:p-14 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 text-[#F6E7B9] text-xs font-bold uppercase tracking-widest border border-[#D4AF37]/40">
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" /> Royal Bespoke Atelier &bull; Punjab &amp; UAE
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Craft Your Heirloom Solitaire or Bridal Suite
            </h2>

            <p className="text-amber-100/90 text-xs sm:text-sm leading-relaxed max-w-lg">
              Collaborate directly with our master goldsmiths and gemologists to create a custom engagement ring, bridal polki haar, or 22K family heirloom with laser-inscribed HUID.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F6E7B9]">
                <Gem className="w-4 h-4 text-[#D4AF37]" /> Conflict-Free GIA/IGI Diamonds
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#F6E7B9]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% BIS 916 Hallmarked Gold
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C5A059] text-[#1A1615] font-bold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition shadow-xl"
              >
                Schedule Private Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/917717595732?text=Namaste!%20I%20would%20like%20to%20consult%20about%20a%20custom%20bespoke%20jewellery%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider transition border border-white/20"
              >
                WhatsApp Atelier
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
