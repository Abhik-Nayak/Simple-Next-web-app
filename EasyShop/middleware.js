// middleware.js (root level)
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });

  const protectedRoutes = ["/cart", "/my-orders", "/order-placed"];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/", req.url)); // redirect to homepage or login
  }

  return NextResponse.next(); // allow the request
}
