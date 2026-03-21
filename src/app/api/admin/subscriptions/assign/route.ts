import { NextRequest, NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/api-auth";
import { adminAssignSubscriptionSchema } from "@/lib/validators/admin-subscription";
import { adminAssignSubscription } from "@/services/subscription-admin";

/**
 * POST — Assign a comp / manual subscription (no Stripe charge).
 */
export async function POST(req: NextRequest) {
  const gate = await requireApiStaffCan("subscriptions", "write");
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = adminAssignSubscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  try {
    await adminAssignSubscription(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Assign failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
