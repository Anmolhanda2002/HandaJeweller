"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedVariant?: string;
}

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  total: number;
  orderStatus: string;
  paymentMethod: string;
  items: OrderItem[];
}

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setOrders(json.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
      <div className="pb-4 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900">
            My Orders & Tracking
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time fulfillment and insured courier status
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-neutral-400">
          Loading order history...
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-neutral-200 rounded-2xl overflow-hidden hover:border-amber-300 transition shadow-sm"
            >
              {/* Order Header Bar */}
              <div className="bg-neutral-50/80 px-5 py-3.5 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[11px] text-neutral-400 block uppercase">Order ID</span>
                    <span className="font-mono font-bold text-neutral-900">{order.orderId}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 block uppercase">Placed On</span>
                    <span className="text-neutral-700">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[11px] text-neutral-400 block uppercase text-right">Total</span>
                    <span className="font-bold text-neutral-900">{formatPrice(order.total)}</span>
                  </div>

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
              </div>

              {/* Items List */}
              <div className="p-5 divide-y divide-neutral-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="bg-neutral-50/40 px-5 py-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Insured Express Transit
                </span>

                <Link
                  href={`/account/orders/${encodeURIComponent(order.orderId)}`}
                  className="font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
                >
                  View Details & Track Timeline <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-xs text-neutral-500 space-y-3">
          <Package className="w-10 h-10 text-neutral-300 mx-auto" />
          <p>You have not placed any orders yet.</p>
          <Link
            href="/shop"
            className="inline-block bg-neutral-900 text-white px-6 py-2.5 rounded-full uppercase tracking-wider text-xs font-semibold hover:bg-amber-800 transition"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
