"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Shop Legacy — compact dark banner with lifestyle image + headline + CTA.
 * IMAGE: 1920×822 (21:9) banner
 * Shows full lifestyle (tools + clothing combined).
 */
export function ShopLegacySection({ data, media }: SectionProps) {
  const headline = (data.headline as string) || "Shop Legacy Life";
  const description = (data.description as string) || "Tools and gear built for those who build themselves";
  const cta = (data.cta as string) || "Explore";
  const ctaHref = (data.ctaHref as string) || "/shop";
  const image = media || (data.image as string) || "/images/sections/generated-bg-3.png";

  return (
    <section className="relative overflow-hidden bg-[#121212]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={headline}
          fill
          className="object-cover brightness-[0.35]"
          sizes="100vw"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-8">
          <div>
            <h2
              className="font-atmospheric text-[#FFFFFF] tracking-[0.06em] leading-tight uppercase mb-2"
              style={{ fontSize: "var(--atm-h2)" }}
            >
              <span className="sm:hidden">{headline}</span>
              <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>{headline}</span>
            </h2>
            <p
              className="text-[#FFFFFF]/40 font-poppins max-w-md"
              style={{ fontSize: "var(--text-sm)" }}
            >
              {description}
            </p>
          </div>

          <Link
            href={ctaHref}
            className="inline-block w-fit bg-[#FFFFFF] text-[#121212] px-7 sm:px-9 py-3 sm:py-3.5 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-poppins flex-shrink-0"
            style={{ fontSize: "var(--text-xs)" }}
          >
            {cta}
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B8860B]/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FFFFFF]/5 to-transparent" />
    </section>
  );
}
