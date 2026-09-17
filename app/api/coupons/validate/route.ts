import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import Coupon from "@/lib/models/Coupon";
import { apiError, apiSuccess } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return apiError("Coupon code is required", 400);
    }

    if (subtotal === undefined || isNaN(subtotal) || subtotal <= 0) {
      return apiError("Valid order subtotal is required", 400);
    }

    await connectToDatabase();

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      status: "active",
    });

    if (!coupon) {
      return apiError("Invalid or expired coupon code", 404);
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return apiError("This coupon is not active yet", 400);
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
      return apiError("This coupon has expired", 400);
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return apiError("This coupon has reached its maximum usage limit", 400);
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return apiError(
        `Minimum order amount of ₹${coupon.minOrder.toLocaleString("en-IN")} required to apply this coupon`,
        400
      );
    }

    let calculatedDiscount = 0;
    if (coupon.discountType === "percentage") {
      calculatedDiscount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        calculatedDiscount = Math.min(calculatedDiscount, coupon.maxDiscount);
      }
    } else {
      calculatedDiscount = Math.min(coupon.discountValue, subtotal);
    }

    return apiSuccess(
      {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        calculatedDiscount,
      },
      `Coupon ${coupon.code} applied successfully! You save ₹${calculatedDiscount.toLocaleString("en-IN")}`
    );
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to validate coupon", 500);
  }
}
