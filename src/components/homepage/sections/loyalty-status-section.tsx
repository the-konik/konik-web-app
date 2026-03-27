"use client";

import type { SectionProps } from "@/types/section";

/**
 * Loyalty Status — thin dark strip with tier badge + progress bar.
 * Nike-aligned: slightly bigger text + padding
 */
export function LoyaltyStatusSection({ data }: SectionProps) {
  const tier = (data.tier as string) || "Builder";
  const nextTier = (data.nextTier as string) || "Legacy";
  const progress = (data.progress as number) || 0;
  const pointsToNext = (data.pointsToNext as string) || "500 pts to next tier";

  return (
    <section className="bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-5 sm:py-6">
        <div className="flex items-center gap-5 sm:gap-7">
          {/* Tier badge */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#B8860B] flex items-center justify-center">
              <span className="font-semibold text-[#FFFFFF] font-poppins" style={{ fontSize: "12px" }}>
                {tier.charAt(0)}
              </span>
            </div>
            <span className="font-semibold uppercase tracking-[0.06em] text-[#FFFFFF] font-poppins" style={{ fontSize: "12px" }}>
              {tier}
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex-1 min-w-0">
            <div className="h-1.5 bg-[#FFFFFF]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4A017] rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>

          {/* Next tier info */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-[#FFFFFF]/30 font-poppins hidden sm:inline" style={{ fontSize: "12px" }}>
              {pointsToNext}
            </span>
            <span className="text-[#FFFFFF]/50 font-poppins" style={{ fontSize: "12px" }}>
              → {nextTier}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
