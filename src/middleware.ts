import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { StaffRole, UserRole } from "@prisma/client";
import { roleMeetsMinimum } from "@/lib/rbac";
import { effectiveStaffFromAuthUser } from "@/lib/staff-rbac";
import { STAFF_LOGIN_PATH } from "@/lib/auth-redirect";

const { auth } = NextAuth(authConfig);

/** Routes anyone can access (marketing, auth, static API auth handlers). */
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/auth/login",
  "/auth/staff/login",
  "/auth/register",
  "/shop",
  "/tools",
  "/cart",
  "/checkout/success",
  "/plans",
  "/company",
  "/api/auth",
];

/** Admin UI — staff JWT / legacy `UserRole.ADMIN` (see `staff-rbac`). */
const adminRoutePrefixes = ["/admin"];

/**
 * Optional tier gates: add entries when you ship premium/VIP-only pages.
 * Example: `{ prefix: "/members/premium", minimumRole: "PREMIUM" }`
 */
const tierRouteRules: { prefix: string; minimumRole: UserRole }[] = [
  // { prefix: "/members/premium", minimumRole: "PREMIUM" },
  // { prefix: "/members/vip", minimumRole: "VIP" },
];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function tierRuleForPath(pathname: string) {
  return tierRouteRules.find((rule) => matchesPrefix(pathname, rule.prefix));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role as UserRole | undefined;

  const isPublicRoute = pathname === "/" || publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  console.log(`Middleware: ${pathname} | isPublic: ${isPublicRoute} | isLoggedIn: ${isLoggedIn}`);

  const isAdminRoute = adminRoutePrefixes.some((prefix) =>
    matchesPrefix(pathname, prefix)
  );

  const isApiRoute = pathname.startsWith("/api");

  // API routes: handle auth inside each handler with `requireApiSession` / `requireApiAdmin`.
  if (isApiRoute) return NextResponse.next();

  // ── Tiered premium/VIP sections (optional) ─────────────────────────────
  const tierRule = tierRuleForPath(pathname);
  if (tierRule && !isPublicRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.nextUrl)
      );
    }
    if (!role || !roleMeetsMinimum(role, tierRule.minimumRole)) {
      return NextResponse.redirect(
        new URL("/dashboard/dashboard?notice=upgrade_required", req.nextUrl)
      );
    }
  }

  // ── Admin panel ─────────────────────────────────────────────────────────
  if (isAdminRoute) {
    const user = req.auth?.user as
      | { role: UserRole; staffRole?: StaffRole | null }
      | undefined;
    const staff = user ? effectiveStaffFromAuthUser(user) : null;
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(
        pathname + req.nextUrl.search
      );
      return NextResponse.redirect(
        new URL(
          `${STAFF_LOGIN_PATH}?callbackUrl=${callbackUrl}`,
          req.nextUrl
        )
      );
    }
    if (!staff) {
      return NextResponse.redirect(
        new URL(
          `${STAFF_LOGIN_PATH}?error=${encodeURIComponent("Staff access required")}`,
          req.nextUrl
        )
      );
    }
    return NextResponse.next();
  }

  // ── Default protected app (dashboard, checkout, etc.) ─────────────────
  if (!isPublicRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
