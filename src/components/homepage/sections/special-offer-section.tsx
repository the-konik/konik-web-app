"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Special Offer — deal card for any category.
 * Nike-aligned: bigger padding, larger text hierarchy
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
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-14">
        <div className="bg-[#121212] rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square sm:aspect-auto sm:min-h-[400px] overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width:640px) 100vw, 50vw"
                loading="lazy"
              />
            </div>

            {/* Content — Nike-aligned bigger text + padding */}
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              {/* Badge */}
              <span
                className="inline-block w-fit bg-[#B8860B] text-[#FFFFFF] px-3.5 py-1.5 rounded-sm uppercase tracking-[0.1em] font-semibold font-poppins mb-5"
                style={{ fontSize: "11px" }}
              >
                {badge}
              </span>

              {/* Discount — Nike hero-size */}
              <h2
                className="font-atmospheric text-[#FFFFFF] tracking-[0.04em] leading-[1.1] uppercase mb-3"
                style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}
              >
                {discount}
              </h2>

              {/* Title */}
              <h3
                className="font-atmospheric text-[#FFFFFF]/70 tracking-[0.03em] uppercase mb-4"
                style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
              >
                {title}
              </h3>

              {category && (
                <span
                  className="text-[#B8860B]/60 font-poppins uppercase tracking-[0.08em] font-semibold mb-5"
                  style={{ fontSize: "12px" }}
                >
                  {category}
                </span>
              )}

              <p
                className="text-[#FFFFFF]/40 font-poppins leading-relaxed mb-8 max-w-sm"
                style={{ fontSize: "15px" }}
              >
                {description}
              </p>

              <Link
                href={ctaHref}
                className="inline-block w-fit bg-[#FFFFFF] text-[#121212] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-medium uppercase tracking-[0.1em] hover:bg-[#F8F8F8] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-poppins"
                style={{ fontSize: "15px" }}
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
