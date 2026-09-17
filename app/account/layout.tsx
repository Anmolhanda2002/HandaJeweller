"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User as UserIcon,
  Package,
  MapPin,
  Heart,
  LogOut,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-neutral-500">
        Authenticating royal patron...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
          Patron Access Required
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Please sign in to view your account dashboard, orders, and addresses.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-neutral-900 text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-amber-900 transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  const navItems = [
    { name: "Overview", href: "/account", icon: LayoutDashboard },
    { name: "My Orders & Tracking", href: "/account/orders", icon: Package },
    { name: "Profile Details", href: "/account/profile", icon: UserIcon },
    { name: "Address Book", href: "/account/addresses", icon: MapPin },
    { name: "Saved Wishlist", href: "/wishlist", icon: Heart },
  ];

  return (
    <div className="bg-neutral-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Patron Portal
          </div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
            My Account
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
              {/* User Avatar & Name */}
              <div className="flex items-center gap-3 pb-6 border-b border-neutral-100">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-base">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-neutral-900 truncate">
                    {user.name}
                  </h3>
                  <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? "bg-neutral-900 text-white font-semibold shadow-sm"
                          : "text-neutral-700 hover:bg-neutral-50 hover:text-amber-900"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-neutral-400"}`} />
                      {item.name}
                    </Link>
                  );
                })}

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition mt-4"
                >
                  <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Account Area */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
