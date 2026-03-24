import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/prisma";

/**
 * POST /api/auth/claim-welcome-discount
 * Marks the authenticated user's welcome 40% discount as claimed.
 * The discount is auto-applied at checkout if this flag is set and no orders exist.
 */
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.user.update({
      where: { email: session.user.email },
      data: { firstPurchaseDiscountClaimed: true },
    });

    return NextResponse.json({ claimed: true });
  } catch (e) {
    console.error("[api/auth/claim-welcome-discount]", e);
    return NextResponse.json(
      { error: "Failed to claim discount" },
      { status: 500 }
    );
  }
}
