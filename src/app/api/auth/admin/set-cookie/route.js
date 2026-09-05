import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    //  Next.js 15: Must await cookies()
    const cookieStore = await cookies();
    
    //  Determine environment
    const host = request.headers.get("host") || "";
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
    const isProduction = process.env.NODE_ENV === "production";

    //  Cookie options for Vercel (Frontend) + Render (Backend)
    const cookieOptions = {
      httpOnly: true,
      secure: isLocalhost,      // True on Vercel (HTTPS)
      sameSite: 'none',          // REQUIRED for cross-origin (Vercel != Render)
      maxAge: 60 * 60 * 24 * 7,  // 1 week
      path: "/",
      //  DO NOT set 'domain' for .vercel.app or .onrender.com
    };

    //  Set cookies
    cookieStore.set("adminToken", token, cookieOptions);
    
    // if (refreshToken) {
    //   const refreshOptions = { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 };
    //   cookieStore.set("refreshToken", refreshToken, refreshOptions);
    // }

    return NextResponse.json({
      success: true,
      message: "Session established",
      token,
    });

  } catch (error) {
    console.error("Set-cookie error:", error);
    return NextResponse.json(
      { error: "Failed to set session cookie", details: error.message },
      { status: 500 }
    );
  }
}   