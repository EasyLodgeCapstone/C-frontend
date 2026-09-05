import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Only admin auth exists for now
  const adminToken = request.cookies.get("adminToken")?.value;
  const isAdmin = !!adminToken;

  // Define route types
  const isMainPage = pathname === "/";
  const isPublicPath = pathname.startsWith("/Public");
  const isAuthPath = pathname.startsWith("/Auth");
  const isProtectedPath = pathname.startsWith("/Protected");
  const isAdminPath = pathname.startsWith("/Admin");
  const isApiPath = pathname.startsWith("/api");

  //  Allow: Main page, Public pages, API routes
  if (isMainPage || isPublicPath || isApiPath) {
    return NextResponse.next();
  }

  //  Auth routes: redirect to home if admin is already logged in
  if (isAuthPath && isAdmin) {
    return NextResponse.redirect(new URL("/Admin/dashboard", request.url));
  }

  //  Protected routes: For now, just allow access (no user auth yet)
  // Later when you add user auth, add: && !isAuthenticated
  if (isProtectedPath) {
    return NextResponse.next();
  }

  //  Admin routes: redirect to admin login if not admin
  if (isAdminPath && !isAdmin) {
    const loginUrl = new URL("/Auth/Admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  //  Allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};