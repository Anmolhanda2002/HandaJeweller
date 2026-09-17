import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import Review from "@/lib/models/Review";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const product = await Product.findOne({ slug, status: "active" })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return apiError("Product not found", 404);
    }

    // Fetch related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: "active",
    })
      .limit(4)
      .lean();

    // Fetch approved reviews for this product
    const reviews = await Review.find({
      product: product._id,
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(
      {
        product,
        relatedProducts,
        reviews,
      },
      "Product retrieved successfully"
    );
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to fetch product", 500);
  }
}
