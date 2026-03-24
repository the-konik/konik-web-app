import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import type { StaffRole, UserRole } from "@prisma/client";
import { roleMeetsMinimum } from "@/lib/auth/rbac";
import {
  canReadSection,
  getEffectiveStaffRole,
  hasStaffPanelAccess,
  type AdminSection,
} from "@/lib/auth/staff-rbac";
import type { Session } from "next-auth";
import { STAFF_ADMIN_HOME, STAFF_LOGIN_PATH } from "@/lib/auth/auth-redirect";

function loginUrl(message?: string) {
  const base = "/auth/login";
  return message ? `${base}?error=${encodeURIComponent(message)}` : base;
}

function staffLoginUrl(message?: string, callbackPath?: string) {
  const params = new URLSearchParams();
  if (message) params.set("error", message);
  if (callbackPath) params.set("callbackUrl", callbackPath);
  const q = params.toString();
  return q ? `${STAFF_LOGIN_PATH}?${q}` : STAFF_LOGIN_PATH;
}

/**
 * Server Components / Server Actions: require a session or redirect to login.
 */
export async function requireSession(options?: {
  callbackPath?: string;
}): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    const path = options?.callbackPath;
    redirect(
      path
        ? `/auth/login?callbackUrl=${encodeURIComponent(path)}`
        : loginUrl()
    );
  }
  return session;
}

/**
 * Admin panel: any staff role (`User.staffRole`) or legacy `UserRole.ADMIN`
 * (treated as SUPER_ADMIN in JWT — see `auth.config`).
 */
export async function requireStaffPanel(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    redirect(staffLoginUrl(undefined, STAFF_ADMIN_HOME));
  }
  if (!hasStaffPanelAccess(session)) {
    redirect(staffLoginUrl("Staff access required"));
  }
  return session;
}

/** @deprecated Use `requireStaffPanel` — kept for existing imports. */
export async function requireAdmin(): Promise<Session> {
  return requireStaffPanel();
}

/** Enforce read access to an admin sidebar section (blocks deep-links). */
export async function requireStaffSection(
  section: AdminSection
): Promise<{ session: Session; staff: StaffRole }> {
  const session = await requireStaffPanel();
  const staff = getEffectiveStaffRole(session)!;
  if (!canReadSection(staff, section)) {
    redirect(staffLoginUrl("No access to this section"));
  }
  return { session, staff };
}

/** Minimum role (e.g. `PREMIUM` for premium-only pages). */
export async function requireMinimumRole(
  minimum: UserRole,
  options?: { callbackPath?: string }
): Promise<Session> {
  const session = await requireSession(options);
  if (!roleMeetsMinimum(session.user.role, minimum)) {
    redirect(loginUrl("Insufficient permissions"));
  }
  return session;
}
