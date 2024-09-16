import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/db";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { address, transactionHash } = await req.json();

    
    console.log("address", address)
    console.log("transactionHash", transactionHash)
    // Validate input
    if (!address || !transactionHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Add user to the database
    await db.cryptoAddress.create({
      data: {
        address,
        transactionHash,
        type: 'ETH', // Add a default value or get it from the request
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}