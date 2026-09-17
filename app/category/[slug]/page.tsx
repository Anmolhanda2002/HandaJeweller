import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectToDatabase from "@/lib/db/connect";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import ProductCard from "@/components/products/ProductCard";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDatabase();
  const category = await Category.findOne({ slug }).lean();
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} | Handa Jeweller`,
    description:
      category.description ||
      `Explore royal collection of ${category.name} handcrafted in 18K and 22K hallmarked gold.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDatabase();

  const category = await Category.findOne({ slug, status: "active" }).lean();
  if (!category) {
    notFound();
  }

  const products = await Product.find({
    category: category._id,
    status: "active",
  })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="bg-neutral-50/50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
          <Link href="/" className="hover:text-amber-800 transition">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-amber-800 transition">Collections</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">{category.name}</span>
        </div>

        {/* Category Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-neutral-950 mb-12 border border-neutral-800">
          <div className="absolute inset-0">
            {category.image && (
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover opacity-40"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
          </div>

          <div className="relative max-w-xl p-8 sm:p-14 space-y-3">
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
              {category.description ||
                "Certified fine jewelry pieces created with timeless artistry and pure precious metals."}
            </p>
            <div className="text-xs text-amber-400 font-semibold pt-2">
              {products.length} Designs Available
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id.toString()}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                product={JSON.parse(JSON.stringify(product)) as any}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <h3 className="text-base font-semibold text-neutral-900 mb-2">
              No items currently listed under this category
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
              New heirloom designs are constantly added by our artisans. Please check back soon.
            </p>
            <Link
              href="/shop"
              className="bg-neutral-900 text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full"
            >
              Browse All Jewelry
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
