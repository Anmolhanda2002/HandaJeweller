import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectToDatabase from "@/lib/db/connect";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import ProductCard from "@/components/products/ProductCard";
import { BreadcrumbSchema, FAQPageSchema } from "@/components/seo/JsonLd";
import { ShieldCheck, Sparkles, HelpCircle } from "lucide-react";

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

  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "https://handajeweller.com";
  const canonicalUrl = `${baseUrl}/category/${category.slug}`;

  return {
    title: `${category.name} | Certified Fine Jewelry | Handa Jeweller`,
    description:
      category.description ||
      `Explore royal collection of ${category.name} handcrafted in 18K and 22K BIS hallmarked gold and certified diamonds. Insured door delivery across India.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.name} | Handa Jeweller`,
      description:
        category.description ||
        `Handcrafted ${category.name} with 100% BIS Hallmarking and GIA certification.`,
      url: canonicalUrl,
      images: category.image ? [{ url: category.image, width: 1200, height: 630 }] : [],
    },
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

  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "https://handajeweller.com";

  const categoryFaqs = [
    {
      question: `Are all items in the ${category.name} collection BIS hallmarked?`,
      answer: `Yes, all gold and diamond creations within ${category.name} undergo mandatory assaying and carry the official triangular BIS seal, karat fineness (22K916 or 18K750), and a 6-digit laser HUID verifiable via the BIS Care App.`,
    },
    {
      question: `Can I customize the sizing or stones for ${category.name}?`,
      answer: `Absolutely. As a bespoke master atelier, we tailor ring sizes, necklace lengths, and solitaire carat grades to your exact specifications. Contact our concierge via WhatsApp to discuss customization.`,
    },
    {
      question: `How does delivery and insurance work for ${category.name}?`,
      answer: `Every parcel is shipped via high-security armored logistics (Sequel / BVC Courier) with 100% transit insurance. Dispatch takes 1-2 business days with doorstep delivery across India and UAE.`,
    },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Jewellery Catalog", url: `${baseUrl}/shop` },
          { name: category.name, url: `${baseUrl}/category/${category.slug}` },
        ]}
      />
      <FAQPageSchema faqs={categoryFaqs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#4A0E17] transition">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#4A0E17] transition">Catalog</Link>
          <span>/</span>
          <span className="text-[#1A1615] font-semibold">{category.name}</span>
        </div>

        {/* Category Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-xl">
          <div className="absolute inset-0">
            {category.image && (
              <Image
                src={category.image}
                alt={category.name}
                fill
                priority
                className="object-cover opacity-35"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
          </div>

          <div className="relative max-w-2xl p-8 sm:p-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Certified Atelier Collection
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
              {category.description ||
                "Immerse yourself in four decades of royal North Indian goldsmithing heritage. Certified by the Bureau of Indian Standards and graded by GIA master gemologists."}
            </p>
            <div className="text-xs text-[#D4AF37] font-semibold pt-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{products.length} Masterpieces Available with Insured Pan-India Despatch</span>
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
          <div className="bg-white rounded-3xl border border-[#E7DFD3] p-12 text-center shadow-sm">
            <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">
              No items currently listed under {category.name}
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
              New heirloom designs are constantly forged at our Punjab ateliers. Please explore our complete fine jewelry vault.
            </p>
            <Link
              href="/shop"
              className="bg-[#4A0E17] hover:bg-[#380A11] text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full transition shadow-sm"
            >
              Browse All Jewelry
            </Link>
          </div>
        )}

        {/* Category Educational Intro & SEO Deep-Dive Text */}
        <div className="bg-white rounded-3xl border border-[#E7DFD3] p-8 sm:p-12 shadow-sm space-y-4 text-neutral-700 text-xs sm:text-sm leading-relaxed">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1615]">
            Craftsmanship &amp; Quality Standards for {category.name}
          </h2>
          <p>
            At <strong>Handa Jeweller (Founded 1982)</strong>, our collection of {category.name.toLowerCase()} represents over four decades of traditional Punjabi goldsmithing. Every ornament is individually engineered to achieve optical brilliance, balance, and lifetime durability. Our precious metals are strictly assayed for exact elemental gold purity, ensuring every sovereign meets or exceeds the Indian BIS 916 hallmarking mandate.
          </p>
          <p>
            Whether selecting an heirloom bridal suite, custom solitaire engagement band, or festive temple necklace, our clients receive full traceability with every purchase. Explore our online collection with insured transit courier delivery across all 28 Indian States and UAE or visit our flagship boutiques in Talwara and Amritsar for private bridal trousseau viewings.
          </p>
        </div>

        {/* Category FAQ Section */}
        <div className="bg-white rounded-3xl border border-[#E7DFD3] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-[#4A0E17]">
            <HelpCircle className="w-5 h-5 text-[#C5A059]" />
            <h2 className="font-serif text-2xl font-bold text-[#1A1615]">
              Frequently Asked Questions About {category.name}
            </h2>
          </div>
          <div className="space-y-4 divide-y divide-neutral-100">
            {categoryFaqs.map((faq, i) => (
              <div key={i} className="pt-4 first:pt-0 space-y-1.5">
                <h3 className="font-serif text-base font-bold text-[#1A1615]">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A524C] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
