import type { SubscriptionStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { reconcileUserRoleFromSubscriptions } from "@/services/subscription-role";
import type Stripe from "stripe";

export function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "TRIALING";
    case "active":
      return "ACTIVE";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
    case "paused":
      return "CANCELLED";
    case "incomplete":
      return "PAST_DUE";
    default:
      return "ACTIVE";
  }
}

/**
 * Apply Stripe subscription object to our `Subscription` row (by `stripeSubscriptionId`).
 */
export async function syncStripeSubscriptionToDb(
  stripeSub: Stripe.Subscription
): Promise<void> {
  const local = await db.subscription.findUnique({
    where: { stripeSubscriptionId: stripeSub.id },
  });
  if (!local) return;

  const anchor = stripeSub.items.data[0];
  const periodEnd = anchor
    ? new Date(anchor.current_period_end * 1000)
    : local.currentPeriodEnd;

  await db.subscription.update({
    where: { id: local.id },
    data: {
      status: mapStripeSubscriptionStatus(stripeSub.status),
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: stripeSub.cancel_at_period_end ?? false,
    },
  });

  await reconcileUserRoleFromSubscriptions(local.userId);
}

/**
 * Mark local row cancelled when Stripe deletes the subscription.
 */
export async function markSubscriptionCancelledByStripeId(
  stripeSubscriptionId: string
): Promise<void> {
  const local = await db.subscription.findUnique({
    where: { stripeSubscriptionId },
  });
  if (!local) return;

  await db.subscription.update({
    where: { id: local.id },
    data: {
      status: "CANCELLED",
      cancelAtPeriodEnd: false,
    },
  });

  await reconcileUserRoleFromSubscriptions(local.userId);
}

/**
 * Re-fetch from Stripe and sync (admin / recovery).
 */
export async function refreshSubscriptionFromStripe(
  stripeSubscriptionId: string
): Promise<void> {
  const stripe = getStripe();
  const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  await syncStripeSubscriptionToDb(stripeSub);
}
