"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import AccountModal from "@/components/AccountModal";
import { assets } from "@/assets/assets";

export default function AccountButton() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);

  if (status === "loading") return <span>Loading...</span>;

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-2 hover:text-gray-900 transition"
      >
        <Image src={assets.user_icon} alt="user" className="w-5 h-5" />
        Sign In
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 hover:text-gray-900 transition"
      >
        <Image
          src={session.user.image || assets.user_icon}
          alt="user"
          width={32}
          height={32}
          className="rounded-full"
        />
        {session.user.name?.split(" ")[0]}
      </button>

      {showModal && <AccountModal onClose={() => setShowModal(false)} />}
    </>
  );
}
