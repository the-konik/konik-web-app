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
 * Nike-aligned: bigger tiles, larger icons, more padding
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
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-10">
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {actions.map((action, i) => {
            const Icon = ICON_MAP[action.icon || "shop"] || ShoppingBag;
            return (
              <Link
                key={i}
                href={action.href}
                className="group flex flex-col items-center gap-2.5 p-5 sm:p-6 bg-[#F5F5F5] rounded-lg hover:bg-[#121212] transition-colors duration-200"
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#121212] group-hover:text-[#B8860B] transition-colors" strokeWidth={1.5} />
                <span
                  className="font-medium uppercase tracking-[0.06em] text-[#121212] group-hover:text-[#FFFFFF] font-poppins transition-colors"
                  style={{ fontSize: "12px" }}
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
