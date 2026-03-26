"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Shop Outfit — horizontal scroll of full outfit cards.
 * IMAGE: 900×1200 (3:4 portrait) per card
 * Mobile: snap-scroll horizontal. Desktop: 3-column grid.
 */
export function ShopOutfitSection({ data }: SectionProps) {
  const outfits = (data.outfits as Array<{
    name: string;
    price: string;
    image: string;
    href: string;
  }>) || [
    { name: "The Builder", price: "$249", image: "/images/homepage/hero-apparel.png", href: "/shop" },
    { name: "The Architect", price: "$319", image: "/images/homepage/lifestyle-tall.png", href: "/shop" },
    { name: "The Pioneer", price: "$279", image: "/images/homepage/hero-footwear.png", href: "/shop" },
  ];

  return (
    <section className="bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h2
            className="font-atmospheric text-[#121212] tracking-[0.06em] uppercase"
            style={{ fontSize: "var(--atm-h2)" }}
          >
            <span className="sm:hidden">Shop Outfit</span>
            <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>Shop Outfit</span>
          </h2>
          <Link
            href="/shop"
            className="font-bold uppercase tracking-[0.12em] text-[#121212] border-b border-[#121212] pb-0.5 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors font-poppins"
            style={{ fontSize: "var(--text-xs)" }}
          >
            View All
          </Link>
        </div>

        {/* Outfit cards */}
        <div className="flex lg:grid lg:grid-cols-3 gap-3 snap-scroll-x lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0">
          {outfits.map((outfit, i) => (
            <Link
              key={i}
              href={outfit.href || "/shop"}
              className="group relative block min-w-[70vw] sm:min-w-[45vw] lg:min-w-0 snap-start overflow-hidden"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F8F8F8]">
                <Image
                  src={outfit.image}
                  alt={outfit.name}
                  fill
                  className="object-cover transition-transform duration-600 group-hover:scale-105"
                  sizes="(max-width:640px) 70vw, (max-width:1024px) 45vw, 33vw"
                  loading="lazy"
                />

                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#000000]/70 to-transparent" />

                {/* Price overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <h3 className="font-bold text-[#FFFFFF] font-poppins tracking-tight" style={{ fontSize: "var(--text-sm)" }}>
                    {outfit.name}
                  </h3>
                  <span className="text-[#B8860B] font-bold font-poppins" style={{ fontSize: "var(--text-base)" }}>
                    {outfit.price}
                  </span>
                </div>

                {/* Hover CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#121212]/40">
                  <span
                    className="bg-[#FFFFFF] text-[#121212] px-6 py-2.5 rounded-full font-bold uppercase tracking-[0.15em] font-poppins"
                    style={{ fontSize: "var(--text-2xs)" }}
                  >
                    Shop Outfit
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
