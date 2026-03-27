"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Identity Section — split layout: large image + headline + CTA.
 * Nike-aligned: taller section, bigger text, more padding
 */
export function IdentitySection({ data, media }: SectionProps) {
  const headline = (data.title as string) || "This Is Not Fashion.";
  const cta = (data.cta as string) || "Explore Systems";
  const ctaHref = (data.ctaHref as string) || "/tools";
  const image = media || (data.image as string) || "/images/hero/hero-training.png";

  return (
    <section className="bg-[#121212]">
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[45vh] sm:min-h-[50vh] lg:min-h-[55vh]">
        {/* Image — 16:10 ratio, 3/5 on desktop */}
        <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-3 overflow-hidden">
          <Image
            src={image}
            alt={headline}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 60vw"
            loading="lazy"
          />
        </div>

        {/* Content — Nike-aligned bigger padding */}
        <div className="lg:col-span-2 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 sm:py-12 lg:py-0">
          <h2
            className="font-atmospheric text-[#FFFFFF] tracking-[0.06em] leading-[1.1] mb-6 sm:mb-8 uppercase"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
          >
            {headline}
          </h2>
          <Link
            href={ctaHref}
            className="inline-block w-fit bg-[#FFFFFF] text-[#121212] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-medium uppercase tracking-[0.1em] hover:bg-[#F8F8F8] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-poppins"
            style={{ fontSize: "15px" }}
          >
            {cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
