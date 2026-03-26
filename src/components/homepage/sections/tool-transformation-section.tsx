"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Tool Transformation — video/image split with headline + CTA.
 * IMAGE/VIDEO: 1200×750 (16:10) or MP4 video
 * Mobile: stacked (image on top). Desktop: 60/40 split.
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
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[45vh] sm:min-h-[50vh]">
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

        {/* Content — 2/5 on desktop */}
        <div className="lg:col-span-2 flex flex-col justify-center px-5 sm:px-10 lg:px-12 py-8 sm:py-10 lg:py-0">
          <span
            className="font-bold uppercase tracking-[0.15em] text-[#B8860B] font-poppins mb-3"
            style={{ fontSize: "var(--text-2xs)" }}
          >
            Legacy Systems
          </span>

          <h2
            className="font-atmospheric text-[#FFFFFF] tracking-[0.06em] leading-tight uppercase mb-3"
            style={{ fontSize: "var(--atm-h2)" }}
          >
            <span className="sm:hidden">{headline}</span>
            <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>{headline}</span>
          </h2>

          <p
            className="text-[#FFFFFF]/40 font-poppins mb-6 leading-relaxed max-w-sm"
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
    </section>
  );
}
