"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { SectionProps } from "@/types/section";

/**
 * Lifestyle Section — aspirational image grid showcasing the KONIK lifestyle.
 *
 * Data: { title, subtitle?, images: [{ src, label, href? }], cta?, ctaHref? }
 */
export function LifestyleSection({ data, media }: SectionProps) {
  const title = (data.title as string) || "The Lifestyle";
  const subtitle = (data.subtitle as string) || "";
  const images = (data.images as Array<{ src: string; label: string; href?: string }>) || [];
  const cta = (data.cta as string) || "";
  const ctaHref = (data.ctaHref as string) || "/shop";

  // Fallback layout if no images provided
  const displayImages = images.length > 0 ? images : [
    { src: media || "/images/hero/hero-legacy.png", label: "Legacy Life", href: "/shop" },
  ];

  return (
    <section className="bg-[#FAFAFA]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-atmospheric text-xl sm:text-3xl lg:text-4xl text-[#121212] tracking-[0.08em] uppercase mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[#4B5563] text-xs sm:text-sm font-poppins tracking-wide max-w-md mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {displayImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={i === 0 ? "col-span-2 lg:col-span-2 row-span-2" : ""}
            >
              <Link
                href={img.href || "/shop"}
                className="group relative block overflow-hidden rounded-sm"
                style={{ aspectRatio: i === 0 ? "16/10" : "3/4" }}
              >
                <Image
                  src={img.src}
                  alt={img.label}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.15em] text-[#FFFFFF] font-poppins">
                    {img.label}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        {cta && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 sm:mt-14 text-center"
          >
            <Link
              href={ctaHref}
              className="inline-block bg-[#121212] text-[#FFFFFF] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#2a2a2a] transition-all duration-300 font-poppins"
            >
              {cta}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
