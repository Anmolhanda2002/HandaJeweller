import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";
import { getUserFromRequest } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiError("Unauthorized", 401);
    }

    const body = await req.json();
    const { guestItems = [] } = body;

    if (!Array.isArray(guestItems) || guestItems.length === 0) {
      return apiSuccess(null, "No items to sync");
    }

    await connectToDatabase();

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
    }

    for (const item of guestItems) {
      const product = await Product.findById(item.productId);
      if (!product || product.status !== "active") continue;

      const itemIndex = cart.items.findIndex(
        (ci) =>
          ci.product.toString() === item.productId &&
          ci.variant === (item.variant || "")
      );

      const qtyToAdd = Number(item.quantity) || 1;

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = Math.min(
          cart.items[itemIndex].quantity + qtyToAdd,
          product.stock
        );
      } else {
        cart.items.push({
          product: product._id,
          variant: item.variant || "",
          quantity: Math.min(qtyToAdd, product.stock),
        });
      }
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.product",
        model: Product,
        select: "name slug price compareAtPrice discount images stock status sku",
      })
      .lean();

    return apiSuccess(populatedCart, "Guest cart merged successfully");
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to sync cart", 500);
  }
}
