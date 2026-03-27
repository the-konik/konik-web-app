"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Product Grid — tight grid with name + price only.
 * IMAGE: 1000×1250 (4:5 portrait) per card
 * Nike-aligned: 15px names, 15px prices, clean grid, generous padding
 */
export function ProductGridSection({ data }: SectionProps) {
  const title = (data.title as string) || "";
  const products = (data.products as Array<{
    name: string;
    price: string;
    image: string;
    href: string;
  }>) || [];
  const ctaLabel = (data.ctaLabel as string) || "Shop All";
  const ctaHref = (data.ctaHref as string) || "/shop";

  return (
    <section className="bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-14">
        {/* Header row — Nike style */}
        {title && (
          <div className="flex items-baseline justify-between mb-6 sm:mb-8">
            <h2
              className="font-atmospheric text-[#121212] tracking-[0.04em] uppercase leading-[1.1]"
              style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)" }}
            >
              {title}
            </h2>
            <Link
              href={ctaHref}
              className="font-medium text-[#121212] border-b border-[#121212] pb-0.5 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors font-poppins"
              style={{ fontSize: "15px" }}
            >
              {ctaLabel}
            </Link>
          </div>
        )}

        {/* Product grid — Nike uses 4:5 cards with clean gaps */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {products.map((product, i) => (
              <Link key={i} href={product.href || "/shop"} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F5] mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    loading="lazy"
                  />
                </div>
                <h3
                  className="font-medium text-[#121212] font-poppins tracking-normal"
                  style={{ fontSize: "15px" }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-[#707072] font-poppins mt-0.5"
                  style={{ fontSize: "15px" }}
                >
                  {product.price}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 sm:py-16">
            <h2
              className="font-atmospheric text-[#121212] tracking-[0.06em] uppercase mb-5"
              style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)" }}
            >
              {title || "The Collection"}
            </h2>
            <Link
              href={ctaHref}
              className="inline-block bg-[#121212] text-[#FFFFFF] px-8 py-3.5 rounded-full font-medium uppercase tracking-[0.1em] hover:bg-[#2a2a2a] transition-all duration-200 font-poppins"
              style={{ fontSize: "15px" }}
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
