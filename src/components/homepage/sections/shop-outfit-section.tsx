"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Shop Outfit — horizontal scroll of full outfit cards.
 * IMAGE: 900×1200 (3:4 portrait) per card
 * Nike-aligned: bigger cards, larger text, more padding
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
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-14">
        {/* Header — Nike style */}
        <div className="flex items-baseline justify-between mb-6 sm:mb-8">
          <h2
            className="font-atmospheric text-[#121212] tracking-[0.04em] uppercase leading-[1.1]"
            style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)" }}
          >
            Shop Outfit
          </h2>
          <Link
            href="/shop"
            className="font-medium text-[#121212] border-b border-[#121212] pb-0.5 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors font-poppins"
            style={{ fontSize: "15px" }}
          >
            View All
          </Link>
        </div>

        {/* Outfit cards — Nike uses bigger gaps */}
        <div className="flex lg:grid lg:grid-cols-3 gap-4 sm:gap-5 snap-scroll-x lg:overflow-visible -mx-6 px-6 lg:mx-0 lg:px-0">
          {outfits.map((outfit, i) => (
            <Link
              key={i}
              href={outfit.href || "/shop"}
              className="group relative block min-w-[72vw] sm:min-w-[45vw] lg:min-w-0 snap-start overflow-hidden"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F5]">
                <Image
                  src={outfit.image}
                  alt={outfit.name}
                  fill
                  className="object-cover transition-transform duration-600 group-hover:scale-105"
                  sizes="(max-width:640px) 72vw, (max-width:1024px) 45vw, 33vw"
                  loading="lazy"
                />

                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#000000]/70 to-transparent" />

                {/* Price overlay — Nike-sized text */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-7">
                  <h3 className="font-medium text-[#FFFFFF] font-poppins tracking-normal" style={{ fontSize: "16px" }}>
                    {outfit.name}
                  </h3>
                  <span className="text-[#B8860B] font-semibold font-poppins mt-0.5 block" style={{ fontSize: "16px" }}>
                    {outfit.price}
                  </span>
                </div>

                {/* Hover CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#121212]/40">
                  <span
                    className="bg-[#FFFFFF] text-[#121212] px-7 py-3 rounded-full font-medium uppercase tracking-[0.1em] font-poppins"
                    style={{ fontSize: "13px" }}
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
