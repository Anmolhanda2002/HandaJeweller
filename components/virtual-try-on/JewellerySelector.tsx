"use client";

import React from "react";
import Image from "next/image";
import { Check, Sparkles } from "lucide-react";
import { JewelleryProduct } from "./types";
import { formatPrice } from "@/lib/utils";

interface JewellerySelectorProps {
  products: JewelleryProduct[];
  selectedProduct: JewelleryProduct | null;
  onSelectProduct: (product: JewelleryProduct) => void;
}

export default function JewellerySelector({
  products,
  selectedProduct,
  onSelectProduct,
}: JewellerySelectorProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-4 text-xs text-stone-500 font-serif">
        No additional try-on jewellery found in this collection.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-serif uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Select Jewellery Piece ({products.length})
        </span>
        {selectedProduct && (
          <span className="text-xs text-stone-300 font-medium truncate max-w-[200px]">
            {selectedProduct.name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
        {products.map((prod) => {
          const isSelected = selectedProduct?._id === prod._id;
          const thumb = prod.images[0] || "/placeholder.png";

          return (
            <button
              key={prod._id}
              type="button"
              onClick={() => onSelectProduct(prod)}
              className={`relative flex-shrink-0 w-24 sm:w-28 rounded-xl p-2 text-left transition border group ${
                isSelected
                  ? "bg-amber-950/40 border-amber-500 shadow-md shadow-amber-900/40 ring-1 ring-amber-500/50"
                  : "bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900"
              }`}
            >
              {/* Product Thumbnail */}
              <div className="relative aspect-square w-full rounded-lg bg-stone-950 overflow-hidden mb-1.5 border border-stone-800/80">
                <Image
                  src={thumb}
                  alt={prod.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div className="space-y-0.5">
                <h4
                  className={`text-[11px] font-serif line-clamp-1 ${
                    isSelected ? "text-amber-200 font-bold" : "text-stone-300"
                  }`}
                >
                  {prod.name}
                </h4>
                <div className="text-[10px] font-bold text-amber-400">
                  {formatPrice(prod.price)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
