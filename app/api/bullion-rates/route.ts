import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import StoreSettings from "@/lib/models/StoreSettings";
import { apiSuccess, apiError } from "@/lib/utils";

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    await connectToDatabase();

    const settings = await StoreSettings.findOne().lean();

    const gold24k = settings?.goldRate24k || 7680;
    const gold22k = settings?.goldRate22k || 7040;
    const gold18k = settings?.goldRate18k || 5760;
    const silver = settings?.silverRate || 93;

    const data = {
      gold24k: {
        karat: "24K",
        perGram: gold24k,
        per10Gram: gold24k * 10,
        purity: "99.9% Pure Investment Bullion",
        hallmark: "BIS Standard Bullion",
        trend: "up",
        change: "+₹35/g",
      },
      gold22k: {
        karat: "22K",
        perGram: gold22k,
        per10Gram: gold22k * 10,
        purity: "91.6% Pure Ornaments (BIS 916)",
        hallmark: "100% BIS Hallmarked with HUID",
        trend: "up",
        change: "+₹30/g",
      },
      gold18k: {
        karat: "18K",
        perGram: gold18k,
        per10Gram: gold18k * 10,
        purity: "75.0% Fine Diamond Jewelry",
        hallmark: "BIS Hallmarked 750",
        trend: "up",
        change: "+₹25/g",
      },
      silver999: {
        metal: "Silver 999",
        perGram: silver,
        perKg: silver * 1000,
        purity: "99.9% Pure Chandi Bars & Ornaments",
        hallmark: "Certified 999 Purity",
        trend: "up",
        change: "+₹0.80/g",
      },
      ratesLastUpdated: settings?.ratesLastUpdated || settings?.updatedAt || new Date().toISOString(),
      benchmark: "North India (Punjab) / MCX Daily Spot Rate",
      storeName: settings?.storeName || "Handa Jeweller",
      whatsappNumber: "917717595732",
    };

    return apiSuccess(data, "Live bullion rates retrieved successfully");
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Failed to fetch bullion rates:", err);
    return apiError(err.message || "Failed to fetch bullion rates", 500);
  }
}
