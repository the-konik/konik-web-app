"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Tool Transformation — video/image split with headline + CTA.
 * Nike-aligned: taller section, bigger text, more padding
 */
export function ToolTransformationSection({ data, media }: SectionProps) {
  const headline = (data.headline as string) || "Transform Your Life";
  const description = (data.description as string) || "Digital systems built for men who build legacy";
  const cta = (data.cta as string) || "Explore Tools";
  const ctaHref = (data.ctaHref as string) || "/tools";
  const videoUrl = (data.videoUrl as string) || null;
  const image = media || (data.image as string) || "/images/homepage/tool-transform.png";

  return (
    <section className="bg-[#121212]">
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[50vh] sm:min-h-[55vh] lg:min-h-[60vh]">
        {/* Media — 3/5 on desktop */}
        <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-3 overflow-hidden">
          {videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <Image
              src={image}
              alt={headline}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 60vw"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#121212]/30 hidden lg:block" />
        </div>

        {/* Content — 2/5 on desktop, Nike-aligned */}
        <div className="lg:col-span-2 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 sm:py-12 lg:py-0">
          <span
            className="font-semibold uppercase tracking-[0.12em] text-[#B8860B] font-poppins mb-4"
            style={{ fontSize: "12px" }}
          >
            Legacy Systems
          </span>

          <h2
            className="font-atmospheric text-[#FFFFFF] tracking-[0.04em] leading-[1.1] uppercase mb-4"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
          >
            {headline}
          </h2>

          <p
            className="text-[#FFFFFF]/40 font-poppins mb-8 leading-relaxed max-w-sm"
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
    </section>
  );
}
