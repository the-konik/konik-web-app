"use client";

import Link from "next/link";
import { ShoppingBag, Wrench, Package, Heart } from "lucide-react";
import type { SectionProps } from "@/types/section";

const ICON_MAP: Record<string, typeof ShoppingBag> = {
  shop: ShoppingBag,
  tools: Wrench,
  orders: Package,
  wishlist: Heart,
};

/**
 * Quick Actions — 4-tile shortcut grid for HOT users.
 * ICON: 200×200 (1:1) SVG/PNG
 * FONT: Poppins --text-2xs for labels
 */
export function QuickActionsSection({ data }: SectionProps) {
  const actions = (data.actions as Array<{
    label: string; href: string; icon?: string;
  }>) || [
    { label: "Shop", href: "/shop", icon: "shop" },
    { label: "Tools", href: "/dashboard", icon: "tools" },
    { label: "Orders", href: "/dashboard/orders", icon: "orders" },
    { label: "Wishlist", href: "/wishlist", icon: "wishlist" },
  ];

  return (
    <section className="bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-6 sm:py-8">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {actions.map((action, i) => {
            const Icon = ICON_MAP[action.icon || "shop"] || ShoppingBag;
            return (
              <Link
                key={i}
                href={action.href}
                className="group flex flex-col items-center gap-2 p-4 bg-[#F8F8F8] rounded-lg hover:bg-[#121212] transition-colors duration-200"
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#121212] group-hover:text-[#B8860B] transition-colors" strokeWidth={1.5} />
                <span
                  className="font-bold uppercase tracking-[0.08em] text-[#121212] group-hover:text-[#FFFFFF] font-poppins transition-colors"
                  style={{ fontSize: "var(--text-2xs)" }}
                >
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
