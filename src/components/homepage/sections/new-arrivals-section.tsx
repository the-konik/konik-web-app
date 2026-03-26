"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * New Arrivals — 2 large cards side by side (stacked on mobile).
 * IMAGE: 1000×1250 (4:5 portrait) per card
 * Mobile: full-width stacked. Desktop: 2 columns.
 */
export function NewArrivalsSection({ data }: SectionProps) {
  const items = (data.items as Array<{
    name: string;
    image: string;
    price?: string;
    href: string;
    tag?: string;
  }>) || [
    { name: "Shadow Hoodie", image: "/images/products/discipline-uniform.png", price: "$89", href: "/shop", tag: "New" },
    { name: "Urban Runner", image: "/images/products/sneakers-minimal.png", price: "$129", href: "/shop", tag: "New" },
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
            <span className="sm:hidden">New Arrivals</span>
            <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>New Arrivals</span>
          </h2>
          <Link
            href="/shop"
            className="font-bold uppercase tracking-[0.12em] text-[#121212] border-b border-[#121212] pb-0.5 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors font-poppins"
            style={{ fontSize: "var(--text-xs)" }}
          >
            Shop New
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href || "/shop"}
              className="group relative block overflow-hidden"
            >
              <div className="relative aspect-[4/5] bg-[#F8F8F8] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-600 group-hover:scale-105"
                  sizes="(max-width:640px) 100vw, 50vw"
                  loading="lazy"
                />

                {/* "New" tag */}
                {item.tag && (
                  <span
                    className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#121212] text-[#FFFFFF] px-2.5 py-1 uppercase tracking-[0.15em] font-bold font-poppins"
                    style={{ fontSize: "var(--text-2xs)" }}
                  >
                    {item.tag}
                  </span>
                )}
              </div>

              <div className="mt-2.5 sm:mt-3">
                <h3
                  className="font-bold text-[#121212] font-poppins tracking-tight"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {item.name}
                </h3>
                {item.price && (
                  <p className="text-[#4B5563] font-poppins mt-0.5" style={{ fontSize: "var(--text-xs)" }}>
                    {item.price}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
