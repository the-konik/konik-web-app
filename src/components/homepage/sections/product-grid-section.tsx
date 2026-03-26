"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Product Grid — tight grid with name + price only.
 * IMAGE: 1000×1250 (4:5 portrait) per card
 * FONT: Poppins --text-sm for names, --text-xs for prices
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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-12">
        {/* Header row */}
        {title && (
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2
              className="font-atmospheric text-[#121212] tracking-[0.06em] uppercase"
              style={{ fontSize: "var(--atm-h2)" }}
            >
              <span className="sm:hidden">{title}</span>
              <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>{title}</span>
            </h2>
            <Link
              href={ctaHref}
              className="font-bold uppercase tracking-[0.12em] text-[#121212] border-b border-[#121212] pb-0.5 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors font-poppins"
              style={{ fontSize: "var(--text-xs)" }}
            >
              {ctaLabel}
            </Link>
          </div>
        )}

        {/* Product grid — 4:5 cards */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {products.map((product, i) => (
              <Link key={i} href={product.href || "/shop"} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F8F8] mb-2">
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
                  className="font-bold text-[#121212] font-poppins tracking-tight truncate"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-[#4B5563] font-poppins"
                  style={{ fontSize: "var(--text-xs)" }}
                >
                  {product.price}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 sm:py-12">
            <h2
              className="font-atmospheric text-[#121212] tracking-[0.08em] uppercase mb-4"
              style={{ fontSize: "var(--atm-h2)" }}
            >
              {title || "The Collection"}
            </h2>
            <Link
              href={ctaHref}
              className="inline-block bg-[#121212] text-[#FFFFFF] px-7 py-3 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-[#2a2a2a] transition-all duration-200 font-poppins"
              style={{ fontSize: "var(--text-xs)" }}
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
