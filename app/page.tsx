import React from "react";
import connectToDatabase from "@/lib/db/connect";
import Banner from "@/lib/models/Banner";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import HeroSlider from "@/components/home/HeroSlider";
import BullionRatesWidget from "@/components/home/BullionRatesWidget";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import BridalAndFestiveShowcase from "@/components/home/BridalAndFestiveShowcase";
import FeaturedSection from "@/components/home/FeaturedSection";
import PromoBanner from "@/components/home/PromoBanner";
import RoyalHeritagePromise from "@/components/home/RoyalHeritagePromise";

export const revalidate = 0; // Always dynamic to reflect Admin updates immediately

async function getHomeData() {
  try {
    await connectToDatabase();

    const [banners, categories, products] = await Promise.all([
      Banner.find({ status: "active" }).sort({ displayOrder: 1 }).lean(),
      Category.find({ status: "active" }).sort({ displayOrder: 1 }).lean(),
      Product.find({ status: "active" })
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    // Attach count to categories
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({
          category: cat._id,
          status: "active",
        });
        return {
          ...cat,
          _id: cat._id.toString(),
          productCount: count,
        };
      })
    );

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      banners: JSON.parse(JSON.stringify(banners)) as any[],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories: JSON.parse(JSON.stringify(categoriesWithCount)) as any[],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      products: JSON.parse(JSON.stringify(products)) as any[],
    };
  } catch (err) {
    console.error("Failed to load home data:", err);
    return { banners: [], categories: [], products: [] };
  }
}

export default async function HomePage() {
  const { banners, categories, products } = await getHomeData();

  return (
    <div className="space-y-0">
      <HeroSlider initialBanners={banners} />
      <BullionRatesWidget />
      <CategoryShowcase categories={categories} />
      <BridalAndFestiveShowcase />
      <FeaturedSection products={products} />
      <PromoBanner />
      <RoyalHeritagePromise />
    </div>
  );
}
