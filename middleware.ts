import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const publicRoutes = ["/login"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isApiRoute = pathname.startsWith("/api");

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const authToken = req.cookies.get("foodlab_auth_token");

  if (!authToken?.value) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const verification = await verifyToken(authToken.value);

    if (!verification.valid || !verification.payload) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is trying to access master-data routes
    if (pathname.startsWith("/routes/master-data")) {
      const userRole = verification.payload.role;
      if (userRole !== "admin") {
        // Redirect non-admin users to dashboard
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", verification.payload.userId.toString());
    requestHeaders.set("x-user-email", verification.payload.email);
    requestHeaders.set("x-user-role", verification.payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
