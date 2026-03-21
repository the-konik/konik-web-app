"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/tools", label: "Tools" },
  { href: "/plans", label: "Plans" },
  { href: "/company", label: "Company" },
  { href: "/cart", label: "Cart" },
] as const;

type Props = {
  /** Dark bar for use on the home hero (primary background). */
  variant?: "light" | "dark";
};

export function PublicHeader({ variant = "light" }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isDark = variant === "dark";
  const bar = isDark
    ? "border-white/10 bg-primary text-primary-foreground"
    : "border-border bg-white text-primary";
  const linkBase = isDark
    ? "text-sm text-primary-foreground/90 hover:text-accent transition"
    : "text-sm text-muted-foreground hover:text-accent transition";
  const linkActive = isDark ? "text-accent" : "text-accent font-medium";
  const ctaClass = isDark
    ? "rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition"
    : "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition";

  return (
    <header className={`sticky top-0 z-50 border-b ${bar}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className={`text-xl font-bold tracking-tight ${isDark ? "" : "text-primary"}`}
          onClick={() => setOpen(false)}
        >
          KONIK
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                pathname === href || pathname.startsWith(href + "/")
                  ? `${linkBase} ${linkActive}`
                  : linkBase
              }
            >
              {label}
            </Link>
          ))}
          <Link href="/auth/login" className={ctaClass}>
            Sign in
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/auth/login" className={`shrink-0 ${ctaClass} px-3 py-1.5 text-xs`}>
            Sign in
          </Link>
          <button
            type="button"
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${
              isDark ? "border-white/20 text-primary-foreground" : "border-border"
            }`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className={`border-t md:hidden ${
            isDark ? "border-white/10 bg-primary" : "border-border bg-white"
          }`}
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6" aria-label="Mobile">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  pathname === href || pathname.startsWith(href + "/")
                    ? isDark
                      ? "bg-white/10 text-accent"
                      : "bg-muted text-accent"
                    : isDark
                      ? "text-primary-foreground/90"
                      : "text-primary"
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
