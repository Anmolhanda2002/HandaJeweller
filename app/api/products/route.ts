import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search") || searchParams.get("q");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const featured = searchParams.get("featured");
    const trending = searchParams.get("trending");
    const newArrival = searchParams.get("newArrival");
    const tryOn = searchParams.get("tryOn");
    const jewelryType = searchParams.get("jewelryType") || searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {
      status: "active",
    };

    if (jewelryType) {
      filter.jewelryType = jewelryType;
    }

    if (categorySlug) {
      const categoryDoc = await Category.findOne({ slug: categorySlug });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        // Try finding by ID
        filter.category = categorySlug;
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (featured === "true") filter.isFeatured = true;
    if (trending === "true") filter.isTrending = true;
    if (newArrival === "true") filter.isNewArrival = true;
    if (tryOn === "true") filter.tryOnEnabled = true;

    // Sorting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortObj: Record<string, any> = { createdAt: -1 };
    if (sort === "price-asc") sortObj = { price: 1 };
    else if (sort === "price-desc") sortObj = { price: -1 };
    else if (sort === "popular") sortObj = { reviewCount: -1 };
    else if (sort === "rating") sortObj = { averageRating: -1 };
    else if (sort === "newest") sortObj = { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return apiSuccess(
      {
        products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
      "Products retrieved successfully"
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Products GET error:", err);
    return apiError(err.message || "Failed to retrieve products", 500);
  }
}
