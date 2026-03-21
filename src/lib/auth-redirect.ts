/**
 * Post-login routing: staff should land on the admin app, not the user dashboard,
 * unless they explicitly came from another `callbackUrl` (e.g. /shop, or /admin/...).
 */

export const DEFAULT_USER_HOME = "/dashboard/dashboard";
export const STAFF_ADMIN_HOME = "/admin/admin";

/** Public route for credentials sign-in (panel + deep links). */
export const STAFF_LOGIN_PATH = "/auth/staff/login";

/** Matches `effectiveStaffFromAuthUser` logic without Prisma imports (client-safe). */
export function sessionUserHasStaffAccess(user: {
  role: string;
  staffRole?: string | null;
}): boolean {
  if (user.staffRole != null && user.staffRole !== "") return true;
  if (user.role === "ADMIN") return true;
  return false;
}

export function postAuthRedirectUrl(
  isStaff: boolean,
  callbackUrl: string
): string {
  if (!isStaff) return callbackUrl || DEFAULT_USER_HOME;

  if (
    callbackUrl === DEFAULT_USER_HOME ||
    callbackUrl.startsWith("/dashboard/")
  ) {
    return STAFF_ADMIN_HOME;
  }

  return callbackUrl;
}
