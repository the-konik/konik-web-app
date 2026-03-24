import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { subscriptionCheckoutSchema } from "@/lib/validators/checkout";
import { createSubscriptionCheckoutSession } from "@/services/subscriptions/checkout";

const DEFAULT_APP =
  process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "http://localhost:3000";

/**
 * Stripe Checkout `mode: subscription` for a `SubscriptionPlan` with `stripePriceId`.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = subscriptionCheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  const successUrl =
    parsed.data.successUrl ||
    `${DEFAULT_APP}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;

  const cancelUrl = parsed.data.cancelUrl || `${DEFAULT_APP}/shop`;

  try {
    const { url } = await createSubscriptionCheckoutSession({
      userId: session.user.id,
      email: session.user.email,
      planId: parsed.data.planId,
      successUrl,
      cancelUrl,
    });
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[checkout/subscription]", e);
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
