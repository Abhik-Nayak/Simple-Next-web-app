"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export function useCart() {
  const { status } = useSession();
  const [cartItems, setCartItems] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        if (data.success) {
          setCartItems(data.cartItems || {});
        } else {
          setError("Failed to fetch cart");
        }
      } catch (err) {
        setError("Cart fetch error");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") fetchCart();
  }, [status]);

  // ✅ Remove item
  const removeFromCart = async (productId) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) {
        setCartItems((prev) => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });
      } else {
        setError("Failed to remove item");
      }
    } catch (err) {
      setError("Remove error");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Update quantity
  const updateCartQuantity = async (productId, quantity) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.cartItems);
      } else {
        setError("Failed to update quantity");
      }
    } catch (err) {
      setError("Update quantity error");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    cartItems,
    isLoading,
    isProcessing,
    error,
    // addToCart,
    removeFromCart,
    updateCartQuantity,
    // checkout,
  };
}
