import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import StoreSettings from "@/lib/models/StoreSettings";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET() {
  try {
    await connectToDatabase();

    let settings = await StoreSettings.findOne().lean();
    if (!settings) {
      const created = await StoreSettings.create({
        storeName: "Handa Jeweller",
        tagline: "Timeless Royal Craftsmanship & Certified Fine Jewelry",
      });
      settings = created.toObject() as unknown as typeof settings;
    }

    return apiSuccess(settings, "Settings retrieved successfully");
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to fetch settings", 500);
  }
}
