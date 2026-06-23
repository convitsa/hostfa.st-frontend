import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Paths requiring authentication
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/sites") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/onboarding");

  // Paths for unauthenticated users only
  const isAuthRoute =
    pathname === "/login" || pathname === "/register";

  if (isProtectedRoute && !token) {
    // Redirect to login page
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    // Redirect to dashboard page
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/onboarding") && token) {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiBase}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const user = await res.json();
        if (user.onboarding_complete) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    } catch (e) {
      console.error("Middleware fetch /auth/me failed:", e);
    }
  }

  return NextResponse.next();
}

// Specify the paths to match
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sites/:path*",
    "/billing/:path*",
    "/onboarding/:path*",
    "/login",
    "/register",
  ],
};

