import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/db";
export async function POST(req: NextRequest) { 

    const body = await req.json();

    console.log("Logging the body here", body)

    return

    // const { data, error } = await db.from("CryptoAddress").insert([{ address, type }]);

    // if (error) {
    //     return NextResponse.json({ error: error.message }, { status: 500 });
    // }



}