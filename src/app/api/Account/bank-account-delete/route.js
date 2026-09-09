import { NextResponse } from "next/server";

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("id");

    if (!accountId) {
        return NextResponse.json(
            {
                valid: false,
                error: "Account ID is required",
            },
            {status: 400}
        );
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/account/deleteAccount?id=${accountId}`,
        {   
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json(
            {
                valid: false,
                error: data.message || data.error || "Failed to delete bank account",
            },
            {status: response.status}
        );
    }

    return NextResponse.json(
        {
            valid: true,
            message: "Bank account deleted successfully",
            data: data,
        },
        {status: 200}
    );
}