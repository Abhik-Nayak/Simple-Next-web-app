"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useCart() {
  const { status } = useSession();
  const [cartItems, setCartItems] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch cart on mount //GET
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

  // ✅ Remove item // DELETE
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

  // ✅ Update quantity //UPDATE
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

  // ✅Add to cart //POST
  const addToCart = async (productData) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorMessage = await res.text(); // since your server returns plain text
        toast.error(errorMessage || "Failed to add item to cart");
        setIsProcessing(false)
        return;
      }

      const data = await res.json();

      if (data.success) {
        toast.success("Added to cart!");
      } else {
        toast.error(data.message || "Error adding to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong. Please try again.");
    }
    setIsProcessing(false)
  };
  return {
    cartItems,
    isLoading,
    isProcessing,
    error,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    // checkout,
  };
}
