import Link from "next/link";
import { requireStaffPanel } from "@/lib/auth/require-auth";
import {
  canReadSection,
  getEffectiveStaffRole,
  type AdminSection,
} from "@/lib/auth/staff-rbac";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";

const NAV: { href: string; label: string; section: AdminSection }[] = [
  { href: "/admin", label: "Dashboard", section: "dashboard" },
  { href: "/admin/products", label: "Products", section: "products" },
  { href: "/admin/tools", label: "Tools", section: "tools" },
  { href: "/admin/orders", label: "Orders", section: "orders" },
  { href: "/admin/users", label: "Users", section: "users" },
  {
    href: "/admin/subscriptions",
    label: "Subscriptions",
    section: "subscriptions",
  },
  { href: "/admin/marketing", label: "Marketing", section: "marketing" },
  { href: "/admin/settings", label: "Settings", section: "settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireStaffPanel();
  const staff = getEffectiveStaffRole(session)!;
  const navItems = NAV.filter((item) => canReadSection(staff, item.section));

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-30 border-b border-border bg-primary text-primary-foreground shadow-sm">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/admin" className="truncate text-lg font-bold">
              KONIK
            </Link>
            <span className="shrink-0 rounded bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
              Admin
            </span>
            <span className="hidden rounded border border-white/20 px-2 py-0.5 text-xs text-primary-foreground/90 sm:inline">
              {staff.replace("_", " ")}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <span className="hidden max-w-[200px] truncate text-sm text-primary-foreground/80 md:inline">
              {session.user.email}
            </span>
            <Link
              href="/dashboard"
              className="text-sm text-primary-foreground/80 hover:text-primary-foreground"
            >
              User dashboard
            </Link>
            <AdminSignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1920px] gap-6 px-4 py-6 lg:gap-8 lg:px-6">
        <aside className="hidden w-52 shrink-0 lg:block xl:w-56">
          <nav className="sticky top-24 space-y-0.5 rounded-xl border border-border bg-white p-2 shadow-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 pb-20 lg:pb-8">{children}</main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white px-2 py-2 lg:hidden"
        aria-label="Admin navigation"
      >
        <div className="mx-auto flex max-w-lg justify-start gap-1 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md px-2 py-1.5 text-center text-[11px] font-medium text-muted-foreground"
            >
              {item.label.split(" ")[0]}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
