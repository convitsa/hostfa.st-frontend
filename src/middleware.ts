import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname, search } = request.nextUrl;
  const protocol = request.nextUrl.protocol || "https:";

  // Retrieve configured domains or fallback
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "app.hostfa.st";
  const marketingDomain = process.env.NEXT_PUBLIC_MARKETING_DOMAIN || "hostfa.st";

  let isAppDomain = false;
  let isMarketingDomain = false;
  let appBaseUrl = "";
  let marketingBaseUrl = "";

  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    const port = host.split(":")[1] || "3000";
    if (host.startsWith("app.")) {
      isAppDomain = true;
    } else {
      isMarketingDomain = true;
    }
    appBaseUrl = `${protocol}//app.localhost:${port}`;
    marketingBaseUrl = `${protocol}//127.0.0.1:${port}`;
  } else {
    if (host.startsWith("app.")) {
      isAppDomain = true;
    } else {
      isMarketingDomain = true;
    }
    appBaseUrl = `${protocol}//${appDomain}`;
    marketingBaseUrl = `${protocol}//${marketingDomain}`;
  }

  // App routes that are served by app.hostfa.st
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/sites") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/onboarding") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/reset-password";

  console.log("MIDDLEWARE LOG:", {
    host,
    pathname,
    isAppDomain,
    isMarketingDomain,
    appBaseUrl,
    marketingBaseUrl,
    isAppRoute,
  });

  // Enforce domain routing
  if (isAppDomain && !isAppRoute) {
    // Redirect marketing pages on the app domain to marketing domain
    const targetUrl = new URL(pathname + search, marketingBaseUrl);
    return new NextResponse(null, {
      status: 307,
      headers: {
        "Location": targetUrl.toString(),
      },
    });
  }

  if (isMarketingDomain && isAppRoute) {
    // Redirect app/auth/dashboard pages on the marketing domain to app domain
    const targetUrl = new URL(pathname + search, appBaseUrl);
    return new NextResponse(null, {
      status: 307,
      headers: {
        "Location": targetUrl.toString(),
      },
    });
  }

  // Proceed with authentication guards (only relevant on the app domain)
  const token = request.cookies.get("token")?.value;

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
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
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

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

