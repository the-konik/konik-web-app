import type { Session } from "next-auth";
import type { StaffRole, UserRole } from "@prisma/client";

/** Sidebar / permission sections for the admin panel. */
export const ADMIN_SECTIONS = [
  "dashboard",
  "products",
  "tools",
  "orders",
  "users",
  "subscriptions",
  "marketing",
  "settings",
] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number];

/** Works with JWT `user` in middleware (staffRole may be absent until next login). */
export function effectiveStaffFromAuthUser(user: {
  role: UserRole;
  staffRole?: StaffRole | null;
}): StaffRole | null {
  if (user.staffRole != null) return user.staffRole;
  if (user.role === "ADMIN") return "SUPER_ADMIN";
  return null;
}

export function getEffectiveStaffRole(session: Session | null): StaffRole | null {
  if (!session?.user) return null;
  return effectiveStaffFromAuthUser(session.user);
}

export function hasStaffPanelAccess(session: Session | null): boolean {
  return getEffectiveStaffRole(session) !== null;
}

export function canReadSection(
  staff: StaffRole,
  section: AdminSection
): boolean {
  if (staff === "SUPER_ADMIN" || staff === "ADMIN") return true;
  const reads: Record<
    Exclude<StaffRole, "SUPER_ADMIN" | "ADMIN">,
    AdminSection[]
  > = {
    SALES: [
      "dashboard",
      "orders",
      "users",
      "products",
      "tools",
      "subscriptions",
    ],
    SHIPPING: ["dashboard", "orders", "products"],
    MARKETING: ["dashboard", "marketing", "products", "tools"],
  };
  return reads[staff]?.includes(section) ?? false;
}

export function canWriteSection(
  staff: StaffRole,
  section: AdminSection
): boolean {
  if (staff === "SUPER_ADMIN" || staff === "ADMIN") return true;
  if (staff === "SHIPPING" && section === "orders") return true;
  if (staff === "MARKETING" && section === "marketing") return true;
  return false;
}

export function isSuperAdminStaff(staff: StaffRole): boolean {
  return staff === "SUPER_ADMIN";
}
