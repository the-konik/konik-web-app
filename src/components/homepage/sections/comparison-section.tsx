"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { SectionProps } from "@/types/section";

/**
 * Comparison Section — KONIK vs generic brands table.
 *
 * Data: { title, subtitle?, rows: [{ feature, konik, others }] }
 * konik/others values: true = checkmark, false = X, string = text
 */
export function ComparisonSection({ data }: SectionProps) {
  const title = (data.title as string) || "KONIK vs The Rest";
  const subtitle = (data.subtitle as string) || "";
  const rows = (data.rows as Array<{ feature: string; konik: boolean | string; others: boolean | string }>) || [
    { feature: "Premium Quality Fabrics", konik: true, others: false },
    { feature: "Life Systems & Tools", konik: true, others: false },
    { feature: "Identity-Driven Design", konik: true, others: false },
    { feature: "Discipline Community", konik: true, others: false },
    { feature: "Generic Hype Marketing", konik: false, others: true },
  ];

  function renderCell(val: boolean | string) {
    if (typeof val === "string") {
      return <span className="text-[11px] font-poppins">{val}</span>;
    }
    return val ? (
      <Check className="w-4 h-4 text-[#B8860B]" strokeWidth={2.5} />
    ) : (
      <X className="w-4 h-4 text-[#FFFFFF]/20" strokeWidth={2} />
    );
  }

  return (
    <section className="bg-[#121212]">
      <div className="max-w-[900px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-atmospheric text-xl sm:text-3xl text-[#FFFFFF] tracking-[0.08em] uppercase mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[#FFFFFF]/40 text-xs sm:text-sm font-poppins">{subtitle}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="overflow-hidden rounded-lg border border-[#FFFFFF]/10"
        >
          {/* Header */}
          <div className="grid grid-cols-3 bg-[#FFFFFF]/5">
            <div className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#FFFFFF]/40 font-poppins">
              Feature
            </div>
            <div className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-[#B8860B] font-poppins">
              KONIK
            </div>
            <div className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-[#FFFFFF]/40 font-poppins">
              Others
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 border-t border-[#FFFFFF]/5 ${
                i % 2 === 0 ? "" : "bg-[#FFFFFF]/[0.02]"
              }`}
            >
              <div className="px-5 py-4 text-[12px] text-[#FFFFFF]/70 font-poppins">
                {row.feature}
              </div>
              <div className="px-5 py-4 flex items-center justify-center">
                {renderCell(row.konik)}
              </div>
              <div className="px-5 py-4 flex items-center justify-center">
                {renderCell(row.others)}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
