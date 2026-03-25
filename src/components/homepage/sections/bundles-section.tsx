"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { SectionProps } from "@/types/section";

/**
 * Bundles Section — displays curated bundle deals with price comparisons.
 *
 * Data: { title, subtitle?, bundles: [{ name, items, originalPrice, bundlePrice, image, href }] }
 */
export function BundlesSection({ data }: SectionProps) {
  const title = (data.title as string) || "Bundle & Save";
  const subtitle = (data.subtitle as string) || "";
  const bundles = (data.bundles as Array<{
    name: string;
    items: string[];
    originalPrice: string;
    bundlePrice: string;
    image: string;
    href: string;
  }>) || [];

  if (bundles.length === 0) {
    return (
      <section className="bg-[#121212]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 text-center">
          <h2 className="font-atmospheric text-xl sm:text-3xl text-[#FFFFFF] tracking-[0.08em] uppercase mb-4">
            {title}
          </h2>
          <p className="text-[#FFFFFF]/40 text-sm font-poppins">Bundles coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-atmospheric text-xl sm:text-3xl lg:text-4xl text-[#FFFFFF] tracking-[0.08em] uppercase mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[#FFFFFF]/40 text-xs sm:text-sm font-poppins tracking-wide">{subtitle}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={bundle.href || "/shop"}
                className="group block bg-[#FFFFFF]/5 border border-[#FFFFFF]/10 rounded-lg overflow-hidden hover:border-[#B8860B]/30 transition-colors"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={bundle.image}
                    alt={bundle.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-sm font-bold text-[#FFFFFF] font-poppins tracking-tight mb-2">
                    {bundle.name}
                  </h3>
                  <ul className="space-y-1 mb-4">
                    {bundle.items.map((item, j) => (
                      <li key={j} className="text-[11px] text-[#FFFFFF]/50 font-poppins flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#B8860B]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-baseline gap-3">
                    <span className="text-lg font-bold text-[#B8860B] font-poppins">{bundle.bundlePrice}</span>
                    <span className="text-sm text-[#FFFFFF]/30 line-through font-poppins">{bundle.originalPrice}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
