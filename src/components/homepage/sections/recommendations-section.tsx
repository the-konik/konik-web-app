"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Recommendations — horizontal scroll product row.
 * IMAGE: 1000×1250 (4:5 portrait) per card
 * FONT: Atmospheric atm-h2 for title, Poppins for card text
 */
export function RecommendationsSection({ data }: SectionProps) {
  const products = (data.products as Array<{
    name: string;
    price: string;
    image: string;
    href: string;
  }>) || [];

  return (
    <section className="bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2
            className="font-atmospheric text-[#121212] tracking-[0.06em] uppercase"
            style={{ fontSize: "var(--atm-h2)" }}
          >
            <span className="sm:hidden">For You</span>
            <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>For You</span>
          </h2>
          <Link
            href="/shop"
            className="font-bold uppercase tracking-[0.12em] text-[#121212] border-b border-[#121212] pb-0.5 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors font-poppins"
            style={{ fontSize: "var(--text-xs)" }}
          >
            See All
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="flex lg:grid lg:grid-cols-4 gap-2 sm:gap-3 snap-scroll-x lg:overflow-visible">
            {products.map((product, i) => (
              <Link
                key={i}
                href={product.href || "/shop"}
                className="group block min-w-[42vw] sm:min-w-[30vw] lg:min-w-0"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F8F8] mb-2">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 42vw, (max-width:1024px) 30vw, 25vw"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-bold text-[#121212] font-poppins tracking-tight truncate" style={{ fontSize: "var(--text-sm)" }}>
                  {product.name}
                </h3>
                <p className="text-[#4B5563] font-poppins" style={{ fontSize: "var(--text-xs)" }}>
                  {product.price}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#4B5563] font-poppins mb-4" style={{ fontSize: "var(--text-sm)" }}>Keep browsing to unlock personalised picks.</p>
            <Link href="/shop" className="inline-block bg-[#121212] text-[#FFFFFF] px-7 py-3 rounded-full font-bold uppercase tracking-[0.2em] font-poppins hover:bg-[#2a2a2a] transition-colors" style={{ fontSize: "var(--text-xs)" }}>
              Browse Collection
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
