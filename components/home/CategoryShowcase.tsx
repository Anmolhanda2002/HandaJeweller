import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

export default function CategoryShowcase({ categories = [] }: { categories: CategoryItem[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Curated By Master Artisans
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            Explore By Royal Category
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-3 leading-relaxed">
            Discover iconic high-jewelry creations handcrafted in 18K & 22K hallmarked gold, diamond solitaires, and uncut polki.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-neutral-100 hover:border-amber-300 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={cat.image || "/placeholder.png"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif text-base sm:text-lg font-bold tracking-wide group-hover:text-amber-300 transition">
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1 text-xs text-neutral-300">
                    <span>{cat.productCount ?? 0} Designs</span>
                    <span className="flex items-center gap-1 text-amber-400 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-300 font-medium">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
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
