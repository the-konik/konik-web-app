import Link from "next/link";

const FOOTER_NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/tools", label: "Tools" },
  { href: "/plans", label: "Plans" },
  { href: "/company", label: "Company" },
  { href: "/cart", label: "Cart" },
  { href: "/auth/login", label: "Account" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-lg font-bold tracking-tight">KONIK</p>
            <p className="mt-2 max-w-xs text-sm text-primary-foreground/70">
              Clothing & digital tools for men building a deliberate life.
            </p>
          </div>
          <nav
            className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3"
            aria-label="Footer"
          >
            {FOOTER_NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-primary-foreground/80 hover:text-accent transition"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-primary-foreground/50 sm:text-left">
          © {new Date().getFullYear()} KONIK. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
