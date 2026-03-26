"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Bundles Section — lookbook-style outfit cards.
 * IMAGE: 900×1200 (3:4 portrait) per card
 * FONT: Poppins --text-sm for names, Atmospheric not used here
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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-12 text-center">
          <h2
            className="font-atmospheric text-[#FFFFFF] tracking-[0.06em] uppercase mb-3"
            style={{ fontSize: "var(--atm-h2)" }}
          >
            Shop The Look
          </h2>
          <p className="text-[#FFFFFF]/30 font-poppins" style={{ fontSize: "var(--text-2xs)" }}>Coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-12">
        <h2
          className="font-atmospheric text-[#FFFFFF] tracking-[0.06em] uppercase mb-5 sm:mb-6"
          style={{ fontSize: "var(--atm-h2)" }}
        >
          <span className="sm:hidden">Shop The Look</span>
          <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>Shop The Look</span>
        </h2>

        <div className="flex lg:grid lg:grid-cols-3 gap-3 snap-scroll-x lg:overflow-visible">
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

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <h3 className="font-bold text-[#FFFFFF] font-poppins tracking-tight mb-1" style={{ fontSize: "var(--text-sm)" }}>
                  {bundle.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-[#B8860B] font-poppins" style={{ fontSize: "var(--text-base)" }}>{bundle.bundlePrice}</span>
                  {bundle.originalPrice && (
                    <span className="text-[#FFFFFF]/30 line-through font-poppins" style={{ fontSize: "var(--text-2xs)" }}>{bundle.originalPrice}</span>
                  )}
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#121212]/40">
                <span className="bg-[#FFFFFF] text-[#121212] px-6 py-2.5 rounded-full font-bold uppercase tracking-[0.15em] font-poppins" style={{ fontSize: "var(--text-2xs)" }}>
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
