"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import {
  CreditCard,
  LayoutDashboard,
  Package,
  Shirt,
  User,
  Wrench,
} from "lucide-react";
import { signOut } from "next-auth/react";
import type { DashboardRoleContextValue } from "@/components/dashboard/dashboard-role-context";
import { cn } from "@/lib/utils";

const desktopNav = [
  { href: "/dashboard/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/dashboard/products", label: "My Products", icon: Shirt },
  { href: "/dashboard/dashboard/tools", label: "Tools", icon: Wrench },
  {
    href: "/dashboard/dashboard/subscription",
    label: "Subscription",
    icon: CreditCard,
  },
  { href: "/dashboard/dashboard/orders", label: "Orders", icon: Package },
  { href: "/dashboard/dashboard/profile", label: "Profile", icon: User },
] as const;

/** Bottom bar: 5 slots — Orders reachable from Overview + sidebar on tablet. */
const mobileNav = [
  { href: "/dashboard/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/dashboard/products", label: "Products", icon: Shirt },
  { href: "/dashboard/dashboard/tools", label: "Tools", icon: Wrench },
  {
    href: "/dashboard/dashboard/subscription",
    label: "Plan",
    icon: CreditCard,
  },
  { href: "/dashboard/dashboard/profile", label: "Profile", icon: User },
] as const;

function roleBadgeClass(role: string) {
  switch (role) {
    case "VIP":
    case "ADMIN":
      return "bg-amber-500/15 text-amber-800 border-amber-500/30";
    case "PREMIUM":
      return "bg-violet-500/15 text-violet-800 border-violet-500/30";
    case "SUBSCRIBER":
      return "bg-sky-500/15 text-sky-800 border-sky-500/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

type Props = {
  session: Session;
  hints: DashboardRoleContextValue;
  children: React.ReactNode;
};

export function DashboardChrome({ session, hints, children }: Props) {
  const pathname = usePathname();
  const role = session.user?.role ?? "USER";

  function isActive(href: string) {
    if (href === "/dashboard/dashboard") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen bg-muted pb-24 md:pb-8">
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="shrink-0 text-lg font-bold text-primary">
              KONIK
            </Link>
            <span
              className={cn(
                "hidden rounded-full border px-2 py-0.5 text-xs font-semibold sm:inline-block",
                roleBadgeClass(role)
              )}
              title="Membership tier from subscription or admin"
            >
              {role}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden max-w-[160px] truncate text-sm text-muted-foreground sm:inline">
              {session.user?.name || session.user?.email}
            </span>
            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/" })}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside className="hidden w-52 shrink-0 md:block lg:w-56">
          <nav className="sticky top-24 space-y-1 rounded-xl border border-border bg-white p-2">
            {desktopNav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive(href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                {label}
              </Link>
            ))}
          </nav>
          {hints.isPremiumOrAbove && (
            <p className="mt-4 px-2 text-xs text-muted-foreground">
              You have premium-tier benefits. Explore locked tools for VIP
              add-ons.
            </p>
          )}
          {hints.isVipOrAbove && (
            <p className="mt-2 px-2 text-xs font-medium text-amber-800">
              VIP — full catalog access where included in your plan.
            </p>
          )}
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Dashboard"
      >
        <div className="mx-auto flex max-w-lg justify-around px-1 pt-1">
          {mobileNav.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium sm:text-xs",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon
                  className={cn("h-5 w-5", active && "text-accent")}
                  aria-hidden
                />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
