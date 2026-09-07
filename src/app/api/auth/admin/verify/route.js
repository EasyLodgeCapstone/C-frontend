// app/api/auth/verify/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("adminToken")?.value;

   

    // Validate token exists
    if (!token) {
      return NextResponse.json(
        { 
          valid: false, 
          error: "No token provided" 
        },
        { status: 401 }
      );
    }

    // Forward to backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-auth/verify`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
    

    

    if (!response.ok) {
      // Clear invalid cookies
      const errorResponse = NextResponse.json(
        { 
          valid: false, 
          error: data.message || data.error || "Authentication failed" 
        },
        { status: response.status }
      );
      
       
        errorResponse.cookies.delete("adminToken");
      
      return errorResponse;
    }

    //  Return consistent response structure
    return NextResponse.json({
      valid: true,
      user: data , // Handle both response formats
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { 
        valid: false, 
        error: "Authentication failed" 
      },
      { status: 500 }
    );
  }
}
