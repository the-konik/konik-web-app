import { NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/api-auth";
import { db } from "@/lib/db";

/**
 * GET — List subscriptions with user + plan (admin).
 */
export async function GET() {
  const gate = await requireApiStaffCan("subscriptions", "read");
  if (!gate.ok) return gate.response;

  const subscriptions = await db.subscription.findMany({
    include: {
      user: { select: { id: true, email: true, name: true, role: true } },
      plan: true,
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 200,
  });

  return NextResponse.json({ subscriptions });
}
