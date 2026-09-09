import { NextResponse } from "next/server";

export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("id");

  const requestBody = await request.json();

  if (!productId) {
    return NextResponse.json(
      {
        valid: false,
        error: "Product ID is required",
      },
      { status: 400 },
    );
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/updateProduct?id=${productId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      {
        valid: false,
        error: data.message || data.error || "Failed to update product",
      },
      { status: response.status },
    );
  }

  return NextResponse.json(
    {
      valid: true,
      message: "Product updated successfully",
      data: data,
    },
    { status: 200 },
  );
}
