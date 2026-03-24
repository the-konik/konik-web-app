import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/prisma";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  firstName: z.string().min(1, "First name is required").optional(),
  surname: z.string().min(1, "Surname is required").optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  dateOfBirth: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      const message =
        validated.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const name = validated.data.name.trim();
    const email = validated.data.email.trim().toLowerCase();
    const password = validated.data.password;
    const firstName = validated.data.firstName?.trim() || null;
    const surname = validated.data.surname?.trim() || null;
    const dateOfBirth = validated.data.dateOfBirth
      ? new Date(validated.data.dateOfBirth)
      : null;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        name,
        firstName,
        surname,
        email,
        password: hashedPassword,
        dateOfBirth,
        emailVerified: new Date(), // Verified via OTP flow
      },
    });

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (e) {
    console.error("[api/auth/register]", e);

    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const message =
      process.env.NODE_ENV === "development" && e instanceof Error
        ? e.message
        : "Something went wrong";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
