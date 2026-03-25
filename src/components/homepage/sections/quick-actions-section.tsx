"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Wrench, Package, Heart } from "lucide-react";
import type { SectionProps } from "@/types/section";

const ICON_MAP: Record<string, typeof ShoppingBag> = {
  shop: ShoppingBag,
  tools: Wrench,
  orders: Package,
  wishlist: Heart,
};

/**
 * Quick Actions Section — shortcut tiles for returning (HOT) users.
 *
 * Data: { title?, actions: [{ label, href, icon?, description? }] }
 */
export function QuickActionsSection({ data }: SectionProps) {
  const title = (data.title as string) || "";
  const actions = (data.actions as Array<{
    label: string; href: string; icon?: string; description?: string;
  }>) || [
    { label: "Shop", href: "/shop", icon: "shop", description: "Browse the collection" },
    { label: "My Tools", href: "/dashboard", icon: "tools", description: "Access your systems" },
    { label: "Orders", href: "/dashboard/orders", icon: "orders", description: "Track your orders" },
    { label: "Wishlist", href: "/wishlist", icon: "wishlist", description: "Saved items" },
  ];

  return (
    <section className="bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-12 sm:py-16">
        {title && (
          <h2 className="font-atmospheric text-lg sm:text-2xl text-[#121212] tracking-[0.08em] uppercase mb-8 text-center">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {actions.map((action, i) => {
            const Icon = ICON_MAP[action.icon || ""] || ShoppingBag;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  href={action.href}
                  className="group flex flex-col items-center gap-3 p-5 sm:p-6 bg-[#F8F8F8] rounded-xl hover:bg-[#121212] transition-colors duration-300"
                >
                  <Icon className="w-6 h-6 text-[#121212] group-hover:text-[#B8860B] transition-colors" strokeWidth={1.5} />
                  <div className="text-center">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#121212] group-hover:text-[#FFFFFF] font-poppins transition-colors">
                      {action.label}
                    </span>
                    {action.description && (
                      <span className="block text-[9px] text-[#4B5563] group-hover:text-[#FFFFFF]/50 font-poppins mt-1 transition-colors">
                        {action.description}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
