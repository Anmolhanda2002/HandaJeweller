"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Download,
  Share2,
  RotateCcw,
  ShoppingBag,
  Check,
  Sparkles,
  Heart,
} from "lucide-react";
import { CapturedPhoto } from "./hooks/useTryOnCapture";
import { JewelleryProduct } from "./types";
import { useCart, CartProduct } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";

interface CapturePreviewProps {
  photo: CapturedPhoto;
  product: JewelleryProduct;
  onRetake: () => void;
  onDownload: () => void;
  onShare: () => Promise<boolean>;
}

export default function CapturePreview({
  photo,
  product,
  onRetake,
  onDownload,
  onShare,
}: CapturePreviewProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const isFavorited = isInWishlist(product._id);

  const handleAddToCart = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addToCart(product as any, "", 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleShare = async () => {
    const success = await onShare();
    if (success) {
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto animate-fade-in">
      {/* Captured High-Res Portrait Frame */}
      <div className="relative w-full aspect-[3/4] max-h-[58vh] rounded-2xl overflow-hidden border-2 border-amber-600/40 shadow-2xl bg-stone-950">
        <img
          src={photo.dataUrl}
          alt={photo.productName}
          className="w-full h-full object-cover"
        />

        {/* Brand Watermark Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-800 text-white">
          <div>
            <div className="text-[10px] font-serif uppercase tracking-widest text-amber-400">
              Handa Jeweller Atelier
            </div>
            <div className="text-xs font-bold truncate max-w-[240px]">
              {product.name}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-amber-300">
              {formatPrice(product.price)}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        {/* Primary Row: Add to Bag & Retake */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full py-3.5 px-4 rounded-xl font-serif text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-amber-900/40"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" /> Added to Shopping Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add This Piece to Bag
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRetake}
            className="w-full py-3.5 px-4 rounded-xl border border-stone-700 bg-stone-900/80 hover:bg-stone-800 text-stone-200 font-serif text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            Try Another Pose / Retake
          </button>
        </div>

        {/* Secondary Row: Download, Share, Wishlist */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 border border-stone-800 text-xs font-medium text-stone-300 hover:text-amber-300 hover:border-amber-600/40 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download Portrait
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 border border-stone-800 text-xs font-medium text-stone-300 hover:text-amber-300 hover:border-amber-600/40 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            {isShared ? "Shared!" : "Share Portrait"}
          </button>

          <button
            type="button"
            onClick={() => toggleWishlist(product as any)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 border text-xs font-medium transition ${
              isFavorited
                ? "border-rose-500 text-rose-400"
                : "border-stone-800 text-stone-300 hover:text-rose-400"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-rose-500" : ""}`} />
            {isFavorited ? "Saved" : "Save to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
