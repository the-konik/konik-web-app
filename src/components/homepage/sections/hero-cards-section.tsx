"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Hero Cards Section — 4 cards (3 product + 1 tool with gold accent).
 * IMAGE: 900×1200 (3:4 portrait) per card
 * Mobile: 2×2 grid. Desktop: 4×1 row.
 * Nike-aligned: edge-to-edge, taller cards, bigger text overlay
 */
export function HeroCardsSection({ data }: SectionProps) {
  const cards = (data.cards as Array<{
    title: string;
    subtitle?: string;
    image: string;
    href: string;
    type?: "product" | "tool";
  }>) || [
    { title: "Apparel", subtitle: "Wear the discipline", image: "/images/homepage/hero-apparel.png", href: "/shop?category=APPAREL", type: "product" },
    { title: "Footwear", subtitle: "Step into legacy", image: "/images/homepage/hero-footwear.png", href: "/shop?category=FOOTWEAR", type: "product" },
    { title: "Accessories", subtitle: "Complete the uniform", image: "/images/homepage/hero-accessories.png", href: "/shop?category=ACCESSORIES", type: "product" },
    { title: "Digital Systems", subtitle: "Engineer your life", image: "/images/homepage/hero-tools.png", href: "/tools", type: "tool" },
  ];

  return (
    <section className="bg-[#121212]">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => {
          const isTool = card.type === "tool";
          return (
            <Link
              key={i}
              href={card.href}
              className="group relative block aspect-[3/4] overflow-hidden"
            >
              {/* Full-bleed image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width:1024px) 50vw, 25vw"
                priority={i < 2}
                quality={85}
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-[#000000]/10 to-transparent" />

              {/* Gold accent border for tool card */}
              {isTool && (
                <div className="absolute inset-0 border-2 border-[#B8860B]/40 pointer-events-none z-10" />
              )}

              {/* Content — Nike uses larger bottom padding & bigger text */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-8 z-10">
                {/* Category tag */}
                <span
                  className={`inline-block px-3 py-1 rounded-sm text-[#FFFFFF] uppercase tracking-[0.12em] font-semibold font-poppins mb-3 ${
                    isTool ? "bg-[#B8860B]/80" : "bg-[#FFFFFF]/10"
                  }`}
                  style={{ fontSize: "11px" }}
                >
                  {isTool ? "Systems" : "Shop"}
                </span>

                {/* Title — Nike-sized: 24px mobile, 28px desktop */}
                <h2
                  className="font-atmospheric text-[#FFFFFF] tracking-[0.04em] leading-[1.1]"
                  style={{ fontSize: "clamp(1.25rem, 2vw, 1.625rem)" }}
                >
                  {card.title}
                </h2>

                {/* Subtitle */}
                {card.subtitle && (
                  <p
                    className="text-[#FFFFFF]/50 font-poppins mt-1.5"
                    style={{ fontSize: "14px" }}
                  >
                    {card.subtitle}
                  </p>
                )}

                {/* CTA arrow */}
                <span className="inline-block mt-4 text-[#FFFFFF]/40 group-hover:text-[#B8860B] transition-all duration-300 group-hover:translate-x-1.5 font-poppins text-[16px]">
                  &#8594;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
