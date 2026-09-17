"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  PackageCheck,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchModal from "../search/SearchModal";
import CartDrawer from "../cart/CartDrawer";
import AnnouncementBar from "./AnnouncementBar";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { wishlist } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop All", href: "/shop" },
    { name: "Diamond Rings", href: "/category/diamond-rings" },
    { name: "Necklaces", href: "/category/gold-necklaces" },
    { name: "Bridal Sets", href: "/category/bridal-sets" },
    { name: "Solitaires", href: "/category/solitaire-collection" },
    { name: "✨ Virtual Try-On", href: "/try-on", highlight: true },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <AnnouncementBar />

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100 py-3"
            : "bg-white border-b border-neutral-100 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:text-amber-800 transition"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex flex-col items-center group">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-600 transition-transform group-hover:rotate-12 duration-300" />
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] text-neutral-900 group-hover:text-amber-900 transition">
                  HANDA
                </span>
              </div>
              <span className="text-[9px] tracking-[0.35em] text-amber-700 uppercase font-semibold -mt-1">
                JEWELLERS
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-[13px] font-medium tracking-wide uppercase transition relative py-1 ${
                      // @ts-ignore
                      link.highlight
                        ? "text-amber-600 font-bold hover:text-amber-500"
                        : isActive
                        ? "text-amber-900 font-semibold"
                        : "text-neutral-700 hover:text-amber-800"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search Modal Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-neutral-700 hover:text-amber-800 hover:bg-neutral-50 rounded-full transition"
                title="Search Jewelry"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="p-2 text-neutral-700 hover:text-amber-800 hover:bg-neutral-50 rounded-full transition relative"
                title="My Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="p-2 text-neutral-700 hover:text-amber-800 hover:bg-neutral-50 rounded-full transition relative"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-neutral-900 text-amber-200 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                      className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-neutral-200 hover:border-amber-600 transition text-neutral-800 text-xs font-medium"
                    >
                      <UserIcon className="w-4 h-4 text-amber-700" />
                      <span className="hidden sm:inline truncate max-w-[90px]">
                        {user.name.split(" ")[0]}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    </button>

                    {isAccountMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <p className="text-xs font-semibold text-neutral-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-neutral-500 truncate">
                            {user.email}
                          </p>
                        </div>

                        <Link
                          href="/account"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-amber-50/50 hover:text-amber-900 transition"
                        >
                          <UserIcon className="w-4 h-4 text-neutral-500" /> Dashboard Overview
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-amber-50/50 hover:text-amber-900 transition"
                        >
                          <PackageCheck className="w-4 h-4 text-neutral-500" /> My Orders & Tracking
                        </Link>
                        <Link
                          href="/account/addresses"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-amber-50/50 hover:text-amber-900 transition"
                        >
                          <MapPin className="w-4 h-4 text-neutral-500" /> Saved Addresses
                        </Link>

                        <div className="border-t border-neutral-100 my-1"></div>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" /> Log Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="text-xs font-medium text-neutral-700 hover:text-amber-900 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-amber-600 transition"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-sm font-medium text-neutral-800 hover:text-amber-800 py-1.5 border-b border-neutral-50"
              >
                {link.name}
              </Link>
            ))}

            {!user ? (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full bg-neutral-900 text-white text-center py-2.5 rounded-lg text-xs font-semibold"
                >
                  Sign In to Your Account
                </Link>
                <Link
                  href="/register"
                  className="w-full bg-amber-50 text-amber-900 text-center py-2.5 rounded-lg text-xs font-medium border border-amber-200"
                >
                  Create New Customer Account
                </Link>
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  href="/account"
                  className="block text-xs font-semibold text-amber-800 py-1"
                >
                  My Account Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="block text-xs text-rose-600 py-1 mt-1 font-medium"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Global Slide-over Cart Drawer */}
      <CartDrawer />
    </>
  );
}
