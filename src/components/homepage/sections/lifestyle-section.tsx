"use client";

import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Lifestyle Section — full-width cinematic with CSS Ken Burns.
 * Nike-aligned: taller section, bigger heading
 */
export function LifestyleSection({ data, media }: SectionProps) {
  const tagline = (data.tagline as string) || "Discipline Is The Uniform";
  const image = media || (data.image as string) || "/images/hero/hero-legacy.png";

  return (
    <section className="relative h-[50vh] sm:h-[55vh] lg:h-[60vh] w-full overflow-hidden bg-[#121212]">
      <Image
        src={image}
        alt={tagline}
        fill
        className="object-cover animate-slow-zoom brightness-[0.45]"
        sizes="100vw"
        loading="lazy"
      />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <h2
          className="font-atmospheric text-white tracking-[0.12em] text-center leading-[1.1] uppercase"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.75rem)" }}
        >
          {tagline}
        </h2>
      </div>

      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#121212]/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#121212]/40 to-transparent" />
    </section>
  );
}
