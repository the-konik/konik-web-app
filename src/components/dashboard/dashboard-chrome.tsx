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
import { cn } from "@/lib/utils/cn";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";

const desktopNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "My Products", icon: Shirt },
  { href: "/dashboard/tools", label: "Tools", icon: Wrench },
  {
    href: "/dashboard/subscription",
    label: "Subscription",
    icon: CreditCard,
  },
  { href: "/dashboard/orders", label: "Orders", icon: Package },
  { href: "/dashboard/profile", label: "Profile", icon: User },
] as const;

/** Bottom bar: 5 slots — Orders reachable from Overview + sidebar on tablet. */
const mobileNav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Products", icon: Shirt },
  { href: "/dashboard/tools", label: "Tools", icon: Wrench },
  {
    href: "/dashboard/subscription",
    label: "Plan",
    icon: CreditCard,
  },
  { href: "/dashboard/profile", label: "Profile", icon: User },
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
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <PublicHeader />
      </div>

      <div className="mx-auto flex w-full max-w-[1920px] flex-1 gap-6 px-4 py-6 sm:px-6 lg:px-12 pt-[140px] sm:pt-[160px]">
        <aside className="hidden w-52 shrink-0 md:block lg:w-64">
          <nav className="sticky top-40 space-y-2">
            <div className="mb-6 px-3">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#B8860B] block mb-2">
                Account
              </span>
              <div className="flex items-center gap-2">
                <span className="max-w-[160px] truncate text-sm font-semibold text-[#121212]">
                  {session.user?.name || session.user?.email?.split('@')[0]}
                </span>
                <span
                  className={cn(
                    "rounded border px-1.5 py-0.5 text-[10px] font-bold tracking-widest uppercase",
                    roleBadgeClass(role)
                  )}
                  title="Membership tier"
                >
                  {role}
                </span>
              </div>
            </div>

            {desktopNav.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 group relative",
                    active
                      ? "bg-[#121212] text-[#FFFFFF] shadow-md font-bold"
                      : "text-[#4B5563] font-medium hover:bg-[#FFFFFF] hover:shadow-sm hover:text-[#121212]"
                  )}
                >
                  <Icon 
                    className={cn(
                      "h-[18px] w-[18px] shrink-0 transition-colors", 
                      active ? "text-[#B8860B]" : "text-[#4B5563] group-hover:text-[#B8860B]"
                    )} 
                    aria-hidden 
                  />
                  {label}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#B8860B] rounded-r-full" />
                  )}
                </Link>
              );
            })}
            
            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/" })}
              className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#EF4444] transition-all hover:bg-red-50"
            >
              Sign out
            </button>
          </nav>
          
          <div className="sticky top-[480px] mt-8">
            {hints.isPremiumOrAbove && (
              <div className="rounded-xl border border-[#B8860B]/20 bg-[#B8860B]/5 p-4 mx-2">
                <p className="text-xs text-[#121212] leading-relaxed font-medium">
                  Premium Tier Active. <span className="text-[#4B5563] font-normal">Explore locked tools for VIP add-ons.</span>
                </p>
              </div>
            )}
            {hints.isVipOrAbove && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 mx-2 mt-3">
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  VIP Access
                </p>
                <p className="text-[11px] text-amber-800/80 mt-1">Full catalog access enabled.</p>
              </div>
            )}
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm">
          {children}
        </main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-[60] border-t border-[#E5E7EB] bg-[#FFFFFF]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
        aria-label="Dashboard"
      >
        <div className="mx-auto flex max-w-lg justify-around px-2 py-2">
          {mobileNav.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors",
                  active ? "text-[#121212]" : "text-[#4B5563] hover:text-[#121212]"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full mb-0.5 transition-colors",
                  active ? "bg-[#B8860B] text-[#FFFFFF]" : "bg-transparent"
                )}>
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <SiteFooter />
    </div>
  );
}
