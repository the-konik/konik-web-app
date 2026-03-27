"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Recommendations — horizontal scroll product row.
 * Nike-aligned: 15px text, larger gaps, more padding
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
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-14">
        <div className="flex items-baseline justify-between mb-5 sm:mb-7">
          <h2
            className="font-atmospheric text-[#121212] tracking-[0.04em] uppercase leading-[1.1]"
            style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)" }}
          >
            For You
          </h2>
          <Link
            href="/shop"
            className="font-medium text-[#121212] border-b border-[#121212] pb-0.5 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors font-poppins"
            style={{ fontSize: "15px" }}
          >
            See All
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 snap-scroll-x lg:overflow-visible">
            {products.map((product, i) => (
              <Link
                key={i}
                href={product.href || "/shop"}
                className="group block min-w-[44vw] sm:min-w-[30vw] lg:min-w-0"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5] mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 44vw, (max-width:1024px) 30vw, 25vw"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-medium text-[#121212] font-poppins tracking-normal truncate" style={{ fontSize: "15px" }}>
                  {product.name}
                </h3>
                <p className="text-[#707072] font-poppins mt-0.5" style={{ fontSize: "15px" }}>
                  {product.price}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#707072] font-poppins mb-5" style={{ fontSize: "15px" }}>Keep browsing to unlock personalised picks.</p>
            <Link href="/shop" className="inline-block bg-[#121212] text-[#FFFFFF] px-8 py-3.5 rounded-full font-medium uppercase tracking-[0.1em] font-poppins hover:bg-[#2a2a2a] transition-colors" style={{ fontSize: "15px" }}>
              Browse Collection
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
