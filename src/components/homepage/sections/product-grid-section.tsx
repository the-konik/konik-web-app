"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { SectionProps } from "@/types/section";

/**
 * Product Grid Section — displays products in a responsive grid.
 *
 * Expected data shape:
 * {
 *   title?: string,
 *   subtitle?: string,
 *   category?: string,       // Filter by category (e.g. "APPAREL")
 *   maxItems?: number,        // Limit (default 8)
 *   ctaLabel?: string,
 *   ctaHref?: string,
 *   products?: Array<{        // Optional inline products (if not fetched from DB)
 *     name: string,
 *     price: string,
 *     image: string,
 *     href: string
 *   }>
 * }
 *
 * NOTE: Full DB-fetched product rendering will be added in Phase 2.
 * For now, this renders inline products from the `data.products` array.
 */
export function ProductGridSection({ data }: SectionProps) {
  const title = (data.title as string) || "The Collection";
  const subtitle = (data.subtitle as string) || "";
  const products = (data.products as Array<{
    name: string;
    price: string;
    image: string;
    href: string;
  }>) || [];
  const ctaLabel = (data.ctaLabel as string) || "View All";
  const ctaHref = (data.ctaHref as string) || "/shop";

  if (products.length === 0) {
    // Placeholder state — will be replaced with DB fetch in Phase 2
    return (
      <section className="bg-[#FFFFFF]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28">
          <div className="text-center">
            <h2 className="font-atmospheric text-xl sm:text-3xl text-[#121212] tracking-[0.08em] uppercase mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[#4B5563] text-xs sm:text-sm font-poppins tracking-wide mb-10">
                {subtitle}
              </p>
            )}
            <Link
              href={ctaHref}
              className="inline-block bg-[#121212] text-[#FFFFFF] px-8 py-3.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#2a2a2a] transition-all duration-300 font-poppins"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <h2 className="font-atmospheric text-xl sm:text-3xl text-[#121212] tracking-[0.08em] uppercase mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[#4B5563] text-xs sm:text-sm font-poppins tracking-wide">
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href={ctaHref}
            className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-[0.15em] text-[#121212] border-b border-[#121212] pb-0.5 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors font-poppins"
          >
            {ctaLabel}
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link href={product.href || "/shop"} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#F8F8F8] mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-[11px] sm:text-[13px] font-bold text-[#121212] font-poppins tracking-tight truncate">
                  {product.name}
                </h3>
                <p className="text-[10px] sm:text-[12px] text-[#4B5563] font-poppins mt-0.5">
                  {product.price}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href={ctaHref}
            className="inline-block bg-[#121212] text-[#FFFFFF] px-8 py-3.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#2a2a2a] transition-all duration-300 font-poppins"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
