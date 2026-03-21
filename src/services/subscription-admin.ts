import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { reconcileUserRoleFromSubscriptions } from "@/services/subscription-role";
import {
  markSubscriptionCancelledByStripeId,
  syncStripeSubscriptionToDb,
} from "@/services/stripe-subscription-sync";

function addMonths(d: Date, months: number) {
  const next = new Date(d);
  next.setMonth(next.getMonth() + months);
  return next;
}

/**
 * Admin / comp: subscription without Stripe (stripeSubscriptionId null).
 */
export async function adminAssignSubscription(params: {
  userId: string;
  planId: string;
  periodMonths: number;
}) {
  const plan = await db.subscriptionPlan.findUnique({
    where: { id: params.planId },
  });
  if (!plan) throw new Error("Plan not found");

  const userExists = await db.user.findUnique({
    where: { id: params.userId },
    select: { id: true },
  });
  if (!userExists) throw new Error("User not found");

  const now = new Date();
  const periodEnd = addMonths(now, params.periodMonths);

  await db.subscription.create({
    data: {
      userId: params.userId,
      planId: params.planId,
      status: "ACTIVE",
      startDate: now,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
    },
  });

  await reconcileUserRoleFromSubscriptions(params.userId);
}

/**
 * Change plan: updates Stripe if linked, then DB + role.
 */
export async function adminChangeSubscriptionPlan(params: {
  subscriptionId: string;
  newPlanId: string;
}) {
  const sub = await db.subscription.findUnique({
    where: { id: params.subscriptionId },
    include: { plan: true },
  });
  if (!sub) throw new Error("Subscription not found");

  const newPlan = await db.subscriptionPlan.findUnique({
    where: { id: params.newPlanId },
  });
  if (!newPlan) throw new Error("New plan not found");

  if (sub.stripeSubscriptionId && newPlan.stripePriceId) {
    const stripe = getStripe();
    const stripeSub = await stripe.subscriptions.retrieve(
      sub.stripeSubscriptionId
    );
    const itemId = stripeSub.items.data[0]?.id;
    if (!itemId) throw new Error("Stripe subscription has no items");

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      items: [{ id: itemId, price: newPlan.stripePriceId }],
      proration_behavior: "create_prorations",
    });

    const updated = await stripe.subscriptions.retrieve(
      sub.stripeSubscriptionId
    );
    await db.subscription.update({
      where: { id: sub.id },
      data: { planId: newPlan.id },
    });
    await syncStripeSubscriptionToDb(updated);
  } else {
    await db.subscription.update({
      where: { id: sub.id },
      data: { planId: newPlan.id },
    });
    await reconcileUserRoleFromSubscriptions(sub.userId);
  }
}

/**
 * Cancel immediately in Stripe when possible; always mark DB cancelled and fix role.
 */
export async function adminCancelSubscription(subscriptionId: string) {
  const sub = await db.subscription.findUnique({
    where: { id: subscriptionId },
  });
  if (!sub) throw new Error("Subscription not found");

  if (sub.stripeSubscriptionId) {
    const stripe = getStripe();
    await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
    await markSubscriptionCancelledByStripeId(sub.stripeSubscriptionId);
  } else {
    await db.subscription.update({
      where: { id: sub.id },
      data: { status: "CANCELLED", cancelAtPeriodEnd: false },
    });
    await reconcileUserRoleFromSubscriptions(sub.userId);
  }
}
