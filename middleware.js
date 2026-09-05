import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/Public"];
const AUTH_ROUTES = ["/Auth"];
const PROTECTED_ROUTES = ["/Protected"];
const ADMIN_ROUTES = ["/Admin"];

export function middleware(request) {
  // get token from cookies or local storage
  // const token = request.cookies.get("token")?.value ;
  const adminToken = request.cookies.get("adminToken")?.value;

  // Get pathname from request
  const { pathname } = request.nextUrl;

  // check if the user accesed the public routes

  // Check if route is public (no auth required)
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/Public"),
  );

  // Check if route is auth page (login, register, etc.)
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/Auth"),
  );

  // Check if route is protected (requires auth)
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/Protected"),
  );

  // Check if it's an admin route
  const isAdminRoute = ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/Admin"),
  );

  // Check if user is authenticated (has token OR refreshToken)
  const isAuthenticated = !!adminToken;

  if (isPublicRoute || isProtectedRoute) {
    return NextResponse.next();
  }

  const publicPaths = ["/Public", "/Auth", "/Protected"];

  if (
    !isAuthenticated &&
    !publicPaths.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdminRoute) {
    if (!adminToken) {
      //   console.log(`[Middleware] 🔒 Unauthenticated user blocked from admin route: ${pathname} - Redirecting to admin login`);
      const loginUrl = new URL("/Auth/Admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (adminToken) {
      // console.log(`[Middleware] 🔒 Auth route blocked for admin: ${pathname} - Redirecting to admin dashboard`);
      return NextResponse.redirect(new URL("/Admin/dashboard", request.url));
    }
  }
}

// Optional: Configure which paths trigger the middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};