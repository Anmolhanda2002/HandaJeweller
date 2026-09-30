"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Crown,
  ChevronDown,
  LogOut,
  PackageCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gem,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchModal from "../search/SearchModal";
import CartDrawer from "../cart/CartDrawer";
import AnnouncementBar from "./AnnouncementBar";

// Fine Jewelry Collections
const FINE_JEWELRY_CATEGORIES = [
  {
    name: "Diamond Rings & Solitaires",
    slug: "diamond-rings",
    subtitle: "GIA Certified VVS Solitaires & Engagement Bands",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Gold Necklaces & Haars",
    slug: "gold-necklaces",
    subtitle: "22K BIS 916 Hallmarked Chokers & Temple Haars",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Royal Bridal Trousseau",
    slug: "bridal-sets",
    subtitle: "Bespoke Uncut Polki & Emerald Grand Suites",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Solitaires & High Jewels",
    slug: "solitaire-collection",
    subtitle: "Ideal-Cut Natural Solitaire Pendants & Rings",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Bangles & Bracelets",
    slug: "bangles-bracelets",
    subtitle: "Handcrafted 22K Gold Kadas & Tennis Bracelets",
    image: "https://images.unsplash.com/photo-1611591475825-c4918e11b333?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Earrings & Jhumkis",
    slug: "earrings",
    subtitle: "Antique Filigree Jhumkis & Solitaire Studs",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop",
  },
];

