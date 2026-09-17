import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const category = await Category.findOne({ slug, status: "active" }).lean();
    if (!category) {
      return apiError("Category not found", 404);
    }

    const products = await Product.find({
      category: category._id,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(
      {
        category,
        products,
      },
      "Category details retrieved successfully"
    );
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to fetch category", 500);
  }
}
