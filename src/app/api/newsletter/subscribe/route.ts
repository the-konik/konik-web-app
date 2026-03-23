import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await db.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ message: "Already subscribed" });
    }

    await db.newsletter.create({
      data: { email },
    });

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
