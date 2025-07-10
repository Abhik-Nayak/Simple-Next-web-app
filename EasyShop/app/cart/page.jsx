"use client";
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { useSession } from "next-auth/react";
import { useCart } from "../hooks/useCart";
import Loading from "@/components/Loading";

const Cart = () => {
  const { data: session, status } = useSession();
  const {
    cartItems,
    isLoading,
    isProcessing,
    error,
    removeFromCart,
    updateCartQuantity,
  } = useCart();
  const { router, getCartCount } = useAppContext();

  /**
   * Calculates the total sum and quantity of items in the cart using React.useMemo.
   * 
   * React.useMemo is a React Hook that memoizes the result of a computation,
   * only recalculating the value when its dependencies change. In this case,
   * the computation (reducing cartItems to sum and quantity) will only run
   * when the cartItems object changes, improving performance by avoiding
   * unnecessary recalculations on every render.
   *
   * @constant
   * @type {{ sum: number, quantity: number }}
   * @property {number} sum - The total price of all items in the cart.
   * @property {number} quantity - The total quantity of all items in the cart.
   */
  const { sum, quantity } = React.useMemo(() => {
    const result = Object.values(cartItems).reduce(
      (acc, { quantity, productPrice }) => {
        acc.sum += quantity * productPrice;
        acc.quantity += quantity;
        return acc;
      },
      { sum: 0, quantity: 0 }
    );
    return {
      sum: Number(result.sum.toFixed(2)),
      quantity: result.quantity,
    };
  }, [cartItems]);

  // ✅ Conditional rendering *after* all hooks
  if (status === "loading") return <Loading/>;
  if (isLoading) return <p>Loading cart...</p>;
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-orange-600">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">
              {quantity} Items
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Product Details
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Price
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Quantity
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(cartItems).map((product) => {
                  return (
                    <tr key={product.productId}>
                      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                            <Image
                              src={product.productImage}
                              alt={product.productName}
                              className="w-16 h-auto object-cover mix-blend-multiply"
                              width={1280}
                              height={720}
                            />
                          </div>
                          <button
                            className="md:hidden text-xs text-orange-600 mt-1"
                            onClick={() => removeFromCart(product.productId)}
                            disabled={isProcessing}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-sm hidden md:block">
                          <p className="text-gray-800">{product.productName}</p>
                          <button
                            className="text-xs text-orange-600 mt-1"
                            onClick={() => removeFromCart(product.productId)}
                            disabled={isProcessing}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        ${product.productPrice}
                      </td>
                      <td className="py-4 md:px-4 px-1">
                        <div className="flex items-center md:gap-2 gap-1">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                product.productId,
                                Number(product.quantity - 1)
                              )
                            }
                            className={`${
                              product.quantity >= 2 ? "" : "invisible"
                            }`}
                            disabled={isProcessing}
                          >
                            <Image
                              src={assets.decrease_arrow}
                              alt="decrease_arrow"
                              className="w-4 h-4"
                            />
                          </button>
                          <input
                            // onChange={(e) =>
                            //   updateCartQuantity(
                            //     product.productId,
                            //     Number(e.target.value)
                            //   )
                            // }
                            disabled
                            type="number"
                            value={product.quantity}
                            className="w-8 border text-center appearance-none"
                          ></input>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                product.productId,
                                Number(product.quantity + 1)
                              )
                            }
                            className={`${
                              product.quantity < 5 ? "" : "invisible"
                            }`}
                            disabled={isProcessing}
                          >
                            <Image
                              src={assets.increase_arrow}
                              alt="increase_arrow"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-600">
                        ${(product.productPrice * product.quantity).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => router.push("/all-products")}
            className="group flex items-center mt-6 gap-2 text-orange-600"
          >
            <Image
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
            />
            Continue Shopping
          </button>
        </div>
        <OrderSummary totalItemsInCart={quantity} totalValue={sum} />
      </div>
    </>
  );
};

export default Cart;
