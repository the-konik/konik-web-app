import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/prisma";
import crypto from "crypto";

const schema = z.object({
  email: z.string().email("Invalid email"),
});

/**
 * POST /api/auth/send-otp
 * Generates a 6-digit OTP, stores it in VerificationToken,
 * and sends it via configured SMTP (or logs in dev).
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

    // Check if email already registered
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Rate limit: max 1 OTP per email per 60 seconds
    const recentToken = await db.verificationToken.findFirst({
      where: {
        identifier: `otp:${email}`,
        expires: { gt: new Date(Date.now() - 60_000) },
      },
    });
    if (recentToken) {
      return NextResponse.json(
        { error: "Please wait before requesting another code" },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const code = crypto.randomInt(100_000, 999_999).toString();

    // Store: expires in 10 minutes
    // Clean up old tokens for this email first
    await db.verificationToken.deleteMany({
      where: { identifier: `otp:${email}` },
    });

    await db.verificationToken.create({
      data: {
        identifier: `otp:${email}`,
        token: code,
        expires: new Date(Date.now() + 10 * 60_000), // 10 min
      },
    });

    // Send email via SMTP
    await sendOtpEmail(email, code);

    return NextResponse.json({ message: "Verification code sent" });
  } catch (e) {
    console.error("[api/auth/send-otp]", e);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}

/**
 * Send OTP email. Uses nodemailer if SMTP is configured,
 * otherwise logs to console in development.
 */
async function sendOtpEmail(email: string, code: string) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || "noreply@konik.com";

  if (!smtpHost || !smtpUser || !smtpPass) {
    // Dev fallback: log to console
    console.log(`\n══════════════════════════════════════`);
    console.log(`  📧 OTP for ${email}: ${code}`);
    console.log(`══════════════════════════════════════\n`);
    return;
  }

  // Dynamic import to keep cold-starts fast
  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort) || 587,
    secure: Number(smtpPort) === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transport.sendMail({
    from: `"KONIK" <${smtpFrom}>`,
    to: email,
    subject: "Your KONIK Verification Code",
    text: `Your verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #121212; margin: 0;">KONIK</h1>
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #4B5563; margin: 0 0 16px;">Your verification code is:</p>
          <div style="font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #121212; background: #F8F8F8; border-radius: 12px; padding: 20px; display: inline-block;">
            ${code}
          </div>
        </div>
        <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin-top: 24px;">
          This code expires in 10 minutes.<br/>
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  });
}
