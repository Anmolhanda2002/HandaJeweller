import React from "react";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import Review from "@/lib/models/Review";
import ProductDetailsView from "@/components/products/ProductDetailsView";
import {
  ProductSchema,
  BreadcrumbSchema,
  FAQPageSchema,
} from "@/components/seo/JsonLd";

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

  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "https://handajeweller.com";
  const canonicalUrl = `${baseUrl}/products/${product.slug}`;
  const firstImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200";

  return {
    title: `${product.name} | Certified Fine Jewelry | Handa Jeweller`,
    description:
      product.shortDescription ||
      `Buy ${product.name} handcrafted in pure hallmarked gold with certified natural solitaires. BIS 916 certified with insured doorstep delivery across India.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} | Handa Jeweller`,
      description:
        product.shortDescription ||
        `Handcrafted ${product.name} with certified 100% BIS Hallmarking and lifetime buyback.`,
      url: canonicalUrl,
      images: [
        {
          url: firstImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Handa Jeweller`,
      description:
        product.shortDescription ||
        `Handcrafted ${product.name} with certified 100% BIS Hallmarking.`,
      images: [firstImage],
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

  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "https://handajeweller.com";

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

  const productFaqs = [
    {
      question: `Is ${product.name} 100% certified hallmarked?`,
      answer: `Yes, this piece carries official 100% BIS 916 Hallmarking with an individual 6-digit laser HUID verifiable directly through the government's official BIS Care App.`,
    },
    {
      question: `What is the delivery time and transit insurance for ${product.name}?`,
      answer: `All orders are shipped via armored secure air couriers (Sequel / BVC Logistics) with 100% transit insurance. Dispatch takes 1-2 business days, followed by 2-4 days express delivery across India.`,
    },
    {
      question: `What is the return and buyback policy for this piece?`,
      answer: `We provide a 15-Day Inspection Return Window and a 100% Lifetime Gold Value Buyback Guarantee based on prevailing daily bullion benchmark rates.`,
    },
  ];

  return (
    <>
      {/* Structured Data Schemas */}
      <ProductSchema
        product={{
          _id: product._id.toString(),
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          sku: product.sku,
          images: product.images,
          stock: product.stock,
          metalPurity:
            (product as any).metalPurity ||
            product.specifications?.find((s: any) =>
              s.key.toLowerCase().includes("purity")
            )?.value ||
            "22K BIS 916 Hallmarked Gold",
          jewelryType: product.jewelryType,
          averageRating: product.averageRating,
          reviewCount: product.reviewCount,
        }}
        url={baseUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Jewellery Catalog", url: `${baseUrl}/shop` },
          ...(product.category
            ? [
                {
                  name: (product.category as any).name,
                  url: `${baseUrl}/category/${(product.category as any).slug}`,
                },
              ]
            : []),
          { name: product.name, url: `${baseUrl}/products/${product.slug}` },
        ]}
      />
      <FAQPageSchema faqs={productFaqs} />

      <ProductDetailsView
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        product={JSON.parse(JSON.stringify(product)) as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        relatedProducts={JSON.parse(JSON.stringify(relatedProducts)) as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reviews={JSON.parse(JSON.stringify(reviews)) as any}
      />
    </>
  );
}
