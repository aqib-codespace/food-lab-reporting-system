import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Public routes that don't require authentication
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  // Allow API routes to handle their own auth
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Check for authentication token in cookies
  const authToken = req.cookies.get("foodlab_auth_token");

  let isAuthenticated = false;

  if (authToken?.value) {
    // Simple check - token exists and is not empty
    isAuthenticated = authToken.value.length > 20;
  }

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If authenticated and trying to access login page, redirect to home
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
