import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/prisma";

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Code must be 6 digits"),
});

/**
 * POST /api/auth/verify-otp
 * Validates OTP code against VerificationToken.
 * On success, marks token as used (deletes it).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const code = parsed.data.code;

    // Find valid token
    const token = await db.verificationToken.findFirst({
      where: {
        identifier: `otp:${email}`,
        token: code,
        expires: { gt: new Date() },
      },
    });

    if (!token) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Delete used token (one-time use)
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: token.identifier,
          token: token.token,
        },
      },
    });

    return NextResponse.json({ verified: true });
  } catch (e) {
    console.error("[api/auth/verify-otp]", e);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
