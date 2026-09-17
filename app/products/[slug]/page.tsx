import React from "react";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import Review from "@/lib/models/Review";
import ProductDetailsView from "@/components/products/ProductDetailsView";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDatabase();
  const product = await Product.findOne({ slug }).populate("category", "name").lean();
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Handa Jeweller`,
    description:
      product.shortDescription ||
      `Buy ${product.name} handcrafted in pure gold and certified diamonds. Certified by GIA & BIS Hallmarked.`,
    openGraph: {
      title: product.name,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDatabase();

  const product = await Product.findOne({ slug, status: "active" })
    .populate("category", "name slug")
    .lean();

  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    status: "active",
  })
    .limit(4)
    .lean();

  // Fetch approved reviews
  const reviews = await Review.find({
    product: product._id,
    status: "approved",
  })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <ProductDetailsView
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product={JSON.parse(JSON.stringify(product)) as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      relatedProducts={JSON.parse(JSON.stringify(relatedProducts)) as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reviews={JSON.parse(JSON.stringify(reviews)) as any}
    />
  );
}
