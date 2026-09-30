import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gem } from "lucide-react";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  categoryType?: "fine" | "artificial";
  productCount?: number;
}

export default function CategoryShowcase({ categories = [] }: { categories: CategoryItem[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-20 bg-[#FAF8F5] border-b border-[#EAE2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4A0E17]/10 text-[#4A0E17] text-xs font-bold uppercase tracking-widest mb-3 border border-[#4A0E17]/20">
            <Gem className="w-3.5 h-3.5 text-[#C5A059]" /> Master Craftsmanship of Punjab
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1615] tracking-tight">
            Explore Royal Collections
          </h2>
          <p className="text-[#5A524C] text-xs sm:text-sm mt-3 leading-relaxed">
            Discover bespoke creations handcrafted in 22K hallmarked gold, certified solitaires, royal uncut polki, and destination artificial bridal jewelry.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="group relative rounded-3xl overflow-hidden bg-white border border-[#E7DFD3] hover:border-[#C5A059] hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-[4/4.8] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={cat.image || "/placeholder.png"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1615]/90 via-[#1A1615]/25 to-transparent" />

                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm border ${
                      cat.categoryType === "artificial"
                        ? "bg-[#1A1615] text-[#D4AF37] border-[#C5A059]/40"
                        : "bg-[#4A0E17] text-white border-[#C5A059]/40"
                    }`}
                  >
                    {cat.categoryType === "artificial" ? "Fashion Artificial" : "22K Fine Gold"}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif text-sm sm:text-base font-bold tracking-wide group-hover:text-[#F6E7B9] transition">
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1 text-xs text-neutral-300">
                    <span className="text-[11px] text-[#E5D7B5]">{cat.productCount ?? 0} Designs</span>
                    <span className="flex items-center gap-1 text-[#D4AF37] opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-300 font-bold text-[11px]">
                      View Collection <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
