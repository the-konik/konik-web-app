"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Identity Section — split layout: large image + headline + CTA.
 * IMAGE: 1200×750 (16:10) desktop
 * FONT: Atmospheric atm-h2 mobile → atm-h1 desktop
 */
export function IdentitySection({ data, media }: SectionProps) {
  const headline = (data.title as string) || "This Is Not Fashion.";
  const cta = (data.cta as string) || "Explore Systems";
  const ctaHref = (data.ctaHref as string) || "/tools";
  const image = media || (data.image as string) || "/images/hero/hero-training.png";

  return (
    <section className="bg-[#121212]">
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[40vh] sm:min-h-[45vh]">
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

        {/* Content */}
        <div className="lg:col-span-2 flex flex-col justify-center px-5 sm:px-10 lg:px-12 py-8 sm:py-10 lg:py-0">
          <h2
            className="font-atmospheric text-[#FFFFFF] tracking-[0.08em] leading-tight mb-5 sm:mb-6 uppercase"
            style={{ fontSize: "var(--atm-h2)" }}
          >
            <span className="sm:hidden">{headline}</span>
            <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>{headline}</span>
          </h2>
          <Link
            href={ctaHref}
            className="inline-block w-fit bg-[#FFFFFF] text-[#121212] px-7 sm:px-9 py-3 sm:py-3.5 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-poppins"
            style={{ fontSize: "var(--text-xs)" }}
          >
            {cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
