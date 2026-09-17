"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface CartProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  images: string[];
  stock: number;
  sku?: string;
}

export interface CartItem {
  product: CartProduct;
  variant: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  addToCart: (product: CartProduct, variant?: string, quantity?: number) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  removeFromCart: (productId: string, variant: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Load cart on initial mount
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // Sync guest items if any existed in localStorage
        const stored = localStorage.getItem("handa_cart");
        let guestItems = [];
        if (stored) {
          try {
            guestItems = JSON.parse(stored);
          } catch (e) {
            console.error(e);
          }
        }

        if (guestItems.length > 0) {
          try {
            await fetch("/api/cart/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                guestItems: guestItems.map((gi: CartItem) => ({
                  productId: gi.product._id,
                  variant: gi.variant,
                  quantity: gi.quantity,
                })),
              }),
            });
            localStorage.removeItem("handa_cart");
          } catch (e) {
            console.error("Cart sync error:", e);
          }
        }

        // Fetch user's cart from MongoDB
        try {
          const res = await fetch("/api/cart");
          const json = await res.json();
          if (json.success && json.data?.items) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validItems = json.data.items.filter((i: any) => i.product && i.product._id);
            setItems(validItems);
          }
        } catch (e) {
          console.error("Failed to load user cart:", e);
        }
      } else {
        // Guest user: read from localStorage
        const stored = localStorage.getItem("handa_cart");
        if (stored) {
          try {
            setItems(JSON.parse(stored));
          } catch {
            setItems([]);
          }
        }
      }
      setIsLoading(false);
    };

    loadCart();
  }, [user]);

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!user && !isLoading) {
      localStorage.setItem("handa_cart", JSON.stringify(items));
    }
  }, [items, user, isLoading]);

  const addToCart = async (product: CartProduct, variant = "", quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.product._id === product._id && i.variant === variant
      );
      if (idx > -1) {
        const next = [...prev];
        const newQty = Math.min(next[idx].quantity + quantity, product.stock);
        next[idx] = { ...next[idx], quantity: newQty };
        return next;
      }
      return [...prev, { product, variant, quantity: Math.min(quantity, product.stock) }];
    });

    setIsCartDrawerOpen(true);

    if (user) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id,
            variant,
            quantity,
            action: "add",
          }),
        });
      } catch (e) {
        console.error("Failed to add to DB cart:", e);
      }
    }
  };

  const updateQuantity = async (productId: string, variant: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product._id === productId && item.variant === variant) {
          return { ...item, quantity: Math.min(quantity, item.product.stock) };
        }
        return item;
      })
    );

    if (user) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            variant,
            quantity,
            action: "set",
          }),
        });
      } catch (e) {
        console.error("Failed to update DB cart:", e);
      }
    }
  };

  const removeFromCart = async (productId: string, variant: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product._id === productId && item.variant === variant)
      )
    );

    if (user) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            variant,
            action: "remove",
          }),
        });
      } catch (e) {
        console.error("Failed to remove from DB cart:", e);
      }
    }
  };

  const clearCart = () => {
    setItems([]);
    if (!user) {
      localStorage.removeItem("handa_cart");
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
