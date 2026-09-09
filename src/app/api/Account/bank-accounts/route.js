import {NextResponse} from "next/server";

export async function GET() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/account/fetchAccounts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json(
            {
                valid: false,
                error: data.message || data.error || "Failed to fetch bank accounts",
            },
            {status: response.status}
        );
    }

    return NextResponse.json(
        {
            valid: true,
            data: data,
        },
        {status: 200}
    );
}