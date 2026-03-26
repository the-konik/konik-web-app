"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Special Offer — deal card for any category (tools, apparel, footwear, accessories).
 * Admin defines offer details via dashboard.
 */
export function SpecialOfferSection({ data, media }: SectionProps) {
  const title = (data.title as string) || "Special Offer";
  const description = (data.description as string) || "Limited time deal on selected items";
  const badge = (data.badge as string) || "Limited";
  const discount = (data.discount as string) || "20% Off";
  const cta = (data.cta as string) || "Shop Now";
  const ctaHref = (data.ctaHref as string) || "/shop";
  const image = media || (data.image as string) || "/images/products/discipline-uniform.png";
  const category = (data.category as string) || "";

  return (
    <section className="bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-10">
        <div className="bg-[#121212] rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square sm:aspect-auto overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width:640px) 100vw, 50vw"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
              {/* Badge */}
              <span
                className="inline-block w-fit bg-[#B8860B] text-[#FFFFFF] px-3 py-1 rounded-sm uppercase tracking-[0.15em] font-bold font-poppins mb-4"
                style={{ fontSize: "var(--text-2xs)" }}
              >
                {badge}
              </span>

              {/* Discount */}
              <h2
                className="font-atmospheric text-[#FFFFFF] tracking-[0.06em] leading-tight uppercase mb-2"
                style={{ fontSize: "var(--atm-hero)" }}
              >
                {discount}
              </h2>

              {/* Title */}
              <h3
                className="font-atmospheric text-[#FFFFFF]/70 tracking-[0.04em] uppercase mb-3"
                style={{ fontSize: "var(--atm-h3)" }}
              >
                {title}
              </h3>

              {category && (
                <span
                  className="text-[#B8860B]/60 font-poppins uppercase tracking-[0.1em] font-bold mb-4"
                  style={{ fontSize: "var(--text-2xs)" }}
                >
                  {category}
                </span>
              )}

              <p
                className="text-[#FFFFFF]/40 font-poppins leading-relaxed mb-6 max-w-sm"
                style={{ fontSize: "var(--text-sm)" }}
              >
                {description}
              </p>

              <Link
                href={ctaHref}
                className="inline-block w-fit bg-[#FFFFFF] text-[#121212] px-7 sm:px-9 py-3 sm:py-3.5 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-poppins"
                style={{ fontSize: "var(--text-xs)" }}
              >
                {cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
