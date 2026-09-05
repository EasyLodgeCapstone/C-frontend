import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/fetchAccount`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      const errorResponse = NextResponse.json(
        {
          valid: false,
          error:
            data.message || data.error || "failed to fetch account details",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      {
        valid: false,
        error: "An unexpected error occurred while fetching account details",
      },
      { status: 500 },
    );
  }
}
