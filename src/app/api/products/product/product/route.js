import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const page = searchParams.get("page") || 1;
  const category = searchParams.get("category") || 1;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/fetchSpecProduct?category=${category}&page=${page}`,
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
          error: data.message || data.error || "failed to fetch products",
        },
        { status: response.status },
      );
      return errorResponse;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        valid: false,
        error: "An unexpected error occurred while fetching products",
      },
      { status: 500 },
    );
  }
}
