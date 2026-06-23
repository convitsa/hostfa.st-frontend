import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handleProxy(req: NextRequest) {
  try {
    const url = new URL(req.url);
    // Remove the /api prefix from the pathname
    const pathname = url.pathname.replace(/^\/api/, "");

    // Construct the backend URL
    const targetUrl = `${API_URL}${pathname}${url.search}`;

    const token = req.cookies.get("token")?.value;

    // Build headers to send to the backend
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      // Do not forward frontend-specific headers
      const lowerKey = key.toLowerCase();
      if (lowerKey !== "host" && lowerKey !== "cookie" && lowerKey !== "connection") {
        headers.set(key, value);
      }
    });

    // Inject JWT Authorization if the cookie is set
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Capture the request body if it exists
    let body: BodyInit | null = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.arrayBuffer();
    }

    // Special intercept: Logout
    if (pathname === "/auth/logout") {
      const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
      response.cookies.set("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        expires: new Date(0), // Delete cookie
      });
      return response;
    }

    // Call backend API
    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    // Special intercept: Login or Register success
    if ((pathname === "/auth/login" || pathname === "/auth/register") && backendResponse.ok) {
      const resData = await backendResponse.clone().json();
      const accessToken = resData.access_token;

      if (accessToken) {
        const response = NextResponse.json(resData, { status: backendResponse.status });
        // Set secure httpOnly cookie
        response.cookies.set("token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        return response;
      }
    }

    // Forward backend response to the client
    const resData = await backendResponse.arrayBuffer();
    const resHeaders = new Headers();
    backendResponse.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey !== "set-cookie" && lowerKey !== "connection" && lowerKey !== "content-encoding") {
        resHeaders.set(key, value);
      }
    });

    return new NextResponse(resData, {
      status: backendResponse.status,
      headers: resHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy connection to backend failed" },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
export const HEAD = handleProxy;
