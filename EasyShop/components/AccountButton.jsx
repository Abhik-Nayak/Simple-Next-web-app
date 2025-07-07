"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { assets } from "@/assets/assets";

export default function AccountButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <span>Loading...</span>;

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="flex items-center gap-2 hover:text-gray-900 transition"
      >
        <Image src={assets.user_icon} alt="user" className="w-5 h-5" />
        Sign In
      </button>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 hover:text-gray-900 transition">
        {/* <Image
          src={session.user.image || assets.user_icon}
          alt="user"
          className="w-6 h-6 rounded-full"
        /> */}
        <Image
          src={session.user.image || assets.user_icon}
          alt="user"
          width={32}
          height={32}
          className="rounded-full"
        />
        {session.user.name?.split(" ")[0]}
      </button>
      <div className="absolute top-full mt-2 right-0 w-40 bg-white shadow-lg border rounded hidden group-hover:block z-10">
        <button
          onClick={() => signOut()}
          className="w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
