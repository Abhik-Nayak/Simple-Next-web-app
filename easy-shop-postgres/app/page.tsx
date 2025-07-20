'use client'
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";


export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <Navbar/>
      {session ? (
        <>
          <p>Welcome {session.user?.email}</p>
          <p>Role: {session.user?.role}</p>
          <button onClick={() => signOut()}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => signIn()}>Login</button>
        </>
      )}
    </div>
  );
}
