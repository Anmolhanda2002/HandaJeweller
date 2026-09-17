import React from "react";
import Image from "next/image";
import { Sparkles, ShieldCheck, Award, Heart } from "lucide-react";

export const metadata = {
  title: "About Us | Handa Jeweller Heritage Since 1985",
  description:
    "Explore the four-decade legacy of Handa Jeweller, crafting certified fine jewelry and royal heirloom solitaires in New Delhi.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Established in 1985
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
            Four Decades of Royal Elegance & Trust
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
            Founded in the historic heart of New Delhi, Handa Jeweller has been the premier destination for connoisseurs of fine hallmarked gold, natural diamonds, and heirloom bridal polki.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/8] rounded-3xl overflow-hidden shadow-xl border border-neutral-200">
          <Image
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1600&auto=format&fit=crop"
            alt="Handa Jeweller Master Craftsmanship"
            fill
            className="object-cover"
          />
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">Uncompromising Purity</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every gram of gold is certified 916 BIS hallmarked, tested with strict laser spectroscopy for exact karat purity.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">Ethical Solitaires</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              All natural diamonds are 100% Kimberly Process certified, cut to ideal proportions, and graded by GIA or IGI.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-neutral-900">Heirloom Heritage</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Crafted not merely as accessories, but as generational heirlooms intended to be passed down through families.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
