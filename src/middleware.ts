import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the i18n middleware
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle locale routing first
  const response = intlMiddleware(request);

  // Get the pathname after locale is processed
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ar)/, "") || "/";

  // Skip auth check for login page
  if (
    pathnameWithoutLocale === "/login" ||
    pathnameWithoutLocale.startsWith("/login")
  ) {
    return response;
  }

  // Check authentication
  const token = request.cookies.get("foodlab_auth_token")?.value;
  if (!token) {
    const locale = pathname.startsWith("/ar") ? "ar" : "en";
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)"],
};
