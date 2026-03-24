import { db } from "@/lib/db/prisma";
import type { ToolAccessSource } from "@prisma/client";
import {
  SUBSCRIPTION_ACCESS_STATUSES,
  TIER_RANK,
} from "@/services/subscriptions/role";

/**
 * Latest active (or trialing) subscription for billing-based tool access.
 */
export async function getActiveSubscription(userId: string) {
  const subs = await db.subscription.findMany({
    where: {
      userId,
      status: { in: [...SUBSCRIPTION_ACCESS_STATUSES] },
    },
    include: {
      plan: {
        include: {
          tools: { include: { tool: true } },
        },
      },
    },
  });
  if (subs.length === 0) return null;
  subs.sort((a, b) => {
    const tier = TIER_RANK[b.plan.tier] - TIER_RANK[a.plan.tier];
    if (tier !== 0) return tier;
    const ae = a.currentPeriodEnd?.getTime() ?? 0;
    const be = b.currentPeriodEnd?.getTime() ?? 0;
    return be - ae;
  });
  return subs[0];
}

/**
 * Core access-control logic for tools.
 * A user can access a tool if:
 *   1. Valid `UserToolAccess` row (purchase, manual grant, trial, etc.), OR
 *   2. An active/trialing subscription plan includes the tool.
 */
export async function hasToolAccess(
  userId: string,
  toolId: string
): Promise<boolean> {
  const directAccess = await db.userToolAccess.findUnique({
    where: { userId_toolId: { userId, toolId } },
  });

  if (directAccess) {
    if (directAccess.expiresAt && directAccess.expiresAt < new Date()) {
      return false;
    }
    return true;
  }

  const subs = await db.subscription.findMany({
    where: {
      userId,
      status: { in: [...SUBSCRIPTION_ACCESS_STATUSES] },
    },
    include: { plan: { include: { tools: true } } },
  });
  return subs.some((s) =>
    s.plan.tools.some((pt) => pt.toolId === toolId)
  );
}

export async function getUserTools(userId: string) {
  const [directAccess, payingSubs] = await Promise.all([
    db.userToolAccess.findMany({
      where: { userId },
      include: { tool: true },
    }),
    db.subscription.findMany({
      where: {
        userId,
        status: { in: [...SUBSCRIPTION_ACCESS_STATUSES] },
      },
      include: {
        plan: {
          include: {
            tools: { include: { tool: true } },
          },
        },
      },
    }),
  ]);

  const accessibleToolIds = new Set<string>();
  const accessibleTools: Array<{
    tool: (typeof directAccess)[0]["tool"];
    source: "purchase" | "subscription" | "manual" | "trial";
  }> = [];

  function directSourceLabel(
    s: ToolAccessSource
  ): "purchase" | "manual" | "trial" {
    switch (s) {
      case "MANUAL_GRANT":
        return "manual";
      case "TRIAL":
        return "trial";
      case "SUBSCRIPTION_PLAN":
        return "purchase";
      default:
        return "purchase";
    }
  }

  for (const access of directAccess) {
    if (access.expiresAt && access.expiresAt < new Date()) continue;
    accessibleToolIds.add(access.toolId);
    accessibleTools.push({
      tool: access.tool,
      source: directSourceLabel(access.source),
    });
  }

  for (const sub of payingSubs) {
    for (const planTool of sub.plan.tools) {
      if (!accessibleToolIds.has(planTool.toolId)) {
        accessibleToolIds.add(planTool.toolId);
        accessibleTools.push({ tool: planTool.tool, source: "subscription" });
      }
    }
  }

  return accessibleTools;
}

export async function grantToolAccess(
  userId: string,
  toolId: string,
  options?: {
    expiresAt?: Date;
    source?: ToolAccessSource;
    orderId?: string;
  }
) {
  const { expiresAt, source = "PURCHASE", orderId } = options ?? {};
  return db.userToolAccess.upsert({
    where: { userId_toolId: { userId, toolId } },
    create: { userId, toolId, expiresAt, source, orderId },
    update: { expiresAt, source, orderId },
  });
}
