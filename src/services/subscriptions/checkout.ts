import { db } from "@/lib/db/prisma";
import { getStripe } from "@/lib/stripe/client";
import { getOrCreateStripeCustomerId } from "@/services/stripe/customer";
import { reconcileUserRoleFromSubscriptions } from "@/services/subscriptions/role";
import { mapStripeSubscriptionStatus } from "@/services/subscriptions/sync";
import type Stripe from "stripe";

/**
 * After Stripe Checkout completes in `subscription` mode: persist `Subscription`
 * and upgrade `User.role` to match plan tier (never downgrades `ADMIN`).
 */
export async function activateSubscriptionFromSession(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;
  const stripeSubId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!userId || !planId || !stripeSubId) {
    console.warn("[subscription] Missing metadata on checkout session");
    return;
  }

  const existing = await db.subscription.findUnique({
    where: { stripeSubscriptionId: stripeSubId },
  });
  if (existing) return;

  const plan = await db.subscriptionPlan.findUnique({ where: { id: planId } });
  if (!plan) {
    console.warn("[subscription] Unknown plan", planId);
    return;
  }

  const stripe = getStripe();
  const sub = await stripe.subscriptions.retrieve(stripeSubId);
  const anchorItem = sub.items.data[0];
  if (!anchorItem) {
    console.warn("[subscription] No subscription items on", stripeSubId);
    return;
  }
  const periodEnd = new Date(anchorItem.current_period_end * 1000);

  const subStatus = mapStripeSubscriptionStatus(sub.status);

  await db.subscription.create({
    data: {
      userId,
      planId,
      status: subStatus,
      stripeSubscriptionId: stripeSubId,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
    },
  });

  await reconcileUserRoleFromSubscriptions(userId);
}

export async function createSubscriptionCheckoutSession(params: {
  userId: string;
  email: string | null | undefined;
  planId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string | null }> {
  const plan = await db.subscriptionPlan.findUnique({
    where: { id: params.planId },
  });
  if (!plan || !plan.active) {
    throw new Error("Plan not available");
  }
  if (!plan.stripePriceId) {
    throw new Error(
      "Plan has no Stripe Price ID — set stripePriceId on SubscriptionPlan in DB"
    );
  }

  const customerId = await getOrCreateStripeCustomerId(
    params.userId,
    params.email
  );
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      planId: plan.id,
      kind: "subscription",
    },
    subscription_data: {
      metadata: { userId: params.userId, planId: plan.id },
    },
  });

  return { url: session.url };
}
