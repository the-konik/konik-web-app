import type { UserRole } from "@prisma/client";

/**
 * Passed from server layout for lightweight role hints in client nav (active states).
 */
export type DashboardRoleContextValue = {
  role: UserRole;
  isPremiumOrAbove: boolean;
  isVipOrAbove: boolean;
  isSubscriberOrAbove: boolean;
};

export function dashboardRoleHints(role: UserRole): DashboardRoleContextValue {
  const rank: Record<UserRole, number> = {
    GUEST: 0,
    USER: 10,
    SUBSCRIBER: 20,
    PREMIUM: 30,
    VIP: 40,
    ADMIN: 100,
  };
  const r = rank[role];
  return {
    role,
    isSubscriberOrAbove: r >= rank.SUBSCRIBER,
    isPremiumOrAbove: r >= rank.PREMIUM,
    isVipOrAbove: r >= rank.VIP,
  };
}
