"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface WishlistProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  images: string[];
  stock: number;
  averageRating?: number;
  reviewCount?: number;
}

interface WishlistContextType {
  wishlist: WishlistProduct[];
  wishlistIds: Set<string>;
  toggleWishlist: (product: WishlistProduct) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const res = await fetch("/api/wishlist");
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const valid = json.data.filter((p: any) => p && p._id);
            setWishlist(valid);
            setWishlistIds(new Set(valid.map((p: WishlistProduct) => p._id)));
          }
        } catch (e) {
          console.error("Failed to load wishlist:", e);
        }
      } else {
        const stored = localStorage.getItem("handa_wishlist");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setWishlist(parsed);
            setWishlistIds(new Set(parsed.map((p: WishlistProduct) => p._id)));
          } catch {
            setWishlist([]);
            setWishlistIds(new Set());
          }
        }
      }
      setIsLoading(false);
    };

    loadWishlist();
  }, [user]);

  const toggleWishlist = async (product: WishlistProduct) => {
    const exists = wishlistIds.has(product._id);
    let updated: WishlistProduct[];

    if (exists) {
      updated = wishlist.filter((p) => p._id !== product._id);
    } else {
      updated = [...wishlist, product];
    }

    setWishlist(updated);
    setWishlistIds(new Set(updated.map((p) => p._id)));

    if (user) {
      try {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id }),
        });
      } catch (e) {
        console.error("Failed to toggle wishlist in DB:", e);
      }
    } else {
      localStorage.setItem("handa_wishlist", JSON.stringify(updated));
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
