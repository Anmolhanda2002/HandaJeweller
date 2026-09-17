"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, MapPin, Heart, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";

export default function AccountOverviewPage() {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setRecentOrders(json.data.slice(0, 3));
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const defaultAddress =
    user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-amber-900/30">
        <div className="relative z-10 max-w-lg space-y-2">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
            Patron Circle
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}
          </h2>
          <p className="text-xs text-neutral-300 leading-relaxed">
            From this dashboard, track insured dispatches, update delivery addresses, and view your private royal acquisitions.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-medium">Orders Placed</span>
            <p className="text-lg font-bold text-neutral-900">{recentOrders.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-medium">Saved Addresses</span>
            <p className="text-lg font-bold text-neutral-900">{user?.addresses?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-neutral-500 font-medium">Patron Status</span>
            <p className="text-xs font-bold text-emerald-700 uppercase">Verified Patron</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <h3 className="font-serif text-lg font-bold text-neutral-900">
            Recent Orders
          </h3>
          <Link
            href="/account/orders"
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
          >
            View All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-neutral-400">Loading orders...</div>
        ) : recentOrders.length > 0 ? (
          <div className="divide-y divide-neutral-100 space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-neutral-900 text-sm block">
                    {order.orderId}
                  </span>
                  <span className="text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    • {order.items?.length} {order.items?.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-neutral-900">{formatPrice(order.total)}</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      order.orderStatus === "delivered"
                        ? "bg-emerald-50 text-emerald-700"
                        : order.orderStatus === "shipped"
                        ? "bg-blue-50 text-blue-700"
                        : order.orderStatus === "cancelled"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                  <Link
                    href={`/account/orders/${encodeURIComponent(order.orderId)}`}
                    className="text-amber-800 hover:text-amber-900 font-medium"
                  >
                    Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-neutral-500">
            You have not placed any orders yet.{" "}
            <Link href="/shop" className="text-amber-800 font-semibold underline">
              Browse Collections
            </Link>
          </div>
        )}
      </div>

      {/* Default Address Preview */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <h3 className="font-serif text-lg font-bold text-neutral-900">
            Primary Delivery Address
          </h3>
          <Link
            href="/account/addresses"
            className="text-xs font-semibold text-amber-800 hover:text-amber-900"
          >
            Manage Addresses
          </Link>
        </div>

        {defaultAddress ? (
          <div className="text-xs text-neutral-600 space-y-1">
            <p className="font-semibold text-neutral-900">{defaultAddress.fullName}</p>
            <p>{defaultAddress.street}</p>
            <p>
              {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.postalCode}
            </p>
            <p>{defaultAddress.country}</p>
            <p className="text-neutral-500 pt-1">Phone: {defaultAddress.phone}</p>
          </div>
        ) : (
          <div className="text-xs text-neutral-500">
            No default address saved yet.{" "}
            <Link href="/account/addresses" className="text-amber-800 font-semibold underline">
              Add your delivery address
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
