import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/db";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { address, type, amount } = body;

    try {
        const user = await db.cryptoAddress.create({
            data: {
                address,
                type,
                number: 0,
                donationAmount: parseFloat(amount), // Convert to number if needed
                donationTimestamp: new Date(),
            },
        });
        return NextResponse.json({ success: true, user }, { status: 201 });
    } catch (error) {
        console.error("Error adding user:", error);
        return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
    }
}