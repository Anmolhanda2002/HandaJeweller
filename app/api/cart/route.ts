import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";
import { getUserFromRequest } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

// GET user's cart from MongoDB
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiError("Unauthorized", 401);
    }

    await connectToDatabase();

    let cart = await Cart.findOne({ user: user._id })
      .populate({
        path: "items.product",
        model: Product,
        select: "name slug price compareAtPrice discount images stock status sku",
      })
      .lean();

    if (!cart) {
      cart = { user: user._id, items: [] } as unknown as typeof cart;
    }

    return apiSuccess(cart, "Cart retrieved successfully");
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to fetch cart", 500);
  }
}

// POST: Add, update or remove items in cart
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiError("Unauthorized", 401);
    }

    const body = await req.json();
    const { productId, variant = "", quantity = 1, action = "add" } = body;

    if (!productId) {
      return apiError("Product ID is required", 400);
    }

    await connectToDatabase();

    const product = await Product.findById(productId);
    if (!product || product.status !== "active") {
      return apiError("Product is not available", 404);
    }

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId && item.variant === variant
    );

    if (action === "remove") {
      if (itemIndex > -1) {
        cart.items.splice(itemIndex, 1);
      }
    } else if (action === "set") {
      if (quantity <= 0) {
        if (itemIndex > -1) cart.items.splice(itemIndex, 1);
      } else {
        if (quantity > product.stock) {
          return apiError(`Only ${product.stock} items available in stock`, 400);
        }
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity = quantity;
        } else {
          cart.items.push({ product: product._id, variant, quantity });
        }
      }
    } else {
      // action === "add"
      const newQty = itemIndex > -1 ? cart.items[itemIndex].quantity + quantity : quantity;
      if (newQty > product.stock) {
        return apiError(`Only ${product.stock} items available in stock`, 400);
      }

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = newQty;
      } else {
        cart.items.push({ product: product._id, variant, quantity });
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

    return apiSuccess(populatedCart, "Cart updated successfully");
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to update cart", 500);
  }
}
