"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AccountDropdown({ onClose, anchorRef }) {
  const { data: session } = useSession();
  const router = useRouter();
  const dropdownRef = useRef();

  // 📦 Close on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !anchorRef.current?.contains(e.target)
      ) {
        onClose();
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, anchorRef]);

  return (
    <div
      ref={dropdownRef}
      className="absolute mt-2 right-0 w-64 bg-white shadow-lg border rounded z-50"
    >
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Image
            src={session?.user?.image || assets.user_icon}
            alt="User"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-medium">{session?.user?.name}</p>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-2">
        <button
          onClick={() => {
            onClose();
            router.push("/cart");
          }}
          className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
        >
          🛒 View Cart
        </button>
         <button
          onClick={() => {
            onClose();
            router.push("/my-orders");
          }}
          className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
        >
          🛍️ My Orders
        </button>
        <button
          onClick={() => {
            onClose();
            router.push("/account");
          }}
          className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
        >
          👤 Account Settings
        </button>
        <button
          onClick={() => {
            signOut();
            onClose();
          }}
          className="w-full text-left px-4 py-2 rounded hover:bg-red-50 text-red-600"
        >
          🔓 Logout
        </button>
      </div>
    </div>
  );
}
