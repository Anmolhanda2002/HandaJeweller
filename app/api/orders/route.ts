import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import Order, { IOrderItem } from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Coupon from "@/lib/models/Coupon";
import Cart from "@/lib/models/Cart";
import StoreSettings from "@/lib/models/StoreSettings";
import { getUserFromRequest } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiError("Unauthorized", 401);
    }

    await connectToDatabase();

    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(orders, "Orders retrieved successfully");
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to fetch orders", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getUserFromRequest(req);

    const body = await req.json();
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod = "cod",
      couponCode = "",
      customerEmail,
      customerPhone,
      customerName,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return apiError("Your cart is empty", 400);
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      return apiError("Complete shipping address is required", 400);
    }

    // Fetch store settings for tax rate and shipping fees
    const settings = await StoreSettings.findOne().lean();
    const taxRate = settings?.taxRate ?? 3; // 3% fine jewelry GST
    const defaultShippingFee = settings?.shippingFee ?? 250;
    const freeShippingThreshold = settings?.freeShippingThreshold ?? 15000;

    // Server-Side Verification: Fetch actual products from MongoDB
    let calculatedSubtotal = 0;
    const verifiedItems: IOrderItem[] = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product || product.status !== "active") {
        return apiError(`Product "${item.name || 'Selected item'}" is no longer available`, 400);
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      if (qty > product.stock) {
        return apiError(
          `Insufficient stock for "${product.name}". Only ${product.stock} items remaining.`,
          400
        );
      }

      const itemTotal = product.price * qty;
      calculatedSubtotal += itemTotal;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images[0] || "",
        price: product.price,
        quantity: qty,
        selectedVariant: item.selectedVariant || item.variant || "",
        total: itemTotal,
      });
    }

    // Server-side coupon verification
    let calculatedDiscount = 0;
    let validCouponCode = "";

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        status: "active",
      });

      if (coupon) {
        const now = new Date();
        const isValidDate = (!coupon.startDate || new Date(coupon.startDate) <= now) &&
          (!coupon.expiryDate || new Date(coupon.expiryDate) >= now);
        const isWithinLimit = !coupon.usageLimit || coupon.usedCount < coupon.usageLimit;
        const meetsMinOrder = !coupon.minOrder || calculatedSubtotal >= coupon.minOrder;

        if (isValidDate && isWithinLimit && meetsMinOrder) {
          validCouponCode = coupon.code;
          if (coupon.discountType === "percentage") {
            calculatedDiscount = Math.round((calculatedSubtotal * coupon.discountValue) / 100);
            if (coupon.maxDiscount && coupon.maxDiscount > 0) {
              calculatedDiscount = Math.min(calculatedDiscount, coupon.maxDiscount);
            }
          } else {
            calculatedDiscount = Math.min(coupon.discountValue, calculatedSubtotal);
          }

          // Increment coupon usage
          await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
        }
      }
    }

    const discountedSubtotal = Math.max(0, calculatedSubtotal - calculatedDiscount);
    const tax = Math.round((discountedSubtotal * taxRate) / 100);
    const shippingFee = discountedSubtotal >= freeShippingThreshold ? 0 : defaultShippingFee;
    const finalTotal = discountedSubtotal + tax + shippingFee;

    // Calculate Partial COD / Advance Payment
    const isPartial = paymentMethod === "cod" && (body.isPartialCOD !== false);
    let advanceAmount = 0;
    let balanceAmount = 0;
    let determinedPaymentStatus: "pending" | "paid" | "partial" = "pending";
    let isCancellable = true;

    if (isPartial) {
      // 50% Advance online payment via Razorpay, 50% balance cash on delivery
      advanceAmount = Math.round(finalTotal * 0.5);
      balanceAmount = finalTotal - advanceAmount;
      determinedPaymentStatus = "partial";
      isCancellable = false; // Strictly non-cancellable
    } else if (paymentMethod === "razorpay" || paymentMethod === "card" || paymentMethod === "upi") {
      advanceAmount = finalTotal;
      balanceAmount = 0;
      determinedPaymentStatus = "paid";
    }

    const {
      razorpayOrderId = "",
      razorpayPaymentId = "",
      razorpaySignature = "",
      whatsappUpdatesOptIn = true,
    } = body;

    // Generate unique Order ID
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${dateStr}-${randomSuffix}`;

    // Create Order in MongoDB
    const newOrder = await Order.create({
      orderId,
      user: user ? user._id : null,
      customerName: customerName || (user ? user.name : shippingAddress.fullName),
      customerEmail: (customerEmail || (user ? user.email : "")).toLowerCase().trim(),
      customerPhone: customerPhone || (user ? user.phone : shippingAddress.phone),
      items: verifiedItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      couponCode: validCouponCode,
      tax,
      shippingFee,
      total: finalTotal,
      paymentMethod,
      paymentStatus: determinedPaymentStatus,
      advancePaymentAmount: advanceAmount,
      balancePaymentAmount: balanceAmount,
      isPartialCOD: isPartial,
      canCancel: isCancellable,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      whatsappUpdatesOptIn: !!whatsappUpdatesOptIn,
      orderStatus: "pending",
      timeline: [
        {
          status: "pending",
          timestamp: new Date(),
          note: isPartial
            ? `Order confirmed with 50% advance booking (₹${advanceAmount.toLocaleString("en-IN")}) paid via Razorpay. Balance ₹${balanceAmount.toLocaleString("en-IN")} payable on doorstep delivery. (Strictly non-cancellable per store policy)`
            : `Order placed online with payment method: ${paymentMethod.toUpperCase()}`,
        },
      ],
    });

    // Decrement inventory stock
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's DB cart if logged in
    if (user) {
      await Cart.findOneAndUpdate({ user: user._id }, { $set: { items: [] } });
    }

    return apiSuccess(newOrder, "Order placed successfully!", 201);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Order creation error:", err);
    return apiError(err.message || "Failed to create order", 500);
  }
}