// Artificial & Fashion Jewelry Collections
const ARTIFICIAL_JEWELRY_CATEGORIES = [
  {
    name: "Kundan & Polki Sets",
    slug: "artificial-kundan-polki",
    subtitle: "Bridal Imitation Chokers, Maang Tikka & Jhumkis",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
    badge: "Bestseller",
  },
  {
    name: "American Diamond (AD)",
    slug: "artificial-american-diamond",
    subtitle: "Grade 5A Cubic Zirconia Rhodium Tennis Sets",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop",
    badge: "Trending",
  },
  {
    name: "Temple & Antique Artificial",
    slug: "artificial-temple-jewellery",
    subtitle: "South Indian Matte Gold Goddess Lakshmi Harams",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
    badge: "Heritage",
  },
  {
    name: "Festive Chandbalis & Jhumkas",
    slug: "artificial-earrings",
    subtitle: "Jaipur Meenakari & Statement Party Drops",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop",
    badge: "Party Wear",
  },
];

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { wishlist } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  // Mega dropdown state
  const [activeDropdown, setActiveDropdown] = useState<"fine" | "artificial" | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile accordion state
  const [mobileFineOpen, setMobileFineOpen] = useState(false);
  const [mobileArtOpen, setMobileArtOpen] = useState(false);

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
    setActiveDropdown(null);
  }, [pathname]);

  const handleMouseEnter = (type: "fine" | "artificial") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(type);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  return (
    <>
      <AnnouncementBar />

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF8F5]/98 backdrop-blur-md shadow-sm border-b border-[#EAE2D5] py-2.5"
            : "bg-[#FAF8F5] border-b border-[#EAE2D5] py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#1A1615] hover:text-[#4A0E17] transition"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex flex-col items-center group flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A059] transition-transform group-hover:scale-110 duration-300" />
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.2em] text-[#1A1615] group-hover:text-[#4A0E17] transition leading-tight">
                  HANDA
                </span>
              </div>
              <span className="text-[8.5px] sm:text-[9.5px] tracking-[0.38em] text-[#8C6D23] uppercase font-bold -mt-0.5">
                JEWELLERS
              </span>
              <div className="flex items-center gap-1 mt-0.5 pt-0.5 border-t border-emerald-500 w-full justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[8.5px] sm:text-[9px] font-bold text-emerald-600 tracking-wider uppercase whitespace-nowrap">
                  100% Trust
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 flex-shrink-0">
              {/* 1. Home */}
              <Link
                href="/"
                className={`text-[13px] font-semibold tracking-wider uppercase transition py-1 whitespace-nowrap relative ${
                  pathname === "/" ? "text-[#4A0E17] font-bold" : "text-[#2A2421] hover:text-[#4A0E17]"
                }`}
              >
                Home
                {pathname === "/" && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059] rounded-full" />
                )}
              </Link>

              {/* 2. Products */}
              <Link
                href="/shop"
                className={`text-[13px] font-semibold tracking-wider uppercase transition py-1 whitespace-nowrap relative ${
                  pathname === "/shop" || pathname.startsWith("/shop") || pathname.startsWith("/products")
                    ? "text-[#4A0E17] font-bold"
                    : "text-[#2A2421] hover:text-[#4A0E17]"
                }`}
              >
                Products
                {(pathname === "/shop" || pathname.startsWith("/shop") || pathname.startsWith("/products")) && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059] rounded-full" />
                )}
              </Link>

              {/* 3. Fine Jewellery (Mega Dropdown) */}
              <div
                className="relative py-2"
                onMouseEnter={() => handleMouseEnter("fine")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1 text-[13px] font-semibold tracking-wider uppercase transition whitespace-nowrap ${
                    activeDropdown === "fine" || pathname.startsWith("/category/")
                      ? "text-[#4A0E17] font-bold"
                      : "text-[#2A2421] hover:text-[#4A0E17]"
                  }`}
                >
                  <span>Fine Jewellery</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === "fine" ? "rotate-180 text-[#C5A059]" : "text-neutral-400"
                    }`}
                  />
                </button>

                {/* Fine Jewelry Mega Dropdown Content */}
                {activeDropdown === "fine" && (
                  <div
                    className="absolute -left-32 top-full w-[880px] bg-white rounded-3xl shadow-2xl border border-[#E7DFD3] p-6 z-50 animate-fadeIn"
                    onMouseEnter={() => handleMouseEnter("fine")}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Dropdown Header */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#4A0E17] to-[#2D080E] text-white border border-[#C5A059]/30 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-[#D4AF37]" />
                          <h4 className="font-serif text-base font-bold text-white">
                            Certified Fine Jewelry Atelier
                          </h4>
                        </div>
                        <p className="text-xs text-amber-200/90 mt-0.5">
                          100% BIS Hallmarked 22K (916) Pure Gold &amp; GIA Natural Solitaires
                        </p>
                      </div>
                      <Link
                        href="/shop"
                        className="text-xs font-bold text-[#D4AF37] hover:text-white flex items-center gap-1 uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-full border border-white/20 transition"
                      >
                        All Fine Jewelry <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* 6 Category Cards Grid with Zoom Animation */}
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      {FINE_JEWELRY_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          className="group p-3 rounded-2xl border border-[#EFE9DF] hover:border-[#C5A059] hover:bg-[#FAF8F5] transition-all flex items-center gap-3.5"
                        >
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                            <Image
                              src={cat.image}
                              alt={cat.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-serif text-xs font-bold text-[#1A1615] group-hover:text-[#4A0E17] transition truncate">
                              {cat.name}
                            </h5>
                            <p className="text-[11px] text-[#5A524C] line-clamp-2 mt-0.5 leading-snug">
                              {cat.subtitle}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Bottom Hallmark Assurance Strip */}
                    <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600 bg-[#FAF6F0] p-3 rounded-2xl border border-[#EAE2D5]">
                      <div className="flex items-center gap-2 text-[#4A0E17]">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="font-semibold text-xs">
                          100% Laser HUID BIS Hallmark Certified • Insured Express Transit Across India &amp; UAE
                        </span>
                      </div>
                      <Link
                        href="/about"
                        className="text-[11px] font-bold text-[#8C6D23] hover:underline uppercase tracking-wide flex-shrink-0"
                      >
                        Hallmark Policy →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Artificial Jewellery (Mega Dropdown) */}
              <div
                className="relative py-2"
                onMouseEnter={() => handleMouseEnter("artificial")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1 text-[13px] font-semibold tracking-wider uppercase transition whitespace-nowrap ${
                    activeDropdown === "artificial"
                      ? "text-[#4A0E17] font-bold"
                      : "text-[#2A2421] hover:text-[#4A0E17]"
                  }`}
                >
                  <span>Artificial Jewellery</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === "artificial" ? "rotate-180 text-[#C5A059]" : "text-neutral-400"
                    }`}
                  />
                </button>

                {/* Artificial Jewelry Mega Dropdown Content */}
                {activeDropdown === "artificial" && (
                  <div
                    className="absolute -left-20 top-full w-[780px] bg-white rounded-3xl shadow-2xl border border-[#E7DFD3] p-6 z-50 animate-fadeIn"
                    onMouseEnter={() => handleMouseEnter("artificial")}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Dropdown Header */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#1A1615] to-[#2D2622] text-white border border-[#C5A059]/30 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Gem className="w-4 h-4 text-[#D4AF37]" />
                          <h4 className="font-serif text-base font-bold text-white">
                            Royal Fashion &amp; Artificial Jewellery
                          </h4>
                        </div>
                        <p className="text-xs text-amber-200/90 mt-0.5">
                          24K Micro Gold Plated Brass &bull; Grade 5A AD Stones &bull; Destination Wedding Glamour
                        </p>
                      </div>
                      <Link
                        href="/shop?type=artificial"
                        className="text-xs font-bold text-[#D4AF37] hover:text-white flex items-center gap-1 uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-full border border-white/20 transition"
                      >
                        All Artificial Line <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* 4 Category Cards Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {ARTIFICIAL_JEWELRY_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          className="group p-3.5 rounded-2xl border border-[#EFE9DF] hover:border-[#C5A059] hover:bg-[#FAF8F5] transition-all flex items-center gap-4"
                        >
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                            <Image
                              src={cat.image}
                              alt={cat.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {cat.badge && (
                              <span className="absolute top-1 left-1 bg-[#4A0E17] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-[#C5A059]/30">
                                {cat.badge}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-serif text-xs font-bold text-[#1A1615] group-hover:text-[#4A0E17] transition truncate">
                              {cat.name}
                            </h5>
                            <p className="text-[11px] text-[#5A524C] line-clamp-2 mt-1 leading-snug">
                              {cat.subtitle}
                            </p>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8C6D23] mt-1.5 opacity-0 group-hover:opacity-100 transition">
                              Shop Collection →
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Bottom Strip */}
                    <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600 bg-[#FAF6F0] p-3 rounded-2xl border border-[#EAE2D5]">
                      <div className="flex items-center gap-2">
                        <Gem className="w-4 h-4 text-[#C5A059]" />
                        <span className="font-semibold text-xs text-[#1A1615]">Anti-Tarnish Plating • Lightweight Comfort • 100% Skin Safe</span>
                      </div>
                      <Link
                        href="/contact"
                        className="text-[11px] font-bold text-[#8C6D23] hover:underline uppercase tracking-wide"
                      >
                        Bulk / Bridal Inquiry →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. About */}
              <Link
                href="/about"
                className={`text-[13px] font-semibold tracking-wider uppercase transition py-1 whitespace-nowrap relative ${
                  pathname === "/about" ? "text-[#4A0E17] font-bold" : "text-[#2A2421] hover:text-[#4A0E17]"
                }`}
              >
                About
                {pathname === "/about" && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059] rounded-full" />
                )}
              </Link>

              {/* 5. Contact */}
              <Link
                href="/contact"
                className={`text-[13px] font-semibold tracking-wider uppercase transition py-1 whitespace-nowrap relative ${
                  pathname === "/contact" ? "text-[#4A0E17] font-bold" : "text-[#2A2421] hover:text-[#4A0E17]"
                }`}
              >
                Contact
                {pathname === "/contact" && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059] rounded-full" />
                )}
              </Link>
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

              {/* Search Modal Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#1A1615] hover:text-[#4A0E17] hover:bg-[#EAE2D5]/40 rounded-full transition"
                title="Search Jewelry"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="p-2 text-[#1A1615] hover:text-[#4A0E17] hover:bg-[#EAE2D5]/40 rounded-full transition relative"
                title="My Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#4A0E17] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="p-2 text-[#1A1615] hover:text-[#4A0E17] hover:bg-[#EAE2D5]/40 rounded-full transition relative"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#4A0E17] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Account Menu */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-amber-600 text-neutral-800 text-xs font-medium hover:bg-neutral-50 transition"
                      aria-label="User Account"
                    >
                      <UserIcon className="w-4 h-4 text-amber-700" />
                      <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    </button>

                    {isAccountMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <p className="text-xs font-semibold text-neutral-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition"
                        >
                          <UserIcon className="w-4 h-4 text-neutral-500" /> My Profile
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition"
                        >
                          <PackageCheck className="w-4 h-4 text-neutral-500" /> My Orders
                        </Link>
                        <Link
                          href="/account/addresses"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition"
                        >
                          <MapPin className="w-4 h-4 text-neutral-500" /> Saved Addresses
                        </Link>

                        <a
                          href="https://wa.me/917717595732?text=Hello%20Handa%20Jeweller%2C%20I%20need%20assistance%20with%20my%20order%20and%20jewellery%20collection."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 transition"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          WhatsApp Support
                        </a>

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
                  <div>
                    <button
                      onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-amber-600 text-neutral-800 text-xs font-medium hover:bg-neutral-50 transition"
                      aria-label="New User Menu"
                    >
                      <UserIcon className="w-4 h-4 text-amber-700" />
                      <span className="hidden sm:inline">Account</span>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    </button>

                    {isAccountMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-3 z-50 animate-fadeIn space-y-2.5">
                        <div className="px-2 pt-1 pb-2 border-b border-neutral-100">
                          <p className="text-xs font-bold text-neutral-900 tracking-wide">
                            Welcome to Handa Jeweller
                          </p>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            New user? Start your royal journey below.
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <Link
                            href="/login"
                            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-center py-2.5 rounded-xl text-xs font-semibold block transition shadow-sm"
                          >
                            Sign In to Account
                          </Link>
                          <Link
                            href="/register"
                            className="w-full bg-amber-50 hover:bg-amber-100 text-amber-950 text-center py-2 rounded-xl text-xs font-semibold border border-amber-200/80 block transition"
                          >
                            Create New Account
                          </Link>
                        </div>

                        <div className="space-y-1 text-xs text-neutral-700 pt-1 border-t border-neutral-100">
                          <Link
                            href="/account/orders"
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-50 transition"
                          >
                            <PackageCheck className="w-3.5 h-3.5 text-neutral-500" />
                            Track Order Status
                          </Link>
                          <a
                            href="https://wa.me/917717595732?text=Namaste%2C%20I%20am%20a%20new%20customer%20at%20Handa%20Jeweller%20and%20would%20like%20to%20know%20about%20your%20jewellery%20and%2050%25%20COD."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition"
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            WhatsApp Support
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn max-h-[80vh] overflow-y-auto">
            {/* Home */}
            <Link
              href="/"
              className="block text-sm font-medium text-neutral-800 hover:text-amber-800 py-2 border-b border-neutral-100"
            >
              Home
            </Link>

            {/* All Products */}
            <Link
              href="/shop"
              className="block text-sm font-medium text-neutral-800 hover:text-amber-800 py-2 border-b border-neutral-100"
            >
              All Products
            </Link>

            {/* Fine Jewelry Accordion */}
            <div className="border-b border-neutral-100 pb-2">
              <button
                onClick={() => setMobileFineOpen(!mobileFineOpen)}
                className="w-full flex items-center justify-between text-sm font-medium text-neutral-800 py-2"
              >
                <span>Fine Jewellery</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${mobileFineOpen ? "rotate-180 text-amber-700" : ""}`}
                />
              </button>

              {mobileFineOpen && (
                <div className="space-y-2 pl-3 pt-1 pb-2">
                  {FINE_JEWELRY_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="flex items-center gap-2.5 py-1 text-xs text-neutral-600 hover:text-amber-800"
                    >
                      <div className="relative w-7 h-7 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                  <Link
                    href="/shop"
                    className="block text-xs font-semibold text-amber-700 pt-1"
                  >
                    View All Fine Jewellery →
                  </Link>
                </div>
              )}
            </div>

            {/* Artificial Jewelry Accordion */}
            <div className="border-b border-neutral-100 pb-2">
              <button
                onClick={() => setMobileArtOpen(!mobileArtOpen)}
                className="w-full flex items-center justify-between text-sm font-medium text-neutral-800 py-2"
              >
                <div className="flex items-center gap-2">
                  <span>Artificial Jewellery</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    Fashion
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${mobileArtOpen ? "rotate-180 text-amber-700" : ""}`}
                />
              </button>

              {mobileArtOpen && (
                <div className="space-y-2 pl-3 pt-1 pb-2">
                  {ARTIFICIAL_JEWELRY_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="flex items-center gap-2.5 py-1 text-xs text-neutral-600 hover:text-amber-800"
                    >
                      <div className="relative w-7 h-7 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                  <Link
                    href="/shop?type=artificial"
                    className="block text-xs font-semibold text-amber-700 pt-1"
                  >
                    View All Artificial Jewellery →
                  </Link>
                </div>
              )}
            </div>

            {/* About */}
            <Link
              href="/about"
              className="block text-sm font-medium text-neutral-800 hover:text-amber-800 py-2 border-b border-neutral-100"
            >
              About Atelier
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className="block text-sm font-medium text-neutral-800 hover:text-amber-800 py-2 border-b border-neutral-100"
            >
              Contact
            </Link>

            {!user ? (
              <div className="pt-3 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full bg-neutral-900 text-white text-center py-2.5 rounded-xl text-xs font-semibold shadow-sm"
                >
                  Sign In to Your Account
                </Link>
                <Link
                  href="/register"
                  className="w-full bg-amber-50 text-amber-950 text-center py-2.5 rounded-xl text-xs font-semibold border border-amber-200"
                >
                  Create New Customer Account
                </Link>
              </div>
            ) : (
              <div className="pt-3">
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
