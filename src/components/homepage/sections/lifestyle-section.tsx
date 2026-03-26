"use client";

import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Lifestyle Section — full-width cinematic with CSS Ken Burns.
 * IMAGE: 1920×822 desktop (21:9 ultrawide)
 * FONT: Atmospheric atm-h2 mobile → atm-hero desktop
 */
export function LifestyleSection({ data, media }: SectionProps) {
  const tagline = (data.tagline as string) || "Discipline Is The Uniform";
  const image = media || (data.image as string) || "/images/hero/hero-legacy.png";

  return (
    <section className="relative h-[40vh] sm:h-[45vh] lg:h-[50vh] w-full overflow-hidden bg-[#121212]">
      <Image
        src={image}
        alt={tagline}
        fill
        className="object-cover animate-slow-zoom brightness-[0.45]"
        sizes="100vw"
        loading="lazy"
      />

      <div className="absolute inset-0 flex items-center justify-center px-5">
        <h2
          className="font-atmospheric text-white tracking-[0.15em] text-center leading-tight uppercase"
          style={{ fontSize: "var(--atm-h2)" }}
        >
          <span className="sm:hidden">{tagline}</span>
          <span className="hidden sm:inline lg:hidden" style={{ fontSize: "var(--atm-h1)" }}>{tagline}</span>
          <span className="hidden lg:inline" style={{ fontSize: "var(--atm-hero)" }}>{tagline}</span>
        </h2>
      </div>

      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#121212]/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#121212]/40 to-transparent" />
    </section>
  );
}
