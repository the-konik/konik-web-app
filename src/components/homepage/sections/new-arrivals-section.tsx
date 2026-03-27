"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * New Arrivals — 2 large cards side by side (stacked on mobile).
 * IMAGE: 1000×1250 (4:5 portrait) per card
 * Nike-aligned: generous section padding, 15-16px product names, clean layout
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
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-14">
        {/* Header — Nike-style: left title + right link */}
        <div className="flex items-baseline justify-between mb-6 sm:mb-8">
          <h2
            className="font-atmospheric text-[#121212] tracking-[0.04em] uppercase leading-[1.1]"
            style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)" }}
          >
            New Arrivals
          </h2>
          <Link
            href="/shop"
            className="font-medium text-[#121212] border-b border-[#121212] pb-0.5 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors font-poppins"
            style={{ fontSize: "15px" }}
          >
            Shop New
          </Link>
        </div>

        {/* Cards — Nike uses larger gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href || "/shop"}
              className="group relative block overflow-hidden"
            >
              <div className="relative aspect-[4/5] bg-[#F5F5F5] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-600 group-hover:scale-105"
                  sizes="(max-width:640px) 100vw, 50vw"
                  loading="lazy"
                />

                {/* "New" tag — Nike-style positioning */}
                {item.tag && (
                  <span
                    className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-[#121212] text-[#FFFFFF] px-3 py-1.5 uppercase tracking-[0.1em] font-semibold font-poppins"
                    style={{ fontSize: "11px" }}
                  >
                    {item.tag}
                  </span>
                )}
              </div>

              <div className="mt-3 sm:mt-4">
                <h3
                  className="font-medium text-[#121212] font-poppins tracking-normal"
                  style={{ fontSize: "15px" }}
                >
                  {item.name}
                </h3>
                {item.price && (
                  <p className="text-[#707072] font-poppins mt-0.5" style={{ fontSize: "15px" }}>
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
