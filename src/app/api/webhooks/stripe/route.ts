import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { fulfillOrderAfterPayment } from "@/services/orders/fulfillment";
import { activateSubscriptionFromSession } from "@/services/subscriptions/checkout";
import {
  markSubscriptionCancelledByStripeId,
  syncStripeSubscriptionToDb,
} from "@/services/subscriptions/sync";
import type Stripe from "stripe";

export const runtime = "nodejs";

/**
 * Stripe webhook — verify signature, then:
 * - `checkout.session.completed` + `mode: payment` → fulfill mixed cart order
 * - `checkout.session.completed` + `mode: subscription` → create `Subscription`, reconcile role
 * - `customer.subscription.updated` → sync status / period end, reconcile role
 * - `customer.subscription.deleted` → mark cancelled, reconcile role
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const raw = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[stripe webhook] signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "subscription") {
          await activateSubscriptionFromSession(session);
          break;
        }

        if (session.mode === "payment" && session.payment_status === "paid") {
          const orderId =
            session.metadata?.orderId ||
            (typeof session.payment_intent === "object" &&
              session.payment_intent &&
              "metadata" in session.payment_intent &&
              (session.payment_intent as Stripe.PaymentIntent).metadata
                ?.orderId);

          if (orderId) {
            const pi =
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id;
            const result = await fulfillOrderAfterPayment(orderId, {
              stripePaymentIntentId: pi ?? undefined,
            });
            if (!result.ok) {
              console.error(
                "[stripe webhook] fulfill failed",
                orderId,
                result.reason
              );
              return NextResponse.json(
                { received: true, fulfillError: result.reason },
                { status: 500 }
              );
            }
          }
        }
        break;
      }
      case "customer.subscription.updated": {
        const stripeSub = event.data.object as Stripe.Subscription;
        await syncStripeSubscriptionToDb(stripeSub);
        break;
      }
      case "customer.subscription.deleted": {
        const stripeSub = event.data.object as Stripe.Subscription;
        await markSubscriptionCancelledByStripeId(stripeSub.id);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("[stripe webhook] handler", e);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
