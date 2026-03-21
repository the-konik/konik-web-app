import type { UserRole } from "@prisma/client";

/**
 * Numeric rank for comparing roles (higher = more privilege).
 * ADMIN can do everything. VIP > PREMIUM > SUBSCRIBER > USER > GUEST.
 */
const ROLE_RANK: Record<UserRole, number> = {
  GUEST: 0,
  USER: 10,
  SUBSCRIBER: 20,
  PREMIUM: 30,
  VIP: 40,
  ADMIN: 100,
};

/** True if `role` is at least as privileged as `minimum`. */
export function roleMeetsMinimum(role: UserRole, minimum: UserRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export function isAdmin(role: UserRole): boolean {
  return role === "ADMIN";
}

/** Premium content: PREMIUM, VIP, or ADMIN. */
export function isPremiumOrAbove(role: UserRole): boolean {
  return roleMeetsMinimum(role, "PREMIUM");
}

/** VIP-only areas: VIP or ADMIN. */
export function isVipOrAbove(role: UserRole): boolean {
  return roleMeetsMinimum(role, "VIP");
}

/** Any normal logged-in customer (excludes GUEST shell accounts if you use them). */
export function isRegisteredCustomer(role: UserRole): boolean {
  return role !== "GUEST";
}
