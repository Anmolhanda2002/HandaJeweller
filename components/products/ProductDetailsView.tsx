"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  Sparkles,
  Award,
  Plus,
  Minus,
} from "lucide-react";
import { useCart, CartProduct } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, getImageUrl } from "@/lib/utils";
import ProductCard from "./ProductCard";

interface Variant {
  name: string;
  options: string[];
  priceDelta?: number;
  stock?: number;
}

interface Spec {
  key: string;
  value: string;
}

interface Review {
  _id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

interface ProductDetailsProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    sku: string;
    brand: string;
    category: { _id: string; name: string; slug: string };
    description: string;
    shortDescription?: string;
    images: string[];
    price: number;
    compareAtPrice?: number;
    discount?: number;
    stock: number;
    lowStockThreshold?: number;
    variants: Variant[];
    specifications: Spec[];
    averageRating: number;
    reviewCount: number;
    tryOnEnabled?: boolean;
    tryOn?: any;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedProducts: any[];
  reviews: Review[];
}

export default function ProductDetailsView({
  product,
  relatedProducts,
  reviews: initialReviews,
}: ProductDetailsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.variants?.forEach((v) => {
      if (v.options?.length > 0) initial[v.name] = v.options[0];
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "desc" | "shipping">("specs");

  // Review submission state
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState("");

  const isFavorited = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;

  const variantString = Object.entries(selectedVariants)
    .map(([name, opt]) => `${name}: ${opt}`)
    .join(" | ");

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product as unknown as CartProduct, variantString, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product as unknown as CartProduct, variantString, quantity);
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to write a review.");
      router.push("/login");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          rating: newRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReviews([data.data, ...reviews]);
        setReviewSuccessMessage("Your review has been submitted and published!");
        setReviewTitle("");
        setReviewComment("");
        setShowReviewForm(false);
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch {
      alert("Network error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <Link href="/" className="hover:text-amber-800 transition">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-amber-800 transition">Collections</Link>
          <span>/</span>
          <Link href={`/category/${product.category.slug}`} className="hover:text-amber-800 transition">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Section: Gallery & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/4.5] w-full rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 shadow-sm">
              <Image
                src={getImageUrl(product.images[selectedImageIndex])}
                alt={product.name}
                fill
                priority
                className="object-cover transition-all duration-300"
              />
              <button
                onClick={() => toggleWishlist(product as unknown as CartProduct)}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition ${
                  isFavorited
                    ? "bg-rose-50 text-rose-600"
                    : "bg-white/90 text-neutral-600 hover:text-rose-600"
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? "fill-rose-600 text-rose-600" : ""}`} />
              </button>

            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? "border-amber-700 ring-2 ring-amber-700/20"
                        : "border-neutral-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={getImageUrl(img)} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest">
                  {product.brand}
                </span>
                <span className="text-xs text-neutral-400">SKU: {product.sku}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.averageRating || 5)
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-800">
                  {product.averageRating || 5.0}
                </span>
                <span className="text-xs text-neutral-400">
                  ({reviews.length} Verified Customer Reviews)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-100 flex items-baseline gap-4">
              <span className="text-3xl font-bold text-neutral-900">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <div className="flex items-center gap-2">
                  <span className="text-base text-neutral-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="text-xs font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                    Save {formatPrice(product.compareAtPrice - product.price)} ({product.discount}%)
                  </span>
                </div>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Variants */}
            {product.variants?.map((v) => (
              <div key={v.name} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900 uppercase tracking-wider">
                    {v.name}: <span className="font-normal text-amber-900">{selectedVariants[v.name]}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {v.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setSelectedVariants((prev) => ({ ...prev, [v.name]: opt }))
                      }
                      className={`px-3.5 py-2 text-xs rounded-xl border transition ${
                        selectedVariants[v.name] === opt
                          ? "border-neutral-900 bg-neutral-900 text-white font-medium shadow-sm"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity & Stock Status */}
            <div className="flex items-center gap-6 pt-2">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wider block">
                  Quantity
                </span>
                <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wider block">
                  Availability
                </span>
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                    Out of Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <Check className="w-4 h-4" /> In Stock ({product.stock} items ready to dispatch)
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdded}
                className={`w-full py-4 rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition shadow-lg ${
                  isOutOfStock
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    : isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-900 hover:bg-neutral-800 text-white"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Shopping Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-neutral-200 text-neutral-950 font-semibold py-4 rounded-xl text-xs uppercase tracking-widest transition shadow-lg shadow-amber-900/20"
              >
                Buy Now (Instant Checkout)
              </button>
            </div>


            {/* Trust Badges Pill */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-center text-[11px] text-neutral-600">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>100% BIS Hallmarked</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-amber-700" />
                <span>Insured Express Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>15-Day Exchange Policy</span>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-neutral-200 pt-6 space-y-3">
              <div className="flex border-b border-neutral-200">
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 mr-6 transition ${
                    activeTab === "specs"
                      ? "border-amber-700 text-amber-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Jewelry Specifications
                </button>
                <button
                  onClick={() => setActiveTab("desc")}
                  className={`pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 mr-6 transition ${
                    activeTab === "desc"
                      ? "border-amber-700 text-amber-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Full Description
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition ${
                    activeTab === "shipping"
                      ? "border-amber-700 text-amber-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Delivery & Warranty
                </button>
              </div>

              {activeTab === "specs" && (
                <div className="pt-2">
                  <dl className="divide-y divide-neutral-100 text-xs">
                    {product.specifications?.map((spec, i) => (
                      <div key={i} className="py-2.5 flex justify-between">
                        <dt className="text-neutral-500 font-medium">{spec.key}</dt>
                        <dd className="text-neutral-900 font-semibold">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {activeTab === "desc" && (
                <div className="pt-2 text-xs text-neutral-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="pt-2 text-xs text-neutral-600 space-y-2 leading-relaxed">
                  <p>
                    • Delivered in high-security tamper-evident packaging with BlueDart Secured Air.
                  </p>
                  <p>• 100% Transit Insurance covered by Handa Jeweller until signature delivery.</p>
                  <p>• Includes GIA/IGI diamond authenticity card and BIS Hallmark certificate.</p>
                  <p>• Lifetime exchange and upgrade guarantees across all physical ateliers.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="mt-20 pt-12 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
                Customer Reviews
              </h2>
              <p className="text-neutral-500 text-xs mt-1">
                Authentic testimonials from verified royal patrons
              </p>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition self-start sm:self-auto"
            >
              {showReviewForm ? "Cancel Review" : "Write a Review"}
            </button>
          </div>

          {reviewSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl mb-6">
              {reviewSuccessMessage}
            </div>
          )}

          {/* Review Submission Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 mb-8 space-y-4 max-w-xl">
              <h3 className="text-sm font-semibold text-neutral-900">Share Your Experience</h3>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-500"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= newRating ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Review Title</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Magnificent diamond brilliance and prompt delivery"
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Detailed Review</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about the craftsmanship, diamond certification, packaging..."
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev._id} className="p-5 rounded-2xl bg-neutral-50/60 border border-neutral-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-neutral-900">{rev.title}</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
                  <p className="text-[11px] text-neutral-400 font-medium">By {rev.userName} • Verified Purchaser</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500">No reviews yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-neutral-200">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mb-8">
              Complete The Look
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
