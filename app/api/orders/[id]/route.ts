import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { getUserFromRequest } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const query = id.startsWith("ORD-") ? { orderId: id } : { _id: id };
    const order = await Order.findOne(query).lean();

    if (!order) {
      return apiError("Order not found", 404);
    }

    return apiSuccess(order, "Order retrieved successfully");
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to fetch order", 500);
  }
}

// POST cancel order
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiError("Unauthorized", 401);
    }

    await connectToDatabase();
    const { id } = await params;
    const { reason = "Cancelled by customer" } = await req.json();

    const query = id.startsWith("ORD-") ? { orderId: id } : { _id: id };
    const order = await Order.findOne(query);

    if (!order) {
      return apiError("Order not found", 404);
    }

    // Verify ownership
    if (order.user && order.user.toString() !== user._id.toString()) {
      return apiError("Forbidden: You cannot cancel this order", 403);
    }

    // Enforce Non-Cancellable Policy for Cash on Delivery with 50% Advance Booking
    if (order.isPartialCOD || order.canCancel === false || (order.advancePaymentAmount && order.advancePaymentAmount > 0)) {
      return apiError(
        "This order cannot be cancelled. As per Handa Jeweller policy for custom vault & hallmarked jewellery, orders placed with 50% advance booking deposit cannot be cancelled once confirmed.",
        400
      );
    }

    // Check cancellation eligibility
    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return apiError(
        `This order cannot be cancelled as it is already ${order.orderStatus}`,
        400
      );
    }

    order.orderStatus = "cancelled";
    order.cancelledReason = reason;
    order.timeline.push({
      status: "cancelled",
      timestamp: new Date(),
      note: `Cancelled by customer: ${reason}`,
    });

    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    return apiSuccess(order, "Order cancelled successfully");
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to cancel order", 500);
  }
}
