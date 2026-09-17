import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import Banner from "@/lib/models/Banner";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET() {
  try {
    await connectToDatabase();

    const banners = await Banner.find({ status: "active" })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return apiSuccess(banners, "Banners retrieved successfully");
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to fetch banners", 500);
  }
}
