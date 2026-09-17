import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import Review from "@/lib/models/Review";
import Product from "@/lib/models/Product";
import { getUserFromRequest } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiError("Please log in to write a review", 401);
    }

    const { productId, rating, title, comment } = await req.json();

    if (!productId || !rating || !title || !comment) {
      return apiError("All review fields are required", 400);
    }

    if (rating < 1 || rating > 5) {
      return apiError("Rating must be between 1 and 5", 400);
    }

    await connectToDatabase();

    const product = await Product.findById(productId);
    if (!product) {
      return apiError("Product not found", 404);
    }

    const review = await Review.create({
      product: product._id,
      user: user._id,
      userName: user.name,
      rating: Number(rating),
      title: title.trim(),
      comment: comment.trim(),
      status: "approved", // Automatically approved or pending
    });

    // Update product average rating & review count
    const allApprovedReviews = await Review.find({
      product: product._id,
      status: "approved",
    });

    const totalScore = allApprovedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = allApprovedReviews.length > 0 ? totalScore / allApprovedReviews.length : 5;

    product.averageRating = Number(avg.toFixed(1));
    product.reviewCount = allApprovedReviews.length;
    await product.save();

    return apiSuccess(review, "Thank you! Your review has been published.", 201);
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to submit review", 500);
  }
}
