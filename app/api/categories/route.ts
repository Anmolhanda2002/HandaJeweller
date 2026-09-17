import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET() {
  try {
    await connectToDatabase();

    const categories = await Category.find({ status: "active" })
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    // Attach product counts
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({
          category: cat._id,
          status: "active",
        });
        return {
          ...cat,
          productCount: count,
        };
      })
    );

    return apiSuccess(categoriesWithCount, "Categories retrieved successfully");
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to fetch categories", 500);
  }
}
