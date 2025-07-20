'use client'
import { useSession } from "next-auth/react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {}

const Navbar = (props: Props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSeller, setIsSeller] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    useEffect(() => {
        console.log(status, session)
        if (status === "authenticated") {
            setShowAuthModal(false);
            session.user.role === "seller" ? setIsSeller(true) : setIsSeller(false);
        }
    }, [status]);
    return (
        <>
            <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
                <Image
                    className="cursor-pointer w-28 md:w-32"
                    onClick={() => router.push("/")}
                    src={assets.logo}
                    alt="logo"
                />

                <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
                    <Link href="/" className="hover:text-amber-500 transition"> Home</Link>
                    <Link href="/all-products" className="hover:text-amber-500 transition">Shop</Link>
                    <Link href="/about-us" className="hover:text-amber-500 transition">About Us</Link>
                    <Link href="/contact" className="hover:text-amber-500 transition">Contact</Link>
                    {isSeller && (
                        <button
                            onClick={() => router.push("/seller")}
                            className="text-xs border px-4 py-1.5 rounded-full hover:text-amber-500 transition cursor-pointer"
                        >
                            Seller Dashboard
                        </button>
                    )}
                </div>
                <ul className="hidden md:flex items-center gap-4">
                    <Image
                        className="w-4 h-4"
                        src={assets.search_icon}
                        alt="search icon"
                    />
                    {session?.user ? (
                        <p>dfdsfs</p>
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="flex items-center gap-2 hover:text-gray-900 transition"
                        >
                            <Image src={assets.user_icon} alt="user icon" />
                            Sign In
                        </button>
                    )}
                </ul>
            </nav>
        </>
    )
}

export default Navbar;