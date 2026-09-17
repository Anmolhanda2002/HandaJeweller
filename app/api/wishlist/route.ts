import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import Wishlist from "@/lib/models/Wishlist";
import Product from "@/lib/models/Product";
import { getUserFromRequest } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

// GET user's wishlist
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiError("Unauthorized", 401);
    }

    await connectToDatabase();

    const wishlist = await Wishlist.findOne({ user: user._id })
      .populate({
        path: "products",
        model: Product,
        select: "name slug price compareAtPrice discount images stock status averageRating reviewCount",
      })
      .lean();

    return apiSuccess(wishlist?.products || [], "Wishlist retrieved");
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to fetch wishlist", 500);
  }
}

// POST toggle item in wishlist
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiError("Unauthorized", 401);
    }

    const { productId } = await req.json();
    if (!productId) {
      return apiError("Product ID is required", 400);
    }

    await connectToDatabase();

    let wishlist = await Wishlist.findOne({ user: user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: user._id, products: [] });
    }

    const index = wishlist.products.findIndex(
      (p) => p.toString() === productId
    );

    let added = false;
    if (index > -1) {
      wishlist.products.splice(index, 1);
      added = false;
    } else {
      wishlist.products.push(productId);
      added = true;
    }

    await wishlist.save();

    return apiSuccess(
      { added, count: wishlist.products.length },
      added ? "Added to wishlist" : "Removed from wishlist"
    );
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to update wishlist", 500);
  }
}
