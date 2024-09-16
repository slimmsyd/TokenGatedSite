import { NextRequest, NextResponse } from "next/server";
const { Configuration, OpenAI } = require("openai");

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: apiKey });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    console.log("Message", message);

    // Your OpenAI logic here
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 500,
      messages: [{ role: "user", content: message }],
      temperature: 1,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  // Handle GET requests if needed
  return NextResponse.json(
    { message: "GET method is not supported for this endpoint" },
    { status: 405 }
  );
}
