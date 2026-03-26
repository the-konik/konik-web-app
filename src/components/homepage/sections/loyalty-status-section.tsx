"use client";

import type { SectionProps } from "@/types/section";

/**
 * Loyalty Status — thin dark strip with tier badge + progress bar.
 * FONT: Atmospheric atm-label for tier badge, Poppins for labels
 */
export function LoyaltyStatusSection({ data }: SectionProps) {
  const tier = (data.tier as string) || "Builder";
  const nextTier = (data.nextTier as string) || "Legacy";
  const progress = (data.progress as number) || 0;
  const pointsToNext = (data.pointsToNext as string) || "500 pts to next tier";

  return (
    <section className="bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-4 sm:py-5">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Tier badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#B8860B] flex items-center justify-center">
              <span className="font-bold text-[#FFFFFF] font-poppins" style={{ fontSize: "var(--text-2xs)" }}>
                {tier.charAt(0)}
              </span>
            </div>
            <span className="font-bold uppercase tracking-[0.08em] text-[#FFFFFF] font-poppins" style={{ fontSize: "var(--text-2xs)" }}>
              {tier}
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex-1 min-w-0">
            <div className="h-1 bg-[#FFFFFF]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4A017] rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>

          {/* Next tier info */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#FFFFFF]/30 font-poppins hidden sm:inline" style={{ fontSize: "var(--text-2xs)" }}>
              {pointsToNext}
            </span>
            <span className="text-[#FFFFFF]/50 font-poppins" style={{ fontSize: "var(--text-2xs)" }}>
              → {nextTier}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
