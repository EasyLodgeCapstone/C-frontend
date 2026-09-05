import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {

    const {searchParams} = new URL(request.url);
    const productId = searchParams.get("id");

     if (!productId) {
      return NextResponse.json(
        {
          valid: false,
          error: "Product ID is required",
        },
        { status: 400 }
      );
    }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/fetchOne?id=${productId}`,
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
          error: data.message || data.error || "failed to fetch product",
        },
        { status: response.status },
      );
      return errorResponse;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      {
        valid: false,
        error: "An unexpected error occurred while fetching product",
      },
      { status: 500 },
    );
  }
}
