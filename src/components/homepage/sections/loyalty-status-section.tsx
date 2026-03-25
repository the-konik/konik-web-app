"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, ArrowRight } from "lucide-react";
import type { SectionProps } from "@/types/section";

/**
 * Loyalty Status Section — membership tier progress bar for HOT users.
 *
 * Data: { title?, tiers?: [{ name, threshold, color }] }
 * In full implementation, reads user role from session.
 */
export function LoyaltyStatusSection({ data }: SectionProps) {
  const title = (data.title as string) || "Your Legacy Status";
  const tiers = (data.tiers as Array<{ name: string; threshold: number; color: string }>) || [
    { name: "Member", threshold: 0, color: "#4B5563" },
    { name: "Subscriber", threshold: 1, color: "#B8860B" },
    { name: "Premium", threshold: 2, color: "#D4A017" },
    { name: "VIP", threshold: 3, color: "#FFD700" },
  ];

  // Default: show as Member (tier 0). Actual tier from session in Phase 3.
  const currentTier = 0;
  const progress = ((currentTier + 1) / tiers.length) * 100;

  return (
    <section className="bg-[#121212]">
      <div className="max-w-[900px] mx-auto px-5 sm:px-10 lg:px-16 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="w-12 h-12 rounded-full bg-[#B8860B]/10 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-6 h-6 text-[#B8860B]" />
          </div>
          <h2 className="font-atmospheric text-lg sm:text-2xl text-[#FFFFFF] tracking-[0.08em] uppercase mb-2">
            {title}
          </h2>
          <p className="text-[#FFFFFF]/40 text-xs font-poppins">
            Current tier: <span className="text-[#B8860B] font-bold">{tiers[currentTier]?.name || "Member"}</span>
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative h-2 bg-[#FFFFFF]/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: `linear-gradient(90deg, #B8860B, #D4A017)` }}
            />
          </div>

          {/* Tier markers */}
          <div className="flex justify-between mt-3">
            {tiers.map((tier, i) => (
              <div key={i} className="text-center">
                <span
                  className={`block text-[9px] font-bold uppercase tracking-[0.1em] font-poppins ${
                    i <= currentTier ? "text-[#B8860B]" : "text-[#FFFFFF]/20"
                  }`}
                >
                  {tier.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upgrade CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 bg-[#B8860B] text-[#FFFFFF] px-8 py-3.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#D4A017] transition-all font-poppins"
          >
            Upgrade Tier
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
