import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { mixedCartSchema } from "@/lib/validators/checkout";
import { expandMixedCartForCheckout } from "@/services/order-fulfillment";
import { getOrCreateStripeCustomerId } from "@/services/stripe-customer";

const DEFAULT_APP =
  process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "http://localhost:3000";

/**
 * Creates a `Order` (PENDING) + Stripe Checkout Session (`mode: payment`)
 * for a mixed cart of clothing (`PRODUCT`) and digital tools (`TOOL`).
 *
 * One-time cart only. For recurring plans use `POST /api/checkout/subscription`.
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

  const parsed = mixedCartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid cart" },
      { status: 400 }
    );
  }

  const successUrl =
    parsed.data.successUrl ||
    `${DEFAULT_APP}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;

  const cancelUrl = parsed.data.cancelUrl || `${DEFAULT_APP}/cart`;

  try {
    const { lines, stripeLineItems, total } = await expandMixedCartForCheckout(
      parsed.data.items
    );

    const order = await db.order.create({
      data: {
        userId: session.user.id,
        totalAmount: total,
        paymentStatus: "PENDING",
        status: "PENDING",
        items: { create: lines },
      },
    });

    const customerId = await getOrCreateStripeCustomerId(
      session.user.id,
      session.user.email
    );

    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: stripeLineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
        kind: "mixed_cart",
      },
      payment_intent_data: {
        metadata: { orderId: order.id, userId: session.user.id },
      },
    });

    await db.order.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: checkoutSession.id },
    });

    return NextResponse.json({
      url: checkoutSession.url,
      orderId: order.id,
    });
  } catch (e) {
    console.error("[checkout/create-session]", e);
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
