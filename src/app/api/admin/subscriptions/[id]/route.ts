import { NextRequest, NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/auth/api-auth";
import { adminChangeSubscriptionPlanSchema } from "@/lib/validators/admin-subscription";
import { adminChangeSubscriptionPlan } from "@/services/subscriptions/admin";

type Ctx = { params: Promise<{ id: string }> };

/**
 * PATCH — Change plan (Stripe proration when `stripeSubscriptionId` is set).
 */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const gate = await requireApiStaffCan("subscriptions", "write");
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = adminChangeSubscriptionPlanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  try {
    await adminChangeSubscriptionPlan({
      subscriptionId: id,
      newPlanId: parsed.data.planId,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
