// middleware.js (root level)
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Middleware to protect routes based on authentication and user role.
//
// - Redirects unauthenticated users away from protected routes.
// - Buyers can access only buyer-specific routes.
// - Sellers can access both buyer and seller features.
// - Note: Sellers are restricted from ordering their own listed products (enforced elsewhere).


export async function middleware(req) {
  const token = await getToken({ req });
  const url = req.nextUrl;

  const protectedBuyerRoutes = ["/cart", "/my-orders", "/order-placed"];
  const protectedSellerRoutes = ["/seller"];

  const isBuyerRoute = protectedBuyerRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  const isSellerRoute = protectedSellerRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  if ((isBuyerRoute || isSellerRoute) && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isSellerRoute && token?.role !== "seller") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // if (isBuyerRoute && token?.role !== "buyer") {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  return NextResponse.next(); // allow the request
}