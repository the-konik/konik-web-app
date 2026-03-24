import type { SubscriptionPlanTier, UserRole } from "@prisma/client";
import { db } from "@/lib/db/prisma";

/** Tier strength for picking the best role when a user has multiple paying subs. */
export const TIER_RANK: Record<SubscriptionPlanTier, number> = {
  SUBSCRIBER: 1,
  PREMIUM: 2,
  VIP: 3,
};

export const tierToRole: Record<SubscriptionPlanTier, UserRole> = {
  SUBSCRIBER: "SUBSCRIBER",
  PREMIUM: "PREMIUM",
  VIP: "VIP",
};

/** Subscriptions that still grant plan tools + tier role (grace for PAST_DUE). */
export const SUBSCRIPTION_ACCESS_STATUSES = [
  "ACTIVE",
  "TRIALING",
  "PAST_DUE",
] as const;

export type SubscriptionAccessStatus =
  (typeof SUBSCRIPTION_ACCESS_STATUSES)[number];

/**
 * After any subscription row changes: set `User.role` from the highest-tier
 * paying subscription, or `USER` if none (never changes `ADMIN`).
 */
export async function reconcileUserRoleFromSubscriptions(
  userId: string
): Promise<void> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user || user.role === "ADMIN") return;

  const subs = await db.subscription.findMany({
    where: {
      userId,
      status: { in: [...SUBSCRIPTION_ACCESS_STATUSES] },
    },
    include: { plan: true },
  });

  if (subs.length === 0) {
    await db.user.update({
      where: { id: userId },
      data: { role: "USER" },
    });
    return;
  }

  let bestTier: SubscriptionPlanTier = "SUBSCRIBER";
  for (const s of subs) {
    if (TIER_RANK[s.plan.tier] > TIER_RANK[bestTier]) {
      bestTier = s.plan.tier;
    }
  }

  await db.user.update({
    where: { id: userId },
    data: { role: tierToRole[bestTier] },
  });
}
