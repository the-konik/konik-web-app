"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { SectionProps } from "@/types/section";

/**
 * CTA Section — full-width call-to-action bar.
 *
 * Expected data shape:
 * {
 *   title: string,
 *   subtitle?: string,
 *   button: string,
 *   href?: string
 * }
 */
export function CTASection({ data, media }: SectionProps) {
  const title = (data.title as string) || "Your life won't change by itself.";
  const subtitle = (data.subtitle as string) || "";
  const button = (data.button as string) || "Start Your Legacy";
  const href = (data.href as string) || "/auth/register";

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A]">
      {/* Optional background image */}
      {media && (
        <div className="absolute inset-0">
          <Image
            src={media}
            alt=""
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]" />
        </div>
      )}

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-32">
        <div className="flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-atmospheric text-xl sm:text-3xl lg:text-4xl text-[#FFFFFF] tracking-[0.08em] leading-tight mb-3 sm:mb-4 uppercase max-w-2xl"
          >
            {title}
          </motion.h2>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-[#FFFFFF]/40 text-xs sm:text-sm font-poppins tracking-wide mb-8 sm:mb-10 max-w-lg"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={href}
              className="inline-block bg-[#B8860B] text-[#FFFFFF] px-10 sm:px-14 py-4 sm:py-5 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#D4A017] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] font-poppins shadow-[0_8px_32px_rgba(184,134,11,0.3)]"
            >
              {button}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative top/bottom gradients */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B8860B]/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#B8860B]/20 to-transparent" />
    </section>
  );
}
