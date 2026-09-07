// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    // Create response
    const response = NextResponse.json(
      { 
        success: true, 
        message: "Logged out successfully",
        clearStorage: true 
      },
      { status: 200 }
    );
    
    // Delete all cookies
    const allCookies = cookieStore.getAll();
    allCookies.forEach(cookie => {
      response.cookies.delete(cookie.name);
    });
    
    // Explicitly delete auth cookies
    response.cookies.delete("adminToken");
    // Add cache-control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
    
  } catch (error) {
    console.error("Logout error:", error);
    
    const errorResponse = NextResponse.json(
      { 
        success: false, 
        error: "Logout failed",
        clearStorage: true 
      },
      { status: 500 }
    );
    
    // Add cache-control headers
    errorResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    errorResponse.headers.set('Pragma', 'no-cache');
    errorResponse.headers.set('Expires', '0');
    
    return errorResponse;
  }
}