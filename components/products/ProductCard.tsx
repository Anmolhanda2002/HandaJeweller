"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Check, Sparkles } from "lucide-react";
import { useCart, CartProduct } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    discount?: number;
    images: string[];
    stock: number;
    lowStockThreshold?: number;
    brand?: string;
    category?: { name: string; slug: string } | string;
    averageRating?: number;
    reviewCount?: number;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    tryOnEnabled?: boolean;
    tryOn?: any;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product._id);
  const primaryImage = product.images[0] || "/placeholder.png";
  const secondaryImage = product.images[1] || primaryImage;

  const categoryName =
    typeof product.category === "object" && product.category?.name
      ? product.category.name
      : "Fine Jewelry";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product as CartProduct, "", 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toggleWishlist(product as any);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 3);

  return (
    <div
      className="group relative bg-white rounded-2xl border border-neutral-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/4.5] w-full overflow-hidden bg-neutral-50 block">
        <Image
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.tryOnEnabled && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-amber-500/50 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
              AR Try-On
            </span>
          )}
          {product.discount && product.discount > 0 ? (
            <span className="bg-amber-900 text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {product.discount}% OFF
            </span>
          ) : null}
          {product.isNewArrival && (
            <span className="bg-neutral-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              New
            </span>
          )}
          {isLowStock && (
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${
            isFavorited
              ? "bg-rose-50 text-rose-600"
              : "bg-white/90 text-neutral-600 hover:text-rose-600 hover:bg-white"
          }`}
          title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-600 text-rose-600" : ""}`} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-neutral-900 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1 text-[11px] text-neutral-500">
            <span className="uppercase tracking-wider truncate">{categoryName}</span>
            <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-neutral-700">
                {product.averageRating || 5.0}
              </span>
              <span className="text-neutral-400 text-[10px]">
                ({product.reviewCount || 0})
              </span>
            </div>
          </div>

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-amber-900 line-clamp-2 transition leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="pt-3 mt-2 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-bold text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price ? (
              <span className="text-xs text-neutral-400 line-through -mt-0.5">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </div>

          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`p-2.5 rounded-xl flex items-center justify-center transition duration-200 ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-100 hover:bg-neutral-900 text-neutral-800 hover:text-white"
              }`}
              title="Add to Shopping Bag"
            >
              {isAdded ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
