import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/db";

export async function POST(req: NextRequest) {
  
    
    return NextResponse.json({ success: true,  }, { status: 201 });

  
}