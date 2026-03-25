"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { SectionProps } from "@/types/section";

/**
 * Identity Section — hooks COLD-stage visitors with an emotional,
 * identity-driven message. DB-controlled content via `data`.
 *
 * Expected data shape:
 * {
 *   title: string,
 *   subtitle?: string,
 *   points: string[],
 *   cta?: string,
 *   ctaHref?: string
 * }
 */
export function IdentitySection({ data }: SectionProps) {
  const title = (data.title as string) || "This is not fashion.";
  const subtitle = (data.subtitle as string) || "This is your operating system.";
  const points = (data.points as string[]) || [
    "No discipline → No progress",
    "No system → No consistency",
    "No identity → No legacy",
  ];
  const cta = (data.cta as string) || "Fix It Now";
  const ctaHref = (data.ctaHref as string) || "/tools";

  return (
    <section className="relative bg-[#121212] overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-atmospheric text-2xl sm:text-4xl lg:text-5xl text-[#FFFFFF] tracking-[0.08em] leading-tight mb-4 uppercase"
          >
            {title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#FFFFFF]/40 text-sm sm:text-base font-poppins tracking-wide mb-12 sm:mb-16"
          >
            {subtitle}
          </motion.p>

          {/* Pain Points */}
          <div className="space-y-5 sm:space-y-6 mb-12 sm:mb-16">
            {points.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-4"
              >
                <span className="w-2 h-2 rounded-full bg-[#B8860B] flex-shrink-0" />
                <span className="text-[#FFFFFF]/70 text-sm sm:text-base font-poppins tracking-wide">
                  {point}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={ctaHref}
              className="inline-block bg-[#FFFFFF] text-[#121212] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-poppins"
            >
              {cta}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
