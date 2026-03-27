"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Bundles Section — lookbook-style outfit cards.
 * IMAGE: 900×1200 (3:4 portrait) per card
 * Nike-aligned: larger cards, bigger text, more padding
 */
export function BundlesSection({ data }: SectionProps) {
  const bundles = (data.bundles as Array<{
    name: string;
    bundlePrice: string;
    originalPrice?: string;
    image: string;
    href: string;
  }>) || [];

  if (bundles.length === 0) {
    return (
      <section className="bg-[#121212]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14 text-center">
          <h2
            className="font-atmospheric text-[#FFFFFF] tracking-[0.04em] uppercase mb-4"
            style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)" }}
          >
            Shop The Look
          </h2>
          <p className="text-[#FFFFFF]/30 font-poppins" style={{ fontSize: "14px" }}>Coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-14">
        <h2
          className="font-atmospheric text-[#FFFFFF] tracking-[0.04em] uppercase mb-6 sm:mb-8 leading-[1.1]"
          style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)" }}
        >
          Shop The Look
        </h2>

        <div className="flex lg:grid lg:grid-cols-3 gap-4 sm:gap-5 snap-scroll-x lg:overflow-visible">
          {bundles.map((bundle, i) => (
            <Link
              key={i}
              href={bundle.href || "/shop"}
              className="group relative block min-w-[75vw] sm:min-w-[45vw] lg:min-w-0 aspect-[3/4] overflow-hidden"
            >
              <Image
                src={bundle.image}
                alt={bundle.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width:1024px) 75vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-7">
                <h3 className="font-medium text-[#FFFFFF] font-poppins tracking-normal mb-1.5" style={{ fontSize: "16px" }}>
                  {bundle.name}
                </h3>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-semibold text-[#B8860B] font-poppins" style={{ fontSize: "16px" }}>{bundle.bundlePrice}</span>
                  {bundle.originalPrice && (
                    <span className="text-[#FFFFFF]/30 line-through font-poppins" style={{ fontSize: "13px" }}>{bundle.originalPrice}</span>
                  )}
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#121212]/40">
                <span className="bg-[#FFFFFF] text-[#121212] px-7 py-3 rounded-full font-medium uppercase tracking-[0.1em] font-poppins" style={{ fontSize: "13px" }}>
                  Shop This Look
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
