"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Category Preview — edge-to-edge image grid.
 * IMAGE: 900×1200 (3:4 portrait) per tile
 * Nike-aligned: larger text overlays, bigger padding
 */
export function CategoryPreviewSection({ data }: SectionProps) {
  const categories = (data.categories as Array<{ name: string; image: string; href: string }>) || [
    { name: "Apparel", image: "/images/hero/hero-legacy.png", href: "/shop?category=APPAREL" },
    { name: "Footwear", image: "/images/hero/hero-footwear.png", href: "/shop?category=FOOTWEAR" },
    { name: "Accessories", image: "/images/hero/hero-accessories.png", href: "/shop?category=ACCESSORIES" },
    { name: "Systems", image: "/images/sections/system-legacy.png", href: "/tools" },
  ];

  return (
    <section className="bg-[#121212]">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[2px]">
        {categories.map((cat, i) => (
          <Link
            key={i}
            href={cat.href}
            className="group relative block aspect-[3/4] overflow-hidden"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width:1024px) 50vw, 25vw"
              loading={i < 2 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/70 via-transparent to-transparent" />
            
            {/* Nike-style: bigger bottom padding, larger category name */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-7 flex items-end justify-between">
              <h3
                className="font-atmospheric text-[#FFFFFF] tracking-[0.06em] uppercase"
                style={{ fontSize: "clamp(0.8125rem, 1.5vw, 1rem)" }}
              >
                {cat.name}
              </h3>
              <span className="text-[#FFFFFF]/50 group-hover:text-[#B8860B] transition-colors font-poppins text-[16px]">
                →
              </span>
            </div>

            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#B8860B]/40 transition-colors duration-300 pointer-events-none" />
          </Link>
        ))}
      </div>
    </section>
  );
}
