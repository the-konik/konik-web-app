import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import type { UserRole } from "@prisma/client";
import { roleMeetsMinimum } from "@/lib/auth/rbac";
import type { Session } from "next-auth";
import type { StaffRole } from "@prisma/client";
import {
  canReadSection,
  canWriteSection,
  getEffectiveStaffRole,
  type AdminSection,
} from "@/lib/auth/staff-rbac";

type ApiAuthResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse };

type ApiStaffResult =
  | { ok: true; session: Session; staff: StaffRole }
  | { ok: false; response: NextResponse };

export async function requireApiSession(): Promise<ApiAuthResult> {
  const session = await auth();
  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, session };
}

/** Any user with admin panel access (staff role or legacy `UserRole.ADMIN`). */
export async function requireApiStaff(): Promise<ApiStaffResult> {
  const result = await requireApiSession();
  if (!result.ok) return result;
  const staff = getEffectiveStaffRole(result.session);
  if (!staff) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { ok: true, session: result.session, staff };
}

export async function requireApiStaffCan(
  section: AdminSection,
  mode: "read" | "write"
): Promise<ApiStaffResult> {
  const r = await requireApiStaff();
  if (!r.ok) return r;
  const allowed =
    mode === "read"
      ? canReadSection(r.staff, section)
      : canWriteSection(r.staff, section);
  if (!allowed) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return r;
}

export async function requireApiSuperStaff(): Promise<ApiStaffResult> {
  const r = await requireApiStaff();
  if (!r.ok) return r;
  if (r.staff !== "SUPER_ADMIN") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return r;
}

/**
 * @deprecated Prefer `requireApiStaff` / `requireApiStaffCan`.
 * Historically "admin API"; now any staff panel user.
 */
export async function requireApiAdmin(): Promise<ApiAuthResult> {
  const r = await requireApiStaff();
  if (!r.ok) return r;
  return { ok: true, session: r.session };
}

export async function requireApiRole(
  minimum: UserRole
): Promise<ApiAuthResult> {
  const result = await requireApiSession();
  if (!result.ok) return result;
  if (!roleMeetsMinimum(result.session.user.role, minimum)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return result;
}

/** For storefront catalog: `admin=true` requires staff that can read products. */
export async function canUseAdminProductCatalog(): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
  const staff = getEffectiveStaffRole(session);
  if (!staff) return false;
  return canReadSection(staff, "products");
}
