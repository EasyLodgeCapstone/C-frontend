import {NextResponse} from "next/server";

export async function POST(request) {
    const requestBody = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/account/createAccount`, {
        method: "POST",
        headers: {  
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("📦 Create Bank Account Response:", data); // Log the response data for debugging

    if (!response.ok) {
        return NextResponse.json(
            {
                valid: false,
                error: data.message || data.error || "Failed to create bank account",
            },
            {status: response.status}
        );
    }

    return NextResponse.json(
        {
            valid: true,
            message: "Bank account created successfully",
            data: data,
        },
        {status: 200}
    );
}