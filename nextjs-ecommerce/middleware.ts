import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwtToken } from "./lib/jwt";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const verified = token && verifyJwtToken(token);

  const protectedPaths = ["/dashboard", "/cart", "/checkout"];

  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !verified) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/cart", "/checkout"],
};
