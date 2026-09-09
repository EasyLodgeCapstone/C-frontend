import {NextResponse} from "next/server";

export async function DELETE(request) {
  const {searchParams} = new URL(request.url);
  const productId = searchParams.get("id");
  console.log(productId, "productId from deleteProduct route.js");

    if (!productId) {
        return NextResponse.json(
            {
                valid: false,
                error: "Product ID is required",
            },
            {status: 400}
        );
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/deleteProduct?id=${productId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json(
            {
                valid: false,
                error: data.message || data.error || "Failed to delete product",
            },
            {status: response.status}
        );
    }   

    return NextResponse.json(
        {
            valid: true,
            message: "Product deleted successfully",
            data: data,
        },
        {status: 200}
    );
}
