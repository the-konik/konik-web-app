"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wrench, ArrowRight } from "lucide-react";
import type { SectionProps } from "@/types/section";

/**
 * User Systems Section — shows the user's active tools dashboard.
 * For HOT-stage users who have purchased tools.
 *
 * Data: { title, subtitle? }
 * Note: Actual tool data would be fetched from user's session/DB in a full implementation.
 * This is a visual scaffold that links to the dashboard.
 */
export function UserSystemsSection({ data }: SectionProps) {
  const title = (data.title as string) || "Your Systems";
  const subtitle = (data.subtitle as string) || "Continue where you left off.";

  return (
    <section className="bg-[#FAFAFA] border-y border-[#E5E7EB]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-14 sm:py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-atmospheric text-lg sm:text-2xl text-[#121212] tracking-[0.08em] uppercase mb-1">
              {title}
            </h2>
            <p className="text-[#4B5563] text-xs font-poppins">{subtitle}</p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#B8860B] font-poppins hover:text-[#121212] transition-colors"
          >
            Open Dashboard
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/dashboard"
            className="group flex items-center gap-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 sm:p-6 hover:border-[#B8860B]/30 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-6 h-6 text-[#B8860B]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#121212] font-poppins">Legacy Life Builder</h3>
              <p className="text-[11px] text-[#4B5563] font-poppins mt-0.5">Your active system — track habits, goals, and progress.</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#4B5563] group-hover:text-[#B8860B] transition-colors flex-shrink-0" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
