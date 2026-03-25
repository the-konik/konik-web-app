"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import type { SectionProps } from "@/types/section";

/**
 * Recommendations Section — personalized product picks for HOT-stage users.
 *
 * Data: { title, subtitle?, ctaLabel?, ctaHref? }
 * In a full implementation, products would be fetched based on user preferences.
 */
export function RecommendationsSection({ data }: SectionProps) {
  const title = (data.title as string) || "Picked for You";
  const subtitle = (data.subtitle as string) || "Based on your style and purchases.";
  const ctaLabel = (data.ctaLabel as string) || "View All Recommendations";
  const ctaHref = (data.ctaHref as string) || "/shop";

  return (
    <section className="bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#B8860B]/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#B8860B]" />
            </div>
            <div>
              <h2 className="font-atmospheric text-lg sm:text-2xl text-[#121212] tracking-[0.08em] uppercase">
                {title}
              </h2>
              <p className="text-[#4B5563] text-[11px] font-poppins mt-0.5">{subtitle}</p>
            </div>
          </div>
          <Link
            href={ctaHref}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#B8860B] font-poppins hover:text-[#121212] transition-colors"
          >
            {ctaLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#F8F8F8] rounded-xl p-8 sm:p-10 text-center"
        >
          <Sparkles className="w-8 h-8 text-[#B8860B]/30 mx-auto mb-4" />
          <p className="text-sm text-[#4B5563] font-poppins mb-6">
            Personalized recommendations are being curated based on your activity.
          </p>
          <Link
            href={ctaHref}
            className="inline-block bg-[#121212] text-[#FFFFFF] px-8 py-3 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#2a2a2a] transition-all font-poppins"
          >
            Browse Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
