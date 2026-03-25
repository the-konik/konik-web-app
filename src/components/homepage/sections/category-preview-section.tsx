"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { SectionProps } from "@/types/section";

/**
 * Category Preview — showcases main categories with hover effects.
 *
 * Data: { title?, categories: [{ name, image, href }] }
 */
export function CategoryPreviewSection({ data }: SectionProps) {
  const title = (data.title as string) || "";
  const categories = (data.categories as Array<{ name: string; image: string; href: string }>) || [
    { name: "Apparel", image: "/images/hero/hero-legacy.png", href: "/shop?category=APPAREL" },
    { name: "Footwear", image: "/images/hero/hero-footwear.png", href: "/shop?category=FOOTWEAR" },
    { name: "Accessories", image: "/images/hero/hero-accessories.png", href: "/shop?category=ACCESSORIES" },
    { name: "Systems", image: "/images/sections/system-legacy.png", href: "/tools" },
  ];

  return (
    <section className="bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28">
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-atmospheric text-xl sm:text-3xl text-[#121212] tracking-[0.08em] uppercase mb-10 sm:mb-14 text-center"
          >
            {title}
          </motion.h2>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={cat.href}
                className="group relative block aspect-[3/4] overflow-hidden rounded-sm"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-[#121212]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <h3 className="font-atmospheric text-sm sm:text-base lg:text-lg text-[#FFFFFF] tracking-[0.1em] uppercase mb-2">
                    {cat.name}
                  </h3>
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF]/60 font-poppins group-hover:text-[#B8860B] transition-colors">
                    Explore →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
