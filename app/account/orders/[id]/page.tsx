"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderTimeline {
  status: string;
  timestamp: string;
  note?: string;
}

interface OrderItem {
  product: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  selectedVariant?: string;
  total: number;
}

interface OrderAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderDetail {
  _id: string;
  orderId: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  timeline: OrderTimeline[];
  cancelledReason?: string;
  advancePaymentAmount?: number;
  balancePaymentAmount?: number;
  isPartialCOD?: boolean;
  canCancel?: boolean;
}

const ORDER_STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Artisan Crafting" },
  { key: "shipped", label: "Shipped / In Transit" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderIdParam = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchOrder = () => {
    setIsLoading(true);
    fetch(`/api/orders/${encodeURIComponent(orderIdParam)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setOrder(json.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [orderIdParam]);

  const handleCancelOrder = async () => {
    if (!order) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/orders/${order.orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason || "Cancelled by customer request" }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCancelModal(false);
        fetchOrder();
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch {
      alert("Network error");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-neutral-200 text-center text-xs text-neutral-400">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-neutral-200 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <h3 className="text-base font-semibold text-neutral-900">Order Not Found</h3>
        <Link
          href="/account/orders"
          className="inline-block text-xs text-amber-800 font-semibold"
        >
          Return to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";
  // Non-cancellable if 50% advance COD or explicitly flagged
  const isNonCancellable = order.isPartialCOD || order.canCancel === false || (order.advancePaymentAmount && order.advancePaymentAmount > 0 && order.paymentMethod === "cod");
  const isEligibleForCancellation = !isNonCancellable && ["pending", "confirmed"].includes(order.orderStatus);

  const handleTrackWhatsApp = () => {
    const msg = `Namaste Handa Jeweller! Could you please provide the latest dispatch and delivery update for my Order ID: ${order.orderId}?`;
    window.open(`https://wa.me/917717595732?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>

        <div className="flex items-center gap-2">
          {/* WhatsApp Tracking Button */}
          <button
            onClick={handleTrackWhatsApp}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition"
          >
            <span>💬 Track on WhatsApp</span>
          </button>

          {isNonCancellable && !isCancelled && (
            <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <span>⚠️ Non-Cancellable (50% Advance Paid)</span>
            </span>
          )}

          {isEligibleForCancellation && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Main Order Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-bold text-neutral-900">
                {order.orderId}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  order.orderStatus === "delivered"
                    ? "bg-emerald-100 text-emerald-800"
                    : order.orderStatus === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : order.orderStatus === "cancelled"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-xs text-neutral-400 block uppercase">Payment Method</span>
            <span className="text-sm font-semibold text-neutral-900 uppercase">
              {order.paymentMethod} • {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Visual Progress Steps (if not cancelled) */}
        {!isCancelled ? (
          <div className="py-4">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-6">
              Fulfillment Journey
            </h3>
            <div className="grid grid-cols-5 gap-2 relative">
              {ORDER_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        isPassed
                          ? "bg-amber-600 text-neutral-950 shadow-md"
                          : "bg-neutral-100 text-neutral-400"
                      } ${isCurrent ? "ring-4 ring-amber-200" : ""}`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] mt-2 font-medium leading-tight ${
                        isPassed ? "text-neutral-900 font-semibold" : "text-neutral-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
            <p className="font-semibold">Order Cancelled</p>
            <p>Reason: {order.cancelledReason || "Cancelled by customer"}</p>
          </div>
        )}

        {/* Itemized Breakdown */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Ordered Items ({order.items?.length})
          </h3>
          <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-2xl p-4">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-50 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900">{item.name}</h4>
                    <p className="text-xs text-neutral-500">
                      Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant}` : ""}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-neutral-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Addresses & Financial Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-neutral-100 text-xs">
          {/* Shipping Address */}
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-900 uppercase tracking-wider">
              Insured Shipping Destination
            </h4>
            <div className="p-4 bg-neutral-50 rounded-xl space-y-1 text-neutral-600">
              <p className="font-semibold text-neutral-900">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p className="text-neutral-500 pt-1">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-900 uppercase tracking-wider">
              Financial Summary
            </h4>
            <div className="p-4 bg-neutral-50 rounded-xl space-y-2 text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">{formatPrice(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-amber-800 font-semibold">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                  <span>- {formatPrice(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>3% GST (Jewelry Hallmark Tax)</span>
                <span className="font-medium text-neutral-900">{formatPrice(order.tax)}</span>
              </div>

              <div className="flex justify-between">
                <span>Insured Courier Fee</span>
                <span className="font-medium text-neutral-900">
                  {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-sm text-neutral-900">
                <span>Total Amount</span>
                <span>{formatPrice(order.total)}</span>
              </div>

              {order.isPartialCOD || (order.advancePaymentAmount && order.advancePaymentAmount > 0) ? (
                <div className="mt-2 pt-2 border-t border-amber-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-emerald-800">
                    <span>50% Advance Online (Razorpay):</span>
                    <span>{formatPrice(order.advancePaymentAmount || Math.round(order.total * 0.5))} (PAID)</span>
                  </div>
                  <div className="flex justify-between font-bold text-amber-900">
                    <span>50% Balance on Doorstep Delivery:</span>
                    <span>{formatPrice(order.balancePaymentAmount || (order.total - Math.round(order.total * 0.5)))} (DUE)</span>
                  </div>
                  <div className="text-[10px] text-amber-800 pt-1 font-medium">
                    ⚠️ Strictly Non-Cancellable Order per jewellery vault terms.
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Timeline Log */}
        {order.timeline && order.timeline.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Activity & Tracking Notes
            </h4>
            <div className="space-y-2">
              {order.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-neutral-600">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-neutral-900 uppercase text-[11px] mr-2">
                      {item.status}:
                    </span>
                    <span>{item.note || "Status updated"}</span>
                    <span className="text-neutral-400 text-[10px] ml-2">
                      ({new Date(item.timestamp).toLocaleString("en-IN")})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-neutral-900">Confirm Cancellation</h3>
            <p className="text-xs text-neutral-600">
              Are you sure you want to cancel order <strong>{order.orderId}</strong>? Reserved inventory will be returned to stock.
            </p>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Reason for cancellation
              </label>
              <input
                type="text"
                placeholder="e.g. Changed my mind, ordered wrong variant"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-medium hover:bg-neutral-200"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
