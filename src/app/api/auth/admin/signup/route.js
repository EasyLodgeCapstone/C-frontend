import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { fullName, email, password } = await request.json();

    // Validate input
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-auth/signup`;
    console.log("Calling API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullName,
        email,
        password,
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);

    // Try to get response text first
    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 500 },
      );
    }


    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || data.error || "Failed to sign up" },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Admin signed up successfully",
        data: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Detailed signup error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
