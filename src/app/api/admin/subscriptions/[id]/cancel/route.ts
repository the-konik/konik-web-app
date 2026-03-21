import { NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/api-auth";
import { adminCancelSubscription } from "@/services/subscription-admin";

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST — Cancel subscription (Stripe API if linked).
 */
export async function POST(_req: Request, ctx: Ctx) {
  const gate = await requireApiStaffCan("subscriptions", "write");
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;

  try {
    await adminCancelSubscription(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Cancel failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
