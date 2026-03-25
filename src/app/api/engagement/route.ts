import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { cookies } from "next/headers";
import { db } from "@/lib/db/prisma";
import { ENGAGEMENT_DELTAS } from "@/lib/engagement/track";

const COOKIE_NAME = "konik_score";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event } = body;

    // Validate event type
    const delta = ENGAGEMENT_DELTAS[event];
    if (!delta) {
      return NextResponse.json(
        { error: `Invalid event type: "${event}"` },
        { status: 400 }
      );
    }

    const session = await auth();

    if (session?.user?.email) {
      // Authenticated → increment in DB
      const user = await db.user.update({
        where: { email: session.user.email },
        data: { engagementScore: { increment: delta } },
        select: { engagementScore: true },
      });
      return NextResponse.json({ score: user.engagementScore });
    }

    // Guest → cookie-based
    const cookieStore = await cookies();
    const current = parseInt(cookieStore.get(COOKIE_NAME)?.value || "0", 10) || 0;
    const newScore = current + delta;

    const response = NextResponse.json({ score: newScore });
    response.cookies.set(COOKIE_NAME, String(newScore), {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 90, // 90 days
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Failed to track engagement" },
      { status: 500 }
    );
  }
}
